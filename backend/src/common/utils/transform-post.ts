/**
 * Transforms a post object to replace the votes array with upvotes/downvotes counts.
 *
 * @param post - A post object containing a votes array with voteType property
 * @returns The post object with votes array removed and upvotes/downvotes counts added
 */
export function transformPostWithVoteCounts<T extends { votes: { voteType: string }[] }>(
  post: T,
): Omit<T, 'votes'> & { upvotes: number; downvotes: number } {
  const upvotes = post.votes.filter((v) => v.voteType === 'UPVOTE').length;
  const downvotes = post.votes.filter((v) => v.voteType === 'DOWNVOTE').length;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { votes, ...postWithoutVotes } = post;
  return {
    ...postWithoutVotes,
    upvotes,
    downvotes,
  };
}
