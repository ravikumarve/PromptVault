from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from pathlib import Path


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./promptvault.db"
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"

    def model_post_init(self, __context):
        if self.SECRET_KEY == "your-secret-key-here-change-in-production":
            import warnings
            warnings.warn(
                "⚠️ SECRET_KEY is set to the default placeholder. "
                "Set a proper SECRET_KEY in .env for production!",
                stacklevel=2,
            )


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
