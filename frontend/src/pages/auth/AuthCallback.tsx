import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spinner, Text, makeStyles, shorthands } from '@fluentui/react-components';
import { useAuth } from '../../context/AuthContext';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)',
    ...shorthands.gap('16px'),
  },
});

export const AuthCallback: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store the token
      localStorage.setItem('accessToken', token);

      // Set auth context (this will fetch user data)
      setAuth(token);

      // Redirect to home
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      // No token, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className={styles.container}>
      <Spinner size="large" />
      <Text>Signing you in...</Text>
    </div>
  );
};
