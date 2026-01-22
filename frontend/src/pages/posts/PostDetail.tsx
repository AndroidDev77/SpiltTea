import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Button,
  Spinner,
  Textarea,
  Avatar,
} from '@fluentui/react-components';
import {
  ArrowUp24Regular,
  ArrowUp24Filled,
  ArrowDown24Regular,
  ArrowDown24Filled,
  ArrowLeft24Regular,
  Person24Regular,
  Eye16Regular,
  Calendar16Regular,
  CheckmarkCircle16Filled,
  Send24Regular,
} from '@fluentui/react-icons';
import { usePost, useComments, useCreateComment, useVotePost, useUserVote } from '../../hooks/usePosts';
import { useAuth } from '../../context/AuthContext';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  backButton: {
    alignSelf: 'flex-start',
    ...shorthands.borderRadius('8px'),
  },
  postCard: {
    ...shorthands.padding('0'),
    ...shorthands.borderRadius('20px'),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    overflow: 'hidden',
  },
  postHeader: {
    ...shorthands.padding('28px', '32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  typeBadge: {
    display: 'inline-block',
    ...shorthands.borderRadius('8px'),
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    ...shorthands.padding('6px', '12px'),
    marginBottom: '16px',
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
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '20px',
    lineHeight: '1.3',
  },
  personSection: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius('12px'),
    marginBottom: '20px',
  },
  personAvatar: {
    width: '56px',
    height: '56px',
    ...shorthands.borderRadius('14px'),
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
    flex: 1,
  },
  personName: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  verifiedIcon: {
    color: tokens.colorPaletteBlueForeground2,
  },
  personMeta: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  viewProfileButton: {
    ...shorthands.borderRadius('8px'),
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('24px'),
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
  },
  postBody: {
    ...shorthands.padding('32px'),
  },
  postContent: {
    fontSize: tokens.fontSizeBase400,
    lineHeight: '1.8',
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'pre-wrap',
  },
  actionsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('20px', '32px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
  },
  voteButtons: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  voteButton: {
    ...shorthands.borderRadius('10px'),
    minWidth: '80px',
  },
  upvoteButton: {
    ':hover': {
      backgroundColor: tokens.colorPaletteGreenBackground1,
    },
  },
  upvoteButtonActive: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  downvoteButton: {
    ':hover': {
      backgroundColor: tokens.colorPaletteRedBackground1,
    },
  },
  downvoteButtonActive: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('10px'),
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  commentsSection: {
    ...shorthands.padding('0'),
    ...shorthands.borderRadius('20px'),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    overflow: 'hidden',
  },
  commentsHeader: {
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
  commentForm: {
    ...shorthands.padding('24px', '32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  commentInputWrapper: {
    display: 'flex',
    ...shorthands.gap('16px'),
  },
  commentTextarea: {
    flex: 1,
  },
  commentsList: {
    ...shorthands.padding('16px', '32px', '32px'),
  },
  commentCard: {
    ...shorthands.padding('20px'),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorNeutralBackground1,
    marginBottom: '12px',
    ':last-child': {
      marginBottom: 0,
    },
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  commentAuthorSection: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  commentAuthor: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  commentDate: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  commentContent: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground2,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('80px'),
    ...shorthands.gap('16px'),
  },
  emptyComments: {
    textAlign: 'center',
    ...shorthands.padding('40px'),
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
  VETTING_REQUEST: { label: 'Vetting Request', style: 'vettingBadge' },
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const PostDetail: React.FC = () => {
  const styles = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState('');

  const { data: post, isLoading: postLoading } = usePost(id!);
  const { data: commentsData, isLoading: commentsLoading } = useComments(id!);
  const { data: userVoteData } = useUserVote(id!);
  const createComment = useCreateComment();
  const votePost = useVotePost();

  const handleVote = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
    if (!id) return;
    try {
      await votePost.mutateAsync({ postId: id, voteType });
    } catch {
      // Error handled by React Query's error state
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
        <Spinner size="large" />
        <Text>Loading post...</Text>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.notFound}>
        <Text size={500}>Post not found</Text>
      </div>
    );
  }

  const typeConfig = postTypeConfig[post.type] || postTypeConfig.EXPERIENCE;

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
          <span className={`${styles.typeBadge} ${styles[typeConfig.style as keyof typeof styles]}`}>
            {typeConfig.label}
          </span>

          <Text className={styles.postTitle}>{post.title}</Text>

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
                >
                  {post.person.name}
                  {post.person.isVerified && (
                    <CheckmarkCircle16Filled className={styles.verifiedIcon} />
                  )}
                </Link>
                <div className={styles.personMeta}>
                  {post.person.city && post.person.state
                    ? `${post.person.city}, ${post.person.state}`
                    : 'Location not specified'}
                </div>
              </div>
              <Button
                appearance="outline"
                size="small"
                className={styles.viewProfileButton}
                onClick={() => navigate(`/persons/${post.person!.id}`)}
              >
                View Profile
              </Button>
            </div>
          )}

          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <Calendar16Regular />
              {formatDate(post.createdAt)}
            </span>
            <span className={styles.metaItem}>
              <Eye16Regular />
              {post.viewCount} views
            </span>
          </div>
        </div>

        <div className={styles.postBody}>
          <Text className={styles.postContent}>{post.content}</Text>
        </div>

        <div className={styles.actionsBar}>
          <div className={styles.voteButtons}>
            <Button
              appearance="subtle"
              icon={userVoteData?.voteType === 'UPVOTE' ? <ArrowUp24Filled /> : <ArrowUp24Regular />}
              onClick={() => handleVote('UPVOTE')}
              disabled={votePost.isPending}
              className={`${styles.voteButton} ${styles.upvoteButton} ${userVoteData?.voteType === 'UPVOTE' ? styles.upvoteButtonActive : ''}`}
            >
              {post.upvotes || 0}
            </Button>
            <Button
              appearance="subtle"
              icon={userVoteData?.voteType === 'DOWNVOTE' ? <ArrowDown24Filled /> : <ArrowDown24Regular />}
              onClick={() => handleVote('DOWNVOTE')}
              disabled={votePost.isPending}
              className={`${styles.voteButton} ${styles.downvoteButton} ${userVoteData?.voteType === 'DOWNVOTE' ? styles.downvoteButtonActive : ''}`}
            >
              {post.downvotes || 0}
            </Button>
          </div>

          <div className={styles.authorInfo}>
            <Avatar
              name={post.author?.username || 'Anonymous'}
              size={28}
              color="colorful"
            />
            <span>Posted by <strong>{post.author?.username || 'Anonymous'}</strong></span>
          </div>
        </div>
      </Card>

      <Card className={styles.commentsSection}>
        <div className={styles.commentsHeader}>
          <h2 className={styles.sectionTitle}>
            Comments ({commentsData?.data?.length || 0})
          </h2>
        </div>

        {user && (
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <div className={styles.commentInputWrapper}>
              <Avatar name={user.username} size={36} color="colorful" />
              <Textarea
                className={styles.commentTextarea}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={2}
                resize="vertical"
              />
              <Button
                appearance="primary"
                icon={<Send24Regular />}
                type="submit"
                disabled={!commentContent.trim() || createComment.isPending}
              >
                {createComment.isPending ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        )}

        <div className={styles.commentsList}>
          {commentsLoading ? (
            <Spinner label="Loading comments..." />
          ) : commentsData?.data && commentsData.data.length > 0 ? (
            commentsData.data.map((comment) => (
              <div key={comment.id} className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  <div className={styles.commentAuthorSection}>
                    <Avatar
                      name={comment.author?.username || 'Unknown'}
                      size={32}
                      color="colorful"
                    />
                    <div>
                      <div className={styles.commentAuthor}>
                        {comment.author?.username || 'Unknown'}
                      </div>
                      <div className={styles.commentDate}>
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                <Text className={styles.commentContent}>{comment.content}</Text>
              </div>
            ))
          ) : (
            <div className={styles.emptyComments}>
              <Text>No comments yet. Be the first to share your thoughts!</Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
