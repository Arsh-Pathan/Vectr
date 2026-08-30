import json
import time
from typing import List, Optional, Dict, Tuple, Any
from sqlalchemy.orm import Session
from models import Issue, User, Contribution


class MatchingService:
    """Zero-token relational SQL engine with Lazy Skill-Bucket Caching."""

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

        if search:
            query = query.filter(
                Issue.title.ilike(f"%{search}%") |
                Issue.repo_full_name.ilike(f"%{search}%") |
                Issue.summary.ilike(f"%{search}%")
            )

        all_candidates = query.all()

        # 4. Parse preferred languages & rank by match score
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

        if language:
            preferred_langs.add(language)

        def score_issue(issue: Issue) -> float:
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
            diff_delta = abs(issue.difficulty_score - user.level)
            proximity_score = max(0, 30 - diff_delta)
            score += proximity_score

            return score

        # Sort candidates descending by score
        ranked_issues = sorted(all_candidates, key=score_issue, reverse=True)
        result = ranked_issues[:limit]

        # Cache ranking for this skill-bucket
        cls._bucket_cache[cache_key] = (now, [i.id for i in result])
        return result
