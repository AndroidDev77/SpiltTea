import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Button,
  Input,
  Textarea,
  Field,
  MessageBar,
  MessageBarBody,
  Select,
} from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
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
  },
  card: {
    ...shorthands.padding('24px'),
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  buttons: {
    display: 'flex',
    ...shorthands.gap('12px'),
    marginTop: '8px',
  },
});

export const CreatePost: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const createPost = useCreatePost();
  const [error, setError] = useState<string>('');

  // Get pre-selected person from navigation state (e.g., from PersonProfile page)
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

    try {
      const post = await createPost.mutateAsync({
        ...formData,
        personId: selectedPerson.id,
      });
      navigate(`/posts/${post.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  const handleChange = (field: keyof CreatePostRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTypeChange = (_: any, data: { value: string }) => {
    setFormData((prev) => ({ ...prev, type: data.value as PostType }));
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
        <Text className={styles.title}>Create New Post</Text>

        {error && (
          <MessageBar intent="error">
            <MessageBarBody>{error}</MessageBarBody>
          </MessageBar>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Post Type" required>
            <Select value={formData.type} onChange={handleTypeChange}>
              <option value="EXPERIENCE">Experience / Review</option>
              <option value="WARNING">Warning</option>
              <option value="VETTING_REQUEST">Vetting Request</option>
            </Select>
          </Field>

          <PersonSelector
            label="Who is this about?"
            value={selectedPerson}
            onChange={handlePersonChange}
          />

          <Field label="Title" required>
            <Input
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="Enter post title"
              required
            />
          </Field>

          <Field label="Content" required>
            <Textarea
              value={formData.content}
              onChange={handleChange('content')}
              placeholder="Share your experience..."
              rows={10}
              required
            />
          </Field>

          <div className={styles.buttons}>
            <Button
              appearance="primary"
              type="submit"
              disabled={createPost.isPending}
            >
              {createPost.isPending ? 'Creating...' : 'Create Post'}
            </Button>
            <Button appearance="secondary" onClick={() => navigate('/posts')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
