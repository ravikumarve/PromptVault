from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from difflib import unified_diff

from ..database import get_db
from ..models.user import User
from ..models.prompt import Prompt as PromptModel
from ..models.version import PromptVersion
from ..schemas.version import PromptVersion as PromptVersionSchema, PromptVersionCreate
from ..core.deps import get_current_user
from ..core.ownership import verify_prompt_ownership

router = APIRouter()


def get_next_version_number(prompt_id: int, db: Session) -> int:
    """
    Get the next version number for a prompt.
    If no versions exist, returns 1.
    """
    latest_version = (
        db.query(PromptVersion)
        .filter(PromptVersion.prompt_id == prompt_id)
        .order_by(PromptVersion.version_number.desc())
        .first()
    )

    return 1 if not latest_version else latest_version.version_number + 1


def calculate_diff(old_content: str, new_content: str) -> str:
    """Calculate unified diff between two versions.
    Returns a string containing the diff.
    """
    old_lines = old_content.splitlines(keepends=True)
    new_lines = new_content.splitlines(keepends=True)

    diff = unified_diff(old_lines, new_lines, fromfile="old", tofile="new", lineterm="")

    return "".join(diff)


@router.get("/prompts/{prompt_id}/versions", response_model=List[PromptVersionSchema])
async def list_versions(
    prompt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all versions for a specific prompt.
    Returns versions ordered by most recent first.
    """
    # Verify prompt ownership
    verify_prompt_ownership(prompt_id, current_user, db)

    versions = (
        db.query(PromptVersion)
        .filter(PromptVersion.prompt_id == prompt_id)
        .order_by(PromptVersion.version_number.desc())
        .all()
    )

    return versions


@router.post(
    "/prompts/{prompt_id}/versions",
    response_model=PromptVersionSchema,
    status_code=status.HTTP_201_CREATED,
)
async def create_version(
    prompt_id: int,
    version_data: PromptVersionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new version for a prompt.

    Features:
    - Automatic version numbering
    - Commit message tracking
    - Model testing tracking
    - Content validation
    """
    # Verify prompt ownership
    prompt = verify_prompt_ownership(prompt_id, current_user, db)

    # Validate content is not empty
    if not version_data.content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Content cannot be empty",
        )

    # Get the next version number
    version_number = get_next_version_number(prompt_id, db)

    # Create new version
    db_version = PromptVersion(
        prompt_id=prompt_id,
        content=version_data.content,
        version_number=version_number,
        message=version_data.message,
        model_tested=version_data.model_tested,
    )

    db.add(db_version)
    db.commit()
    db.refresh(db_version)

    return db_version


@router.get(
    "/prompts/{prompt_id}/versions/{version_id}", response_model=PromptVersionSchema
)
async def get_version(
    prompt_id: int,
    version_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get a specific version of a prompt.
    """
    # Verify prompt ownership
    verify_prompt_ownership(prompt_id, current_user, db)

    version = (
        db.query(PromptVersion)
        .filter(PromptVersion.id == version_id, PromptVersion.prompt_id == prompt_id)
        .first()
    )

    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version with ID {version_id} not found for prompt {prompt_id}",
        )

    return version


@router.get("/prompts/{prompt_id}/versions/latest", response_model=PromptVersionSchema)
async def get_latest_version(
    prompt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get the latest version of a prompt.
    """
    # Verify prompt ownership
    verify_prompt_ownership(prompt_id, current_user, db)

    version = (
        db.query(PromptVersion)
        .filter(PromptVersion.prompt_id == prompt_id)
        .order_by(PromptVersion.version_number.desc())
        .first()
    )

    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No versions found for prompt {prompt_id}",
        )

    return version


@router.get("/prompts/{prompt_id}/versions/{version_id}/diff")
async def get_version_diff(
    prompt_id: int,
    version_id: int,
    target_version_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get diff between two versions.

    If target_version_id is not provided, compares with previous version.
    Returns unified diff format.
    """
    # Verify prompt ownership
    verify_prompt_ownership(prompt_id, current_user, db)

    # Get the source version
    source_version = (
        db.query(PromptVersion)
        .filter(PromptVersion.id == version_id, PromptVersion.prompt_id == prompt_id)
        .first()
    )

    if not source_version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Source version with ID {version_id} not found",
        )

    # Determine target version
    if target_version_id:
        target_version = (
            db.query(PromptVersion)
            .filter(
                PromptVersion.id == target_version_id,
                PromptVersion.prompt_id == prompt_id,
            )
            .first()
        )

        if not target_version:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Target version with ID {target_version_id} not found",
            )
    else:
        # Get previous version
        target_version = (
            db.query(PromptVersion)
            .filter(
                PromptVersion.prompt_id == prompt_id,
                PromptVersion.version_number < source_version.version_number,
            )
            .order_by(PromptVersion.version_number.desc())
            .first()
        )

        if not target_version:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No previous version found for comparison",
            )

    # Calculate diff
    diff_content = calculate_diff(target_version.content, source_version.content)

    return {
        "source_version_id": source_version.id,
        "source_version_number": source_version.version_number,
        "target_version_id": target_version.id,
        "target_version_number": target_version.version_number,
        "diff": diff_content,
    }


@router.get("/prompts/{prompt_id}/versions/{version_id}/compare/{target_version_id}")
async def compare_versions(
    prompt_id: int,
    version_id: int,
    target_version_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Compare two specific versions.
    Returns both versions and their diff.
    """
    # Verify prompt ownership
    verify_prompt_ownership(prompt_id, current_user, db)

    # Get both versions
    version1 = (
        db.query(PromptVersion)
        .filter(PromptVersion.id == version_id, PromptVersion.prompt_id == prompt_id)
        .first()
    )

    version2 = (
        db.query(PromptVersion)
        .filter(
            PromptVersion.id == target_version_id, PromptVersion.prompt_id == prompt_id
        )
        .first()
    )

    if not version1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version with ID {version_id} not found",
        )

    if not version2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version with ID {target_version_id} not found",
        )

    # Determine which version is newer for diff direction
    if version1.version_number > version2.version_number:
        source_version = version1
        target_version = version2
    else:
        source_version = version2
        target_version = version1

    # Calculate diff
    diff_content = calculate_diff(target_version.content, source_version.content)

    return {
        "versions": {
            "source": PromptVersionSchema.from_orm(source_version),
            "target": PromptVersionSchema.from_orm(target_version),
        },
        "diff": diff_content,
    }
