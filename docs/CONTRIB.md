# Contributing to Spilt Tea

This guide covers development workflow, available scripts, environment setup, and testing procedures for the Spilt Tea dating vetting platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Testing Procedures](#testing-procedures)
- [Code Quality](#code-quality)

## Prerequisites

- **Node.js**: >= 18.0.0 (Node 22 LTS recommended)
- **npm**: >= 9.0.0
- **Docker** and **Docker Compose**: For running PostgreSQL and Redis
- **Git**: Version control

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SpiltTea
```

### 2. Install Dependencies

The project uses npm workspaces for monorepo management:

```bash
npm install
```

This installs dependencies for both backend and frontend workspaces.

### 3. Configure Environment Variables

#### Root Environment (Docker)

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Variables:**

| Variable | Purpose | Example |
|----------|---------|---------|
| `POSTGRES_USER` | PostgreSQL username | `spilttea` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `12345678` |
| `POSTGRES_DB` | Database name | `spilttea` |
| `JWT_SECRET` | JWT signing key | `your-super-secret-jwt-key-change-in-production` |
| `AWS_REGION` | AWS region for S3 | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `your-access-key` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `your-secret-key` |
| `S3_BUCKET_NAME` | S3 bucket for uploads | `spilttea-uploads` |

**Optional Variables:**

| Variable | Purpose | Example |
|----------|---------|---------|
| `TWILIO_ACCOUNT_SID` | Twilio phone verification | `your-account-sid` |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | `your-auth-token` |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | `+1234567890` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | `your-email@gmail.com` |
| `SMTP_PASSWORD` | Email app password | `your-app-password` |
| `EMAIL_FROM` | From email address | `noreply@spilttea.com` |

#### Backend Environment

Copy `backend/.env.example` to `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

**Required Variables:**

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/spilttea?schema=public` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing key (must match root) | `your-super-secret-jwt-key-change-in-production` |
| `PORT` | Backend server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

**AWS S3 Variables:**

| Variable | Purpose | Example |
|----------|---------|---------|
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `your-access-key` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `your-secret-key` |
| `S3_BUCKET_NAME` | S3 bucket name | `spilttea-uploads` |
| `S3_ENDPOINT` | Optional: S3-compatible endpoint | `http://localhost:9000` (for MinIO) |

#### Frontend Environment

Copy `frontend/.env.example` to `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

**Required Variables:**

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` |

### 4. Start Infrastructure Services

Start PostgreSQL and Redis using Docker Compose:

```bash
docker-compose up -d postgres redis
```

### 5. Run Database Migrations

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
cd ..
```

## Development Workflow

### Local Development (Recommended)

Start both backend and frontend in development mode with hot-reload:

```bash
npm run dev
```

This runs:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:3000`

### Separate Workspaces

Start backend only:

```bash
npm run dev:backend
```

Start frontend only:

```bash
npm run dev:frontend
```

### Docker Development

Build and run all services in Docker:

```bash
docker-compose up -d --build
```

View logs:

```bash
docker-compose logs -f
```

Stop services:

```bash
docker-compose down
```

## Available Scripts

### Root Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start both backend and frontend with hot-reload |
| `dev:backend` | `npm run dev:backend` | Start backend only |
| `dev:frontend` | `npm run dev:frontend` | Start frontend only |
| `build` | `npm run build` | Build both workspaces for production |
| `build:backend` | `npm run build:backend` | Build backend only |
| `build:frontend` | `npm run build:frontend` | Build frontend only |
| `test` | `npm run test` | Run tests in all workspaces |
| `lint` | `npm run lint` | Lint all workspaces |

### Backend Scripts

Run from `backend/` directory or use `npm run <script> --workspace=backend`:

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start with hot-reload (NestJS watch mode) |
| `build` | `npm run build` | Build for production |
| `start` | `npm run start` | Start production server |
| `start:prod` | `npm run start:prod` | Start production server (node dist/main) |
| `start:debug` | `npm run start:debug` | Start with debugger attached |
| `test` | `npm run test` | Run unit tests with Jest |
| `test:watch` | `npm run test:watch` | Run tests in watch mode |
| `test:cov` | `npm run test:cov` | Run tests with coverage report |
| `test:debug` | `npm run test:debug` | Debug tests |
| `test:e2e` | `npm run test:e2e` | Run E2E tests (requires PostgreSQL and Redis) |
| `lint` | `npm run lint` | ESLint with auto-fix |
| `format` | `npm run format` | Format code with Prettier |
| `prisma:generate` | `npm run prisma:generate` | Regenerate Prisma client after schema changes |
| `prisma:migrate` | `npm run prisma:migrate` | Run database migrations |
| `prisma:studio` | `npm run prisma:studio` | Open Prisma Studio GUI |

### Frontend Scripts

Run from `frontend/` directory or use `npm run <script> --workspace=frontend`:

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Vite dev server with HMR |
| `build` | `npm run build` | TypeScript compile + Vite production build |
| `lint` | `npm run lint` | ESLint check |
| `preview` | `npm run preview` | Preview production build locally |

## Testing Procedures

### Backend Testing

#### Unit Tests

Run all unit tests:

```bash
cd backend
npm run test
```

Watch mode for TDD:

```bash
npm run test:watch
```

Coverage report:

```bash
npm run test:cov
```

Coverage threshold: **80%** minimum required.

#### E2E Tests

**Prerequisites:**
- PostgreSQL running on port 5432
- Redis running on port 6379

```bash
npm run test:e2e
```

#### Test Structure

- **Unit tests**: `*.spec.ts` files alongside source
- **E2E tests**: `test/*.e2e-spec.ts`
- **Mock data**: Use Jest mocks for PrismaService, RedisService, etc.

### Frontend Testing

The frontend uses Vitest (configuration in progress).

### Testing Best Practices

1. **Test-Driven Development (TDD)**
   - Write tests first (RED)
   - Implement minimum code to pass (GREEN)
   - Refactor (IMPROVE)

2. **Test Types Required**
   - Unit tests for services, utilities, components
   - Integration tests for API endpoints
   - E2E tests for critical user flows

3. **Coverage Requirements**
   - Minimum 80% code coverage
   - All services must have comprehensive tests
   - Edge cases and error handling tested

## Code Quality

### Linting

Run linters:

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
cd backend && npm run lint
cd frontend && npm run lint
```

### Formatting

Backend uses Prettier:

```bash
cd backend
npm run format
```

### Pre-commit Hooks

Hooks are configured in `~/.claude/settings.json`:

- **TypeScript check**: Runs `tsc` after editing .ts/.tsx files
- **Prettier**: Auto-formats JS/TS files after edit
- **console.log warning**: Warns about console.log in edited files
- **Git push review**: Opens editor for review before push

### Code Review

Before committing, use the code-reviewer agent:

```bash
# In Claude Code CLI
/code-review
```

This checks for:
- Security vulnerabilities
- Performance issues
- Code quality problems
- Best practice violations

### Database Schema Changes

**Always follow this workflow:**

1. Modify `backend/prisma/schema.prisma`
2. Generate Prisma client: `npm run prisma:generate`
3. Create migration: `npm run prisma:migrate`
4. Commit both schema and migration files

### Git Workflow

**Commit Message Format:**

```
<type>: <description>

<optional body>
```

**Types:** feat, fix, refactor, docs, test, chore, perf, ci

**Example:**

```bash
git commit -m "feat: Add phone number masking for privacy"
```

### Pull Requests

When creating PRs:

1. Analyze full commit history (not just latest commit)
2. Draft comprehensive PR summary with test plan
3. Include TODOs for testing
4. Push with `-u` flag if new branch

**Example:**

```bash
git checkout -b feature/user-blocking
# ... make changes ...
git add .
git commit -m "feat: Add user blocking functionality"
git push -u origin feature/user-blocking
gh pr create --title "Add user blocking" --body "## Summary
- Implement block/unblock endpoints
- Add blocked_users table
- Update permissions logic

## Test plan
- [ ] Test blocking user
- [ ] Test unblocking user
- [ ] Verify blocked user cannot interact"
```

## Project Structure

```
SpiltTea/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/         # JWT authentication, email/phone verification
│   │   ├── users/        # User CRUD, profiles
│   │   ├── posts/        # Posts, comments, likes
│   │   ├── vetting/      # Vetting requests
│   │   ├── storage/      # S3 file uploads
│   │   ├── search/       # Full-text search
│   │   └── common/       # Shared modules (Prisma, Redis)
│   ├── prisma/           # Database schema and migrations
│   └── test/             # E2E tests
├── frontend/             # React 19 + Vite
│   ├── src/
│   │   ├── api/          # Axios client
│   │   ├── components/   # React components
│   │   ├── context/      # React contexts (Auth)
│   │   ├── pages/        # Route pages
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
└── docs/                 # Documentation
```

## Architecture Overview

### Backend (NestJS)

- **Entry point**: `backend/src/main.ts` → `backend/src/app.module.ts`
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for rate limiting and caching
- **Auth**: JWT with bcrypt password hashing
- **Storage**: AWS S3 with presigned URLs
- **Validation**: class-validator decorators

**Key modules:**
- `auth/` - Authentication and verification
- `users/` - User management with roles (USER, MODERATOR, ADMIN)
- `posts/` - Posts (EXPERIENCE, VETTING_REQUEST, WARNING) with comments and likes
- `vetting/` - Vetting workflow (PENDING, APPROVED, REJECTED)
- `search/` - PostgreSQL full-text search with trending algorithm

### Frontend (React)

- **Entry point**: `frontend/src/main.tsx` → `frontend/src/App.tsx`
- **State management**: React Query for server state, Context for auth
- **UI library**: Fluent UI v9 components
- **Routing**: React Router v7
- **HTTP client**: Axios with JWT interceptors

## Port Assignments

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | postgresql://localhost:5432 |
| Redis | 6379 | redis://localhost:6379 |

## Getting Help

- **Issues**: Report bugs and request features via GitHub Issues
- **Documentation**: Check `/docs` directory and `CLAUDE.md`
- **Code Review**: Use `/code-review` in Claude Code CLI
- **Security**: Use `/security-review` for security analysis

## Common Issues

### Database Connection Errors

Ensure PostgreSQL is running:

```bash
docker-compose up -d postgres
```

Check connection string in `backend/.env`:

```
DATABASE_URL="postgresql://spilttea:12345678@localhost:5432/spilttea?schema=public"
```

### Redis Connection Errors

Ensure Redis is running:

```bash
docker-compose up -d redis
```

### Port Conflicts

If ports are already in use, update:
- Backend: `PORT` in `backend/.env`
- Frontend: Vite config or use different port with `npm run dev -- --port 3001`

### Build Errors

1. Clean and reinstall:
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
```

2. Regenerate Prisma client:
```bash
cd backend
npm run prisma:generate
```

3. Use build-error-resolver agent:
```bash
# In Claude Code CLI
/build-fix
```
