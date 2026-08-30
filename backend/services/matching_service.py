"""Hybrid Matching Service — combines ChromaDB vector similarity with SQL filtering."""
import json
import time
import logging
from typing import List, Optional, Dict, Tuple, Any
from sqlalchemy.orm import Session
from models import Issue, User, Contribution
from services.vector_service import VectorService

logger = logging.getLogger(__name__)


class MatchingService:
    """Hybrid matcher: Vector semantic search + SQL skill-bucket filtering."""

    @classmethod
    def get_matched_issues(
        cls,
        db: Session,
        user: User,
        difficulty: Optional[str] = None,
        language: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 20,
    ) -> List[Issue]:
        """Find matching issues using vector similarity + SQL filters."""

        # Parse user's preferred languages
        try:
            preferred_langs = []
            raw_langs = json.loads(user.preferred_languages or "[]")
            for item in raw_langs:
                if isinstance(item, str):
                    preferred_langs.append(item)
                elif isinstance(item, dict) and "language" in item:
                    preferred_langs.append(item["language"])
        except Exception:
            preferred_langs = []

        if language:
            preferred_langs.append(language)

        # 1. Try vector search first for semantic matching
        vector_ids = []
        try:
            vector_ids = VectorService.search_issues(
                user_languages=preferred_langs,
                user_tier=user.tier or "beginner",
                user_level=user.level or 0,
                limit=limit * 2,  # Fetch extra so we can filter
            )
        except Exception as e:
            logger.warning(f"Vector search failed, falling back to SQL: {e}")

        # 2. Get IDs of issues the user already solved
        solved_issue_ids = [
            c.issue_id for c in db.query(Contribution.issue_id).filter(Contribution.user_id == user.id).all()
        ]

        # 3. Build SQL query
        if vector_ids:
            # Use vector-ranked order
            query = db.query(Issue).filter(Issue.id.in_(vector_ids))
        else:
            # Fallback: pure SQL matching
            max_difficulty = min(100, (user.level or 0) + 15)
            query = db.query(Issue).filter(
                Issue.difficulty_score <= max_difficulty,
            )

        # Exclude solved issues
        if solved_issue_ids:
            query = query.filter(~Issue.id.in_(solved_issue_ids))

        # Apply optional filters
        if difficulty:
            query = query.filter(Issue.difficulty == difficulty.lower())

        if search:
            query = query.filter(
                Issue.title.ilike(f"%{search}%") |
                Issue.repo_full_name.ilike(f"%{search}%")
            )

        all_candidates = query.all()

        # 4. If we have vector results, maintain vector ranking order
        if vector_ids:
            id_order = {vid: idx for idx, vid in enumerate(vector_ids)}
            all_candidates.sort(key=lambda iss: id_order.get(iss.id, 9999))
        else:
            # Fallback ranking by language match + difficulty proximity
            def score_issue(issue: Issue) -> float:
                score = 0.0
                if issue.is_daily_challenge:
                    score += 100.0

                try:
                    skills = set(json.loads(issue.required_skills or "[]"))
                except Exception:
                    skills = set()

                if preferred_langs and skills:
                    common = set(preferred_langs).intersection(skills)
                    score += len(common) * 20.0

                diff_delta = abs(issue.difficulty_score - (user.level or 0))
                score += max(0, 30 - diff_delta)
                return score

            all_candidates.sort(key=score_issue, reverse=True)

        return all_candidates[:limit]
