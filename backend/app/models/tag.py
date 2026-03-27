from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

prompt_tags = Table(
    "prompt_tags",
    Base.metadata,
    Column("prompt_id", Integer, ForeignKey("prompts.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True),
)


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="tags")
    prompts = relationship("Prompt", secondary=prompt_tags, back_populates="tags")
