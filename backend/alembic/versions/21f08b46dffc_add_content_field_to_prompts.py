"""add_content_field_to_prompts

Revision ID: 21f08b46dffc
Revises:
Create Date: 2026-04-01 02:00:16.568598

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "21f08b46dffc"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add content column to prompts table with empty string as default
    op.add_column("prompts", sa.Column("content", sa.String(), default=""))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove content column from prompts table
    op.drop_column("prompts", "content")
