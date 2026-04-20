from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from typing import List

from ..database import get_db
from ..models.user import User
from ..models.prompt import Prompt as PromptModel
from ..models.version import PromptVersion
from ..schemas.prompt import Prompt, PromptCreate
from ..core.deps import get_current_user
from ..core.ownership import verify_prompt_ownership

router = APIRouter()


def build_prompt_response(prompt: PromptModel) -> dict:
    """Build a prompt response dict with version_count and latest_content."""
    version_count = len(prompt.versions) if prompt.versions else 0
    latest_content = None
    if prompt.versions:
        latest = max(prompt.versions, key=lambda v: v.version_number)
        latest_content = latest.content

    return {
        "id": prompt.id,
        "user_id": prompt.user_id,
        "title": prompt.title,
        "description": prompt.description,
        "is_public": prompt.is_public,
        "created_at": prompt.created_at,
        "updated_at": prompt.updated_at,
        "version_count": version_count,
        "latest_content": latest_content,
    }


@router.get("/", response_model=List[Prompt])
async def list_prompts(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    prompts = (
        db.query(PromptModel)
        .filter(PromptModel.user_id == current_user.id)
        .options(selectinload(PromptModel.versions))
        .order_by(PromptModel.updated_at.desc())
        .all()
    )

    return [build_prompt_response(p) for p in prompts]


@router.post("/", response_model=Prompt, status_code=status.HTTP_201_CREATED)
async def create_prompt(
    prompt: PromptCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Create the prompt
    db_prompt = PromptModel(
        title=prompt.title,
        description=prompt.description,
        is_public=prompt.is_public,
        user_id=current_user.id,
    )
    db.add(db_prompt)
    db.flush()  # Flush to get the prompt ID before creating version

    # Auto-create initial version
    db_version = PromptVersion(
        prompt_id=db_prompt.id,
        version_number=1,
        content=prompt.content,
        message="Initial version",
    )
    db.add(db_version)
    db.commit()
    db.refresh(db_prompt)

    # Eager-load versions for the response
    db_prompt = (
        db.query(PromptModel)
        .options(selectinload(PromptModel.versions))
        .filter(PromptModel.id == db_prompt.id)
        .first()
    )

    return build_prompt_response(db_prompt)


@router.get("/{prompt_id}", response_model=Prompt)
async def get_prompt(
    prompt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prompt = verify_prompt_ownership(prompt_id, current_user, db)
    return build_prompt_response(prompt)
