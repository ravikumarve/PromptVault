from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.user import User
from ..schemas.prompt import Prompt, PromptCreate
from ..core.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[Prompt])
async def list_prompts(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return []


@router.post("/", response_model=Prompt)
async def create_prompt(
    prompt: PromptCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Prompt creation not implemented yet",
    )


@router.get("/{prompt_id}", response_model=Prompt)
async def get_prompt(
    prompt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found"
    )
