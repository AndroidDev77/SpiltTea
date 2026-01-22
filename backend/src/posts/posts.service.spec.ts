import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostType, Gender, VoteType } from '@prisma/client';

describe('PostsService', () => {
  let service: PostsService;

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    vote: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockAuthor = {
    id: 'author-123',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    profileImageUrl: null,
  };

  const mockPerson = {
    id: 'person-456',
    name: 'John Doe',
    approximateAge: 30,
    gender: Gender.MALE,
    city: 'New York',
    state: 'NY',
    profileImageUrl: null,
    isVerified: false,
  };

  const mockPost = {
    id: 'post-789',
    authorId: 'author-123',
    type: PostType.EXPERIENCE,
    title: 'Test Post',
    content: 'Test content',
    personId: 'person-456',
    personName: null,
    personAge: null,
    personGender: null,
    personLocation: null,
    evidenceUrls: [],
    isAnonymous: false,
    isPublished: true,
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: mockAuthor,
    person: mockPerson,
  };

  const mockPostWithVotes = {
    ...mockPost,
    votes: [{ voteType: 'UPVOTE' }, { voteType: 'UPVOTE' }, { voteType: 'DOWNVOTE' }],
    _count: {
      votes: 3,
      comments: 5,
      reviews: 2,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPostDto = {
      type: PostType.EXPERIENCE,
      title: 'Test Post',
      content: 'Test content',
      personId: 'person-456',
    };

    it('should create a post successfully', async () => {
      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.create('author-123', createPostDto);

      expect(result).toEqual(mockPost);
      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: {
          ...createPostDto,
          authorId: 'author-123',
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
          person: {
            select: {
              id: true,
              name: true,
              approximateAge: true,
              gender: true,
              city: true,
              state: true,
              profileImageUrl: true,
              isVerified: true,
            },
          },
        },
      });
    });

    it('should create a post without personId', async () => {
      const createPostDtoWithoutPerson = {
        type: PostType.WARNING,
        title: 'Warning Post',
        content: 'Warning content',
        personName: 'Jane Doe',
        personAge: 25,
        personGender: Gender.FEMALE,
        personLocation: 'Los Angeles, CA',
      };

      const postWithoutPerson = {
        ...mockPost,
        personId: null,
        person: null,
        personName: 'Jane Doe',
        personAge: 25,
        personGender: Gender.FEMALE,
        personLocation: 'Los Angeles, CA',
      };

      mockPrismaService.post.create.mockResolvedValue(postWithoutPerson);

      const result = await service.create('author-123', createPostDtoWithoutPerson);

      expect(result).toEqual(postWithoutPerson);
      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: {
          ...createPostDtoWithoutPerson,
          authorId: 'author-123',
        },
        include: expect.any(Object),
      });
    });

    it('should create an anonymous post', async () => {
      const anonymousPostDto = {
        ...createPostDto,
        isAnonymous: true,
      };

      const anonymousPost = {
        ...mockPost,
        isAnonymous: true,
      };

      mockPrismaService.post.create.mockResolvedValue(anonymousPost);

      const result = await service.create('author-123', anonymousPostDto);

      expect(result.isAnonymous).toBe(true);
    });
  });

  describe('findAll', () => {
    it('should return paginated posts with default params', async () => {
      const mockPosts = [mockPostWithVotes];
      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result).toEqual({
        posts: [
          {
            ...mockPost,
            _count: mockPostWithVotes._count,
            upvotes: 2,
            downvotes: 1,
          },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
      });
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: { isPublished: true },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter posts by type', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([mockPostWithVotes]);
      mockPrismaService.post.count.mockResolvedValue(1);

      await service.findAll({ type: PostType.EXPERIENCE });

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isPublished: true, type: PostType.EXPERIENCE },
        }),
      );
    });

    it('should filter posts by authorId', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([mockPostWithVotes]);
      mockPrismaService.post.count.mockResolvedValue(1);

      await service.findAll({ authorId: 'author-123' });

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isPublished: true, authorId: 'author-123' },
        }),
      );
    });

    it('should apply pagination with skip and take', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(50);

      const result = await service.findAll({ skip: 20, take: 10 });

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        }),
      );
      expect(result.page).toBe(3);
      expect(result.totalPages).toBe(5);
    });

    it('should combine type and authorId filters', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(0);

      await service.findAll({
        type: PostType.WARNING,
        authorId: 'author-123',
      });

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isPublished: true,
            type: PostType.WARNING,
            authorId: 'author-123',
          },
        }),
      );
    });

    it('should return empty list when no posts found', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(0);

      const result = await service.findAll({});

      expect(result.posts).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a post and increment view count', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPostWithVotes);
      mockPrismaService.post.update.mockResolvedValue({ ...mockPost, viewCount: 1 });

      const result = await service.findOne('post-789');

      expect(result).toEqual({
        ...mockPost,
        _count: mockPostWithVotes._count,
        upvotes: 2,
        downvotes: 1,
      });
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 'post-789' },
        include: expect.objectContaining({
          author: expect.any(Object),
          person: expect.any(Object),
          _count: expect.any(Object),
          votes: expect.any(Object),
        }),
      });
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: 'post-789' },
        data: { viewCount: { increment: 1 } },
      });
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.post.update).not.toHaveBeenCalled();
    });

    it('should include reviews count in _count', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPostWithVotes);
      mockPrismaService.post.update.mockResolvedValue(mockPost);

      await service.findOne('post-789');

      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 'post-789' },
        include: expect.objectContaining({
          _count: {
            select: {
              votes: true,
              comments: true,
              reviews: true,
            },
          },
        }),
      });
    });
  });

  describe('update', () => {
    const updatePostDto = {
      title: 'Updated Title',
      content: 'Updated content',
    };

    it('should update post when user is owner', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue({
        ...mockPost,
        ...updatePostDto,
      });

      const result = await service.update('post-789', 'author-123', updatePostDto);

      expect(result.title).toBe('Updated Title');
      expect(result.content).toBe('Updated content');
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: 'post-789' },
        data: updatePostDto,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent-id', 'author-123', updatePostDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.post.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      await expect(service.update('post-789', 'other-user-id', updatePostDto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockPrismaService.post.update).not.toHaveBeenCalled();
    });

    it('should update partial fields', async () => {
      const partialUpdate = { title: 'Only Title Updated' };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue({
        ...mockPost,
        ...partialUpdate,
      });

      const result = await service.update('post-789', 'author-123', partialUpdate);

      expect(result.title).toBe('Only Title Updated');
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: 'post-789' },
        data: partialUpdate,
        include: expect.any(Object),
      });
    });

    it('should update isPublished field', async () => {
      const publishUpdate = { isPublished: false };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue({
        ...mockPost,
        isPublished: false,
      });

      const result = await service.update('post-789', 'author-123', publishUpdate);

      expect(result.isPublished).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete post when user is owner', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await service.remove('post-789', 'author-123');

      expect(result).toEqual({ message: 'Post deleted successfully' });
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { id: 'post-789' },
      });
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id', 'author-123')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.post.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      await expect(service.remove('post-789', 'other-user-id')).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.post.delete).not.toHaveBeenCalled();
    });
  });

  describe('votePost', () => {
    const postId = 'post-789';
    const userId = 'user-123';

    it('should create a new upvote when no existing vote', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.vote.findUnique.mockResolvedValue(null);
      mockPrismaService.vote.create.mockResolvedValue({
        id: 'vote-1',
        userId,
        postId,
        voteType: VoteType.UPVOTE,
      });

      const result = await service.votePost(postId, userId, 'UPVOTE');

      expect(result).toEqual({ voteType: 'UPVOTE', message: 'Vote created' });
      expect(mockPrismaService.vote.create).toHaveBeenCalledWith({
        data: {
          userId,
          postId,
          voteType: 'UPVOTE',
        },
      });
    });

    it('should create a new downvote when no existing vote', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.vote.findUnique.mockResolvedValue(null);
      mockPrismaService.vote.create.mockResolvedValue({
        id: 'vote-1',
        userId,
        postId,
        voteType: VoteType.DOWNVOTE,
      });

      const result = await service.votePost(postId, userId, 'DOWNVOTE');

      expect(result).toEqual({ voteType: 'DOWNVOTE', message: 'Vote created' });
    });

    it('should remove vote when same vote type is submitted (toggle off)', async () => {
      const existingVote = {
        id: 'vote-1',
        userId,
        postId,
        voteType: VoteType.UPVOTE,
      };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.vote.findUnique.mockResolvedValue(existingVote);
      mockPrismaService.vote.delete.mockResolvedValue(existingVote);

      const result = await service.votePost(postId, userId, 'UPVOTE');

      expect(result).toEqual({ voteType: null, message: 'Vote removed' });
      expect(mockPrismaService.vote.delete).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    });

    it('should update vote when different vote type is submitted', async () => {
      const existingVote = {
        id: 'vote-1',
        userId,
        postId,
        voteType: VoteType.UPVOTE,
      };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.vote.findUnique.mockResolvedValue(existingVote);
      mockPrismaService.vote.update.mockResolvedValue({
        ...existingVote,
        voteType: VoteType.DOWNVOTE,
      });

      const result = await service.votePost(postId, userId, 'DOWNVOTE');

      expect(result).toEqual({ voteType: 'DOWNVOTE', message: 'Vote updated' });
      expect(mockPrismaService.vote.update).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        data: { voteType: 'DOWNVOTE' },
      });
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.votePost(postId, userId, 'UPVOTE')).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.vote.findUnique).not.toHaveBeenCalled();
    });

    it('should change from downvote to upvote', async () => {
      const existingVote = {
        id: 'vote-1',
        userId,
        postId,
        voteType: VoteType.DOWNVOTE,
      };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.vote.findUnique.mockResolvedValue(existingVote);
      mockPrismaService.vote.update.mockResolvedValue({
        ...existingVote,
        voteType: VoteType.UPVOTE,
      });

      const result = await service.votePost(postId, userId, 'UPVOTE');

      expect(result).toEqual({ voteType: 'UPVOTE', message: 'Vote updated' });
    });

    it('should toggle off downvote', async () => {
      const existingVote = {
        id: 'vote-1',
        userId,
        postId,
        voteType: VoteType.DOWNVOTE,
      };
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.vote.findUnique.mockResolvedValue(existingVote);
      mockPrismaService.vote.delete.mockResolvedValue(existingVote);

      const result = await service.votePost(postId, userId, 'DOWNVOTE');

      expect(result).toEqual({ voteType: null, message: 'Vote removed' });
    });
  });

  describe('getUserVote', () => {
    const postId = 'post-789';
    const userId = 'user-123';

    it('should return upvote when user has upvoted', async () => {
      mockPrismaService.vote.findUnique.mockResolvedValue({
        id: 'vote-1',
        userId,
        postId,
        voteType: VoteType.UPVOTE,
      });

      const result = await service.getUserVote(postId, userId);

      expect(result).toEqual({ voteType: VoteType.UPVOTE });
      expect(mockPrismaService.vote.findUnique).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    });

    it('should return downvote when user has downvoted', async () => {
      mockPrismaService.vote.findUnique.mockResolvedValue({
        id: 'vote-1',
        userId,
        postId,
        voteType: VoteType.DOWNVOTE,
      });

      const result = await service.getUserVote(postId, userId);

      expect(result).toEqual({ voteType: VoteType.DOWNVOTE });
    });

    it('should return null when user has not voted', async () => {
      mockPrismaService.vote.findUnique.mockResolvedValue(null);

      const result = await service.getUserVote(postId, userId);

      expect(result).toEqual({ voteType: null });
    });
  });
});
