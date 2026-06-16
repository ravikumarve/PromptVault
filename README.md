<p align="center">
<img src="https://img.shields.io/badge/PromptVault-Git_for_AI_Prompts-F59E0B?style=for-the-badge&logo=git&logoColor=white" alt="PromptVault" />
</p>

<h1 align="center">PromptVault</h1>

<p align="center">
<strong>Version control for AI prompts. Commit, diff, and collaborate on your prompt engineering workflow.</strong>
</p>

<p align="center">
<img src="https://img.shields.io/github/stars/ravikumarve/PromptVault?style=social" />
<img src="https://img.shields.io/github/license/ravikumarve/PromptVault" />
<img src="https://img.shields.io/badge/python-3.12+-3776AB?logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/Next.js-16-000?logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/status-active-brightgreen" />
</p>

---

## ✨ Features

- **Git-like Versioning**: Commit, branch, and diff your prompts like code
- **Team Collaboration**: Share, review, and comment on prompt changes
- **AI Model Testing**: Run prompts against OpenAI, Anthropic, and more — track what works
- **Dashboard UI**: Dark premium interface with amber accent, built for prompt engineers

## 🚀 Quick Start

```bash
# Clone & install
git clone https://github.com/ravikumarve/PromptVault.git && cd PromptVault

# Backend
cd backend && pip install -r requirements.txt && cp .env.example .env

# Frontend
cd ../frontend && npm install

# Run (two terminals)
uvicorn app.main:app --reload   # ← backend :8000
npm run dev                      # ← frontend :3000
```

## ⚙️ Configuration

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./promptvault.db` | SQLAlchemy connection string |
| `SECRET_KEY` | — | JWT signing key (change in production!) |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` | Token expiry (7 days) |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed origins |

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 · TypeScript · Tailwind CSS 4 · shadcn/ui · Radix UI |
| Backend | FastAPI · SQLAlchemy 2.0 · JWT (Python-JOSE) · Alembic |
| Database | SQLite (dev) · extensible to PostgreSQL |

## 📖 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/logout` | Clear session |
| POST | `/api/auth/refresh` | Refresh expired token |

### Prompts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/prompts/` | List user's prompts (with version count + latest content) |
| POST | `/api/prompts/` | Create prompt + initial version |
| GET | `/api/prompts/{id}` | Get prompt details |
| PUT | `/api/prompts/{id}` | Update prompt (auto-versions on content change) |
| DELETE | `/api/prompts/{id}` | Delete prompt + all versions |

### Versions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/prompts/{id}/versions` | List all versions |
| POST | `/api/prompts/{id}/versions` | Create new version (auto-numbered) |
| GET | `/api/prompts/{id}/versions/latest` | Get latest version |
| GET | `/api/prompts/{id}/versions/{vid}` | Get specific version |
| GET | `/api/prompts/{id}/versions/{vid}/diff` | Unified diff (optional `target_version_id`) |
| GET | `/api/prompts/{id}/versions/{vid}/compare/{target}` | Compare two versions |

Full interactive docs: `http://localhost:8000/api/docs`

## 🧪 Testing

```bash
cd backend
PYTHONPATH=. python3 -m pytest tests/ -v
```

**41 tests** covering auth, prompt CRUD, versioning, ownership isolation, and diff/compare. Uses an in-memory SQLite database — no setup required.

## 🗂️ Project Structure

```
promptvault/
├── frontend/               # Next.js 16 (App Router)
│   └── src/
│       ├── app/            # (auth)/ and (app)/ route groups
│       ├── components/     # Sidebar, Topbar, UI primitives
│       ├── lib/            # ApiClient, auth hooks, utils
│       └── types/          # TypeScript interfaces
├── backend/                # FastAPI
│   ├── app/
│   │   ├── core/           # Config, security, dependencies
│   │   ├── models/         # SQLAlchemy models (User, Prompt, PromptVersion, Tag)
│   │   ├── routers/        # auth, prompts, versions
│   │   └── schemas/        # Pydantic validation schemas
│   └── tests/              # 41 pytest tests (in-memory DB)
├── .env.example
└── README.md
```

## 🤝 Contributing

1. Fork → `git checkout -b feat/your-feature`
2. Commit using [Conventional Commits](https://conventionalcommits.org)
3. Open a PR with a clear description

## 📄 License

MIT — see [LICENSE](LICENSE)
