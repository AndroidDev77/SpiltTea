import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
});

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const styles = useStyles();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner label="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
