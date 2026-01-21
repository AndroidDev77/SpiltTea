import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class PersonsService {
  constructor(private prisma: PrismaService) {}

  async create(createdById: string, createPersonDto: CreatePersonDto) {
    return this.prisma.person.create({
      data: {
        ...createPersonDto,
        createdById,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  }

  async search(query: string, skip = 0, take = 20) {
    const [persons, total] = await Promise.all([
      this.prisma.person.findMany({
        skip,
        take,
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              aliases: {
                has: query,
              },
            },
            {
              city: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.person.count({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              aliases: {
                has: query,
              },
            },
            {
              city: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
    ]);

    return {
      persons,
      total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: string) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            posts: true,
            vettingRequests: true,
          },
        },
      },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    return person;
  }

  async findPersonPosts(personId: string, skip = 0, take = 20) {
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take,
        where: {
          personId,
          isPublished: true,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.post.count({
        where: {
          personId,
          isPublished: true,
        },
      }),
    ]);

    return {
      person,
      posts,
      total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take),
    };
  }

  async update(id: string, userId: string, userRole: UserRole, updatePersonDto: UpdatePersonDto) {
    const person = await this.prisma.person.findUnique({
      where: { id },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    // Only admins or the creator can update
    if (userRole !== UserRole.ADMIN && person.createdById !== userId) {
      throw new ForbiddenException('You do not have permission to update this person');
    }

    // Only admins can set isVerified
    if (updatePersonDto.isVerified !== undefined && userRole !== UserRole.ADMIN) {
      delete updatePersonDto.isVerified;
    }

    return this.prisma.person.update({
      where: { id },
      data: updatePersonDto,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole: UserRole) {
    const person = await this.prisma.person.findUnique({
      where: { id },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    // Only admins can delete
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete persons');
    }

    await this.prisma.person.delete({
      where: { id },
    });

    return { message: 'Person deleted successfully' };
  }
}
