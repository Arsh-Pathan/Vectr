import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, ForeignKey, UniqueConstraint
from database import Base


class Contribution(Base):
    """Contribution record when a developer completes an issue."""
    __tablename__ = "contributions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    issue_id = Column(String, ForeignKey("issues.id"), nullable=False)
    pr_url = Column(String, nullable=True)
    points_earned = Column(Integer, nullable=False)
    completed_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat(), index=True)

    __table_args__ = (
        UniqueConstraint("user_id", "issue_id", name="uq_user_issue_contrib"),
    )
