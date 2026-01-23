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
  Dropdown,
  Option,
} from '@fluentui/react-components';
import { useAuth } from '../../context/AuthContext';
import type { RegisterRequest, Gender } from '../../types';

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
  divider: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    marginTop: '16px',
    marginBottom: '16px',
    '&::before, &::after': {
      content: '""',
      flex: 1,
      ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    },
  },
  dividerText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  googleButton: {
    backgroundColor: 'white',
    color: '#1f1f1f',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

export const Register: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'PREFER_NOT_TO_SAY',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/verify-email');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof RegisterRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleGenderChange = (_: unknown, data: { optionValue?: string }) => {
    if (data.optionValue) {
      setFormData((prev) => ({ ...prev, gender: data.optionValue as Gender }));
    }
  };

  const handleGoogleSignup = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Text className={styles.title}>Create an Account</Text>
        
        {error && (
          <MessageBar intent="error">
            <MessageBarBody>{error}</MessageBarBody>
          </MessageBar>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="First Name" required>
            <Input
              type="text"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              required
            />
          </Field>

          <Field label="Last Name" required>
            <Input
              type="text"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              required
            />
          </Field>

          <Field label="Username" required>
            <Input
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              required
            />
          </Field>

          <Field label="Email" required>
            <Input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
            />
          </Field>

          <Field label="Date of Birth" required>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              required
            />
          </Field>

          <Field label="Gender" required>
            <Dropdown
              value={formData.gender}
              selectedOptions={[formData.gender]}
              onOptionSelect={handleGenderChange}
              placeholder="Select gender"
            >
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
              <Option value="NON_BINARY">Non-Binary</Option>
              <Option value="OTHER">Other</Option>
              <Option value="PREFER_NOT_TO_SAY">Prefer Not to Say</Option>
            </Dropdown>
          </Field>

          <Field label="Password" required>
            <Input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              required
            />
          </Field>

          <Field label="Confirm Password" required>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Field>

          <Button
            appearance="primary"
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>or</span>
        </div>

        <Button
          appearance="outline"
          onClick={handleGoogleSignup}
          className={styles.googleButton}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '8px' }}>
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Sign up with Google
        </Button>

        <div className={styles.linkText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Login here
          </Link>
        </div>
      </Card>
    </div>
  );
};
