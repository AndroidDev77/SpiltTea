import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Input,
  Button,
  Text,
  Field,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import { useAuth } from '../../context/AuthContext';
import type { LoginRequest } from '../../types';

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
    maxWidth: '400px',
    ...shorthands.padding('32px'),
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '24px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  submitButton: {
    marginTop: '8px',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: tokens.fontSizeBase300,
  },
  link: {
    color: tokens.colorBrandForeground1,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

export const Login: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Text className={styles.title}>Welcome to Spilt Tea</Text>
        
        {error && (
          <MessageBar intent="error">
            <MessageBarBody>{error}</MessageBarBody>
          </MessageBar>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Email" required>
            <Input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
            />
          </Field>

          <Field label="Password" required>
            <Input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              required
            />
          </Field>

          <Button
            appearance="primary"
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className={styles.linkText}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
};
