from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from typing import List

from ..database import get_db
from ..models.user import User
from ..models.prompt import Prompt as PromptModel
from ..models.version import PromptVersion
from ..schemas.prompt import Prompt, PromptCreate, PromptUpdate
from ..core.deps import get_current_user
from ..core.ownership import verify_prompt_ownership
from ..routers.versions import get_next_version_number

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


@router.put("/{prompt_id}", response_model=Prompt)
async def update_prompt(
    prompt_id: int,
    prompt_update: PromptUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prompt = verify_prompt_ownership(prompt_id, current_user, db)

    # Update metadata fields if provided
    if prompt_update.title is not None:
        prompt.title = prompt_update.title
    if prompt_update.description is not None:
        prompt.description = prompt_update.description
    if prompt_update.is_public is not None:
        prompt.is_public = prompt_update.is_public

    # Auto-create new version if content changed
    if prompt_update.content is not None:
        if not prompt_update.content.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Content cannot be empty",
            )

        latest_content = None
        if prompt.versions:
            latest = max(prompt.versions, key=lambda v: v.version_number)
            latest_content = latest.content

        if latest_content is None or prompt_update.content != latest_content:
            version_number = get_next_version_number(prompt_id, db)
            db_version = PromptVersion(
                prompt_id=prompt_id,
                version_number=version_number,
                content=prompt_update.content,
                message="Updated content",
            )
            db.add(db_version)

    db.commit()

    # Re-fetch with eager-loaded versions for the response
    prompt = (
        db.query(PromptModel)
        .options(selectinload(PromptModel.versions))
        .filter(PromptModel.id == prompt_id)
        .first()
    )

    return build_prompt_response(prompt)


@router.delete("/{prompt_id}")
async def delete_prompt(
    prompt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prompt = verify_prompt_ownership(prompt_id, current_user, db)
    db.delete(prompt)
    db.commit()
    return {"message": "Prompt deleted successfully"}
