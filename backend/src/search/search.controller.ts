import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  searchAll(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = parseInt(limit || '10') || 10;
    const skip = (pageNum - 1) * limitNum;

    return this.searchService.searchAll(query, skip, limitNum);
  }

  @Get('posts')
  searchPosts(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = parseInt(limit || '20') || 20;
    const skip = (pageNum - 1) * limitNum;

    return this.searchService.searchPosts(query, skip, limitNum);
  }

  @Get('users')
  searchUsers(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = parseInt(limit || '20') || 20;
    const skip = (pageNum - 1) * limitNum;

    return this.searchService.searchUsers(query, skip, limitNum);
  }
}
