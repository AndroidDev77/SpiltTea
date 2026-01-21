import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() createPersonDto: CreatePersonDto) {
    return this.personsService.create(req.user.userId, createPersonDto);
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = parseInt(limit || '20') || 20;
    const skip = (pageNum - 1) * limitNum;

    return this.personsService.search(query || '', skip, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personsService.findOne(id);
  }

  @Get(':id/posts')
  findPersonPosts(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page || '1') || 1;
    const limitNum = parseInt(limit || '20') || 20;
    const skip = (pageNum - 1) * limitNum;

    return this.personsService.findPersonPosts(id, skip, limitNum);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return this.personsService.update(id, req.user.userId, req.user.role, updatePersonDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.personsService.remove(id, req.user.userId, req.user.role);
  }
}
