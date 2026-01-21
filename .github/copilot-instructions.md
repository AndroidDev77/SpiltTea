# SpiltTea Repository - Copilot Instructions

## Repository Overview

**SpiltTea** is a production-grade web application for dating vetting and experience sharing. It's a full-stack monorepo with a React frontend and NestJS backend, using PostgreSQL for data persistence and Redis for caching.

## Repository Structure

```
SpiltTea/
├── backend/          # NestJS backend API
│   ├── src/
│   │   ├── auth/     # Authentication & authorization (JWT, email/phone verification)
│   │   ├── users/    # User management and profiles
│   │   ├── posts/    # Posts, experiences, comments, likes
│   │   ├── vetting/  # Vetting requests for people
│   │   ├── storage/  # S3 file storage (presigned URLs)
│   │   ├── search/   # Full-text search (PostgreSQL)
│   │   └── common/   # Shared utilities (Prisma, Redis)
│   ├── prisma/       # Database schema and migrations
│   └── test/         # E2E tests
├── frontend/         # React 19 + TypeScript frontend
│   └── src/
│       ├── api/      # Axios API client with endpoints
│       ├── components/ # Reusable components (Layout, Header, ProtectedRoute)
│       ├── pages/    # Page components (Home, Login, Register, Posts, etc.)
│       ├── hooks/    # Custom React hooks (usePosts, useSearch, etc.)
│       └── context/  # React context (AuthContext)
└── docker-compose.yml # Docker orchestration for all services
```

## Project Information

- **Type**: Full-stack web application (monorepo)
- **Languages**: TypeScript (both frontend and backend)
- **Frontend**: React 19, Vite, Fluent UI v9, React Router v7, React Query
- **Backend**: NestJS, Prisma ORM, PostgreSQL 15, Redis 7
- **Infrastructure**: Docker, AWS S3, Nodemailer, Twilio
- **Node Version**: 18+
- **Package Manager**: npm 9+ with workspaces

## Build and Development Instructions

### Prerequisites

Before starting development:
- **Required**: Node.js 18+, npm 9+, PostgreSQL 14+, Redis 7+
- **Optional**: Docker & Docker Compose (for containerized deployment)
- **For full features**: AWS S3 credentials, SMTP server, Twilio account (phone verification)

### Bootstrap Commands

```bash
# 1. Install all dependencies (uses npm workspaces)
npm install

# 2. Setup backend environment
cd backend
cp .env.example .env
# Edit .env with your configuration (DATABASE_URL, REDIS_URL, JWT_SECRET, AWS credentials, etc.)

# 3. Generate Prisma client and run migrations
npm run prisma:generate
npm run prisma:migrate

# 4. Setup frontend environment
cd ../frontend
cp .env.example .env
# Edit .env with VITE_API_URL (default: http://localhost:3001)

# 5. Return to root
cd ..
```

### Development Commands

**Start development servers (from project root):**
```bash
npm run dev
# Starts both backend (http://localhost:3001) and frontend (http://localhost:3000) concurrently
```

**Or start individually:**
```bash
npm run dev:backend   # Backend only on port 3001
npm run dev:frontend  # Frontend only on port 3000
```

**Backend-specific commands (from backend/ directory):**
```bash
npm run dev             # Start with hot-reload
npm run prisma:studio   # Open Prisma Studio database GUI
npm run prisma:migrate  # Run new migrations
npm run prisma:generate # Regenerate Prisma client after schema changes
```

### Build Commands

**Build everything (from project root):**
```bash
npm run build
# Builds both backend and frontend in sequence
```

**Or build individually:**
```bash
npm run build:backend   # Compiles TypeScript to dist/
npm run build:frontend  # Builds React app to dist/
```

**Production deployment:**
```bash
# Backend
cd backend
npm run start:prod  # Runs compiled code from dist/

# Frontend
cd frontend
npm run build
# Serve dist/ folder with nginx (see frontend/nginx.conf)
```

### Testing

**Run all tests (from project root):**
```bash
npm test  # Runs tests in both workspaces
```

**Backend tests (from backend/ directory):**
```bash
npm run test        # Unit tests with Jest
npm run test:watch  # Watch mode
npm run test:cov    # Coverage report
npm run test:e2e    # E2E tests (requires running database)
```

**Frontend tests (from frontend/ directory):**
```bash
npm test  # Component tests with Vitest
```

**IMPORTANT**: The E2E tests in backend require PostgreSQL and Redis to be running. Use Docker Compose or local instances.

### Linting

**Lint everything (from project root):**
```bash
npm run lint  # Lints both backend and frontend
```

**Backend linting (from backend/ directory):**
```bash
npm run lint    # ESLint with auto-fix
npm run format  # Prettier formatting
```

**Frontend linting (from frontend/ directory):**
```bash
npm run lint  # ESLint
```

### Docker Deployment

```bash
# Start all services (backend, frontend, postgres, redis)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

**Note**: Ensure `.env` file exists in the root with all required variables before running Docker Compose.

## Architecture and Layout

### Backend Architecture

**Framework**: NestJS with modular structure
- **Entry Point**: `backend/src/main.ts` (starts on port 3001)
- **App Module**: `backend/src/app.module.ts` (imports all feature modules)

**Key Modules**:
1. **auth/** - JWT authentication, email verification tokens, phone OTP (Twilio), bcrypt password hashing
2. **users/** - User CRUD, profiles, search, role-based access control
3. **posts/** - Posts (Experience, Vetting Request, Warning types), comments with nested replies, likes, view tracking
4. **vetting/** - Vetting requests for individuals, status workflow (Pending, Approved, Rejected)
5. **storage/** - S3 presigned URLs for upload/download, supports S3-compatible services
6. **search/** - Full-text search using PostgreSQL indexes
7. **common/prisma/** - Prisma client service (shared across modules)
8. **common/redis/** - Redis service for caching and rate limiting

**Database**: 
- ORM: Prisma (`backend/prisma/schema.prisma`)
- Core models: User, Post, VettingRequest, Review, Comment, Like, Tag, Report
- Indexes on: email, username, phoneNumber, post type, full-text search on title/content

**Configuration**: 
- Environment variables via `.env` (see `backend/.env.example`)
- ESLint config: `backend/.eslintrc.js`
- Prettier config: `backend/.prettierrc`
- TypeScript config: `backend/tsconfig.json`

### Frontend Architecture

**Framework**: React 19 with TypeScript, built with Vite
- **Entry Point**: `frontend/src/main.tsx`
- **Main Component**: `frontend/src/App.tsx` (sets up routing and auth context)

**Routing** (React Router v7):
- `/login`, `/register`, `/verify-email` - Authentication pages
- `/` - Home page with trending posts
- `/posts`, `/posts/:id`, `/posts/create` - Posts management
- `/vetting` - Vetting requests dashboard
- `/search` - Search interface
- `/profile/:id` - User profiles

**State Management**:
- **React Query** for server state (caching, refetching)
- **AuthContext** (`frontend/src/context/AuthContext.tsx`) for authentication state
- Local state with React hooks

**API Client**:
- Axios instance in `frontend/src/api/client.ts` with interceptors for JWT tokens
- Endpoint modules: auth, posts, vetting, search, storage, users

**UI Components**: 
- Fluent UI v9 components (Button, Input, Card, etc.)
- Custom components in `frontend/src/components/layout/`

**Configuration**:
- Environment variables via `.env` (see `frontend/.env.example`)
- ESLint config: `frontend/eslint.config.js`
- TypeScript configs: `frontend/tsconfig.json`, `frontend/tsconfig.app.json`
- Vite config: `frontend/vite.config.ts`
- Vitest config: `frontend/vitest.config.ts`

### Key Files and Locations

**Root Level**:
- `package.json` - Root package with workspace configuration and dev scripts
- `docker-compose.yml` - Orchestrates postgres, redis, backend, frontend containers
- `.env.example` - Template for environment variables
- `.gitignore` - Excludes node_modules, dist, .env files
- `.editorconfig` - Editor configuration

**Documentation**:
- `README.md` - Quick start guide and feature overview
- `PROJECT_SUMMARY.md` - Detailed architecture and API documentation
- `IMPLEMENTATION_COMPLETE.md` - Implementation details and deployment guide
- `SECURITY_UPDATE.md` - Security patches and vulnerability fixes
- `frontend/README.md` - Frontend-specific documentation
- `frontend/QUICKSTART.md` - Frontend quick start guide

## Development Guidelines

### Making Changes

1. **Backend changes**:
   - Always run `npm run prisma:generate` after modifying `prisma/schema.prisma`
   - Run migrations with `npm run prisma:migrate` before pushing schema changes
   - Follow NestJS conventions: controllers for routes, services for business logic
   - Add DTOs with class-validator decorators for request validation
   - Write unit tests for services, E2E tests for critical flows

2. **Frontend changes**:
   - Use Fluent UI components for consistency
   - Create custom hooks for data fetching (follow patterns in `frontend/src/hooks/`)
   - Use React Query for server state management
   - Add TypeScript types in `frontend/src/types/index.ts`
   - Test components with Vitest

3. **Database changes**:
   - Always create Prisma migrations (don't edit the database directly)
   - Add indexes for frequently queried fields
   - Consider cascading deletes for referential integrity

4. **Environment variables**:
   - Never commit `.env` files
   - Update `.env.example` when adding new variables
   - Document required vs. optional variables

### Common Issues and Workarounds

1. **Prisma client out of sync**: Run `npm run prisma:generate` in backend/
2. **Port conflicts**: Backend uses 3001, frontend uses 3000, PostgreSQL 5432, Redis 6379
3. **CORS issues**: Backend CORS is configured in `backend/src/main.ts`
4. **JWT authentication**: Token stored in localStorage, sent via Authorization header
5. **File uploads**: Use presigned URLs from `/api/storage/upload-url` endpoint
6. **Rate limiting**: Throttled to 10 requests/minute per IP (configurable in backend)

### Git Workflow

- Main branch: `main`
- Feature branches: `feature/feature-name` or `copilot/feature-name`
- Conventional commits recommended
- Pull requests required for merging

## Validation Steps

Before committing changes:

1. **Lint your code**: `npm run lint` (from root)
2. **Run tests**: `npm test` (from root)
3. **Build successfully**: `npm run build` (from root)
4. **Test locally**: `npm run dev` and verify functionality
5. **Check for security issues**: Review dependencies, avoid committing secrets
6. **Update documentation**: If adding features or changing APIs

## Important Notes

- This is a **production-ready application** with comprehensive features
- **Always run database migrations** after pulling schema changes
- **PostgreSQL and Redis** are required dependencies (use Docker Compose for easy setup)
- **Environment variables** must be configured before running (see .env.example files)
- **S3 credentials** are required for file uploads (supports S3-compatible services like MinIO)
- **Email verification** is required for new users (configure SMTP settings)
- **Phone verification** is optional (requires Twilio credentials)
- **Rate limiting** is enabled by default (10 req/min per IP)
- The application uses **npm workspaces** for monorepo management
- When in doubt, check `PROJECT_SUMMARY.md` for detailed technical documentation
