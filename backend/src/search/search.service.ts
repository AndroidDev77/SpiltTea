import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { transformPostWithVoteCounts } from '../common/utils/transform-post';

// Utility function to mask phone number - shows only last 4 digits (industry standard)
function maskPhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  // Remove any non-digit characters for processing
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return phone; // Don't mask if too short
  // Mask all digits except the last 4
  const maskedPart = '*'.repeat(digits.length - 4);
  const visiblePart = digits.slice(-4);
  return maskedPart + visiblePart;
}

// Transform person data to mask phone number
function transformPersonWithMaskedPhone(person: any) {
  return {
    ...person,
    phoneNumber: maskPhoneNumber(person.phoneNumber),
  };
}

interface SearchPersonsParams {
  query?: string;
  name?: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  twitterHandle?: string;
  igHandle?: string;
  tiktokHandle?: string;
  skip?: number;
  take?: number;
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchPersons(params: SearchPersonsParams) {
    const {
      query,
      name,
      phoneNumber,
      city,
      state,
      twitterHandle,
      igHandle,
      tiktokHandle,
      skip = 0,
      take = 20,
    } = params;

    // Build the where clause based on provided filters
    const conditions: any[] = [];

    // General query search (searches across name, aliases, city, social media)
    if (query) {
      conditions.push({
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { aliases: { has: query } },
          { city: { contains: query, mode: 'insensitive' } },
          { twitterHandle: { contains: query, mode: 'insensitive' } },
          { igHandle: { contains: query, mode: 'insensitive' } },
          { tiktokHandle: { contains: query, mode: 'insensitive' } },
        ],
      });
    }

    // Specific name filter
    if (name) {
      conditions.push({
        name: { contains: name, mode: 'insensitive' },
      });
    }

    // Phone number filter (search by partial match)
    if (phoneNumber) {
      // Remove non-digits for comparison
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      conditions.push({
        phoneNumber: { contains: cleanPhone },
      });
    }

    // City filter
    if (city) {
      conditions.push({
        city: { contains: city, mode: 'insensitive' },
      });
    }

    // State filter
    if (state) {
      conditions.push({
        state: { contains: state, mode: 'insensitive' },
      });
    }

    // Twitter handle filter
    if (twitterHandle) {
      conditions.push({
        twitterHandle: { contains: twitterHandle, mode: 'insensitive' },
      });
    }

    // Instagram handle filter
    if (igHandle) {
      conditions.push({
        igHandle: { contains: igHandle, mode: 'insensitive' },
      });
    }

    // TikTok handle filter
    if (tiktokHandle) {
      conditions.push({
        tiktokHandle: { contains: tiktokHandle, mode: 'insensitive' },
      });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    const [persons, total] = await Promise.all([
      this.prisma.person.findMany({
        skip,
        take,
        where,
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: [{ isVerified: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.person.count({ where }),
    ]);

    // Mask phone numbers before returning
    const transformedPersons = persons.map(transformPersonWithMaskedPhone);

    return {
      persons: transformedPersons,
      total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take),
    };
  }

  // Keep legacy methods for backwards compatibility but they redirect to searchPersons
  async searchPosts(query: string, skip = 0, take = 20) {
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take,
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
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
          person: true,
          _count: {
            select: {
              votes: true,
              comments: true,
            },
          },
          votes: {
            select: {
              voteType: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.post.count({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    // Transform posts to include upvotes and downvotes counts, and mask person phone
    const transformedPosts = posts.map((post) => {
      const { person, ...postWithVotes } = post;
      const transformedPost = transformPostWithVoteCounts(postWithVotes);
      return {
        ...transformedPost,
        person: person ? transformPersonWithMaskedPhone(person) : null,
      };
    });

    return {
      posts: transformedPosts,
      total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take),
    };
  }

  async searchUsers(query: string, skip = 0, take = 20) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { twitterHandle: { contains: query, mode: 'insensitive' } },
            { igHandle: { contains: query, mode: 'insensitive' } },
            { tiktokHandle: { contains: query, mode: 'insensitive' } },
          ],
          isActive: true,
          isBanned: false,
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          bio: true,
          profileImageUrl: true,
          twitterHandle: true,
          igHandle: true,
          tiktokHandle: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { twitterHandle: { contains: query, mode: 'insensitive' } },
            { igHandle: { contains: query, mode: 'insensitive' } },
            { tiktokHandle: { contains: query, mode: 'insensitive' } },
          ],
          isActive: true,
          isBanned: false,
        },
      }),
    ]);

    return {
      users,
      total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take),
    };
  }

  async searchAll(query: string, take = 10) {
    // Now primarily returns people search results
    const persons = await this.searchPersons({ query, take });

    return {
      persons: persons.persons,
      totals: {
        persons: persons.total,
      },
    };
  }

  async getTrendingPosts(limit = 10) {
    // Get recent posts from the last 30 days with engagement data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const posts = await this.prisma.post.findMany({
      where: {
        isPublished: true,
        createdAt: {
          gte: thirtyDaysAgo,
        },
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
        person: true,
        votes: {
          select: {
            voteType: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      take: 100, // Get more posts to calculate trending score
    });

    // Calculate trending score for each post
    // Score = (upvotes - downvotes) * 2 + commentCount * 3 + viewCount + recencyBonus
    const now = new Date();
    const scoredPosts = posts.map((post) => {
      const upvotes = post.votes.filter((v) => v.voteType === 'UPVOTE').length;
      const downvotes = post.votes.filter((v) => v.voteType === 'DOWNVOTE').length;
      const commentCount = post._count.comments;
      const viewCount = post.viewCount || 0;

      // Recency bonus: posts from today get +50, yesterday +40, etc. (decays over 7 days)
      const ageInDays = Math.floor(
        (now.getTime() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24),
      );
      const recencyBonus = Math.max(0, 50 - ageInDays * 7);

      const trendingScore =
        (upvotes - downvotes) * 2 + commentCount * 3 + viewCount * 0.1 + recencyBonus;

      return {
        post,
        upvotes,
        downvotes,
        trendingScore,
      };
    });

    // Sort by trending score descending
    scoredPosts.sort((a, b) => b.trendingScore - a.trendingScore);

    // Return top posts with transformed data
    return scoredPosts.slice(0, limit).map(({ post, upvotes, downvotes }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { votes, person, ...postWithoutVotes } = post;
      return {
        ...postWithoutVotes,
        upvotes,
        downvotes,
        commentCount: post._count.comments,
        person: person ? transformPersonWithMaskedPhone(person) : null,
      };
    });
  }
}
