import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../common/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    create: jest.fn(),
    findByVerificationToken: jest.fn(),
    verifyEmail: jest.fn(),
    updateLastLogin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'FRONTEND_URL') return 'http://localhost:3000';
      if (key === 'NODE_ENV') return 'test';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // These are retrieved for potential future use but tests use mocks directly
    void module.get<UsersService>(UsersService);
    void module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        emailVerified: true,
        passwordHash: 'hashed',
      };

      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as any);
      mockJwtService.sign.mockReturnValue('jwt-token');
      mockUsersService.updateLastLogin.mockResolvedValue(undefined);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken', 'jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(mockUser.email);
      expect(mockUsersService.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if email not verified', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        emailVerified: false,
        passwordHash: 'hashed',
      };

      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as any);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        username: 'newuser',
        dateOfBirth: '1990-01-01',
        gender: 'MALE' as any,
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.findByUsername.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ id: '1', ...registerDto });

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('userId', '1');
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if email exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        gender: 'MALE' as any,
      };

      mockUsersService.findByEmail.mockResolvedValue({ email: registerDto.email });

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockUsersService.findByVerificationToken.mockResolvedValue(mockUser);
      mockUsersService.verifyEmail.mockResolvedValue(undefined);

      const result = await service.verifyEmail('valid-token');

      expect(result).toHaveProperty('message', 'Email verified successfully');
      expect(mockUsersService.verifyEmail).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw BadRequestException for invalid token', async () => {
      mockUsersService.findByVerificationToken.mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(BadRequestException);
    });
  });
});
