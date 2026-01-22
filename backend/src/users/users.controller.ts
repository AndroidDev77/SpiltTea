import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('profile')
  async updateProfile(
    @Request() req: any,
    @Body()
    updateData: {
      firstName?: string;
      lastName?: string;
      bio?: string;
      profileImageUrl?: string;
      twitterHandle?: string;
      igHandle?: string;
      tiktokHandle?: string;
    },
  ) {
    return this.usersService.updateProfile(req.user.userId, updateData);
  }

  @Get(':username')
  async getUserByUsername(@Request() req: any) {
    const username = req.params.username;
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      profileImageUrl: user.profileImageUrl,
      twitterHandle: user.twitterHandle,
      igHandle: user.igHandle,
      tiktokHandle: user.tiktokHandle,
      createdAt: user.createdAt,
    };
  }
}
