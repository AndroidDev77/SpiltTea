import React from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Button,
  Spinner,
  Avatar,
} from '@fluentui/react-components';
import {
  Add24Regular,
  Person24Regular,
  Eye16Regular,
  Comment16Regular,
  ArrowUp16Regular,
  ArrowDown16Regular,
  CheckmarkCircle16Filled,
} from '@fluentui/react-icons';
import { Link, useNavigate } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('32px'),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('16px'),
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  title: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    margin: 0,
  },
  createButton: {
    ...shorthands.borderRadius('10px'),
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.padding('10px', '20px'),
  },
  postsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  postCard: {
    ...shorthands.padding('0'),
    ...shorthands.borderRadius('16px'),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    ':hover': {
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)',
      ...shorthands.borderColor(tokens.colorNeutralStroke1),
    },
  },
  postCardInner: {
    ...shorthands.padding('24px'),
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    ...shorthands.gap('16px'),
  },
  personSection: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  personAvatar: {
    width: '44px',
    height: '44px',
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorNeutralBackground5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  personAvatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  personInfo: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('2px'),
  },
  personName: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  verifiedIcon: {
    color: tokens.colorPaletteBlueForeground2,
  },
  personMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  typeBadge: {
    ...shorthands.borderRadius('8px'),
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    ...shorthands.padding('4px', '10px'),
  },
  warningBadge: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  experienceBadge: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  vettingBadge: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  postTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  postContent: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    marginBottom: '20px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.6',
  },
  postFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '16px',
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('20px'),
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  statIcon: {
    color: tokens.colorNeutralForeground3,
  },
  upvoteStat: {
    color: tokens.colorPaletteGreenForeground1,
  },
  downvoteStat: {
    color: tokens.colorPaletteRedForeground1,
  },
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('80px'),
    ...shorthands.gap('16px'),
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('80px', '24px'),
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('16px'),
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke2),
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    marginBottom: '24px',
  },
});

const postTypeConfig: Record<string, { label: string; style: string }> = {
  EXPERIENCE: { label: 'Experience', style: 'experienceBadge' },
  WARNING: { label: 'Warning', style: 'warningBadge' },
  VETTING_REQUEST: { label: 'Vetting', style: 'vettingBadge' },
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const PostList: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { data, isLoading } = usePosts({ page: 1, pageSize: 20 });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" />
        <Text>Loading posts...</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Latest Posts</h1>
          <p className={styles.subtitle}>Discover experiences and reviews from the community</p>
        </div>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={() => navigate('/posts/create')}
          className={styles.createButton}
          size="large"
        >
          Write Review
        </Button>
      </div>

      {data && data.data.length > 0 ? (
        <div className={styles.postsContainer}>
          {data.data.map((post) => {
            const typeConfig = postTypeConfig[post.type] || postTypeConfig.EXPERIENCE;
            return (
              <Card
                key={post.id}
                className={styles.postCard}
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <div className={styles.postCardInner}>
                  <div className={styles.postHeader}>
                    {post.person && (
                      <div className={styles.personSection}>
                        <div className={styles.personAvatar}>
                          {post.person.profileImageUrl ? (
                            <img
                              src={post.person.profileImageUrl}
                              alt={post.person.name}
                              className={styles.personAvatarImage}
                            />
                          ) : (
                            <Person24Regular />
                          )}
                        </div>
                        <div className={styles.personInfo}>
                          <Link
                            to={`/persons/${post.person.id}`}
                            className={styles.personName}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {post.person.name}
                            {post.person.isVerified && (
                              <CheckmarkCircle16Filled className={styles.verifiedIcon} />
                            )}
                          </Link>
                          <span className={styles.personMeta}>
                            {post.person.city && post.person.state
                              ? `${post.person.city}, ${post.person.state}`
                              : 'Location unknown'}
                          </span>
                        </div>
                      </div>
                    )}
                    <span className={`${styles.typeBadge} ${styles[typeConfig.style as keyof typeof styles]}`}>
                      {typeConfig.label}
                    </span>
                  </div>

                  <Text className={styles.postTitle}>{post.title}</Text>
                  <Text className={styles.postContent}>{post.content}</Text>

                  <div className={styles.postFooter}>
                    <div className={styles.stats}>
                      <span className={`${styles.stat} ${styles.upvoteStat}`}>
                        <ArrowUp16Regular className={styles.statIcon} />
                        {post.upvotes || 0}
                      </span>
                      <span className={`${styles.stat} ${styles.downvoteStat}`}>
                        <ArrowDown16Regular className={styles.statIcon} />
                        {post.downvotes || 0}
                      </span>
                      <span className={styles.stat}>
                        <Comment16Regular className={styles.statIcon} />
                        {post._count?.comments || 0}
                      </span>
                      <span className={styles.stat}>
                        <Eye16Regular className={styles.statIcon} />
                        {post.viewCount}
                      </span>
                    </div>
                    <div className={styles.authorInfo}>
                      <Avatar
                        name={post.author?.username || 'Anonymous'}
                        size={20}
                        color="colorful"
                      />
                      <span>{post.author?.username || 'Anonymous'}</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📝</span>
          <Text className={styles.emptyTitle}>No posts yet</Text>
          <Text className={styles.emptyText}>
            Be the first to share an experience or review with the community.
          </Text>
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={() => navigate('/posts/create')}
            size="large"
          >
            Write Your First Review
          </Button>
        </div>
      )}
    </div>
  );
};
