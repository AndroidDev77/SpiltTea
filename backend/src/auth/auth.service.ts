import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { RedisService } from '../common/redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const username = registerDto.username || `user_${Date.now()}`;
    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) {
      throw new BadRequestException('Username already taken');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const emailVerificationToken = randomBytes(32).toString('hex');

    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      username,
      dateOfBirth: new Date(registerDto.dateOfBirth),
      gender: registerDto.gender,
      phoneNumber: registerDto.phoneNumber,
      emailVerificationToken,
    });

    // TODO: Send verification email
    await this.sendVerificationEmail(user.email, emailVerificationToken);

    return {
      message: 'Registration successful. Please check your email for verification.',
      userId: user.id,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.usersService.verifyEmail(user.id);

    return { message: 'Email verified successfully' };
  }

  async sendVerificationEmail(email: string, token: string) {
    // TODO: Implement email sending with nodemailer
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    // Development only - log to console
    if (this.configService.get('NODE_ENV') === 'development') {
      console.log(`[DEV] Verification URL for ${email}: ${verificationUrl}`);
    }

    // In production, use nodemailer to send actual email
    // Example implementation:
    // await this.emailService.send({
    //   to: email,
    //   subject: 'Verify your email',
    //   html: `Click here to verify: ${verificationUrl}`
    // });
  }

  async requestPhoneOtp(userId: string, phoneNumber: string) {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with 10-minute expiration
    await this.redisService.set(`phone-otp:${userId}`, otp, 600);

    // TODO: Send OTP via Twilio
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    // In production, use Twilio SDK to send SMS

    return { message: 'OTP sent successfully' };
  }

  async verifyPhoneOtp(userId: string, otp: string) {
    const storedOtp = await this.redisService.get(`phone-otp:${userId}`);

    if (!storedOtp || storedOtp !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.usersService.verifyPhone(userId);
    await this.redisService.del(`phone-otp:${userId}`);

    return { message: 'Phone verified successfully' };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
