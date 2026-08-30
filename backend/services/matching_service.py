import json
from typing import List, Optional
from sqlalchemy.orm import Session
from models import Issue, User, Contribution


class MatchingService:
    """Zero-token relational SQL engine that pairs developers with suitable issues."""

    @staticmethod
    def get_matched_issues(
        db: Session,
        user: User,
        difficulty: Optional[str] = None,
        language: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 20,
    ) -> List[Issue]:
        """Find matching open-source issues using fast SQL filtering."""
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
            preferred_langs = set(json.loads(user.preferred_languages or "[]"))
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
        return ranked_issues[:limit]
