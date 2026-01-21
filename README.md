# SpiltTea 🫖

A production-grade, inclusive web application for dating vetting and experience sharing.

## 🚀 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Fluent UI v9** - Microsoft's modern design system
- **React Router v7** - Client-side routing
- **React Query (TanStack)** - Data fetching and state management
- **Vite** - Fast build tooling

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **Prisma ORM** - Type-safe database client
- **Redis** - Caching and rate limiting
- **JWT** - Authentication

### Infrastructure
- **AWS S3** - Object storage (S3-compatible)
- **Nodemailer** - Email verification
- **Twilio** - SMS/Phone verification (optional)

## 📁 Project Structure

```
SpiltTea/
├── backend/          # NestJS backend API
│   ├── src/
│   │   ├── auth/     # Authentication & authorization
│   │   ├── users/    # User management
│   │   ├── posts/    # Posts & experiences
│   │   ├── vetting/  # Vetting requests
│   │   ├── storage/  # S3 file storage
│   │   ├── search/   # Full-text search
│   │   └── common/   # Shared utilities
│   └── prisma/       # Database schema
├── frontend/         # React frontend
│   └── src/
│       ├── api/      # API client
│       ├── components/ # Reusable components
│       ├── pages/    # Page components
│       ├── hooks/    # Custom React hooks
│       └── context/  # React context
└── docker-compose.yml # Docker orchestration
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Redis 7+
- AWS S3 or S3-compatible storage

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/AndroidDev77/SpiltTea.git
   cd SpiltTea
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   
   # Run Prisma migrations
   npm run prisma:migrate
   
   # Generate Prisma client
   npm run prisma:generate
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with backend API URL
   ```

5. **Run Development Servers**
   ```bash
   # From project root
   npm run dev
   ```
   
   This will start:
   - Backend API: http://localhost:3001
   - Frontend App: http://localhost:3000

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

This will start:
- Backend API
- Frontend App
- PostgreSQL Database
- Redis Cache

## 📖 Features

### Authentication
- ✅ Email/password authentication
- ✅ Email verification with tokens
- ✅ Optional phone verification (Twilio)
- ✅ JWT-based sessions
- ✅ Secure password hashing (bcrypt)

### Posts & Experiences
- ✅ Create, read, update, delete posts
- ✅ Anonymous posting option
- ✅ Evidence/image uploads (S3)
- ✅ Comments and replies
- ✅ Like/unlike functionality
- ✅ View tracking

### Vetting System
- ✅ Request vetting for people
- ✅ Search existing vettings
- ✅ Status management (pending, approved, rejected)
- ✅ Link vettings to posts

### Search
- ✅ Full-text search across posts
- ✅ User search
- ✅ PostgreSQL-optimized queries
- ✅ Filter by type, date, location

### Storage
- ✅ Presigned URL uploads
- ✅ Presigned URL downloads
- ✅ S3-compatible storage
- ✅ Secure file access control

### Security
- ✅ Rate limiting (Redis)
- ✅ Input validation
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ CORS configuration

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📝 API Documentation

Once the backend is running, API documentation is available at:
- Swagger UI: http://localhost:3001/api-docs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- AndroidDev77

## 🙏 Acknowledgments

- Fluent UI team for the amazing component library
- NestJS community
- Prisma team for the excellent ORM
