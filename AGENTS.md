# PromptVault — Agent Instructions

Git-for-prompts SaaS. Two-package monorepo: FastAPI backend + Next.js frontend.

## Dev Commands

```bash
# Backend (from backend/)
source venv/bin/activate
uvicorn app.main:app --reload          # starts on :8000

# Frontend (from frontend/)
npm run dev                            # starts on :3000
npm run lint                           # eslint (no test runner configured)
npx tsc --noEmit                       # typecheck
```

No test framework is set up on either side. `pytest` and `npm test` will fail. Ad-hoc test scripts exist at repo root (`test-api-integration.js`, `test-frontend-api.js`) and `backend/test_versions.py` — these are standalone scripts, not suite runners.

## Architecture

- **Backend**: `backend/app/main.py` → FastAPI app. Routers in `app/routers/` (auth, prompts, versions). Models in `app/models/` (user, prompt, version, tag). Schemas in `app/schemas/`. Config in `app/core/`.
- **Frontend**: Next.js 16.2.1 App Router. Route groups: `(auth)/` for login/register, `(app)/` for dashboard/prompts (authenticated shell with sidebar+topbar). API client at `src/lib/api.ts`. Auth hook at `src/lib/auth.ts`. Path alias `@/*` → `./src/*`.
- **API prefix**: All backend routes mount under `/api/`. Docs at `http://localhost:8000/api/docs`.
- **Database**: SQLite. Tables auto-created on startup via `Base.metadata.create_all` — Alembic is installed but **not actually used** for migrations. Two `.db` files exist (`app.db`, `promptvault.db`) — `promptvault.db` is the one configured in `.env.example`.

## Critical Gotchas

### Auth is HTTPBearer, not cookies
Backend uses `HTTPBearer` scheme (`Authorization: Bearer <token>`). Frontend stores JWT in `localStorage`. The `/auth/logout` endpoint deletes a cookie that was never set — this is a no-op. **Do not add cookie-based auth without changing the security scheme.**

### Token refresh endpoint is missing
`src/lib/api.ts` calls `/api/auth/refresh` on 401, but this endpoint does not exist in the backend. Token refresh will silently fail and the user gets logged out.

### Schema mismatches between frontend types and backend
- Frontend `RegisterRequest` sends `username`; backend `UserCreate` expects `name`. Registration will 422.
- Frontend `PromptVersion` type has `version_hash`; backend model uses `version_number`. Version display will break.

### Duplicated version-numbering logic
`get_next_version_number()` is copy-pasted in both `backend/app/routers/prompts.py` and `backend/app/routers/versions.py`. Changes to one must be mirrored to the other.

### Deprecated FastAPI startup event
`@app.on_event("startup")` is deprecated. Use `lifespan` context manager for newer FastAPI versions.

### Legacy SQLAlchemy import
`database.py` uses `from sqlalchemy.ext.declarative import declarative_base` (deprecated). Modern pattern is `from sqlalchemy.orm import DeclarativeBase`.

## Design System (UI work)

**Read `design-system.md` before writing any UI code.** It is the source of truth. Key rules:

- **Dark premium**: bg `#09090B`, accent amber `#F59E0B`. Never indigo/violet/blue as primary.
- **Fonts**: Geist (sans) + Geist Mono. Never Inter, Roboto, or system-ui. Prompt content always `font-mono`.
- **CSS variables**: All colors reference `--var()` tokens defined in `globals.css`. No hardcoded hex inline.
- **shadcn style**: `radix-nova` (not default). Icons: `lucide-react` only, no emoji in nav.
- **Tailwind CSS 4**: Uses `@tailwindcss/postcss` plugin, not `tailwind.config.js`.
- **Card radius**: `rounded-lg` (8px). Never `rounded-2xl` or `rounded-full`.
- **Motion**: 150–200ms only. No bounce/spring.

## Environment

- Backend `.env`: `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `CORS_ORIGINS`. Copy from `backend/.env.example`.
- Frontend `.env.local`: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).
- Python 3.12+, Node 18+.

## File Map (non-obvious)

```
backend/
  app/core/config.py      ← Settings via pydantic-settings, cached with lru_cache
  app/core/deps.py         ← get_current_user dependency (HTTPBearer)
  app/core/security.py     ← bcrypt hashing, JWT creation
  app/models/tag.py        ← Also defines prompt_tags association table
  alembic/                 ← Installed but unused; tables auto-create on startup
  test_versions.py         ← Standalone script, not a pytest suite

frontend/
  src/lib/api.ts           ← ApiClient class with token refresh (broken, see above)
  src/lib/auth.ts          ← useAuth() hook + useProtectedRoute()
  src/app/globals.css.bak  ← Leftover backup file, safe to delete
  components.json          ← shadcn config: style "radix-nova", rsc: true
```
