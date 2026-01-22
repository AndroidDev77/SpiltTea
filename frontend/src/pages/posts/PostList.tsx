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
import { Link, useNavigate } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { Add24Regular, Person24Regular } from '@fluentui/react-icons';

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
  personInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    marginBottom: '8px',
  },
  personAvatar: {
    width: '24px',
    height: '24px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: tokens.colorNeutralBackground5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  personAvatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  personName: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  postType: {
    marginLeft: 'auto',
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

const postTypeLabels: Record<string, string> = {
  EXPERIENCE: 'Experience',
  WARNING: 'Warning',
  VETTING_REQUEST: 'Vetting Request',
};

export const PostList: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { data, isLoading } = usePosts({ page: 1, pageSize: 20 });

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
        <Text className={styles.title}>Latest Posts</Text>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={() => navigate('/posts/create')}
        >
          Write Review
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
                <div style={{ flex: 1 }}>
                  {post.person && (
                    <div className={styles.personInfo}>
                      <div className={styles.personAvatar}>
                        {post.person.profileImageUrl ? (
                          <img
                            src={post.person.profileImageUrl}
                            alt={post.person.name}
                            className={styles.personAvatarImage}
                          />
                        ) : (
                          <Person24Regular style={{ fontSize: '14px' }} />
                        )}
                      </div>
                      <Link
                        to={`/persons/${post.person.id}`}
                        className={styles.personName}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {post.person.name}
                      </Link>
                      {post.person.isVerified && (
                        <Badge appearance="filled" color="success" size="small">
                          Verified
                        </Badge>
                      )}
                    </div>
                  )}
                  <Text className={styles.postTitle}>{post.title}</Text>
                </div>
                <Badge
                  appearance="outline"
                  className={styles.postType}
                  color={post.type === 'WARNING' ? 'danger' : 'informative'}
                >
                  {postTypeLabels[post.type] || post.type}
                </Badge>
              </div>

              <Text className={styles.postContent}>{post.content}</Text>

              <div className={styles.postMeta}>
                <span>{post._count?.likes || 0} likes</span>
                <span>{post._count?.comments || 0} comments</span>
                <span>{post.viewCount} views</span>
                <span>By {post.author?.username || 'Anonymous'}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Text>No reviews yet. Be the first to write one!</Text>
        </div>
      )}
    </div>
  );
};
