from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload
from ..models.user import User
from ..models.prompt import Prompt as PromptModel


def verify_prompt_ownership(
    prompt_id: int, current_user: User, db: Session
) -> PromptModel:
    """Verify that the current user owns the prompt.

    Returns the prompt with versions eager-loaded if valid,
    raises HTTPException otherwise.
    """
    prompt = (
        db.query(PromptModel)
        .options(selectinload(PromptModel.versions))
        .filter(PromptModel.id == prompt_id)
        .first()
    )

    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prompt with ID {prompt_id} not found",
        )

    if prompt.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this prompt",
        )

    return prompt
