import json
import time
import logging
from typing import List, Optional, Dict, Tuple, Any
from sqlalchemy.orm import Session
from models import Issue, User, Contribution

logger = logging.getLogger(__name__)


class MatchingService:
    """Zero-token relational SQL engine with Lazy Skill-Bucket Caching + Vector Hybrid Search."""

    _bucket_cache: Dict[str, Tuple[float, List[Any]]] = {}
    CACHE_TTL_SECONDS = 300  # 5 minutes cache

    @classmethod
    def get_skill_bucket(cls, user: User) -> str:
        """Derive skill bucket from user tier, level band (in brackets of 10), and top language."""
        level_band = (user.level // 10) * 10
        try:
            langs = json.loads(user.preferred_languages or "[]")
            top_lang = langs[0] if isinstance(langs, list) and langs else "general"
            if isinstance(top_lang, dict):
                top_lang = top_lang.get("language", "general")
        except Exception:
            top_lang = "general"
        return f"{user.tier}_{level_band}_{top_lang}".lower()

    @classmethod
    def _score_issue(cls, issue: Issue, preferred_langs: set, user_level: int) -> float:
        """Score a single issue based on language match, difficulty proximity, and daily challenge."""
        score = 0.0
        # Daily challenge boost
        if issue.is_daily_challenge:
            score += 100.0

        # Language match boost
        try:
            skills = set(json.loads(issue.required_skills or "[]"))
        except Exception:
            skills = set()

        if preferred_langs and skills:
            common = preferred_langs.intersection(skills)
            score += len(common) * 20.0

        # Sweet-spot proximity (issues close to user's level give best learning experience)
        diff_delta = abs(issue.difficulty_score - user_level)
        proximity_score = max(0, 30 - diff_delta)
        score += proximity_score

        return score

    @classmethod
    def _parse_preferred_langs(cls, user: User, extra_language: Optional[str] = None) -> set:
        """Parse user's preferred languages from JSON column."""
        try:
            preferred_langs = set()
            raw_langs = json.loads(user.preferred_languages or "[]")
            for item in raw_langs:
                if isinstance(item, str):
                    preferred_langs.add(item)
                elif isinstance(item, dict) and "language" in item:
                    preferred_langs.add(item["language"])
        except Exception:
            preferred_langs = set()

        if extra_language:
            preferred_langs.add(extra_language)
        return preferred_langs

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
        """Find matching open-source issues using fast SQL filtering + Skill-Bucket Caching."""
        # If search query provided, use hybrid vector+SQL path
        if search:
            return cls.get_semantically_matched_issues(
                db=db, user=user, search_query=search,
                difficulty=difficulty, language=language, limit=limit,
            )

        skill_bucket = cls.get_skill_bucket(user)
        cache_key = f"{skill_bucket}_{difficulty}_{language}_{search}"
        now = time.time()

        # Check Lazy Cache
        if cache_key in cls._bucket_cache:
            timestamp, cached_issue_ids = cls._bucket_cache[cache_key]
            if now - timestamp < cls.CACHE_TTL_SECONDS:
                # Return issues from DB using cached IDs
                issues = db.query(Issue).filter(Issue.id.in_(cached_issue_ids)).all()
                # Maintain cached order
                issue_map = {i.id: i for i in issues}
                ordered = [issue_map[i_id] for i_id in cached_issue_ids if i_id in issue_map]
                return ordered[:limit]

        # 1. Fetch IDs of issues the user already solved
        solved_issue_ids = [
            c.issue_id for c in db.query(Contribution.issue_id).filter(Contribution.user_id == user.id).all()
        ]

        # 2. Base query: Unsolved issues within developer reach
        max_difficulty = min(100, user.level + 15)  # Developer level + headroom
        query = db.query(Issue).filter(
            ~Issue.id.in_(solved_issue_ids) if solved_issue_ids else True,
            Issue.difficulty_score <= max_difficulty,
        )

        # 3. Apply optional filters
        if difficulty:
            query = query.filter(Issue.difficulty == difficulty.lower())

        all_candidates = query.all()

        # 4. Parse preferred languages & rank by match score
        preferred_langs = cls._parse_preferred_langs(user, language)

        # Sort candidates descending by score
        ranked_issues = sorted(
            all_candidates,
            key=lambda iss: cls._score_issue(iss, preferred_langs, user.level or 0),
            reverse=True,
        )
        result = ranked_issues[:limit]

        # Cache ranking for this skill-bucket
        cls._bucket_cache[cache_key] = (now, [i.id for i in result])
        return result

    @classmethod
    def get_semantically_matched_issues(
        cls,
        db: Session,
        user: User,
        search_query: str,
        difficulty: Optional[str] = None,
        language: Optional[str] = None,
        limit: int = 20,
    ) -> List[Issue]:
        """Hybrid vector+SQL matching: semantic similarity merged with skill-bucket scoring.
        
        Final score = 0.4 * semantic_score + 0.6 * normalized_skill_score
        Vector path only activates when search is provided — lazy, not eager.
        """
        from services.vector_service import VectorService

        # 1. Get semantic similarity scores from vector search
        try:
            vector_results = VectorService.find_similar_issues(
                db=db, query_text=search_query, top_k=limit * 3,
            )
            semantic_scores = {issue_id: score for issue_id, score in vector_results}
        except Exception as e:
            logger.warning(f"Vector search failed, falling back to SQL-only: {e}")
            semantic_scores = {}

        # 2. Get all candidate issues (unsolved, within difficulty reach)
        solved_issue_ids = [
            c.issue_id for c in db.query(Contribution.issue_id).filter(Contribution.user_id == user.id).all()
        ]
        max_difficulty = min(100, user.level + 15)
        query = db.query(Issue).filter(
            ~Issue.id.in_(solved_issue_ids) if solved_issue_ids else True,
            Issue.difficulty_score <= max_difficulty,
        )
        if difficulty:
            query = query.filter(Issue.difficulty == difficulty.lower())

        all_candidates = query.all()

        # 3. Also include keyword fallback for issues matching the search text
        keyword_query = db.query(Issue).filter(
            Issue.title.ilike(f"%{search_query}%") |
            Issue.repo_full_name.ilike(f"%{search_query}%") |
            Issue.summary.ilike(f"%{search_query}%")
        )
        keyword_candidates = keyword_query.all()

        # Merge candidate sets (dedup by id)
        candidate_map = {iss.id: iss for iss in all_candidates}
        for iss in keyword_candidates:
            candidate_map[iss.id] = iss

        # 4. Compute hybrid scores
        preferred_langs = cls._parse_preferred_langs(user, language)

        # Normalize skill scores to [0, 1]
        skill_scores = {}
        max_skill_score = 1.0
        for iss in candidate_map.values():
            s = cls._score_issue(iss, preferred_langs, user.level or 0)
            skill_scores[iss.id] = s
            if s > max_skill_score:
                max_skill_score = s

        hybrid_results = []
        for issue_id, issue in candidate_map.items():
            sem_score = semantic_scores.get(issue_id, 0.0)
            skill_score = skill_scores.get(issue_id, 0.0) / max_skill_score
            final_score = 0.4 * sem_score + 0.6 * skill_score
            hybrid_results.append((issue, final_score))

        # Sort by hybrid score descending
        hybrid_results.sort(key=lambda x: x[1], reverse=True)
        return [issue for issue, _ in hybrid_results[:limit]]

