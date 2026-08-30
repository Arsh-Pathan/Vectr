import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, ForeignKey, Text
from database import Base


class Organization(Base):
    """Registered Organization model."""
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    github_org_url = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())


class Project(Base):
    """Organization's registered projects/repos."""
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False, index=True)
    repo_full_name = Column(String, nullable=False)
    repo_url = Column(String, nullable=False)
    issues_scanned = Column(Integer, default=0)
    created_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
