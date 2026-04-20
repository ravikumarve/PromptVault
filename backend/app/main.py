from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .database import engine, Base
from .routers import auth, prompts, versions

app = FastAPI(
    title="PromptVault API",
    description="Git-for-prompts SaaS API",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "ok"}


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(prompts.router, prefix="/api/prompts", tags=["prompts"])
app.include_router(versions.router, prefix="/api", tags=["versions"])
