from typing import List
from sqlalchemy.orm import Session
from models import User, UserBadge

BADGE_METADATA = {
    "first_step": {
        "name": "First Step",
        "icon": "🌱",
        "description": "Every journey begins with a single step",
        "condition": "Solve 1 issue",
    },
    "on_fire": {
        "name": "On Fire",
        "icon": "🔥",
        "description": "You're on a roll!",
        "condition": "3-day contribution streak",
    },
    "unstoppable": {
        "name": "Unstoppable",
        "icon": "⚡",
        "description": "Nothing can stop you",
        "condition": "7-day contribution streak",
    },
    "sharpshooter": {
        "name": "Sharpshooter",
        "icon": "🎯",
        "description": "Precision and consistency",
        "condition": "Solve 10 issues",
    },
    "veteran": {
        "name": "Veteran",
        "icon": "💎",
        "description": "A seasoned contributor",
        "condition": "Solve 50 issues",
    },
    "daily_warrior": {
        "name": "Daily Warrior",
        "icon": "🌟",
        "description": "Challenge accepted, daily",
        "condition": "Complete 5 daily challenges",
    },
    "level_up": {
        "name": "Level Up",
        "icon": "🚀",
        "description": "Breaking through to Moderate",
        "condition": "Reach Level 25",
    },
    "elite": {
        "name": "Elite",
        "icon": "👑",
        "description": "Among the best",
        "condition": "Reach Level 75",
    },
}


class BadgeService:
    """Evaluates and awards gamified badges."""

    @staticmethod
    def check_and_award_badges(db: Session, user: User) -> List[str]:
        """Check all badge rules and persist newly unlocked badges. Returns list of new badge IDs."""
        existing_badge_ids = {
            ub.badge_id for ub in db.query(UserBadge).filter(UserBadge.user_id == user.id).all()
        }

        conditions = {
            "first_step": (user.issues_solved or 0) >= 1,
            "on_fire": (user.streak_days or 0) >= 3,
            "unstoppable": (user.streak_days or 0) >= 7,
            "sharpshooter": (user.issues_solved or 0) >= 10,
            "veteran": (user.issues_solved or 0) >= 50,
            "daily_warrior": (user.daily_challenges_completed or 0) >= 5,
            "level_up": (user.level or 0) >= 25,
            "elite": (user.level or 0) >= 75,
        }

        newly_earned = []
        for badge_id, met in conditions.items():
            if met and badge_id not in existing_badge_ids:
                new_badge = UserBadge(user_id=user.id, badge_id=badge_id)
                db.add(new_badge)
                newly_earned.append(badge_id)

        if newly_earned:
            db.commit()

        return newly_earned
