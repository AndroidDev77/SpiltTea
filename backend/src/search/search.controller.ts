import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  searchAll(@Query('q') query: string, @Query('limit') limit?: string) {
    const limitNum = Math.min(parseInt(limit || '10') || 10, 100);

    return this.searchService.searchAll(query, limitNum);
  }

  @Get('persons')
  searchPersons(
    @Query('q') query?: string,
    @Query('name') name?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = Math.min(parseInt(limit || '20') || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    return this.searchService.searchPersons({
      query,
      name,
      phoneNumber,
      city,
      state,
      skip,
      take: limitNum,
    });
  }

  @Get('posts')
  searchPosts(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = Math.min(parseInt(limit || '20') || 20, 100);
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
    const limitNum = Math.min(parseInt(limit || '20') || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    return this.searchService.searchUsers(query, skip, limitNum);
  }
}
