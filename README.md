# PromptVault

Git for AI Prompts - Version control, collaboration, and testing for your prompt engineering workflow.

## Overview

PromptVault is a SaaS platform that brings Git-like version control to AI prompt engineering. Track changes, collaborate with teams, and test prompts across different models - all in one place.

## Features

- **Version Control**: Track changes, revert to previous versions, and maintain complete history
- **Team Collaboration**: Share prompts and maintain consistency across AI applications
- **Model Testing**: Test prompts across different AI models and track performance
- **Modern Stack**: Next.js 16 frontend with FastAPI backend and SQLite database

## Tech Stack

### Frontend
- **Framework**: Next.js 16.2.1 with App Router
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Language**: TypeScript
- **UI**: Radix UI, Lucide React icons

### Backend
- **Framework**: FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT-based auth system
- **API**: RESTful API with OpenAPI documentation

## Getting Started

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
   # Backend (.env)
   DATABASE_URL=sqlite:///./promptvault.db
   SECRET_KEY=your-secret-key-here
   CORS_ORIGINS=http://localhost:3000
   ```

5. **Run the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   uvicorn app.main:app --reload
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/api/docs

## Project Structure

```
promptvault/
├── frontend/                 # Next.js frontend
│   ├── src/app/             # App Router pages
│   │   ├── (app)/          # Authenticated routes
│   │   ├── (auth)/         # Authentication routes
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   └── package.json
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── core/          # Configuration and dependencies
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routers/       # API routes
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── database.py    # Database setup
│   │   └── main.py        # FastAPI app
│   └── requirements.txt
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Prompts
- `GET /api/prompts` - List all prompts
- `POST /api/prompts` - Create new prompt
- `GET /api/prompts/{id}` - Get prompt by ID
- `PUT /api/prompts/{id}` - Update prompt
- `DELETE /api/prompts/{id}` - Delete prompt

### Health
- `GET /api/health` - Health check endpoint

## Development

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests  
cd backend
pytest
```

### Building for Production

```bash
# Frontend build
cd frontend
npm run build

# Backend (no build needed for Python)
```

### Code Quality

```bash
# Linting
cd frontend
npm run lint

# Type checking
npx tsc --noEmit
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Open an issue on GitHub
- Join our Discord community
- Email: support@promptvault.dev

## Roadmap

- [ ] Prompt diff visualization
- [ ] Prompt performance analytics
- [ ] Team collaboration features
- [ ] Model integration (OpenAI, Anthropic, etc.)
- [ ] Prompt templates and sharing
- [ ] CLI tool for local prompt management