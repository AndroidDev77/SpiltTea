import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VettingService } from './vetting.service';
import { CreateVettingRequestDto } from './dto/create-vetting-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VettingStatus } from '@prisma/client';

@Controller('vetting')
export class VettingController {
  constructor(private readonly vettingService: VettingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() createVettingRequestDto: CreateVettingRequestDto) {
    return this.vettingService.create(req.user.userId, createVettingRequestDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: VettingStatus,
    @Query('authorId') authorId?: string,
    @Query('targetUserId') targetUserId?: string,
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = parseInt(limit || '20') || 20;
    const skip = (pageNum - 1) * limitNum;

    return this.vettingService.findAll({
      skip,
      take: limitNum,
      status,
      authorId,
      targetUserId,
    });
  }

  @Get('search')
  searchByName(
    @Query('name') name: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = parseInt(limit || '20') || 20;
    const skip = (pageNum - 1) * limitNum;

    return this.vettingService.searchByName(name, skip, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vettingService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: VettingStatus) {
    return this.vettingService.updateStatus(id, status);
  }
}
