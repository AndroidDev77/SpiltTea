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

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const styles = useStyles();
  const { user, isAuthenticated, isLoading } = useAuth();

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

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
