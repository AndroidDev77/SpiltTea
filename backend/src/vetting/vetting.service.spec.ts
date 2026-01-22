import { Test, TestingModule } from '@nestjs/testing';
import { VettingService } from './vetting.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { VettingStatus } from '@prisma/client';

describe('VettingService', () => {
  let service: VettingService;

  const mockPrismaService = {
    vettingRequest: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockAuthor = {
    id: 'author-1',
    username: 'testauthor',
    firstName: 'Test',
    lastName: 'Author',
    profileImageUrl: 'https://example.com/author.jpg',
  };

  const mockTargetUser = {
    id: 'target-1',
    username: 'targetuser',
    firstName: 'Target',
    lastName: 'User',
    profileImageUrl: 'https://example.com/target.jpg',
  };

  const mockPost = {
    id: 'post-1',
    title: 'Test Post',
    type: 'VETTING_REQUEST',
  };

  const mockVettingRequest = {
    id: 'vetting-1',
    authorId: 'author-1',
    targetUserId: 'target-1',
    postId: 'post-1',
    targetName: 'John Doe',
    targetAge: 30,
    targetGender: 'MALE',
    targetLocation: 'New York',
    targetDescription: 'Description of target',
    status: VettingStatus.PENDING,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    author: mockAuthor,
    targetUser: mockTargetUser,
    post: mockPost,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VettingService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<VettingService>(VettingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      targetUserId: 'target-1',
      postId: 'post-1',
      targetName: 'John Doe',
      targetAge: 30,
      targetGender: 'MALE' as const,
      targetLocation: 'New York',
      targetDescription: 'Description of target',
    };

    it('should create a vetting request successfully', async () => {
      mockPrismaService.vettingRequest.create.mockResolvedValue(mockVettingRequest);

      const result = await service.create('author-1', createDto);

      expect(result).toEqual(mockVettingRequest);
      expect(mockPrismaService.vettingRequest.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          authorId: 'author-1',
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
          targetUser: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
      });
    });

    it('should create a vetting request with minimal data', async () => {
      const minimalDto = {
        targetName: 'Jane Doe',
      };

      const minimalResult = {
        ...mockVettingRequest,
        id: 'vetting-2',
        targetName: 'Jane Doe',
        targetUserId: null,
        postId: null,
        targetAge: null,
        targetGender: null,
        targetLocation: null,
        targetDescription: null,
        targetUser: null,
        post: null,
      };

      mockPrismaService.vettingRequest.create.mockResolvedValue(minimalResult);

      const result = await service.create('author-1', minimalDto);

      expect(result).toEqual(minimalResult);
      expect(mockPrismaService.vettingRequest.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            ...minimalDto,
            authorId: 'author-1',
          },
        }),
      );
    });
  });

  describe('findAll', () => {
    const mockRequests = [
      mockVettingRequest,
      { ...mockVettingRequest, id: 'vetting-2', targetName: 'Jane Smith' },
    ];

    it('should return paginated vetting requests with default pagination', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue(mockRequests);
      mockPrismaService.vettingRequest.count.mockResolvedValue(2);

      const result = await service.findAll({});

      expect(result).toEqual({
        requests: mockRequests,
        total: 2,
        page: 1,
        totalPages: 1,
      });
      expect(mockPrismaService.vettingRequest.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: {},
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by status', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue([mockVettingRequest]);
      mockPrismaService.vettingRequest.count.mockResolvedValue(1);

      const result = await service.findAll({ status: VettingStatus.PENDING });

      expect(result.requests).toHaveLength(1);
      expect(mockPrismaService.vettingRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: VettingStatus.PENDING },
        }),
      );
    });

    it('should filter by authorId', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue([mockVettingRequest]);
      mockPrismaService.vettingRequest.count.mockResolvedValue(1);

      const result = await service.findAll({ authorId: 'author-1' });

      expect(result.requests).toHaveLength(1);
      expect(mockPrismaService.vettingRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { authorId: 'author-1' },
        }),
      );
    });

    it('should filter by targetUserId', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue([mockVettingRequest]);
      mockPrismaService.vettingRequest.count.mockResolvedValue(1);

      const result = await service.findAll({ targetUserId: 'target-1' });

      expect(result.requests).toHaveLength(1);
      expect(mockPrismaService.vettingRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { targetUserId: 'target-1' },
        }),
      );
    });

    it('should apply custom pagination', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue([mockVettingRequest]);
      mockPrismaService.vettingRequest.count.mockResolvedValue(25);

      const result = await service.findAll({ skip: 10, take: 10 });

      expect(result).toEqual({
        requests: [mockVettingRequest],
        total: 25,
        page: 2,
        totalPages: 3,
      });
      expect(mockPrismaService.vettingRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it('should combine multiple filters', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue([mockVettingRequest]);
      mockPrismaService.vettingRequest.count.mockResolvedValue(1);

      const result = await service.findAll({
        status: VettingStatus.APPROVED,
        authorId: 'author-1',
        targetUserId: 'target-1',
      });

      expect(result.requests).toHaveLength(1);
      expect(mockPrismaService.vettingRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: VettingStatus.APPROVED,
            authorId: 'author-1',
            targetUserId: 'target-1',
          },
        }),
      );
    });

    it('should return empty results when no requests match', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue([]);
      mockPrismaService.vettingRequest.count.mockResolvedValue(0);

      const result = await service.findAll({ status: VettingStatus.REJECTED });

      expect(result).toEqual({
        requests: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });
    });
  });

  describe('findOne', () => {
    it('should return a vetting request by id', async () => {
      mockPrismaService.vettingRequest.findUnique.mockResolvedValue(mockVettingRequest);

      const result = await service.findOne('vetting-1');

      expect(result).toEqual(mockVettingRequest);
      expect(mockPrismaService.vettingRequest.findUnique).toHaveBeenCalledWith({
        where: { id: 'vetting-1' },
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
          targetUser: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
              type: true,
              content: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException when vetting request not found', async () => {
      mockPrismaService.vettingRequest.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('non-existent-id')).rejects.toThrow('Vetting request not found');
    });
  });

  describe('updateStatus', () => {
    it('should update status to APPROVED', async () => {
      const existingRequest = { ...mockVettingRequest };
      const updatedRequest = { ...mockVettingRequest, status: VettingStatus.APPROVED };

      mockPrismaService.vettingRequest.findUnique.mockResolvedValue(existingRequest);
      mockPrismaService.vettingRequest.update.mockResolvedValue(updatedRequest);

      const result = await service.updateStatus('vetting-1', VettingStatus.APPROVED);

      expect(result.status).toBe(VettingStatus.APPROVED);
      expect(mockPrismaService.vettingRequest.findUnique).toHaveBeenCalledWith({
        where: { id: 'vetting-1' },
      });
      expect(mockPrismaService.vettingRequest.update).toHaveBeenCalledWith({
        where: { id: 'vetting-1' },
        data: { status: VettingStatus.APPROVED },
      });
    });

    it('should update status to REJECTED', async () => {
      const existingRequest = { ...mockVettingRequest };
      const updatedRequest = { ...mockVettingRequest, status: VettingStatus.REJECTED };

      mockPrismaService.vettingRequest.findUnique.mockResolvedValue(existingRequest);
      mockPrismaService.vettingRequest.update.mockResolvedValue(updatedRequest);

      const result = await service.updateStatus('vetting-1', VettingStatus.REJECTED);

      expect(result.status).toBe(VettingStatus.REJECTED);
      expect(mockPrismaService.vettingRequest.update).toHaveBeenCalledWith({
        where: { id: 'vetting-1' },
        data: { status: VettingStatus.REJECTED },
      });
    });

    it('should throw NotFoundException when updating non-existent request', async () => {
      mockPrismaService.vettingRequest.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus('non-existent-id', VettingStatus.APPROVED)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.updateStatus('non-existent-id', VettingStatus.APPROVED)).rejects.toThrow(
        'Vetting request not found',
      );
      expect(mockPrismaService.vettingRequest.update).not.toHaveBeenCalled();
    });
  });

  describe('searchByName', () => {
    const searchResults = [
      { ...mockVettingRequest, targetName: 'John Doe' },
      { ...mockVettingRequest, id: 'vetting-2', targetName: 'Johnny Smith' },
    ];

    it('should search by name with default pagination', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue(searchResults);
      mockPrismaService.vettingRequest.count.mockResolvedValue(2);

      const result = await service.searchByName('John');

      expect(result).toEqual({
        requests: searchResults,
        total: 2,
        page: 1,
        totalPages: 1,
      });
      expect(mockPrismaService.vettingRequest.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: {
          targetName: {
            contains: 'John',
            mode: 'insensitive',
          },
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should search with custom pagination', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue([searchResults[0]]);
      mockPrismaService.vettingRequest.count.mockResolvedValue(15);

      const result = await service.searchByName('John', 5, 5);

      expect(result).toEqual({
        requests: [searchResults[0]],
        total: 15,
        page: 2,
        totalPages: 3,
      });
      expect(mockPrismaService.vettingRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        }),
      );
    });

    it('should return empty results when no matches found', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue([]);
      mockPrismaService.vettingRequest.count.mockResolvedValue(0);

      const result = await service.searchByName('NonExistentName');

      expect(result).toEqual({
        requests: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });
    });

    it('should perform case-insensitive search', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue(searchResults);
      mockPrismaService.vettingRequest.count.mockResolvedValue(2);

      await service.searchByName('john');

      expect(mockPrismaService.vettingRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            targetName: {
              contains: 'john',
              mode: 'insensitive',
            },
          },
        }),
      );
    });

    it('should search with partial name match', async () => {
      mockPrismaService.vettingRequest.findMany.mockResolvedValue([searchResults[0]]);
      mockPrismaService.vettingRequest.count.mockResolvedValue(1);

      const result = await service.searchByName('Doe');

      expect(result.requests).toHaveLength(1);
      expect(mockPrismaService.vettingRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            targetName: {
              contains: 'Doe',
              mode: 'insensitive',
            },
          },
        }),
      );
    });
  });
});
