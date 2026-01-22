import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Button,
  Input,
  Textarea,
  Field,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import { ArrowLeft24Regular, Send24Regular } from '@fluentui/react-icons';
import { useCreatePost } from '../../hooks/usePosts';
import { PersonSelector } from '../../components/persons/PersonSelector';
import type { CreatePostRequest, Person, PostType } from '../../types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  backButton: {
    alignSelf: 'flex-start',
    ...shorthands.borderRadius('8px'),
  },
  card: {
    ...shorthands.padding('0'),
    ...shorthands.borderRadius('20px'),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    overflow: 'hidden',
  },
  cardHeader: {
    ...shorthands.padding('28px', '32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    margin: 0,
  },
  cardBody: {
    ...shorthands.padding('32px'),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  fieldLabel: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  fieldDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  postTypeOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    ...shorthands.gap('12px'),
    marginTop: '8px',
  },
  postTypeOption: {
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('12px'),
    ...shorthands.border('2px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    ':hover': {
      ...shorthands.borderColor(tokens.colorNeutralStroke1),
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  postTypeOptionSelected: {
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    backgroundColor: tokens.colorBrandBackground2,
  },
  postTypeIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  postTypeLabel: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  postTypeDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  input: {
    ...shorthands.borderRadius('10px'),
  },
  textarea: {
    ...shorthands.borderRadius('10px'),
  },
  errorMessage: {
    ...shorthands.borderRadius('10px'),
    marginBottom: '16px',
  },
  cardFooter: {
    ...shorthands.padding('24px', '32px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.gap('12px'),
  },
  submitButton: {
    ...shorthands.borderRadius('10px'),
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.padding('10px', '24px'),
  },
  cancelButton: {
    ...shorthands.borderRadius('10px'),
  },
});

const postTypes = [
  {
    value: 'EXPERIENCE',
    icon: '💬',
    label: 'Experience',
    description: 'Share your personal experience',
  },
  {
    value: 'WARNING',
    icon: '⚠️',
    label: 'Warning',
    description: 'Alert others about concerns',
  },
  {
    value: 'VETTING_REQUEST',
    icon: '🔍',
    label: 'Vetting',
    description: 'Request community verification',
  },
];

export const CreatePost: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const createPost = useCreatePost();
  const [error, setError] = useState<string>('');

  const preSelectedPerson = (location.state as { person?: Person } | null)?.person || null;
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(preSelectedPerson);
  const [formData, setFormData] = useState<CreatePostRequest>({
    type: 'EXPERIENCE',
    title: '',
    content: '',
    personId: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedPerson) {
      setError('Please select a person this review is about');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!formData.content.trim()) {
      setError('Please enter content for your review');
      return;
    }

    try {
      const post = await createPost.mutateAsync({
        ...formData,
        personId: selectedPerson.id,
      });
      navigate(`/posts/${post.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to create post');
    }
  };

  const handleChange = (field: keyof CreatePostRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTypeChange = (type: PostType) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handlePersonChange = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className={styles.container}>
      <Button
        appearance="subtle"
        icon={<ArrowLeft24Regular />}
        onClick={() => navigate('/posts')}
        className={styles.backButton}
      >
        Back to Posts
      </Button>

      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Create a New Post</h1>
          <p className={styles.subtitle}>
            Share your experience or warn others about someone in the community
          </p>
        </div>

        <div className={styles.cardBody}>
          {error && (
            <MessageBar intent="error" className={styles.errorMessage}>
              <MessageBarBody>{error}</MessageBarBody>
            </MessageBar>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Post Type</span>
              <span className={styles.fieldDescription}>
                Choose the type that best describes your post
              </span>
              <div className={styles.postTypeOptions}>
                {postTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`${styles.postTypeOption} ${formData.type === type.value ? styles.postTypeOptionSelected : ''}`}
                    onClick={() => handleTypeChange(type.value as PostType)}
                  >
                    <div className={styles.postTypeIcon}>{type.icon}</div>
                    <div className={styles.postTypeLabel}>{type.label}</div>
                    <div className={styles.postTypeDescription}>{type.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <PersonSelector
              label="Who is this about?"
              value={selectedPerson}
              onChange={handlePersonChange}
            />

            <Field label="Title" required>
              <Input
                value={formData.title}
                onChange={handleChange('title')}
                placeholder="Give your post a clear, descriptive title"
                required
                size="large"
                className={styles.input}
              />
            </Field>

            <Field label="Content" required>
              <Textarea
                value={formData.content}
                onChange={handleChange('content')}
                placeholder="Share the details of your experience. Be specific and factual."
                rows={8}
                required
                resize="vertical"
                className={styles.textarea}
              />
            </Field>
          </form>
        </div>

        <div className={styles.cardFooter}>
          <Button
            appearance="secondary"
            onClick={() => navigate('/posts')}
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            appearance="primary"
            icon={<Send24Regular />}
            onClick={handleSubmit}
            disabled={createPost.isPending}
            className={styles.submitButton}
          >
            {createPost.isPending ? 'Creating...' : 'Publish Post'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
