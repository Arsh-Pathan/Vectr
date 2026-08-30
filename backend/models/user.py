import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text
from database import Base


class User(Base):
    """User database model."""
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    google_id = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)

    # GitHub Details
    github_username = Column(String, nullable=True, index=True)
    github_token = Column(String, nullable=True)

    # Gamification
    level = Column(Integer, default=0)
    points = Column(Integer, default=0)
    tier = Column(String, default="beginner")

    # Preferences (JSON encoded string)
    preferred_languages = Column(Text, default="[]")

    # Stats
    streak_days = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    issues_solved = Column(Integer, default=0)
    daily_challenges_completed = Column(Integer, default=0)
    last_contribution_date = Column(String, nullable=True)

    # Timestamps
    created_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
    updated_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat(), onupdate=lambda: datetime.now(timezone.utc).isoformat())
