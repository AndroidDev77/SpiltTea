import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Spinner,
  Badge,
  Button,
} from '@fluentui/react-components';
import {
  Location24Regular,
  CheckmarkCircle24Filled,
  Person24Regular,
  Edit24Regular,
} from '@fluentui/react-icons';
import { usePersonPosts } from '../../hooks/usePersons';

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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  name: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  verifiedIcon: {
    color: tokens.colorPaletteGreenForeground1,
  },
  aliases: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  stats: {
    display: 'flex',
    ...shorthands.gap('16px'),
    marginTop: '8px',
    alignItems: 'center',
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
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
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  postLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  postTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
  },
  postContent: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    marginBottom: '8px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  postMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    ...shorthands.gap('12px'),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('48px'),
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('48px'),
    color: tokens.colorNeutralForeground3,
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px',
  },
  reviewsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
});

export const PersonProfile: React.FC = () => {
  const styles = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePersonPosts(id!);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner label="Loading person..." />
      </div>
    );
  }

  if (error || !data) {
    return <Text>Person not found</Text>;
  }

  const { person, posts, total } = data;

  const formatLocation = () => {
    const parts = [person.city, person.state, person.country].filter(Boolean);
    return parts.join(', ');
  };

  const formatAge = () => {
    if (!person.approximateAge) return null;
    return `~${person.approximateAge} years old`;
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
          <div className={styles.profileInfo}>
            <div className={styles.nameRow}>
              <Text className={styles.name}>{person.name}</Text>
              {person.isVerified && (
                <CheckmarkCircle24Filled className={styles.verifiedIcon} />
              )}
            </div>
            {person.aliases && person.aliases.length > 0 && (
              <Text className={styles.aliases}>
                Also known as: {person.aliases.join(', ')}
              </Text>
            )}
            <div className={styles.stats}>
              {formatLocation() && (
                <div className={styles.location}>
                  <Location24Regular />
                  <span>{formatLocation()}</span>
                </div>
              )}
              {formatAge() && <Badge appearance="outline">{formatAge()}</Badge>}
              {formatGender() && <Badge appearance="outline">{formatGender()}</Badge>}
              <Badge appearance="tint">{total} {total === 1 ? 'review' : 'reviews'}</Badge>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button
            appearance="primary"
            icon={<Edit24Regular />}
            onClick={() => navigate('/posts/create', { state: { person } })}
          >
            Write Review
          </Button>
        </div>
      </Card>

      <div>
        <Text className={styles.sectionTitle}>Reviews about {person.name}</Text>

        {posts.length > 0 ? (
          <div className={styles.postsContainer}>
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className={styles.postLink}
              >
                <Card className={styles.postCard}>
                  <Text className={styles.postTitle}>{post.title}</Text>
                  <Text className={styles.postContent}>{post.content}</Text>
                  <div className={styles.postMeta}>
                    <span>By {post.author?.username || 'Anonymous'}</span>
                    <span>{post._count?.likes || 0} likes</span>
                    <span>{post._count?.comments || 0} comments</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Text>No reviews yet for {person.name}</Text>
          </div>
        )}
      </div>
    </div>
  );
};
