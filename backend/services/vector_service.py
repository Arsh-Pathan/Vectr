import json
import hashlib
import logging
from typing import List, Tuple, Optional

import numpy as np
from sqlalchemy.orm import Session
from google import genai

from config import GEMINI_API_KEY
from models import Issue, IssueEmbedding

logger = logging.getLogger(__name__)

EMBEDDING_MODEL = "gemini-embedding-001"


class VectorService:
    """Vector embedding service using Gemini embeddings + numpy cosine similarity.
    
    Stores embeddings as JSON-serialized float arrays in SQLite.
    Uses numpy for fast cosine similarity — zero extra dependencies.
    """

    _client: Optional[genai.Client] = None

    @classmethod
    def _get_client(cls) -> genai.Client:
        if cls._client is None:
            cls._client = genai.Client(api_key=GEMINI_API_KEY)
        return cls._client

    @classmethod
    def embed_text(cls, text: str) -> List[float]:
        """Generate a 768-dim embedding vector for a text string."""
        client = cls._get_client()
        result = client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=text,
        )
        # result.embeddings is a list of ContentEmbedding objects
        return list(result.embeddings[0].values)

    @staticmethod
    def _title_hash(title: str) -> str:
        """SHA256 hash of title — used to skip re-embedding unchanged titles."""
        return hashlib.sha256(title.strip().lower().encode()).hexdigest()

    @classmethod
    def embed_and_store(
        cls,
        db: Session,
        issue_id: str,
        title: str,
        description: Optional[str] = None,
    ) -> IssueEmbedding:
        """Generate embedding for an issue and store it. Skips if title unchanged."""
        title_hash = cls._title_hash(title)

        # Check if embedding already exists with same title hash
        existing = db.query(IssueEmbedding).filter(
            IssueEmbedding.issue_id == issue_id
        ).first()

        if existing and existing.title_hash == title_hash:
            return existing  # Title unchanged, skip re-embedding

        # Combine title + first 200 chars of description for richer embedding
        embed_text = title
        if description:
            embed_text += f" — {description[:200]}"

        embedding = cls.embed_text(embed_text)
        embedding_json = json.dumps(embedding)

        if existing:
            existing.embedding = embedding_json
            existing.title_hash = title_hash
            existing.model_version = EMBEDDING_MODEL
        else:
            existing = IssueEmbedding(
                issue_id=issue_id,
                title_hash=title_hash,
                embedding=embedding_json,
                model_version=EMBEDDING_MODEL,
            )
            db.add(existing)

        db.commit()
        logger.info(f"Embedded issue {issue_id}: '{title[:50]}...'")
        return existing

    @classmethod
    def find_similar_issues(
        cls,
        db: Session,
        query_text: str,
        top_k: int = 10,
    ) -> List[Tuple[str, float]]:
        """Find issues semantically similar to query_text.
        
        Returns list of (issue_id, similarity_score) tuples, sorted descending.
        Uses numpy cosine similarity — ~1ms for 1000 vectors.
        """
        query_vec = np.array(cls.embed_text(query_text), dtype=np.float32)
        query_norm = np.linalg.norm(query_vec)
        if query_norm == 0:
            return []

        # Load all stored embeddings
        all_embeddings = db.query(IssueEmbedding).all()
        if not all_embeddings:
            return []

        issue_ids = []
        vectors = []
        for emb in all_embeddings:
            try:
                vec = json.loads(emb.embedding)
                vectors.append(vec)
                issue_ids.append(emb.issue_id)
            except Exception:
                continue

        if not vectors:
            return []

        # Batch cosine similarity via numpy
        matrix = np.array(vectors, dtype=np.float32)
        norms = np.linalg.norm(matrix, axis=1)
        # Avoid division by zero
        norms = np.where(norms == 0, 1e-10, norms)
        similarities = matrix @ query_vec / (norms * query_norm)

        # Rank by similarity
        top_indices = np.argsort(similarities)[::-1][:top_k]
        results = [
            (issue_ids[idx], float(similarities[idx]))
            for idx in top_indices
            if similarities[idx] > 0.0
        ]
        return results

    @classmethod
    def bulk_embed_issues(cls, db: Session) -> int:
        """Backfill embeddings for all issues that don't have one yet.
        
        Returns the number of newly embedded issues.
        """
        # Find issues without embeddings
        existing_issue_ids = {
            row.issue_id for row in db.query(IssueEmbedding.issue_id).all()
        }
        all_issues = db.query(Issue).all()
        missing = [iss for iss in all_issues if iss.id not in existing_issue_ids]

        if not missing:
            logger.info("All issues already have embeddings.")
            return 0

        count = 0
        for issue in missing:
            try:
                cls.embed_and_store(
                    db=db,
                    issue_id=issue.id,
                    title=issue.title,
                    description=issue.description,
                )
                count += 1
            except Exception as e:
                logger.warning(f"Failed to embed issue {issue.id}: {e}")

        logger.info(f"Bulk embedded {count} issues.")
        return count
