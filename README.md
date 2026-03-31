# PromptVault

Git for AI Prompts - Version control, collaboration, and testing for your prompt engineering workflow.

## 🚀 Current Status

**Last Updated: March 31, 2026**

### ✅ Completed Features

**Core Infrastructure:**
- ✅ **Authentication System**: Full JWT-based auth with registration, login, logout
- ✅ **Database Setup**: SQLite with SQLAlchemy ORM, user models, migrations ready
- ✅ **Backend API**: FastAPI backend with health checks and OpenAPI docs
- ✅ **Frontend Foundation**: Next.js 16.2.1 with TypeScript and Tailwind CSS 4
- ✅ **UI Design System**: Complete auth pages (login/register) with responsive design

**What Actually Works:**
- User registration and login (`POST /api/auth/register`, `POST /api/auth/login`)
- JWT token generation and validation
- Database persistence for user accounts
- Health check endpoint (`GET /api/health`)
- Complete authentication flow in frontend
- Responsive login/register UI

### ⚠️ Current Limitations
- Frontend development server not running (needs `npm run dev`)
- Prompt management endpoints return 501 Not Implemented
- Dashboard and main app interface not built yet
- No prompt versioning functionality implemented
- No AI model integrations yet

## 📋 Roadmap

### Phase 1: Core MVP (Current Focus)
- [x] **Authentication System** - User registration/login with JWT
- [x] **Database Schema** - User models and migrations
- [x] **Backend Foundation** - FastAPI setup with health checks
- [x] **Frontend Setup** - Next.js with TypeScript and Tailwind
- [ ] **Prompt CRUD** - Create, read, update, delete prompts
- [ ] **Version Control** - Git-like versioning for prompts
- [ ] **Dashboard UI** - Main application interface

### Phase 2: Collaboration Features
- [ ] Team management and sharing
- [ ] Prompt diff visualization
- [ ] Comment and review system
- [ ] Access control and permissions

### Phase 3: Advanced Features
- [ ] AI model integrations (OpenAI, Anthropic, etc.)
- [ ] Prompt performance analytics
- [ ] Template system and prompt sharing
- [ ] CLI tool for local prompt management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.2.1 with App Router
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Language**: TypeScript
- **UI**: Radix UI, Lucide React icons

### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: SQLite with SQLAlchemy 2.0 ORM
- **Authentication**: JWT with Python-JOSE
- **API**: RESTful API with OpenAPI documentation
- **Migrations**: Alembic for database versioning

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promptvault
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Copy and customize the example file
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```bash
   DATABASE_URL=sqlite:///./promptvault.db
   SECRET_KEY=your-super-secret-key-here-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```

5. **Run the development servers**
   ```bash
   # Terminal 1 - Backend (port 8000)
   cd backend
   uvicorn app.main:app --reload
   
   # Terminal 2 - Frontend (port 3000)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/api/docs

## 🗂️ Project Structure

```
promptvault/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── (app)/      # Authenticated routes (WIP)
│   │   │   ├── (auth)/     # Authentication routes
│   │   │   └── layout.tsx  # Root layout
│   │   ├── components/      # React components
│   │   ├── lib/            # Utility functions
│   │   └── types/          # TypeScript definitions
│   └── package.json
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── core/           # Configuration and dependencies
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API routes
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── database.py     # Database setup
│   │   └── main.py         # FastAPI app
│   ├── alembic/            # Database migrations
│   └── requirements.txt
└── README.md
```

## 🔌 API Endpoints

### Authentication (✅ Working)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Prompts (🚧 In Progress)
- `GET /api/prompts` - List all prompts (returns empty array)
- `POST /api/prompts` - Create new prompt (501 Not Implemented)
- `GET /api/prompts/{id}` - Get prompt by ID (404 Not Found)
- `PUT /api/prompts/{id}` - Update prompt (Not Implemented)
- `DELETE /api/prompts/{id}` - Delete prompt (Not Implemented)

### Health
- `GET /api/health` - Health check endpoint (✅ Working)

## 🧪 Development

### Running Tests

```bash
# Frontend tests (when implemented)
cd frontend
npm test

# Backend tests (when implemented)
cd backend
pytest
```

### Code Quality

```bash
# Linting
cd frontend
npm run lint

# Type checking
npx tsc --noEmit
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Focus Areas
- Implement prompt CRUD operations
- Build version control system for prompts
- Create dashboard and main application UI
- Add AI model integrations
- Implement team collaboration features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Open an issue on GitHub for bugs or feature requests
- Check the API documentation at `/api/docs` when backend is running
- Review the existing codebase for implementation patterns

---

**Note**: This is an active development project. Features marked as "working" have been tested and verified. Features marked "in progress" are partially implemented but may have limitations. Check the GitHub issues for current development status and priorities.