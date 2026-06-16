"""Import all models so SQLAlchemy registers them before mapper configuration."""
from .user import User
from .prompt import Prompt
from .version import PromptVersion
from .tag import Tag, prompt_tags
