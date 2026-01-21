import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  async getUploadUrl(
    @Request() req: any,
    @Body('filename') filename: string,
    @Body('contentType') contentType: string,
  ) {
    const key = this.storageService.generateFileKey(req.user.userId, filename);
    const uploadUrl = await this.storageService.getUploadPresignedUrl(key, contentType);
    const publicUrl = this.storageService.getPublicUrl(key);

    return {
      uploadUrl,
      key,
      publicUrl,
    };
  }

  @Get('download-url')
  async getDownloadUrl(@Query('key') key: string, @Query('expiresIn') expiresIn?: string) {
    const expires = expiresIn ? parseInt(expiresIn) : 3600;
    const downloadUrl = await this.storageService.getDownloadPresignedUrl(key, expires);

    return {
      downloadUrl,
    };
  }
}
