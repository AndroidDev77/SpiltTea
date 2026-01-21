import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateVettingRequestDto } from './dto/create-vetting-request.dto';
import { VettingStatus } from '@prisma/client';

@Injectable()
export class VettingService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, createVettingRequestDto: CreateVettingRequestDto) {
    return this.prisma.vettingRequest.create({
      data: {
        ...createVettingRequestDto,
        authorId,
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
        targetUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    status?: VettingStatus;
    authorId?: string;
    targetUserId?: string;
  }) {
    const { skip = 0, take = 20, status, authorId, targetUserId } = params;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (targetUserId) {
      where.targetUserId = targetUserId;
    }

    const [requests, total] = await Promise.all([
      this.prisma.vettingRequest.findMany({
        skip,
        take,
        where,
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
          targetUser: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              profileImageUrl: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.vettingRequest.count({ where }),
    ]);

    return {
      requests,
      total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: string) {
    const request = await this.prisma.vettingRequest.findUnique({
      where: { id },
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
        targetUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            type: true,
            content: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Vetting request not found');
    }

    return request;
  }

  async updateStatus(id: string, status: VettingStatus) {
    const request = await this.prisma.vettingRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Vetting request not found');
    }

    return this.prisma.vettingRequest.update({
      where: { id },
      data: { status },
    });
  }

  async searchByName(name: string, skip = 0, take = 20) {
    const [requests, total] = await Promise.all([
      this.prisma.vettingRequest.findMany({
        skip,
        take,
        where: {
          targetName: {
            contains: name,
            mode: 'insensitive',
          },
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.vettingRequest.count({
        where: {
          targetName: {
            contains: name,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return {
      requests,
      total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take),
    };
  }
}
