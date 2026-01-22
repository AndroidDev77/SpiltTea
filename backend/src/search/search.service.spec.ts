import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../common/prisma/prisma.service';

describe('SearchService', () => {
  let service: SearchService;

  const mockPrismaService = {
    person: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    post: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('maskPhoneNumber helper', () => {
    it('should mask phone number showing only last 4 digits', async () => {
      const mockPerson = {
        id: '1',
        name: 'Test Person',
        phoneNumber: '5551234567',
        city: 'Austin',
        state: 'TX',
        _count: { posts: 2 },
      };

      mockPrismaService.person.findMany.mockResolvedValue([mockPerson]);
      mockPrismaService.person.count.mockResolvedValue(1);

      const result = await service.searchPersons({ query: 'Test' });

      expect(result.persons[0].phoneNumber).toBe('******4567');
    });

    it('should handle phone number with formatting characters', async () => {
      const mockPerson = {
        id: '1',
        name: 'Test Person',
        phoneNumber: '(555) 123-4567',
        city: 'Austin',
        state: 'TX',
        _count: { posts: 2 },
      };

      mockPrismaService.person.findMany.mockResolvedValue([mockPerson]);
      mockPrismaService.person.count.mockResolvedValue(1);

      const result = await service.searchPersons({ query: 'Test' });

      // After removing non-digits, we have 10 digits, so 6 asterisks + 4 visible
      expect(result.persons[0].phoneNumber).toBe('******4567');
    });

    it('should return null for null phone number', async () => {
      const mockPerson = {
        id: '1',
        name: 'Test Person',
        phoneNumber: null,
        city: 'Austin',
        state: 'TX',
        _count: { posts: 2 },
      };

      mockPrismaService.person.findMany.mockResolvedValue([mockPerson]);
      mockPrismaService.person.count.mockResolvedValue(1);

      const result = await service.searchPersons({ query: 'Test' });

      expect(result.persons[0].phoneNumber).toBeNull();
    });

    it('should return null for undefined phone number', async () => {
      const mockPerson = {
        id: '1',
        name: 'Test Person',
        phoneNumber: undefined,
        city: 'Austin',
        state: 'TX',
        _count: { posts: 2 },
      };

      mockPrismaService.person.findMany.mockResolvedValue([mockPerson]);
      mockPrismaService.person.count.mockResolvedValue(1);

      const result = await service.searchPersons({ query: 'Test' });

      expect(result.persons[0].phoneNumber).toBeNull();
    });

    it('should not mask phone numbers shorter than 6 digits', async () => {
      const mockPerson = {
        id: '1',
        name: 'Test Person',
        phoneNumber: '12345',
        city: 'Austin',
        state: 'TX',
        _count: { posts: 2 },
      };

      mockPrismaService.person.findMany.mockResolvedValue([mockPerson]);
      mockPrismaService.person.count.mockResolvedValue(1);

      const result = await service.searchPersons({ query: 'Test' });

      expect(result.persons[0].phoneNumber).toBe('12345');
    });

    it('should mask exactly 6 digit phone numbers', async () => {
      const mockPerson = {
        id: '1',
        name: 'Test Person',
        phoneNumber: '123456',
        city: 'Austin',
        state: 'TX',
        _count: { posts: 2 },
      };

      mockPrismaService.person.findMany.mockResolvedValue([mockPerson]);
      mockPrismaService.person.count.mockResolvedValue(1);

      const result = await service.searchPersons({ query: 'Test' });

      expect(result.persons[0].phoneNumber).toBe('**3456');
    });
  });

  describe('searchPersons', () => {
    const createMockPerson = (overrides = {}) => ({
      id: '1',
      name: 'John Doe',
      aliases: ['Johnny'],
      phoneNumber: '5551234567',
      city: 'Austin',
      state: 'TX',
      isVerified: true,
      createdAt: new Date('2024-01-01'),
      _count: { posts: 5 },
      ...overrides,
    });

    it('should search persons with general query', async () => {
      const mockPersons = [createMockPerson()];
      mockPrismaService.person.findMany.mockResolvedValue(mockPersons);
      mockPrismaService.person.count.mockResolvedValue(1);

      const result = await service.searchPersons({ query: 'John' });

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
          where: {
            AND: [
              {
                OR: [
                  { name: { contains: 'John', mode: 'insensitive' } },
                  { aliases: { has: 'John' } },
                  { city: { contains: 'John', mode: 'insensitive' } },
                ],
              },
            ],
          },
        }),
      );
      expect(result.persons).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should search persons by name filter', async () => {
      const mockPersons = [createMockPerson()];
      mockPrismaService.person.findMany.mockResolvedValue(mockPersons);
      mockPrismaService.person.count.mockResolvedValue(1);

      await service.searchPersons({ name: 'John' });

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [{ name: { contains: 'John', mode: 'insensitive' } }],
          },
        }),
      );
    });

    it('should search persons by phone number filter', async () => {
      const mockPersons = [createMockPerson()];
      mockPrismaService.person.findMany.mockResolvedValue(mockPersons);
      mockPrismaService.person.count.mockResolvedValue(1);

      await service.searchPersons({ phoneNumber: '(555) 123-4567' });

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [{ phoneNumber: { contains: '5551234567' } }],
          },
        }),
      );
    });

    it('should search persons by city filter', async () => {
      const mockPersons = [createMockPerson()];
      mockPrismaService.person.findMany.mockResolvedValue(mockPersons);
      mockPrismaService.person.count.mockResolvedValue(1);

      await service.searchPersons({ city: 'Austin' });

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [{ city: { contains: 'Austin', mode: 'insensitive' } }],
          },
        }),
      );
    });

    it('should search persons by state filter', async () => {
      const mockPersons = [createMockPerson()];
      mockPrismaService.person.findMany.mockResolvedValue(mockPersons);
      mockPrismaService.person.count.mockResolvedValue(1);

      await service.searchPersons({ state: 'TX' });

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [{ state: { contains: 'TX', mode: 'insensitive' } }],
          },
        }),
      );
    });

    it('should combine multiple filters', async () => {
      const mockPersons = [createMockPerson()];
      mockPrismaService.person.findMany.mockResolvedValue(mockPersons);
      mockPrismaService.person.count.mockResolvedValue(1);

      await service.searchPersons({
        query: 'John',
        name: 'Doe',
        city: 'Austin',
        state: 'TX',
      });

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              {
                OR: [
                  { name: { contains: 'John', mode: 'insensitive' } },
                  { aliases: { has: 'John' } },
                  { city: { contains: 'John', mode: 'insensitive' } },
                ],
              },
              { name: { contains: 'Doe', mode: 'insensitive' } },
              { city: { contains: 'Austin', mode: 'insensitive' } },
              { state: { contains: 'TX', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });

    it('should use default pagination values', async () => {
      mockPrismaService.person.findMany.mockResolvedValue([]);
      mockPrismaService.person.count.mockResolvedValue(0);

      await service.searchPersons({});

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        }),
      );
    });

    it('should apply custom pagination', async () => {
      mockPrismaService.person.findMany.mockResolvedValue([]);
      mockPrismaService.person.count.mockResolvedValue(100);

      const result = await service.searchPersons({ skip: 20, take: 10 });

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        }),
      );
      expect(result.page).toBe(3); // skip 20 / take 10 + 1 = 3
      expect(result.totalPages).toBe(10); // ceil(100 / 10) = 10
    });

    it('should calculate page and totalPages correctly', async () => {
      mockPrismaService.person.findMany.mockResolvedValue([]);
      mockPrismaService.person.count.mockResolvedValue(55);

      const result = await service.searchPersons({ skip: 40, take: 20 });

      expect(result.page).toBe(3); // floor(40 / 20) + 1 = 3
      expect(result.totalPages).toBe(3); // ceil(55 / 20) = 3
    });

    it('should return empty where clause when no filters provided', async () => {
      mockPrismaService.person.findMany.mockResolvedValue([]);
      mockPrismaService.person.count.mockResolvedValue(0);

      await service.searchPersons({});

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });

    it('should include post count and order by isVerified and createdAt', async () => {
      mockPrismaService.person.findMany.mockResolvedValue([]);
      mockPrismaService.person.count.mockResolvedValue(0);

      await service.searchPersons({});

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            _count: {
              select: {
                posts: true,
              },
            },
          },
          orderBy: [{ isVerified: 'desc' }, { createdAt: 'desc' }],
        }),
      );
    });
  });

  describe('searchPosts', () => {
    const createMockPost = (overrides = {}) => ({
      id: '1',
      title: 'Test Post Title',
      content: 'Test post content here',
      isPublished: true,
      createdAt: new Date('2024-01-01'),
      author: {
        id: 'user1',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        profileImageUrl: null,
      },
      person: {
        id: 'person1',
        name: 'John Doe',
        phoneNumber: '5551234567',
      },
      _count: {
        votes: 10,
        comments: 5,
      },
      votes: [{ voteType: 'UPVOTE' }, { voteType: 'UPVOTE' }, { voteType: 'DOWNVOTE' }],
      ...overrides,
    });

    it('should search posts by query', async () => {
      const mockPosts = [createMockPost()];
      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(1);

      const result = await service.searchPosts('Test');

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isPublished: true,
            OR: [
              { title: { contains: 'Test', mode: 'insensitive' } },
              { content: { contains: 'Test', mode: 'insensitive' } },
            ],
          },
        }),
      );
      expect(result.posts).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should transform post with vote counts', async () => {
      const mockPosts = [createMockPost()];
      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(1);

      const result = await service.searchPosts('Test');

      expect(result.posts[0].upvotes).toBe(2);
      expect(result.posts[0].downvotes).toBe(1);
      expect(result.posts[0]).not.toHaveProperty('votes');
    });

    it('should mask person phone number in posts', async () => {
      const mockPosts = [createMockPost()];
      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(1);

      const result = await service.searchPosts('Test');

      expect(result.posts[0].person.phoneNumber).toBe('******4567');
    });

    it('should handle null person in posts', async () => {
      const mockPosts = [createMockPost({ person: null })];
      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(1);

      const result = await service.searchPosts('Test');

      expect(result.posts[0].person).toBeNull();
    });

    it('should use default pagination values', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(0);

      await service.searchPosts('Test');

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        }),
      );
    });

    it('should apply custom pagination', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(100);

      const result = await service.searchPosts('Test', 30, 15);

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 30,
          take: 15,
        }),
      );
      expect(result.page).toBe(3); // floor(30 / 15) + 1 = 3
      expect(result.totalPages).toBe(7); // ceil(100 / 15) = 7
    });

    it('should order posts by createdAt descending', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(0);

      await service.searchPosts('Test');

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            createdAt: 'desc',
          },
        }),
      );
    });

    it('should include author and person relations', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(0);

      await service.searchPosts('Test');

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                profileImageUrl: true,
              },
            },
            person: true,
          }),
        }),
      );
    });
  });

  describe('searchUsers', () => {
    const createMockUser = (overrides = {}) => ({
      id: '1',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      bio: 'A test user bio',
      profileImageUrl: null,
      createdAt: new Date('2024-01-01'),
      ...overrides,
    });

    it('should search users by query', async () => {
      const mockUsers = [createMockUser()];
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);
      mockPrismaService.user.count.mockResolvedValue(1);

      const result = await service.searchUsers('test');

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { username: { contains: 'test', mode: 'insensitive' } },
              { firstName: { contains: 'test', mode: 'insensitive' } },
              { lastName: { contains: 'test', mode: 'insensitive' } },
            ],
            isActive: true,
            isBanned: false,
          },
        }),
      );
      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should use default pagination values', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.count.mockResolvedValue(0);

      await service.searchUsers('test');

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        }),
      );
    });

    it('should apply custom pagination', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.count.mockResolvedValue(50);

      const result = await service.searchUsers('test', 10, 5);

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 5,
        }),
      );
      expect(result.page).toBe(3); // floor(10 / 5) + 1 = 3
      expect(result.totalPages).toBe(10); // ceil(50 / 5) = 10
    });

    it('should select only safe user fields', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.count.mockResolvedValue(0);

      await service.searchUsers('test');

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            bio: true,
            profileImageUrl: true,
            createdAt: true,
          },
        }),
      );
    });

    it('should filter for active non-banned users only', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.count.mockResolvedValue(0);

      await service.searchUsers('test');

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
            isBanned: false,
          }),
        }),
      );
    });

    it('should order users by createdAt descending', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.count.mockResolvedValue(0);

      await service.searchUsers('test');

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            createdAt: 'desc',
          },
        }),
      );
    });
  });

  describe('searchAll', () => {
    it('should return unified search results for persons', async () => {
      const mockPersons = [
        {
          id: '1',
          name: 'John Doe',
          phoneNumber: '5551234567',
          city: 'Austin',
          state: 'TX',
          _count: { posts: 5 },
        },
      ];
      mockPrismaService.person.findMany.mockResolvedValue(mockPersons);
      mockPrismaService.person.count.mockResolvedValue(1);

      const result = await service.searchAll('John');

      expect(result.persons).toHaveLength(1);
      expect(result.totals.persons).toBe(1);
    });

    it('should use default take of 10', async () => {
      mockPrismaService.person.findMany.mockResolvedValue([]);
      mockPrismaService.person.count.mockResolvedValue(0);

      await service.searchAll('test');

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        }),
      );
    });

    it('should allow custom take parameter', async () => {
      mockPrismaService.person.findMany.mockResolvedValue([]);
      mockPrismaService.person.count.mockResolvedValue(0);

      await service.searchAll('test', 5);

      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });

    it('should mask phone numbers in results', async () => {
      const mockPersons = [
        {
          id: '1',
          name: 'John Doe',
          phoneNumber: '5551234567',
          city: 'Austin',
          state: 'TX',
          _count: { posts: 5 },
        },
      ];
      mockPrismaService.person.findMany.mockResolvedValue(mockPersons);
      mockPrismaService.person.count.mockResolvedValue(1);

      const result = await service.searchAll('John');

      expect(result.persons[0].phoneNumber).toBe('******4567');
    });
  });

  describe('edge cases', () => {
    it('should handle empty search results', async () => {
      mockPrismaService.person.findMany.mockResolvedValue([]);
      mockPrismaService.person.count.mockResolvedValue(0);

      const result = await service.searchPersons({ query: 'nonexistent' });

      expect(result.persons).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(0);
    });

    it('should handle multiple persons with various phone number formats', async () => {
      const mockPersons = [
        { id: '1', name: 'Person 1', phoneNumber: '5551234567', _count: { posts: 1 } },
        { id: '2', name: 'Person 2', phoneNumber: null, _count: { posts: 2 } },
        { id: '3', name: 'Person 3', phoneNumber: '123', _count: { posts: 3 } },
        { id: '4', name: 'Person 4', phoneNumber: '9999999999', _count: { posts: 4 } },
      ];
      mockPrismaService.person.findMany.mockResolvedValue(mockPersons);
      mockPrismaService.person.count.mockResolvedValue(4);

      const result = await service.searchPersons({});

      expect(result.persons[0].phoneNumber).toBe('******4567');
      expect(result.persons[1].phoneNumber).toBeNull();
      expect(result.persons[2].phoneNumber).toBe('123'); // Too short to mask
      expect(result.persons[3].phoneNumber).toBe('******9999');
    });

    it('should handle empty string phone number', async () => {
      const mockPerson = {
        id: '1',
        name: 'Test Person',
        phoneNumber: '',
        _count: { posts: 1 },
      };
      mockPrismaService.person.findMany.mockResolvedValue([mockPerson]);
      mockPrismaService.person.count.mockResolvedValue(1);

      const result = await service.searchPersons({});

      expect(result.persons[0].phoneNumber).toBeNull();
    });
  });
});
