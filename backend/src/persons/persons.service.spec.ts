import { Test, TestingModule } from '@nestjs/testing';
import { PersonsService } from './persons.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole, Gender } from '@prisma/client';

describe('PersonsService', () => {
  let service: PersonsService;

  const mockPrismaService = {
    person: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    post: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<PersonsService>(PersonsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createdById = 'user-123';
    const createPersonDto = {
      name: 'John Doe',
      aliases: ['JD', 'Johnny'],
      approximateAge: 30,
      gender: Gender.MALE,
      phoneNumber: '+1234567890',
      city: 'New York',
      state: 'NY',
      country: 'USA',
    };

    it('should create a person successfully', async () => {
      const expectedResult = {
        id: 'person-123',
        ...createPersonDto,
        createdById,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        profileImageUrl: null,
        _count: { posts: 0 },
      };

      mockPrismaService.person.create.mockResolvedValue(expectedResult);

      const result = await service.create(createdById, createPersonDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.person.create).toHaveBeenCalledWith({
        data: {
          ...createPersonDto,
          createdById,
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });
    });

    it('should create a person with minimal data', async () => {
      const minimalDto = { name: 'Jane Doe' };
      const expectedResult = {
        id: 'person-456',
        name: 'Jane Doe',
        createdById,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        _count: { posts: 0 },
      };

      mockPrismaService.person.create.mockResolvedValue(expectedResult);

      const result = await service.create(createdById, minimalDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.person.create).toHaveBeenCalledWith({
        data: {
          name: 'Jane Doe',
          createdById,
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });
    });
  });

  describe('search', () => {
    const mockPersons = [
      {
        id: 'person-1',
        name: 'John Doe',
        aliases: ['JD'],
        city: 'New York',
        _count: { posts: 5 },
      },
      {
        id: 'person-2',
        name: 'Jane Doe',
        aliases: [],
        city: 'Los Angeles',
        _count: { posts: 3 },
      },
    ];

    it('should search persons with default pagination', async () => {
      mockPrismaService.person.findMany.mockResolvedValue(mockPersons);
      mockPrismaService.person.count.mockResolvedValue(2);

      const result = await service.search('Doe');

      expect(result).toEqual({
        persons: mockPersons,
        total: 2,
        page: 1,
        totalPages: 1,
      });
      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: {
          OR: [
            { name: { contains: 'Doe', mode: 'insensitive' } },
            { aliases: { has: 'Doe' } },
            { city: { contains: 'Doe', mode: 'insensitive' } },
          ],
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should search persons with custom pagination', async () => {
      mockPrismaService.person.findMany.mockResolvedValue([mockPersons[1]]);
      mockPrismaService.person.count.mockResolvedValue(25);

      const result = await service.search('test', 10, 10);

      expect(result).toEqual({
        persons: [mockPersons[1]],
        total: 25,
        page: 2,
        totalPages: 3,
      });
      expect(mockPrismaService.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it('should return empty results when no matches found', async () => {
      mockPrismaService.person.findMany.mockResolvedValue([]);
      mockPrismaService.person.count.mockResolvedValue(0);

      const result = await service.search('nonexistent');

      expect(result).toEqual({
        persons: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });
    });
  });

  describe('findOne', () => {
    const mockPerson = {
      id: 'person-123',
      name: 'John Doe',
      aliases: ['JD'],
      city: 'New York',
      createdBy: {
        id: 'user-123',
        username: 'johncreator',
      },
      _count: {
        posts: 5,
        vettingRequests: 2,
      },
    };

    it('should return a person by id', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(mockPerson);

      const result = await service.findOne('person-123');

      expect(result).toEqual(mockPerson);
      expect(mockPrismaService.person.findUnique).toHaveBeenCalledWith({
        where: { id: 'person-123' },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
            },
          },
          _count: {
            select: {
              posts: true,
              vettingRequests: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException when person not found', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('nonexistent-id')).rejects.toThrow('Person not found');
    });
  });

  describe('findPersonPosts', () => {
    const mockPerson = {
      id: 'person-123',
      name: 'John Doe',
    };

    const mockPosts = [
      {
        id: 'post-1',
        title: 'Post about John',
        personId: 'person-123',
        isPublished: true,
        author: {
          id: 'user-1',
          username: 'author1',
          firstName: 'Author',
          lastName: 'One',
          profileImageUrl: null,
        },
        _count: { votes: 10, comments: 5 },
        votes: [{ voteType: 'UPVOTE' }, { voteType: 'UPVOTE' }, { voteType: 'DOWNVOTE' }],
      },
      {
        id: 'post-2',
        title: 'Another post',
        personId: 'person-123',
        isPublished: true,
        author: {
          id: 'user-2',
          username: 'author2',
          firstName: 'Author',
          lastName: 'Two',
          profileImageUrl: 'http://example.com/pic.jpg',
        },
        _count: { votes: 5, comments: 2 },
        votes: [{ voteType: 'UPVOTE' }],
      },
    ];

    it('should return person posts with vote transformation', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(mockPerson);
      mockPrismaService.post.findMany.mockResolvedValue(mockPosts);
      mockPrismaService.post.count.mockResolvedValue(2);

      const result = await service.findPersonPosts('person-123');

      expect(result.person).toEqual(mockPerson);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.posts).toHaveLength(2);
      expect(result.posts[0]).toHaveProperty('upvotes', 2);
      expect(result.posts[0]).toHaveProperty('downvotes', 1);
      expect(result.posts[0]).not.toHaveProperty('votes');
      expect(result.posts[1]).toHaveProperty('upvotes', 1);
      expect(result.posts[1]).toHaveProperty('downvotes', 0);
    });

    it('should return person posts with custom pagination', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(mockPerson);
      mockPrismaService.post.findMany.mockResolvedValue([mockPosts[1]]);
      mockPrismaService.post.count.mockResolvedValue(25);

      const result = await service.findPersonPosts('person-123', 10, 10);

      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(3);
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it('should throw NotFoundException when person not found', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(null);

      await expect(service.findPersonPosts('nonexistent-id')).rejects.toThrow(NotFoundException);
      await expect(service.findPersonPosts('nonexistent-id')).rejects.toThrow('Person not found');
    });

    it('should return empty posts array when person has no posts', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(mockPerson);
      mockPrismaService.post.findMany.mockResolvedValue([]);
      mockPrismaService.post.count.mockResolvedValue(0);

      const result = await service.findPersonPosts('person-123');

      expect(result.posts).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('update', () => {
    const personId = 'person-123';
    const creatorId = 'user-creator';
    const adminId = 'user-admin';
    const otherId = 'user-other';

    const existingPerson = {
      id: personId,
      name: 'John Doe',
      createdById: creatorId,
    };

    const updateDto = {
      name: 'John Updated',
      city: 'Boston',
    };

    it('should allow admin to update any person', async () => {
      const updatedPerson = {
        ...existingPerson,
        ...updateDto,
        _count: { posts: 5 },
      };

      mockPrismaService.person.findUnique.mockResolvedValue(existingPerson);
      mockPrismaService.person.update.mockResolvedValue(updatedPerson);

      const result = await service.update(personId, adminId, UserRole.ADMIN, updateDto);

      expect(result).toEqual(updatedPerson);
      expect(mockPrismaService.person.update).toHaveBeenCalledWith({
        where: { id: personId },
        data: updateDto,
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });
    });

    it('should allow creator to update their own person', async () => {
      const updatedPerson = {
        ...existingPerson,
        ...updateDto,
        _count: { posts: 5 },
      };

      mockPrismaService.person.findUnique.mockResolvedValue(existingPerson);
      mockPrismaService.person.update.mockResolvedValue(updatedPerson);

      const result = await service.update(personId, creatorId, UserRole.USER, updateDto);

      expect(result).toEqual(updatedPerson);
      expect(mockPrismaService.person.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when non-creator non-admin tries to update', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(existingPerson);

      await expect(service.update(personId, otherId, UserRole.USER, updateDto)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.update(personId, otherId, UserRole.USER, updateDto)).rejects.toThrow(
        'You do not have permission to update this person',
      );
    });

    it('should throw ForbiddenException when moderator (non-admin) tries to update others person', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(existingPerson);

      await expect(
        service.update(personId, otherId, UserRole.MODERATOR, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when person not found', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(null);

      await expect(
        service.update('nonexistent-id', adminId, UserRole.ADMIN, updateDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update('nonexistent-id', adminId, UserRole.ADMIN, updateDto),
      ).rejects.toThrow('Person not found');
    });

    it('should allow admin to set isVerified', async () => {
      const updateWithVerified = { ...updateDto, isVerified: true };
      const updatedPerson = {
        ...existingPerson,
        ...updateWithVerified,
        _count: { posts: 5 },
      };

      mockPrismaService.person.findUnique.mockResolvedValue(existingPerson);
      mockPrismaService.person.update.mockResolvedValue(updatedPerson);

      await service.update(personId, adminId, UserRole.ADMIN, updateWithVerified);

      expect(mockPrismaService.person.update).toHaveBeenCalledWith({
        where: { id: personId },
        data: updateWithVerified,
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });
    });

    it('should strip isVerified when non-admin tries to set it', async () => {
      const updateWithVerified = { name: 'Updated Name', isVerified: true };
      const updatedPerson = {
        ...existingPerson,
        name: 'Updated Name',
        _count: { posts: 5 },
      };

      mockPrismaService.person.findUnique.mockResolvedValue(existingPerson);
      mockPrismaService.person.update.mockResolvedValue(updatedPerson);

      await service.update(personId, creatorId, UserRole.USER, updateWithVerified);

      // isVerified should be stripped from the update data
      expect(mockPrismaService.person.update).toHaveBeenCalledWith({
        where: { id: personId },
        data: { name: 'Updated Name' },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });
    });
  });

  describe('remove', () => {
    const personId = 'person-123';
    const creatorId = 'user-creator';
    const adminId = 'user-admin';

    const existingPerson = {
      id: personId,
      name: 'John Doe',
      createdById: creatorId,
    };

    it('should allow admin to delete a person', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(existingPerson);
      mockPrismaService.person.delete.mockResolvedValue(existingPerson);

      const result = await service.remove(personId, adminId, UserRole.ADMIN);

      expect(result).toEqual({ message: 'Person deleted successfully' });
      expect(mockPrismaService.person.delete).toHaveBeenCalledWith({
        where: { id: personId },
      });
    });

    it('should throw ForbiddenException when non-admin tries to delete', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(existingPerson);

      await expect(service.remove(personId, creatorId, UserRole.USER)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.remove(personId, creatorId, UserRole.USER)).rejects.toThrow(
        'Only admins can delete persons',
      );
    });

    it('should throw ForbiddenException when creator (non-admin) tries to delete their own person', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(existingPerson);

      await expect(service.remove(personId, creatorId, UserRole.USER)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when moderator tries to delete', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(existingPerson);

      await expect(service.remove(personId, creatorId, UserRole.MODERATOR)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when person not found', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id', adminId, UserRole.ADMIN)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove('nonexistent-id', adminId, UserRole.ADMIN)).rejects.toThrow(
        'Person not found',
      );
    });
  });
});
