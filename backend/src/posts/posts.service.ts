import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostType } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
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
        person: {
          select: {
            id: true,
            name: true,
            approximateAge: true,
            gender: true,
            city: true,
            state: true,
            profileImageUrl: true,
            isVerified: true,
          },
        },
      },
    });
  }

  async findAll(params: { skip?: number; take?: number; type?: PostType; authorId?: string }) {
    const { skip = 0, take = 20, type, authorId } = params;

    const where: any = {
      isPublished: true,
    };

    if (type) {
      where.type = type;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
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
          person: {
            select: {
              id: true,
              name: true,
              approximateAge: true,
              gender: true,
              city: true,
              state: true,
              profileImageUrl: true,
              isVerified: true,
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
      this.prisma.post.count({ where }),
    ]);

    return {
      posts,
      total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
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
        person: {
          select: {
            id: true,
            name: true,
            approximateAge: true,
            gender: true,
            city: true,
            state: true,
            profileImageUrl: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            reviews: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Increment view count
    await this.prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
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
      },
    });
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: 'Post deleted successfully' };
  }

  async likePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return { liked: false };
    } else {
      // Like
      await this.prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return { liked: true };
    }
  }
}
