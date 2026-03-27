from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PromptBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_public: bool = False


class PromptCreate(PromptBase):
    pass


class Prompt(PromptBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
