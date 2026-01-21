import React from 'react';
import { useParams } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Spinner,
  Badge,
} from '@fluentui/react-components';
import { useUser, useUserPosts } from '../../hooks/useUser';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  profileCard: {
    ...shorthands.padding('24px'),
  },
  profileHeader: {
    display: 'flex',
    ...shorthands.gap('16px'),
    alignItems: 'center',
    marginBottom: '16px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: tokens.colorBrandBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: tokens.fontSizeBase600,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  stats: {
    display: 'flex',
    ...shorthands.gap('16px'),
    marginTop: '8px',
  },
  bio: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    marginTop: '12px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '16px',
  },
  postsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  postCard: {
    ...shorthands.padding('16px'),
  },
  postTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '8px',
  },
  postMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('48px'),
  },
});

export const UserProfile: React.FC = () => {
  const styles = useStyles();
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading: userLoading } = useUser(id!);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(id!);

  if (userLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner label="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return <Text>User not found</Text>;
  }

  return (
    <div className={styles.container}>
      <Card className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <Text className={styles.username}>{user.username}</Text>
            <div className={styles.stats}>
              <Badge appearance="tint">Trust: {user.trust}</Badge>
              <Badge appearance={user.emailVerified ? 'filled' : 'outline'}>
                {user.emailVerified ? '✓ Verified' : 'Not Verified'}
              </Badge>
            </div>
          </div>
        </div>
        
        {user.bio && <Text className={styles.bio}>{user.bio}</Text>}
      </Card>

      <div>
        <Text className={styles.sectionTitle}>Posts by {user.username}</Text>
        
        {postsLoading ? (
          <Spinner label="Loading posts..." />
        ) : postsData && postsData.data.length > 0 ? (
          <div className={styles.postsContainer}>
            {postsData.data.map((post) => (
              <Card key={post.id} className={styles.postCard}>
                <Text className={styles.postTitle}>{post.title}</Text>
                <div className={styles.postMeta}>
                  <span>👍 {post.upvotes}</span>
                  <span> • </span>
                  <span>💬 {post.commentCount}</span>
                  <span> • </span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Text>No posts yet</Text>
        )}
      </div>
    </div>
  );
};
