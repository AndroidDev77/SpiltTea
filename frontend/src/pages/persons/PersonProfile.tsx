import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Spinner,
  Button,
  Avatar,
} from '@fluentui/react-components';
import {
  Location20Regular,
  CheckmarkCircle16Filled,
  Person24Regular,
  Edit24Regular,
  ArrowUp16Regular,
  ArrowDown16Regular,
  Comment16Regular,
} from '@fluentui/react-icons';
import { usePersonPosts } from '../../hooks/usePersons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  profileCard: {
    ...shorthands.padding('0'),
    ...shorthands.borderRadius('20px'),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    overflow: 'hidden',
  },
  profileHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.padding('40px', '32px', '32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    textAlign: 'center',
  },
  avatar: {
    width: '120px',
    height: '120px',
    ...shorthands.borderRadius('24px'),
    backgroundColor: tokens.colorNeutralBackground5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    overflow: 'hidden',
    marginBottom: '20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.gap('10px'),
    marginBottom: '8px',
  },
  name: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  verifiedIcon: {
    color: tokens.colorPaletteBlueForeground2,
    fontSize: '20px',
  },
  aliases: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    marginBottom: '16px',
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.gap('6px'),
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    marginBottom: '20px',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.gap('32px'),
    ...shorthands.padding('20px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.gap('4px'),
  },
  statValue: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('24px', '32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
  },
  writeReviewButton: {
    ...shorthands.borderRadius('10px'),
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.padding('12px', '32px'),
  },
  reviewsSection: {
    ...shorthands.borderRadius('20px'),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    overflow: 'hidden',
  },
  reviewsHeader: {
    ...shorthands.padding('24px', '32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
  postsContainer: {
    ...shorthands.padding('16px', '24px', '24px'),
  },
  postCard: {
    ...shorthands.padding('20px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorNeutralBackground1,
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      transform: 'translateX(4px)',
    },
    ':last-child': {
      marginBottom: 0,
    },
  },
  postLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  postTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.4',
    flex: 1,
  },
  typeBadge: {
    ...shorthands.borderRadius('6px'),
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase100,
    ...shorthands.padding('3px', '8px'),
    marginLeft: '12px',
    flexShrink: 0,
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
  postContent: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    marginBottom: '16px',
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
  },
  postStats: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  postMeta: {
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
    ...shorthands.padding('60px', '24px'),
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },
  notFound: {
    textAlign: 'center',
    ...shorthands.padding('80px'),
  },
});

const postTypeConfig: Record<string, { label: string; style: string }> = {
  EXPERIENCE: { label: 'Experience', style: 'experienceBadge' },
  WARNING: { label: 'Warning', style: 'warningBadge' },
  VETTING_REQUEST: { label: 'Vetting', style: 'vettingBadge' },
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const PersonProfile: React.FC = () => {
  const styles = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePersonPosts(id!);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" />
        <Text>Loading profile...</Text>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.notFound}>
        <Text size={500}>Person not found</Text>
      </div>
    );
  }

  const { person, posts, total } = data;

  const formatLocation = () => {
    const parts = [person.city, person.state, person.country].filter(Boolean);
    return parts.join(', ') || 'Location not specified';
  };

  const formatAge = () => {
    if (!person.approximateAge) return null;
    return `~${person.approximateAge}`;
  };

  const formatGender = () => {
    if (!person.gender) return null;
    const genderMap: Record<string, string> = {
      MALE: 'Male',
      FEMALE: 'Female',
      NON_BINARY: 'Non-binary',
      OTHER: 'Other',
      PREFER_NOT_TO_SAY: 'Not specified',
    };
    return genderMap[person.gender] || person.gender;
  };

  return (
    <div className={styles.container}>
      <Card className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {person.profileImageUrl ? (
              <img
                src={person.profileImageUrl}
                alt={person.name}
                className={styles.avatarImage}
              />
            ) : (
              <Person24Regular />
            )}
          </div>
          <div className={styles.nameRow}>
            <Text className={styles.name}>{person.name}</Text>
            {person.isVerified && (
              <CheckmarkCircle16Filled className={styles.verifiedIcon} />
            )}
          </div>
          {person.aliases && person.aliases.length > 0 && (
            <Text className={styles.aliases}>
              Also known as: {person.aliases.join(', ')}
            </Text>
          )}
          <div className={styles.location}>
            <Location20Regular />
            <span>{formatLocation()}</span>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{total}</span>
            <span className={styles.statLabel}>Reviews</span>
          </div>
          {formatAge() && (
            <div className={styles.statItem}>
              <span className={styles.statValue}>{formatAge()}</span>
              <span className={styles.statLabel}>Age</span>
            </div>
          )}
          {formatGender() && (
            <div className={styles.statItem}>
              <span className={styles.statValue}>{formatGender()}</span>
              <span className={styles.statLabel}>Gender</span>
            </div>
          )}
        </div>

        <div className={styles.actionsRow}>
          <Button
            appearance="primary"
            icon={<Edit24Regular />}
            onClick={() => navigate('/posts/create', { state: { person } })}
            className={styles.writeReviewButton}
            size="large"
          >
            Write a Review
          </Button>
        </div>
      </Card>

      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2 className={styles.sectionTitle}>Reviews ({total})</h2>
        </div>

        <div className={styles.postsContainer}>
          {posts.length > 0 ? (
            posts.map((post) => {
              const typeConfig = postTypeConfig[post.type] || postTypeConfig.EXPERIENCE;
              return (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className={styles.postLink}
                >
                  <div className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <Text className={styles.postTitle}>{post.title}</Text>
                      <span className={`${styles.typeBadge} ${styles[typeConfig.style as keyof typeof styles]}`}>
                        {typeConfig.label}
                      </span>
                    </div>
                    <Text className={styles.postContent}>{post.content}</Text>
                    <div className={styles.postFooter}>
                      <div className={styles.postStats}>
                        <span className={styles.stat}>
                          <ArrowUp16Regular />
                          {post.upvotes || 0}
                        </span>
                        <span className={styles.stat}>
                          <ArrowDown16Regular />
                          {post.downvotes || 0}
                        </span>
                        <span className={styles.stat}>
                          <Comment16Regular />
                          {post._count?.comments || 0}
                        </span>
                      </div>
                      <div className={styles.postMeta}>
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
                </Link>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📝</span>
              <Text className={styles.emptyTitle}>No reviews yet</Text>
              <Text className={styles.emptyText}>
                Be the first to write a review about {person.name}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
