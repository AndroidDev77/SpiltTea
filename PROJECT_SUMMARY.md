# Spilt Tea - Project Summary

## Overview
Spilt Tea is a production-grade web application for dating vetting and experience sharing. The platform allows users to share their dating experiences, request vetting of potential dates, and search through a community-driven database of dating experiences.

## Architecture

### Technology Stack

#### Frontend
- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe development
- **Fluent UI v9** - Microsoft's enterprise-grade component library
- **React Router v7** - Client-side routing with data loading
- **React Query v5** - Powerful data synchronization
- **Vite** - Lightning-fast build tool
- **Axios** - HTTP client with interceptors

#### Backend
- **NestJS** - Enterprise-grade Node.js framework
- **TypeScript** - End-to-end type safety
- **Prisma ORM** - Type-safe database client
- **PostgreSQL 15** - Robust relational database
- **Redis 7** - In-memory caching and rate limiting
- **JWT** - Stateless authentication
- **Passport.js** - Authentication middleware

#### Infrastructure
- **Docker** - Containerization for consistent deployments
- **Docker Compose** - Multi-container orchestration
- **AWS S3** - Scalable object storage (S3-compatible)
- **Nodemailer** - Email delivery
- **Twilio** - SMS/Phone verification

## Features

### 1. Authentication & Authorization
- ✅ Email/password registration
- ✅ Email verification with secure tokens
- ✅ Optional phone verification via Twilio OTP
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcrypt, 10 rounds)
- ✅ Rate limiting on auth endpoints
- ✅ Protected routes and API guards

### 2. User Management
- ✅ User profiles with customizable information
- ✅ Profile images via S3 storage
- ✅ User search functionality
- ✅ Account status management (active, banned)
- ✅ Role-based access control (User, Moderator, Admin)

### 3. Posts & Experiences
- ✅ Create, read, update, delete posts
- ✅ Three post types: Experience, Vetting Request, Warning
- ✅ Anonymous posting option
- ✅ Rich text content with metadata
- ✅ Evidence/image attachments (S3 presigned URLs)
- ✅ Comments with nested replies
- ✅ Like/unlike functionality
- ✅ View count tracking
- ✅ Tagging system

### 4. Vetting System
- ✅ Request vetting for individuals
- ✅ Link vettings to existing posts
- ✅ Status workflow (Pending, Approved, Rejected)
- ✅ Search vettings by name, location, demographics
- ✅ Community-driven verification

### 5. Search & Discovery
- ✅ Full-text search across posts (PostgreSQL)
- ✅ User search (username, name)
- ✅ Filter by post type, date, author
- ✅ Optimized database indexes
- ✅ Pagination support

### 6. File Storage
- ✅ Presigned URL uploads (secure, direct to S3)
- ✅ Presigned URL downloads (time-limited access)
- ✅ Support for S3-compatible services (MinIO, DigitalOcean Spaces)
- ✅ Automatic file key generation
- ✅ Public URL generation

### 7. Security & Performance
- ✅ Rate limiting (10 requests/minute per IP)
- ✅ Input validation (class-validator)
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React escaping)
- ✅ CORS configuration
- ✅ Redis caching for hot data
- ✅ Database query optimization
- ✅ Environment-based configuration

## Database Schema

### Core Models
1. **User** - User accounts with authentication
2. **Post** - User-generated content (experiences, vetting requests, warnings)
3. **VettingRequest** - Vetting requests for individuals
4. **Review** - Reviews on posts (1-5 star rating)
5. **Comment** - Comments with nested replies
6. **Like** - Post likes
7. **Tag** - Content categorization
8. **PostTag** - Many-to-many relationship
9. **Report** - Content moderation

### Key Relationships
- Users → Posts (one-to-many)
- Users → VettingRequests (one-to-many, both author and target)
- Posts → Comments (one-to-many)
- Posts → Reviews (one-to-many)
- Posts → Likes (one-to-many)
- Posts → Tags (many-to-many via PostTag)

### Indexes
- User: email, username, phoneNumber
- Post: authorId, type, createdAt, full-text (title, content)
- VettingRequest: authorId, targetUserId, status
- Review: postId, rating
- Comment: postId, authorId

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login and get JWT token
- `GET /verify-email?token=...` - Verify email address
- `POST /request-phone-otp` - Request phone verification OTP
- `POST /verify-phone` - Verify phone with OTP

### Users (`/api/users`)
- `GET /profile` - Get current user profile
- `PATCH /profile` - Update user profile
- `GET /:username` - Get public user profile

### Posts (`/api/posts`)
- `GET /` - List posts (with pagination, filters)
- `POST /` - Create new post
- `GET /:id` - Get single post
- `PATCH /:id` - Update post (owner only)
- `DELETE /:id` - Delete post (owner only)
- `POST /:id/like` - Like/unlike post

### Vetting (`/api/vetting`)
- `GET /` - List vetting requests (with filters)
- `POST /` - Create vetting request
- `GET /search?name=...` - Search by target name
- `GET /:id` - Get single vetting request
- `PATCH /:id/status` - Update vetting status

### Storage (`/api/storage`)
- `POST /upload-url` - Get presigned upload URL
- `GET /download-url?key=...` - Get presigned download URL

### Search (`/api/search`)
- `GET /` - Search all (posts + users)
- `GET /posts?q=...` - Search posts
- `GET /users?q=...` - Search users

## Frontend Structure

### Pages
- `/login` - Login page
- `/register` - Registration page
- `/verify-email` - Email verification
- `/` - Home page with trending posts
- `/posts` - Posts list
- `/posts/:id` - Post detail with comments
- `/posts/create` - Create new post
- `/vetting` - Vetting requests dashboard
- `/search` - Search interface
- `/profile/:id` - User profile

### Key Components
- **Layout** - Header, navigation, footer wrapper
- **ProtectedRoute** - Auth guard for protected pages
- **AuthContext** - Global authentication state
- **API Client** - Centralized Axios instance with interceptors

### Custom Hooks
- `usePosts` - Fetch posts list
- `usePost` - Fetch single post
- `useCreatePost` - Create post mutation
- `useVettingRequests` - Fetch vetting requests
- `useSearch` - Search functionality
- `useUser` - Fetch user profile

## Deployment

### Docker Deployment
```bash
# Copy environment file
cp .env.example .env
# Edit .env with your values

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Manual Deployment

#### Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run build
npm run start:prod
```

#### Frontend
```bash
cd frontend
npm install
npm run build
# Serve dist/ folder with nginx or similar
```

### Environment Variables

#### Required
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT signing
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `S3_BUCKET_NAME` - S3 bucket name

#### Optional
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` - Phone verification
- `SMTP_*` - Email configuration

## Performance Considerations

### Backend
- Redis caching for frequently accessed data
- Database indexes on commonly queried fields
- Pagination on all list endpoints
- Connection pooling (Prisma default)
- Rate limiting to prevent abuse

### Frontend
- React Query caching with smart invalidation
- Code splitting with React.lazy
- Optimized bundle size with Vite
- CDN delivery for static assets
- Image optimization for uploads

### Database
- Full-text search indexes on Post(title, content)
- Composite indexes for common query patterns
- Cascading deletes for referential integrity
- EXPLAIN ANALYZE for query optimization

## Security Measures

### Authentication
- Bcrypt password hashing (10 rounds)
- JWT tokens with expiration (7 days)
- Email verification required before login
- Optional phone verification for additional security

### API Security
- Rate limiting (10 req/min via Redis)
- Input validation on all endpoints
- SQL injection protection via Prisma
- XSS protection via React
- CORS whitelist configuration

### File Storage
- Presigned URLs with expiration (15 minutes upload, 1 hour download)
- File size limits
- Content-type validation
- Unique file keys to prevent collisions

### Data Protection
- Sensitive data encrypted at rest
- HTTPS enforced in production
- Environment variables for secrets
- No secrets in source code

## Testing Strategy

### Backend Tests
- Unit tests for services
- Integration tests for controllers
- E2E tests for critical flows
- Database seeding for tests

### Frontend Tests
- Component tests with React Testing Library
- Hook tests with @testing-library/react-hooks
- Integration tests for pages
- E2E tests with Playwright (future)

## Monitoring & Logging

### Application Logs
- Structured logging with Winston (future)
- Log levels: error, warn, info, debug
- Request/response logging

### Health Checks
- Database connection health
- Redis connection health
- API endpoint health checks

### Metrics (Future)
- Request rate and latency
- Error rates
- Cache hit rates
- Database query performance

## Future Enhancements

### Features
- [ ] Direct messaging between users
- [ ] Push notifications
- [ ] Advanced moderation tools
- [ ] User reputation system
- [ ] Verified user badges
- [ ] Mobile apps (React Native)

### Technical
- [ ] GraphQL API (alongside REST)
- [ ] WebSocket for real-time updates
- [ ] Elasticsearch for advanced search
- [ ] CDN integration for static assets
- [ ] Automated testing (CI/CD)
- [ ] Performance monitoring (Datadog, New Relic)

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for consistency
- Functional components with hooks
- Async/await over promises
- Descriptive variable names

### Git Workflow
- Feature branches from main
- Pull requests with code review
- Conventional commits
- Semantic versioning

### Testing
- Write tests for new features
- Maintain >80% code coverage
- Test edge cases and error paths
- E2E tests for critical flows

## License
MIT

## Support
For issues and questions, please open a GitHub issue.
