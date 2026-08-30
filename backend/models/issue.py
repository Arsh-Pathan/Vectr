import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, Text, UniqueConstraint
from database import Base


class Issue(Base):
    """Cached GitHub Issue categorized by Issue Scanner Agent."""
    __tablename__ = "issues"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    github_issue_id = Column(Integer, nullable=False)
    repo_full_name = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=False)

    # AI categorization
    difficulty = Column(String, nullable=False, index=True)  # beginner | moderate | advanced
    difficulty_score = Column(Integer, nullable=False)  # 1-100
    required_skills = Column(Text, default="[]")  # JSON array string
    labels = Column(Text, default="[]")  # JSON array string
    summary = Column(Text, nullable=True)
    estimated_time = Column(String, nullable=True)

    # Daily Challenge
    is_daily_challenge = Column(Boolean, default=False, index=True)
    daily_challenge_date = Column(String, nullable=True)

    # Organization
    organization_id = Column(String, nullable=True)

    # Timestamps
    created_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
    scanned_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())

    __table_args__ = (
        UniqueConstraint("github_issue_id", "repo_full_name", name="uq_repo_issue"),
    )
