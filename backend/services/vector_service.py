"""Vector Database Service using ChromaDB + Gemini Embeddings for semantic issue matching."""
import logging
from typing import List, Dict, Any, Optional

import chromadb
from google import genai

from config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

# Gemini embedding model
EMBEDDING_MODEL = "gemini-embedding-001"


class VectorService:
    """Manages ChromaDB collections for semantic search over GitHub issues."""

    _client: Optional[chromadb.ClientAPI] = None
    _collection: Optional[chromadb.Collection] = None

    @classmethod
    def _get_collection(cls) -> chromadb.Collection:
        if cls._collection is None:
            cls._client = chromadb.Client()
            cls._collection = cls._client.get_or_create_collection(
                name="issues",
                metadata={"hnsw:space": "cosine"},
            )
        return cls._collection

    @classmethod
    def _embed_texts(cls, texts: List[str]) -> List[List[float]]:
        """Generate embeddings using Gemini Embedding API."""
        if not GEMINI_API_KEY or GEMINI_API_KEY.startswith("your_"):
            # Fallback: use simple character-frequency vectors for demo
            return [cls._simple_embed(t) for t in texts]

        try:
            client = genai.Client(api_key=GEMINI_API_KEY)
            result = client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=texts,
            )
            return [e.values for e in result.embeddings]
        except Exception as e:
            logger.warning(f"Gemini embedding failed: {e}. Using fallback embeddings.")
            return [cls._simple_embed(t) for t in texts]

    @staticmethod
    def _simple_embed(text: str) -> List[float]:
        """Deterministic fallback embedding based on keyword hashing (768-dim to match Gemini)."""
        import hashlib
        vec = [0.0] * 768
        words = text.lower().split()
        for word in words:
            h = int(hashlib.md5(word.encode()).hexdigest(), 16)
            for i in range(768):
                vec[i] += ((h >> (i % 32)) & 1) * 0.01
        # Normalize
        magnitude = max(sum(v * v for v in vec) ** 0.5, 1e-10)
        return [v / magnitude for v in vec]

    @classmethod
    def upsert_issues(cls, issues: List[Dict[str, Any]]) -> int:
        """Embed and store issues in ChromaDB. Returns count of upserted issues."""
        if not issues:
            return 0

        collection = cls._get_collection()

        ids = []
        documents = []
        metadatas = []

        for issue in issues:
            issue_id = str(issue["id"])
            # Build a rich text document for embedding
            doc = f"{issue['title']}. {issue.get('description', '')}. " \
                  f"Skills: {', '.join(issue.get('skills', []))}. " \
                  f"Labels: {', '.join(issue.get('labels', []))}. " \
                  f"Difficulty: {issue.get('difficulty', 'beginner')}. " \
                  f"Repo: {issue.get('repo', '')}"

            ids.append(issue_id)
            documents.append(doc)
            metadatas.append({
                "repo": issue.get("repo", ""),
                "difficulty": issue.get("difficulty", "beginner"),
                "difficulty_score": issue.get("difficulty_score", 25),
            })

        # Generate embeddings
        embeddings = cls._embed_texts(documents)

        collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
        )

        logger.info(f"Upserted {len(ids)} issues into vector DB")
        return len(ids)

    @classmethod
    def search_issues(
        cls,
        user_languages: List[str],
        user_tier: str,
        user_level: int,
        limit: int = 20,
    ) -> List[str]:
        """Semantic search: find issue IDs most relevant to a user's profile."""
        collection = cls._get_collection()

        if collection.count() == 0:
            return []

        # Build a query document from user profile
        query_text = (
            f"Developer skilled in {', '.join(user_languages) if user_languages else 'general programming'}. "
            f"Tier: {user_tier}. Level: {user_level}. "
            f"Looking for open source issues to contribute to."
        )

        query_embedding = cls._embed_texts([query_text])[0]

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=min(limit, collection.count()),
        )

        return results["ids"][0] if results["ids"] else []
