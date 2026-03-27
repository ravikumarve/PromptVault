# PromptVault — Week 1 OpenCode Prompt
# Paste this into OpenCode from ~/promptvault directory

---

Activate the backend-architect agent combined with the frontend-developer agent.

You are building **PromptVault** — a Git-for-prompts SaaS.
Core concept: version control for AI prompts. Users create prompts, save versions, 
tag them, test them, and share them. Like GitHub but for prompts.

Stack:
- Frontend: Next.js 14 App Router + shadcn/ui + Tailwind CSS
- Backend: FastAPI + SQLAlchemy + SQLite
- Auth: JWT tokens (FastAPI backend, stored in httpOnly cookies)
- Styling: Follow design-system.md exactly — dark premium, amber accent, Geist font

Read design-system.md fully before writing any UI code.

---

## Week 1 Deliverables

### Backend (~/promptvault/backend/)

**1. Project structure**
```
backend/
  app/
    main.py           ← FastAPI app entry point
    database.py       ← SQLAlchemy engine + session
    models/
      user.py         ← User model
      prompt.py       ← Prompt model  
      version.py      ← PromptVersion model
      tag.py          ← Tag model
    schemas/
      user.py         ← Pydantic schemas
      prompt.py
      version.py
    routers/
      auth.py         ← /auth/register, /auth/login, /auth/logout, /auth/me
      prompts.py      ← CRUD for prompts (stub — full Week 2)
    core/
      config.py       ← Settings from .env
      security.py     ← JWT encode/decode, password hashing
      deps.py         ← FastAPI dependencies (get_current_user, get_db)
  .env.example
  requirements.txt
  alembic.ini
  alembic/
```

**2. Database models**

User:
- id, email (unique), hashed_password, name, created_at, is_active

Prompt:
- id, title, description, user_id (FK), is_public, created_at, updated_at
- relationship: versions, tags, user

PromptVersion:
- id, prompt_id (FK), content (TEXT), version_number (INT), 
  message (commit message), model_tested (nullable), created_at
- version_number auto-increments per prompt (1, 2, 3...)

Tag:
- id, name, user_id (FK)
- Many-to-many with Prompt via prompt_tags table

**3. Auth endpoints**
- POST /auth/register → create user, return JWT
- POST /auth/login → verify credentials, return JWT  
- GET /auth/me → return current user (requires auth)
- POST /auth/logout → clear token

**4. Security rules**
- Passwords: bcrypt hashing via passlib
- JWT: python-jose, 7-day expiry, stored in httpOnly cookie
- All routes beyond /auth require valid JWT via Depends(get_current_user)
- No secrets in code — use .env + python-dotenv
- Input validation via Pydantic — no raw dicts

**5. Prompt stubs (full implementation Week 2)**
- GET /prompts → list user's prompts (returns empty list for now)
- POST /prompts → create prompt stub
- GET /prompts/{id} → get single prompt

---

### Frontend (~/promptvault/frontend/)

**1. Project structure**
```
frontend/src/
  app/
    layout.tsx          ← Root layout: Geist font, dark bg, global CSS
    page.tsx            ← Landing page (/ route)
    (auth)/
      login/page.tsx    ← Login page
      register/page.tsx ← Register page
    (app)/
      layout.tsx        ← App shell: sidebar + topbar
      dashboard/page.tsx ← Main dashboard (stub)
      prompts/page.tsx  ← Prompts list (stub)
  components/
    ui/                 ← shadcn components (auto-generated)
    layout/
      sidebar.tsx       ← App sidebar nav
      topbar.tsx        ← Top navigation bar
    auth/
      login-form.tsx    ← Login form component
      register-form.tsx ← Register form component
  lib/
    api.ts              ← Axios/fetch client pointing to FastAPI
    auth.ts             ← Auth helpers (getToken, setToken, clearToken)
  types/
    index.ts            ← TypeScript interfaces (User, Prompt, Version, Tag)
```

**2. Landing page (/) — follows design-system.md**
- Dark premium hero: headline + subheadline + CTA buttons
- Feature grid: 3 cards (Version Control, Team Sharing, Model Testing)
- Simple nav: logo left, Login + Get Started right
- Amber radial gradient on body background
- NO generic indigo CTA — use amber primary button

**3. Auth pages**
- Login: centered card, email + password, link to register
- Register: name + email + password + confirm password
- Both connect to FastAPI backend via lib/api.ts
- On success: store JWT, redirect to /dashboard
- Error states visible in UI (not just console)

**4. App shell layout**
- Sidebar: 240px, PromptVault logo, nav items (Dashboard, My Prompts, Explore, Settings)
- Topbar: breadcrumb left, user avatar + name right
- Main: scrollable content area
- Active nav item: amber accent styling per design-system.md

**5. Dashboard stub**
- Welcome message with user name
- 3 stat cards: Total Prompts, Total Versions, Public Prompts
- Recent prompts list (empty state handled — not just blank)
- "Create your first prompt" CTA if no prompts exist

---

## Rules for this entire week

1. Read design-system.md before writing any component
2. All State management: React hooks only (no Redux/Zustand Week 1)
3. All API calls go through lib/api.ts — never fetch() inline in components
4. TypeScript strict mode — no `any` types
5. Every component handles: loading state, empty state, error state
6. Backend: no bare `except:` — always specific exceptions
7. Backend: all routes async def
8. Frontend: use lucide-react for all icons — no emoji in UI
9. Git commit after each major piece: follow conventional commits
10. No placeholder "coming soon" text — use proper empty states with CTAs

---

## Completion checklist

Backend:
- [ ] FastAPI starts with `uvicorn app.main:app --reload`
- [ ] /auth/register creates user in SQLite
- [ ] /auth/login returns valid JWT
- [ ] /auth/me returns user when JWT provided
- [ ] /api/health returns {"status": "ok"}
- [ ] All routes have response_model declared

Frontend:
- [ ] `npm run dev` starts without errors
- [ ] Landing page renders with dark premium design
- [ ] Login form submits to FastAPI and stores token
- [ ] Register form creates account and redirects
- [ ] App shell renders with sidebar + topbar
- [ ] Dashboard shows empty state correctly

---

Start by reading design-system.md, then map the full file structure, 
then implement backend first, then frontend.
Report progress after each major file group. 
Ask before making any architectural decisions not covered above.
