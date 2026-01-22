import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Button,
  Spinner,
} from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';
import { useTrendingPosts } from '../../hooks/useSearch';
import { useAuth } from '../../context/AuthContext';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  hero: {
    ...shorthands.padding('48px', '24px'),
    textAlign: 'center',
    backgroundColor: tokens.colorBrandBackground,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    color: tokens.colorNeutralForegroundOnBrand,
  },
  heroTitle: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '16px',
  },
  heroSubtitle: {
    fontSize: tokens.fontSizeBase400,
    marginBottom: '24px',
  },
  heroButtons: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.gap('12px'),
  },
  section: {
    marginTop: '24px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '16px',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    ...shorthands.gap('16px'),
  },
  postCard: {
    ...shorthands.padding('16px'),
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  postTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '8px',
  },
  postMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    ...shorthands.gap('12px'),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('48px'),
  },
});

export const HomePage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: trendingPosts, isLoading } = useTrendingPosts(6);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <Text className={styles.heroTitle}>Welcome to Spilt Tea</Text>
        <Text className={styles.heroSubtitle}>
          A community-driven platform for sharing and vetting information
        </Text>
        {!isAuthenticated && (
          <div className={styles.heroButtons}>
            <Button appearance="primary" onClick={() => navigate('/register')}>
              Get Started
            </Button>
            <Button appearance="secondary" onClick={() => navigate('/login')}>
              Login
            </Button>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>Trending Posts</Text>
          
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spinner label="Loading trending posts..." />
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {trendingPosts?.map((post) => (
                <Card
                  key={post.id}
                  className={styles.postCard}
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <Text className={styles.postTitle}>{post.title}</Text>
                  <div className={styles.postMeta}>
                    <span>👍 {post.upvotes}</span>
                    <span>💬 {post.commentCount}</span>
                    <span>👁 {post.viewCount}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
