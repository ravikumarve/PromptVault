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

| Endpoint | Method | Status |
|---|---|---|
| `/api/auth/register` | POST | ✅ Working |
| `/api/auth/login` | POST | ✅ Working |
| `/api/auth/logout` | POST | ✅ Working |
| `/api/auth/me` | GET | ✅ Working |
| `/api/prompts` | GET | 🚧 Returns empty |
| `/api/prompts` | POST | 🚧 501 Not Implemented |
| `/api/health` | GET | ✅ Working |

Full interactive docs: `http://localhost:8000/api/docs`

## 🗂️ Project Structure

```
promptvault/
├── frontend/          # Next.js 16 (App Router)
│   └── src/
│       ├── app/       # (auth)/ and (app)/ route groups
│       ├── components/
│       └── lib/
├── backend/           # FastAPI
│   └── app/
│       ├── core/      # Config, dependencies
│       ├── models/    # SQLAlchemy models
│       ├── routers/   # API routes
│       └── schemas/   # Pydantic schemas
└── .env.example
```

## 🤝 Contributing

1. Fork → `git checkout -b feat/your-feature`
2. Commit using [Conventional Commits](https://conventionalcommits.org)
3. Open a PR with a clear description

## 📄 License

MIT — see [LICENSE](LICENSE)
