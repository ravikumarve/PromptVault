# 🏛️ PromptVault — Agent Integration Guide

### [2026-06-16 09:00] - Phase 1 Dashboard Implementation (Core Shell + Library)
- **State**: Success — Pushed to main (5aacb10)
- **MCP Data Used**: code_tree (AST analysis), read_session (session resume)
- **Agents Deployed**: explore (project audit), @codebase (direct execution)
- **Architectural Decision**: Landing page tokens (`--bg-void`, `--surface-panel`, `--border-dim`, `--accent-amber`) as CSS custom properties. Fixed sidebar (240px→48px collapsible) with localStorage persistence. Inter + JetBrains Mono fonts replacing Geist. Bento grid (12-col) for dashboard layout. KPI strip feeds from real `GET /api/prompts/` data.
- **Deliverables**:
  - `globals.css` — full landing page tokens, grid overlay, ambient glow, btn/btn-primary/btn-outline, card, diff, scrollbar styles
  - `components/ui/` — KpiCard, SearchInput, EmptyState, Badge, Avatar
  - `components/layout/sidebar.tsx` — collapsible (240px/48px), 5 nav items, amber accent, localStorage
  - `components/layout/topbar.tsx` — breadcrumbs, ⌘K search, user avatar with name/email
  - `(app)/layout.tsx` — fixed sidebar offset, flex layout, polling for collapse state
  - `dashboard/page.tsx` — bento grid, 4 KPI cards (real data), recent prompts, activity feed, version chart placeholder
  - `prompts/page.tsx` — real API data, search (visual), sort (visual), prompt rows with badges, empty state
  - Switched fonts: Geist → Inter + JetBrains Mono (next/font/google)
- **Next Turn Directive**: Phase 2 — Prompt Detail page (70/30 split), Version Timeline component, CodeBlock component. Phase 3 — Prompt Editor + Diff Viewer hero component.

### [2026-06-15 14:30] - Dashboard Architecture + Backend Test Suite
- **State**: Success — Pushed to main (89ad2e9)
- **MCP Data Used**: websearch (dashboard layout patterns, bento grid inspiration)
- **Agents Deployed**: explore (project audit), @orchestrator (direct execution)
- **Architectural Decision**: Fixed sidebar + breadcrumb header + scrollable content (Stripe/GitHub hybrid). Bento grid for dashboard. Diff viewer as hero component. Particle wave in auth layout only initially.
- **Deliverables**: `DASHBOARD_ARCHITECTURE.md` (523 lines, 8 sections), `backend/tests/` (41 tests), fixed 3 pre-existing bugs (models/__init__.py, tag.py DateTime import, versions.py route ordering)
- **Next Turn Directive**: Apply amber theme from `promptvault-landing.html` and begin Phase 1 implementation (sidebar, topbar, prompts library, dashboard with real data)

### [2026-04-20 07:20] - Sprint PromptCRUD-Bravo
- **State**: Success — Pushed to main (36b459e)
- **MCP Data Used**: code_tree (AST analysis), @review (code review)
- **Agents Deployed**: @orchestrator (direct), @review (code review)
- **Architectural Decision**: Completed full prompt CRUD (PUT/DELETE). PUT auto-versions on content change using `get_next_version_number` from versions router. Refresh token endpoint uses `get_user_from_expired_token` dep (decodes JWT with `verify_exp=False`) so expired tokens can be refreshed. Login/register now properly stores token in localStorage before checkAuth. Created `prompts/new/page.tsx` with design-system-compliant form. Removed `tags` from frontend API calls until backend supports them.
- **Next Turn Directive**: Add Pydantic Field constraints (min_length/max_length) on PromptCreate/PromptUpdate. Add pagination to list_prompts. Move `get_next_version_number` to core/ or services/ (cross-router import smell). Add `version_hash` to PromptVersion model. Replace `window.location.href` redirects with `useRouter().push()`. Add frontend prompt detail/edit page.

### [2026-04-20 06:55] - Sprint PromptCRUD-Alpha
- **State**: Success — Pushed to main (66165dc)
- **MCP Data Used**: code_tree (AST analysis), grep_app (ownership patterns), git CLI
- **Agents Deployed**: @orchestrator (direct), @review (code review)
- **Architectural Decision**: Implemented prompt CRUD with auto-versioning. Extracted shared `verify_prompt_ownership` to `core/ownership.py` (DRY). Added `is_active` check in auth dep. Frontend `Prompt` type now matches backend response shape (`version_count`, `latest_content` instead of `content`).
- **Next Turn Directive**: Implement PUT /api/prompts/{id} and DELETE /api/prompts/{id}. Add refresh token endpoint. Add input validation (Field constraints on PromptCreate). Add pagination to list_prompts.

### [2026-04-20 05:15] - Sprint PromptVault-Hygiene
- **State**: Success
- **MCP Data Used**: GitHub API (file contents, branch management), git CLI
- **Agents Deployed**: @orchestrator (direct execution)
- **Architectural Decision**: Removed 3649 tracked files (venv, db, logs, __pycache__, local-only docs) from repo. Renamed master→main. Upgraded README with badges and API reference table.
- **Next Turn Directive**: Commit the remaining unstaged backend code changes (modified models, routers, schemas) as a feature commit, then implement Prompt CRUD endpoints

## Project Context
**PromptVault** is a Git-for-Prompts SaaS: version control, collaboration, and testing for AI prompt engineering. Two-package monorepo: FastAPI backend (port 8000) + Next.js 16.2.1 frontend (port 3000).

## Agent Source Directory
Production-ready agent definitions live at: `/home/matrix/agency-agents/`

## Active Agents for PromptVault

| Agent | File | When to Use |
|---|---|---|
| 🏗️ Backend Architect | `engineering/engineering-backend-architect.md` | FastAPI routes, SQLAlchemy models, DB schema design |
| 🖥️ Frontend Developer | `engineering/engineering-frontend-developer.md` | Next.js App Router pages, React components, Tailwind UI |
| 🔍 Code Reviewer | `engineering/engineering-code-reviewer.md` | Pre-commit quality gates, PR reviews |
| 🔒 Security Engineer | `engineering/engineering-security-engineer.md` | Auth hardening, JWT audit, CORS review |
| 📝 Technical Writer | `engineering/engineering-technical-writer.md` | README, API docs, inline docstrings |
| 🏛️ Software Architect | `engineering/engineering-software-architect.md` | Architecture decisions, monorepo structure |
| ⚙️ DevOps Automator | `engineering/engineering-devops-automator.md` | CI/CD, GitHub Actions, deployment |
| 🎨 UI Designer | `design/design-ui-designer.md` | Component design, design tokens, visual system |
| 📐 UX Architect | `design/design-ux-architect.md` | CSS foundation, layout architecture, responsive |
| 🧪 API Tester | `testing/testing-api-tester.md` | FastAPI endpoint testing, contract validation |
| ♿ Accessibility Auditor | `testing/testing-accessibility-auditor.md` | WCAG AA compliance, keyboard nav, screen reader |
| 📋 Product Manager | `product/product-manager.md` | Roadmap, sprint planning, feature prioritization |
| 🎛️ Agents Orchestrator | `specialized/agents-orchestrator.md` | Multi-agent pipeline coordination |
| 📢 Developer Advocate | `specialized/specialized-developer-advocate.md` | Community content, demos, Gumroad listing |
| 📄 Document Generator | `specialized/specialized-document-generator.md` | Auto-generate docs from code |

## Design System (Local Reference)
See `design-system.md` (local-only, not in repo) for:
- Dark premium aesthetic, amber accent `#F59E0B`
- Geist fonts, bg `#09090B`
- `rounded-lg` only (never `rounded-2xl`)
- Tailwind CSS 4 with `@tailwindcss/postcss` plugin
- shadcn style `radix-nova`

## How to Use Agents
1. **Single task**: Load the relevant agent file from `/home/matrix/agency-agents/` as context
2. **Pipeline**: Use the Agents Orchestrator to coordinate multiple agents in sequence
3. **Quality gate**: Always run Code Reviewer before committing
4. **Security**: Run Security Engineer on any auth/DB changes
