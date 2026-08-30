import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, ForeignKey
from database import Base


class IssueEmbedding(Base):
    """Stores vector embeddings for issue titles to enable semantic search."""
    __tablename__ = "issue_embeddings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    issue_id = Column(String, ForeignKey("issues.id"), unique=True, nullable=False, index=True)
    title_hash = Column(String, nullable=False)  # SHA256 of title — skip re-embed if unchanged
    embedding = Column(Text, nullable=False)  # JSON-serialized float array (768 dims)
    model_version = Column(String, default="gemini-embedding-001")
    created_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
