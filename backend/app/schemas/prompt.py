from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PromptBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_public: bool = False


class PromptCreate(PromptBase):
    content: str


class PromptUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    content: Optional[str] = None


class Prompt(PromptBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    version_count: int = 0
    latest_content: Optional[str] = None

    class Config:
        from_attributes = True
