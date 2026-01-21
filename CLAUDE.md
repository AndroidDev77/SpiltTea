# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

**From project root:**
```bash
npm install              # Install all dependencies (uses npm workspaces)
npm run dev              # Start both backend (port 3001) and frontend (port 3000)
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only
npm run build            # Build both workspaces
npm run lint             # Lint both workspaces
npm test                 # Run tests in both workspaces
```

**Backend (from backend/):**
```bash
npm run dev              # Start with hot-reload
npm run test             # Unit tests with Jest
npm run test:watch       # Watch mode
npm run test:e2e         # E2E tests (requires PostgreSQL and Redis running)
npm run prisma:generate  # Regenerate Prisma client after schema changes
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run lint             # ESLint with auto-fix
npm run format           # Prettier formatting
```

**Frontend (from frontend/):**
```bash
npm run dev              # Vite dev server
npm run build            # TypeScript compile + Vite build
npm run lint             # ESLint
```

**Docker:**
```bash
docker-compose up -d             # Start all services
docker-compose up -d --build     # Rebuild after code changes
```

## Architecture Overview

This is a full-stack TypeScript monorepo using npm workspaces with a NestJS backend and React frontend.

### Backend (NestJS)

Entry point: `backend/src/main.ts` → `backend/src/app.module.ts`

**Module structure:**
- `auth/` - JWT authentication, email verification tokens, phone OTP via Twilio, bcrypt password hashing
- `users/` - User CRUD, profiles, role-based access (USER, MODERATOR, ADMIN)
- `posts/` - Posts with types (EXPERIENCE, VETTING_REQUEST, WARNING), comments with nested replies, likes, view tracking
- `vetting/` - Vetting requests with status workflow (PENDING, APPROVED, REJECTED)
- `storage/` - S3 presigned URLs for file upload/download
- `search/` - Full-text search using PostgreSQL
- `common/prisma/` - Shared Prisma client service
- `common/redis/` - Redis service for caching and rate limiting

**Database:** PostgreSQL with Prisma ORM. Schema at `backend/prisma/schema.prisma`.

**Key models:** User, Post, VettingRequest, Review, Comment, Like, Tag, Report

### Frontend (React 19)

Entry point: `frontend/src/main.tsx` → `frontend/src/App.tsx`

**Key patterns:**
- React Query for server state management
- AuthContext (`frontend/src/context/AuthContext.tsx`) for auth state
- Axios client with JWT interceptors (`frontend/src/api/client.ts`)
- Fluent UI v9 components
- React Router v7 for routing

**Routes:** `/login`, `/register`, `/verify-email`, `/`, `/posts`, `/posts/:id`, `/posts/create`, `/vetting`, `/search`, `/profile/:id`

## Important Patterns

- Always run `npm run prisma:generate` after modifying `backend/prisma/schema.prisma`
- Always run `npm run prisma:migrate` before pushing schema changes
- Backend follows NestJS conventions: controllers for routes, services for business logic
- Use class-validator decorators for request validation DTOs
- JWT token stored in localStorage, sent via Authorization header
- Rate limiting enabled: 10 requests/minute per IP

## Port Assignments

- Frontend: 3000
- Backend: 3001
- PostgreSQL: 5432
- Redis: 6379

## Environment Setup

Backend requires: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, AWS S3 credentials, SMTP settings
Frontend requires: `VITE_API_URL` (default: http://localhost:3001)

See `.env.example` files in root, backend/, and frontend/ directories.
