import { transformPostWithVoteCounts } from './transform-post';

describe('transformPostWithVoteCounts', () => {
  describe('vote counting', () => {
    it('should correctly count UPVOTE votes', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [{ voteType: 'UPVOTE' }, { voteType: 'UPVOTE' }, { voteType: 'UPVOTE' }],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.upvotes).toBe(3);
    });

    it('should correctly count DOWNVOTE votes', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [{ voteType: 'DOWNVOTE' }, { voteType: 'DOWNVOTE' }],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.downvotes).toBe(2);
    });

    it('should handle posts with no votes (empty array)', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.upvotes).toBe(0);
      expect(result.downvotes).toBe(0);
    });

    it('should handle posts with only upvotes', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [{ voteType: 'UPVOTE' }, { voteType: 'UPVOTE' }],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.upvotes).toBe(2);
      expect(result.downvotes).toBe(0);
    });

    it('should handle posts with only downvotes', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [{ voteType: 'DOWNVOTE' }, { voteType: 'DOWNVOTE' }, { voteType: 'DOWNVOTE' }],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.upvotes).toBe(0);
      expect(result.downvotes).toBe(3);
    });

    it('should handle posts with mixed votes', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [{ voteType: 'UPVOTE' }, { voteType: 'UPVOTE' }, { voteType: 'DOWNVOTE' }],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.upvotes).toBe(2);
      expect(result.downvotes).toBe(1);
    });
  });

  describe('object transformation', () => {
    it('should remove the votes array from the returned object', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [{ voteType: 'UPVOTE' }],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result).not.toHaveProperty('votes');
    });

    it('should preserve all other post properties', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        authorId: 'author-123',
        type: 'EXPERIENCE',
        personId: 'person-456',
        votes: [{ voteType: 'UPVOTE' }, { voteType: 'DOWNVOTE' }],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Post');
      expect(result.content).toBe('Content');
      expect(result.createdAt).toEqual(new Date('2024-01-01'));
      expect(result.updatedAt).toEqual(new Date('2024-01-02'));
      expect(result.authorId).toBe('author-123');
      expect(result.type).toBe('EXPERIENCE');
      expect(result.personId).toBe('person-456');
    });

    it('should return correct structure with upvotes and downvotes properties', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [{ voteType: 'UPVOTE' }, { voteType: 'UPVOTE' }, { voteType: 'DOWNVOTE' }],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result).toEqual({
        id: '1',
        title: 'Test Post',
        content: 'Content',
        upvotes: 2,
        downvotes: 1,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle votes with additional properties', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [
          { voteType: 'UPVOTE', userId: 'user-1', createdAt: new Date() },
          { voteType: 'DOWNVOTE', userId: 'user-2', createdAt: new Date() },
        ],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.upvotes).toBe(1);
      expect(result.downvotes).toBe(1);
    });

    it('should ignore invalid vote types', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [
          { voteType: 'UPVOTE' },
          { voteType: 'INVALID' },
          { voteType: 'DOWNVOTE' },
          { voteType: 'OTHER' },
        ],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.upvotes).toBe(1);
      expect(result.downvotes).toBe(1);
    });

    it('should handle posts with nested objects', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        author: {
          id: 'author-1',
          name: 'Test Author',
        },
        person: {
          id: 'person-1',
          name: 'Test Person',
        },
        votes: [{ voteType: 'UPVOTE' }],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.author).toEqual({ id: 'author-1', name: 'Test Author' });
      expect(result.person).toEqual({ id: 'person-1', name: 'Test Person' });
      expect(result.upvotes).toBe(1);
      expect(result.downvotes).toBe(0);
    });

    it('should handle posts with array properties besides votes', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        tags: ['tag1', 'tag2'],
        comments: [{ id: 'c1' }, { id: 'c2' }],
        votes: [{ voteType: 'UPVOTE' }],
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.tags).toEqual(['tag1', 'tag2']);
      expect(result.comments).toEqual([{ id: 'c1' }, { id: 'c2' }]);
    });

    it('should not mutate the original post object', () => {
      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes: [{ voteType: 'UPVOTE' }],
      };

      const originalVotesLength = mockPost.votes.length;
      transformPostWithVoteCounts(mockPost);

      expect(mockPost.votes).toBeDefined();
      expect(mockPost.votes.length).toBe(originalVotesLength);
      expect(mockPost).not.toHaveProperty('upvotes');
      expect(mockPost).not.toHaveProperty('downvotes');
    });

    it('should handle large number of votes', () => {
      const votes = [];
      for (let i = 0; i < 1000; i++) {
        votes.push({ voteType: i % 3 === 0 ? 'DOWNVOTE' : 'UPVOTE' });
      }

      const mockPost = {
        id: '1',
        title: 'Test Post',
        content: 'Content',
        votes,
      };

      const result = transformPostWithVoteCounts(mockPost);

      expect(result.upvotes).toBe(666);
      expect(result.downvotes).toBe(334);
    });
  });
});
