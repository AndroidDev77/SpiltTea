import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Button,
  Spinner,
  Badge,
  Textarea,
  Field,
} from '@fluentui/react-components';
import {
  ThumbLike24Regular,
  ThumbDislike24Regular,
  ArrowLeft24Regular,
} from '@fluentui/react-icons';
import { usePost, useComments, useCreateComment, useVote } from '../../hooks/usePosts';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  postCard: {
    ...shorthands.padding('24px'),
  },
  postHeader: {
    marginBottom: '16px',
  },
  postTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '12px',
  },
  postMeta: {
    display: 'flex',
    ...shorthands.gap('16px'),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginBottom: '12px',
  },
  postTags: {
    display: 'flex',
    ...shorthands.gap('8px'),
    marginBottom: '16px',
  },
  postContent: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: '1.6',
    marginBottom: '24px',
    whiteSpace: 'pre-wrap',
  },
  voteButtons: {
    display: 'flex',
    ...shorthands.gap('12px'),
  },
  commentsSection: {
    marginTop: '24px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '16px',
  },
  commentForm: {
    marginBottom: '24px',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  commentCard: {
    ...shorthands.padding('16px'),
  },
  commentAuthor: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '8px',
  },
  commentContent: {
    fontSize: tokens.fontSizeBase300,
    marginBottom: '8px',
  },
  commentMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('48px'),
  },
});

export const PostDetail: React.FC = () => {
  const styles = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState('');

  const { data: post, isLoading: postLoading } = usePost(id!);
  const { data: commentsData, isLoading: commentsLoading } = useComments(id!);
  const createComment = useCreateComment();
  const vote = useVote();

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!id) return;
    try {
      await vote.mutateAsync({
        targetId: id,
        targetType: 'post',
        voteType,
      });
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentContent.trim()) return;

    try {
      await createComment.mutateAsync({
        postId: id,
        content: commentContent,
      });
      setCommentContent('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  if (postLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner label="Loading post..." />
      </div>
    );
  }

  if (!post) {
    return <Text>Post not found</Text>;
  }

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

      <Card className={styles.postCard}>
        <div className={styles.postHeader}>
          <Text className={styles.postTitle}>{post.title}</Text>
          
          <div className={styles.postMeta}>
            <span>By {post.author?.username || 'Unknown'}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <Badge appearance="outline">{post.category}</Badge>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className={styles.postTags}>
              {post.tags.map((tag) => (
                <Badge key={tag} size="small" appearance="tint">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Text className={styles.postContent}>{post.content}</Text>

        <div className={styles.voteButtons}>
          <Button
            appearance="subtle"
            icon={<ThumbLike24Regular />}
            onClick={() => handleVote('upvote')}
          >
            {post.upvotes}
          </Button>
          <Button
            appearance="subtle"
            icon={<ThumbDislike24Regular />}
            onClick={() => handleVote('downvote')}
          >
            {post.downvotes}
          </Button>
        </div>

        <div className={styles.commentsSection}>
          <Text className={styles.sectionTitle}>
            Comments ({post.commentCount})
          </Text>

          {user && (
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <Field label="Add a comment">
                <Textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                />
              </Field>
              <Button
                appearance="primary"
                type="submit"
                disabled={!commentContent.trim() || createComment.isPending}
                style={{ marginTop: '8px' }}
              >
                {createComment.isPending ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>
          )}

          {commentsLoading ? (
            <Spinner label="Loading comments..." />
          ) : (
            <div className={styles.commentsList}>
              {commentsData?.data.map((comment) => (
                <Card key={comment.id} className={styles.commentCard}>
                  <Text className={styles.commentAuthor}>
                    {comment.author?.username || 'Unknown'}
                  </Text>
                  <Text className={styles.commentContent}>{comment.content}</Text>
                  <div className={styles.commentMeta}>
                    <span>👍 {comment.upvotes}</span>
                    <span>👎 {comment.downvotes}</span>
                    <span>•</span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
