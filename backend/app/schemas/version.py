from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PromptVersionBase(BaseModel):
    content: str
    message: Optional[str] = None
    model_tested: Optional[str] = None


class PromptVersionCreate(PromptVersionBase):
    pass


class PromptVersion(PromptVersionBase):
    id: int
    prompt_id: int
    version_number: int
    created_at: datetime

    class Config:
        from_attributes = True
