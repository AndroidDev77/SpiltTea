import { Controller, Post, Body, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('request-phone-otp')
  @UseGuards(JwtAuthGuard)
  async requestPhoneOtp(@Request() req: any, @Body('phoneNumber') phoneNumber: string) {
    return this.authService.requestPhoneOtp(req.user.userId, phoneNumber);
  }

  @Post('verify-phone')
  @UseGuards(JwtAuthGuard)
  async verifyPhone(@Request() req: any, @Body() verifyPhoneDto: VerifyPhoneDto) {
    return this.authService.verifyPhoneOtp(req.user.userId, verifyPhoneDto.otp);
  }
}
