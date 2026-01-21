# Spilt Tea Frontend

A React-based frontend for the Spilt Tea application - a community-driven platform for sharing and vetting information.

## Features

- **Authentication**: Login, Registration, and Email Verification
- **Posts Management**: Create, view, and interact with posts
- **Vetting System**: Request and complete vetting tasks
- **Search**: Advanced search with filters
- **User Profiles**: View user information and activity
- **Real-time Updates**: Using React Query for efficient data fetching

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Fast build tool and dev server
- **Fluent UI v9** - Microsoft's modern UI component library
- **React Router v7** - Client-side routing
- **TanStack Query (React Query)** - Data fetching and caching
- **Axios** - HTTP client with interceptors

## Project Structure

```
/frontend
├── src/
│   ├── api/              # API client and endpoints
│   ├── components/       # Reusable UI components
│   │   ├── layout/      # Layout components (Header, Layout, ProtectedRoute)
│   │   └── common/      # Common UI components
│   ├── context/         # React Context (AuthContext)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── auth/       # Authentication pages
│   │   ├── home/       # Home page
│   │   ├── posts/      # Post-related pages
│   │   ├── vetting/    # Vetting pages
│   │   ├── search/     # Search page
│   │   └── profile/    # Profile page
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component with routing
│   └── main.tsx        # Entry point
├── .env.example        # Environment variables template
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
VITE_API_URL=http://localhost:5000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Key Components

### Authentication Flow
- Login and registration with JWT tokens
- Email verification support
- Protected routes requiring authentication
- Automatic token refresh and logout on expiry

### API Integration
- Centralized API client with Axios
- Automatic token injection in requests
- Error handling and 401 redirect
- Request/response interceptors

### State Management
- React Query for server state
- Context API for auth state
- Local state with React hooks

### UI Components
- Fluent UI v9 components throughout
- Responsive design
- Dark/Light theme support (via Fluent UI)
- Accessible components

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow React best practices
4. Use Fluent UI components
5. Write meaningful commit messages

## License

MIT
