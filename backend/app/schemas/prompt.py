from pydantic import BaseModel, computed_field
from datetime import datetime
from typing import Optional


class PromptBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_public: bool = False


class PromptCreate(PromptBase):
    content: str


class Prompt(PromptBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    version_count: int = 0
    latest_content: Optional[str] = None

    class Config:
        from_attributes = True
