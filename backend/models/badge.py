import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, ForeignKey, UniqueConstraint
from database import Base


class UserBadge(Base):
    """Junction table for badges earned by users."""
    __tablename__ = "user_badges"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    badge_id = Column(String, nullable=False)
    earned_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())

    __table_args__ = (
        UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),
    )
