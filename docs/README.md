# Documentation Index

This directory contains comprehensive documentation for the Spilt Tea platform.

## Available Documentation

### [CONTRIB.md](./CONTRIB.md)
**Developer contribution guide** covering:
- Development workflow
- Environment setup (Node.js, PostgreSQL, Redis, Docker)
- Available npm scripts (root, backend, frontend)
- Testing procedures (unit, integration, E2E)
- Code quality standards
- Git workflow and commit conventions
- Common development issues

**Use this when:** Setting up local development, learning the codebase, or contributing code.

### [RUNBOOK.md](./RUNBOOK.md)
**Operations runbook** covering:
- Deployment procedures (Docker, migrations, zero-downtime)
- Monitoring and health checks
- Common production issues and fixes
- Rollback procedures (application and database)
- Database operations (backups, maintenance)
- Security incident response
- Emergency contacts

**Use this when:** Deploying to production, troubleshooting issues, responding to incidents, or performing maintenance.

## Quick Links

### Development
- **Start development**: `npm run dev` (runs both backend and frontend)
- **Run tests**: `npm run test`
- **Database migrations**: `cd backend && npm run prisma:migrate`
- **Code review**: Use `/code-review` in Claude Code CLI

### Deployment
- **Build Docker**: `docker-compose up -d --build`
- **View logs**: `docker-compose logs -f`
- **Database backup**: `docker exec spilttea-postgres pg_dump -U spilttea spilttea > backup.sql`
- **Health check**: `curl http://localhost:3001/health`

### Common Commands

```bash
# Start all services
docker-compose up -d

# Rebuild after code changes
docker-compose up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Database operations
cd backend
npm run prisma:studio         # Open GUI
npm run prisma:migrate        # Run migrations
npm run prisma:generate       # Regenerate client

# Testing
npm run test                  # All workspaces
npm run test --workspace=backend
npm run test:watch --workspace=backend
npm run test:e2e --workspace=backend
```

## Project Overview

**Spilt Tea** is a dating vetting and experience sharing platform built with:
- **Backend**: NestJS, PostgreSQL, Prisma, Redis
- **Frontend**: React 19, Vite, Fluent UI v9, React Query
- **Infrastructure**: Docker Compose, AWS S3, Twilio (optional), SMTP (optional)

### Key Features
- User authentication with JWT (email/phone verification)
- Post types: Experience, Vetting Request, Warning
- Comments with nested replies
- Likes/votes (upvote/downvote)
- Trending algorithm (recency + engagement)
- Full-text search
- Vetting request workflow
- S3 file uploads with presigned URLs
- Rate limiting
- Role-based access control (USER, MODERATOR, ADMIN)

## Architecture

```
SpiltTea/
├── backend/              # NestJS API (port 3001)
│   ├── src/
│   │   ├── auth/         # JWT, email/phone verification
│   │   ├── users/        # User management, profiles
│   │   ├── posts/        # Posts, comments, likes, votes
│   │   ├── vetting/      # Vetting requests workflow
│   │   ├── storage/      # S3 presigned URLs
│   │   ├── search/       # Full-text search, trending
│   │   └── common/       # Prisma, Redis shared modules
│   └── prisma/           # Database schema, migrations
├── frontend/             # React 19 + Vite (port 3000)
│   └── src/
│       ├── api/          # Axios client with JWT interceptors
│       ├── components/   # Reusable UI components
│       ├── context/      # Auth context
│       ├── pages/        # Route components
│       └── types/        # TypeScript types
└── docs/                 # This documentation
```

## Environment Configuration

### Required Services
- **Node.js**: 22 LTS (18+ supported)
- **PostgreSQL**: 15+ (port 5432)
- **Redis**: 7+ (port 6379)
- **Docker**: For containerized deployment

### Environment Variables

**Root** (`.env`):
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `JWT_SECRET`
- AWS S3: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`
- Optional: Twilio, SMTP

**Backend** (`backend/.env`):
- `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`
- `PORT=3001`, `NODE_ENV=development`, `FRONTEND_URL`
- AWS S3 credentials
- Optional: SMTP, Twilio

**Frontend** (`frontend/.env`):
- `VITE_API_URL=http://localhost:3001`

## Testing

### Coverage Requirements
- **Minimum**: 80% code coverage
- **Test types**: Unit, Integration, E2E

### Test Commands
```bash
# Backend unit tests
cd backend
npm run test

# Watch mode (TDD)
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests (requires PostgreSQL + Redis)
npm run test:e2e
```

### Test-Driven Development (TDD)
1. Write test first (RED)
2. Implement minimal code (GREEN)
3. Refactor (IMPROVE)
4. Use `/tdd` skill in Claude Code CLI

## Code Quality

### Linting
```bash
npm run lint                    # All workspaces
npm run lint --workspace=backend
npm run lint --workspace=frontend
```

### Formatting (Backend)
```bash
cd backend
npm run format                  # Prettier
```

### Pre-commit Hooks
Configured in `~/.claude/settings.json`:
- TypeScript check after editing .ts/.tsx
- Prettier auto-format
- console.log warnings
- Git push review

### Code Review
```bash
# In Claude Code CLI
/code-review
```

### Security Review
```bash
# In Claude Code CLI
/security-review
```

## Troubleshooting

### Backend won't start
1. Check PostgreSQL: `docker-compose ps postgres`
2. Check environment variables: `docker-compose config`
3. Regenerate Prisma: `docker exec spilttea-backend npm run prisma:generate`

### Frontend can't connect to backend
1. Verify backend health: `curl http://localhost:3001/health`
2. Check `VITE_API_URL` in `frontend/.env`
3. Check CORS: `FRONTEND_URL` in `backend/.env`

### Database migration issues
1. Check status: `npx prisma migrate status`
2. Backup first: `docker exec spilttea-postgres pg_dump -U spilttea spilttea > backup.sql`
3. Run migration: `npm run prisma:migrate`

### Test failures
1. Use `/tdd` or `/build-fix` in Claude Code CLI
2. Check test isolation
3. Verify mocks are correct

## Additional Resources

- **Main README**: `/README.md` - Project overview
- **CLAUDE.md**: `/CLAUDE.md` - Claude Code configuration and guidelines
- **Custom Agents**: `/.claude/agents/` - Specialized agents for code review, security, TDD, etc.
- **Rules**: `/.claude/rules/` - Coding standards, security, testing, performance
- **Skills**: `/.claude/skills/` - Reusable patterns and guidelines

## Getting Help

- **GitHub Issues**: Report bugs and feature requests
- **Claude Code CLI**: Use specialized agents
  - `/code-review` - Code quality review
  - `/security-review` - Security analysis
  - `/tdd` - Test-driven development
  - `/build-fix` - Fix build errors
  - `/plan` - Plan complex features

## Maintenance

### Regular Tasks
- **Daily**: Monitor logs, check error rates
- **Weekly**: Review security alerts, update dependencies
- **Monthly**: Database maintenance (VACUUM, ANALYZE), review backups

### Backup Schedule
- **Automated**: Daily at 2 AM (configure cron)
- **Manual**: Before deployments and migrations
- **Retention**: 7 days minimum

---

**Last Updated**: 2026-01-22
**Maintained By**: Development Team
