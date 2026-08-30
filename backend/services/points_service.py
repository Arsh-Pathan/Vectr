from datetime import date, timedelta
from agents.profile_agent import points_to_level, level_to_tier
from models import User


class PointsService:
    """Handles points calculation, leveling, and streak progression."""

    POINTS_TABLE = {
        "beginner": 10,
        "moderate": 25,
        "advanced": 50,
        "daily_challenge": 15,
        "streak_per_day": 5,
    }

    @classmethod
    def calculate_solve_points(cls, difficulty: str, is_daily: bool = False, streak_days: int = 0) -> int:
        """Calculate total points earned for completing an issue."""
        if is_daily:
            base = cls.POINTS_TABLE["daily_challenge"]
        else:
            base = cls.POINTS_TABLE.get(difficulty.lower(), 10)

        # Streak bonus (5 pts per active streak day)
        streak_bonus = streak_days * cls.POINTS_TABLE["streak_per_day"]
        return base + streak_bonus

    @classmethod
    def award_points(cls, user: User, points_to_add: int) -> int:
        """Award points to user and update level and tier."""
        user.points = (user.points or 0) + points_to_add
        user.level = points_to_level(user.points)
        user.tier = level_to_tier(user.level)
        return user.points

    @classmethod
    def update_streak(cls, user: User, contribution_date: date):
        """Update consecutive streak days based on contribution date."""
        today_str = contribution_date.isoformat()
        if not user.last_contribution_date:
            user.streak_days = 1
        elif user.last_contribution_date == today_str:
            pass  # Same day, keep streak
        else:
            last_date = date.fromisoformat(user.last_contribution_date)
            if contribution_date == last_date + timedelta(days=1):
                user.streak_days = (user.streak_days or 0) + 1
            else:
                user.streak_days = 1

        user.last_contribution_date = today_str
        user.longest_streak = max(user.longest_streak or 0, user.streak_days)
