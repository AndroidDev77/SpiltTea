import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Button,
  Spinner,
  Badge,
} from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { Add24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  postsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  postCard: {
    ...shorthands.padding('20px'),
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  postTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '8px',
  },
  postContent: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  postMeta: {
    display: 'flex',
    ...shorthands.gap('16px'),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  postTags: {
    display: 'flex',
    ...shorthands.gap('8px'),
    marginTop: '8px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('48px'),
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('48px'),
    color: tokens.colorNeutralForeground2,
  },
});

export const PostList: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { data, isLoading } = usePosts({ page: 1, pageSize: 10 });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner label="Loading posts..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>Posts</Text>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={() => navigate('/posts/create')}
        >
          Create Post
        </Button>
      </div>

      {data && data.data.length > 0 ? (
        <div className={styles.postsContainer}>
          {data.data.map((post) => (
            <Card
              key={post.id}
              className={styles.postCard}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <div className={styles.postHeader}>
                <div>
                  <Text className={styles.postTitle}>{post.title}</Text>
                  <Badge appearance="outline">{post.category}</Badge>
                </div>
              </div>
              
              <Text className={styles.postContent}>{post.content}</Text>
              
              {post.tags && post.tags.length > 0 && (
                <div className={styles.postTags}>
                  {post.tags.map((tag) => (
                    <Badge key={tag} size="small" appearance="tint">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className={styles.postMeta}>
                <span>👍 {post.upvotes}</span>
                <span>👎 {post.downvotes}</span>
                <span>💬 {post.commentCount}</span>
                <span>👁 {post.viewCount}</span>
                <span>By {post.author?.username || 'Unknown'}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Text>No posts yet. Be the first to create one!</Text>
        </div>
      )}
    </div>
  );
};
