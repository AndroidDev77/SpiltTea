import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { VerifyEmail } from './pages/auth/VerifyEmail';

// Main Pages
import { HomePage } from './pages/home/HomePage';
import { PostList } from './pages/posts/PostList';
import { PostDetail } from './pages/posts/PostDetail';
import { CreatePost } from './pages/posts/CreatePost';
import { VettingRequests } from './pages/vetting/VettingRequests';
import { SearchPage } from './pages/search/SearchPage';
import { UserProfile } from './pages/profile/UserProfile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts"
                  element={
                    <ProtectedRoute>
                      <PostList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts/:id"
                  element={
                    <ProtectedRoute>
                      <PostDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts/create"
                  element={
                    <ProtectedRoute>
                      <CreatePost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vetting"
                  element={
                    <ProtectedRoute>
                      <VettingRequests />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <SearchPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:id"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </FluentProvider>
  );
}

export default App;
