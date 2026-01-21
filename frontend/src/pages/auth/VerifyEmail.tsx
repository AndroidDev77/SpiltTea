import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
  Text,
  MessageBar,
  MessageBarBody,
  Spinner,
} from '@fluentui/react-components';
import { authApi } from '../../api';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 64px)',
    ...shorthands.padding('24px'),
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    ...shorthands.padding('32px'),
    textAlign: 'center',
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '16px',
  },
  message: {
    marginTop: '16px',
    marginBottom: '16px',
  },
  button: {
    marginTop: '16px',
  },
});

export const VerifyEmail: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email or request a new verification link.');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await authApi.verifyEmail({ token });
      setStatus('success');
      setMessage(response.message || 'Email verified successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Text className={styles.title}>Email Verification</Text>

        {status === 'verifying' && (
          <>
            <Spinner label="Verifying your email..." />
            <Text className={styles.message}>
              Please wait while we verify your email address...
            </Text>
          </>
        )}

        {status === 'success' && (
          <>
            <MessageBar intent="success" className={styles.message}>
              <MessageBarBody>{message}</MessageBarBody>
            </MessageBar>
            <Text>Redirecting to login page...</Text>
          </>
        )}

        {status === 'error' && (
          <>
            <MessageBar intent="error" className={styles.message}>
              <MessageBarBody>{message}</MessageBarBody>
            </MessageBar>
            <Button
              appearance="primary"
              onClick={() => navigate('/login')}
              className={styles.button}
            >
              Go to Login
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};
