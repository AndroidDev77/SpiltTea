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
    phoneNumber: '',
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
      // Remove phoneNumber if empty
      const submitData = { ...formData };
      if (!submitData.phoneNumber) {
        delete submitData.phoneNumber;
      }
      await register(submitData);
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

          <Field label="Phone Number (Optional)">
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              placeholder="+1234567890"
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
