import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService, CreateUserDto } from './users.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { Gender, UserRole } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    passwordHash: 'hashed-password',
    dateOfBirth: new Date('1990-01-01'),
    gender: Gender.MALE,
    phoneNumber: '+1234567890',
    emailVerified: false,
    phoneVerified: false,
    emailVerificationToken: 'verification-token-123',
    phoneOtpSecret: null,
    bio: 'Test bio',
    profileImageUrl: null,
    role: UserRole.USER,
    isActive: true,
    isBanned: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLoginAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        passwordHash: 'hashed-password-123',
        firstName: 'New',
        lastName: 'User',
        username: 'newuser',
        dateOfBirth: new Date('1995-05-15'),
        gender: Gender.FEMALE,
        phoneNumber: '+1987654321',
        emailVerificationToken: 'new-token-456',
        bio: 'New user bio',
      };

      const expectedResult = {
        id: 'new-user-456',
        email: createUserDto.email,
        username: createUserDto.username,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        emailVerified: false,
        phoneVerified: false,
        role: UserRole.USER,
        createdAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(expectedResult);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          emailVerified: true,
          phoneVerified: true,
          role: true,
          createdAt: true,
        },
      });
    });

    it('should create a user without optional fields', async () => {
      const createUserDto: CreateUserDto = {
        email: 'minimal@example.com',
        passwordHash: 'hashed-password',
        firstName: 'Minimal',
        lastName: 'User',
        username: 'minimaluser',
        dateOfBirth: new Date('2000-01-01'),
        gender: Gender.OTHER,
      };

      const expectedResult = {
        id: 'minimal-user-789',
        email: createUserDto.email,
        username: createUserDto.username,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        emailVerified: false,
        phoneVerified: false,
        role: UserRole.USER,
        createdAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(expectedResult);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
        select: expect.any(Object),
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });
  });

  describe('findByUsername', () => {
    it('should return a user when found by username', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
    });

    it('should return null when user not found by username', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByUsername('nonexistentuser');

      expect(result).toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'nonexistentuser' },
      });
    });
  });

  describe('findById', () => {
    it('should return a user when found by id', async () => {
      const selectedUser = {
        id: mockUser.id,
        email: mockUser.email,
        emailVerified: mockUser.emailVerified,
        phoneNumber: mockUser.phoneNumber,
        phoneVerified: mockUser.phoneVerified,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        username: mockUser.username,
        bio: mockUser.bio,
        dateOfBirth: mockUser.dateOfBirth,
        gender: mockUser.gender,
        role: mockUser.role,
        isActive: mockUser.isActive,
        isBanned: mockUser.isBanned,
        profileImageUrl: mockUser.profileImageUrl,
        createdAt: mockUser.createdAt,
        lastLoginAt: mockUser.lastLoginAt,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(selectedUser);

      const result = await service.findById('user-123');

      expect(result).toEqual(selectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          phoneNumber: true,
          phoneVerified: true,
          firstName: true,
          lastName: true,
          username: true,
          bio: true,
          dateOfBirth: true,
          gender: true,
          role: true,
          isActive: true,
          isBanned: true,
          profileImageUrl: true,
          createdAt: true,
          lastLoginAt: true,
        },
      });
    });

    it('should throw NotFoundException when user not found by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent-id')).rejects.toThrow(NotFoundException);
      await expect(service.findById('nonexistent-id')).rejects.toThrow('User not found');
    });
  });

  describe('findByVerificationToken', () => {
    it('should return a user when found by verification token', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findByVerificationToken('verification-token-123');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { emailVerificationToken: 'verification-token-123' },
      });
    });

    it('should return null when user not found by verification token', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await service.findByVerificationToken('invalid-token');

      expect(result).toBeNull();
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { emailVerificationToken: 'invalid-token' },
      });
    });
  });

  describe('verifyEmail', () => {
    it('should mark email as verified and clear verification token', async () => {
      const updatedUser = {
        ...mockUser,
        emailVerified: true,
        emailVerificationToken: null,
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.verifyEmail('user-123');

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
        },
      });
    });
  });

  describe('verifyPhone', () => {
    it('should mark phone as verified and clear OTP secret', async () => {
      const updatedUser = {
        ...mockUser,
        phoneVerified: true,
        phoneOtpSecret: null,
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.verifyPhone('user-123');

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: {
          phoneVerified: true,
          phoneOtpSecret: null,
        },
      });
    });
  });

  describe('updateLastLogin', () => {
    it('should update last login timestamp', async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now);

      const updatedUser = {
        ...mockUser,
        lastLoginAt: now,
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateLastLogin('user-123');

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { lastLoginAt: expect.any(Date) },
      });

      jest.useRealTimers();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile with all fields', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        bio: 'Updated bio',
        profileImageUrl: 'https://example.com/new-image.jpg',
      };

      const updatedUser = {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        bio: updateData.bio,
        profileImageUrl: updateData.profileImageUrl,
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('user-123', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: updateData,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          bio: true,
          profileImageUrl: true,
          updatedAt: true,
        },
      });
    });

    it('should update user profile with partial fields', async () => {
      const updateData = {
        bio: 'Only updating bio',
      };

      const updatedUser = {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        bio: updateData.bio,
        profileImageUrl: mockUser.profileImageUrl,
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('user-123', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: updateData,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          bio: true,
          profileImageUrl: true,
          updatedAt: true,
        },
      });
    });

    it('should update user profile with empty data object', async () => {
      const updateData = {};

      const updatedUser = {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        bio: mockUser.bio,
        profileImageUrl: mockUser.profileImageUrl,
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('user-123', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: updateData,
        select: expect.any(Object),
      });
    });
  });
});
