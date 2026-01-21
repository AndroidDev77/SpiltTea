# Quick Start Guide

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Available Pages

- `/login` - Login page
- `/register` - Registration page
- `/verify-email` - Email verification page
- `/` - Home page (protected)
- `/posts` - Posts list (protected)
- `/posts/:id` - Post detail (protected)
- `/posts/create` - Create new post (protected)
- `/vetting` - Vetting requests (protected)
- `/search` - Search page (protected)
- `/profile/:id` - User profile (protected)

## Project Structure

- **API Layer** (`src/api/`): Axios client and API endpoints
- **Components** (`src/components/`): Reusable UI components
- **Context** (`src/context/`): React Context for auth state
- **Hooks** (`src/hooks/`): Custom React hooks for data fetching
- **Pages** (`src/pages/`): Page components for routing
- **Types** (`src/types/`): TypeScript type definitions

## Key Features

✅ JWT Authentication with auto-refresh
✅ Protected routes with auth guard
✅ React Query for efficient data fetching
✅ Fluent UI v9 components
✅ TypeScript for type safety
✅ Responsive design
✅ Optimistic updates
✅ Error handling

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```
