import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import { useCreatePost } from '../../hooks/usePosts';
import type { CreatePostRequest } from '../../types';

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
  const createPost = useCreatePost();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    category: '',
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const post = await createPost.mutateAsync(formData);
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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags }));
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
          <Field label="Title" required>
            <Input
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="Enter post title"
              required
            />
          </Field>

          <Field label="Category" required>
            <Input
              value={formData.category}
              onChange={handleChange('category')}
              placeholder="e.g., Technology, Politics, Entertainment"
              required
            />
          </Field>

          <Field label="Tags" hint="Comma-separated tags">
            <Input
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="e.g., breaking, verified, discussion"
            />
          </Field>

          <Field label="Content" required>
            <Textarea
              value={formData.content}
              onChange={handleChange('content')}
              placeholder="Share your story..."
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
