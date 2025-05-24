import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// Type definitions for better type safety
interface StoryQueryParams {
  category?: string;
  region?: string;
  search?: string;
  page?: string;
  limit?: string;
}

interface StoryResponse {
  stories: any[];
  totalPages: number;
  currentPage: number;
}

export async function GET(request: Request) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params: StoryQueryParams = {
      category: searchParams.get('category') || undefined,
      region: searchParams.get('region') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '9',
    };

    const page = parseInt(params.page!, 10);
    const limit = parseInt(params.limit!, 10);

    // Validate pagination parameters
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 50) {
      return new NextResponse('Invalid pagination parameters', { status: 400 });
    }

    // Build where clause
    const whereClause: Prisma.StoryWhereInput = {
      status: 'PUBLISHED',
    };

    if (params.category && params.category !== '전체') {
      whereClause.items = {
        some: {
          name: params.category
        }
      };
    }
    if (params.region && params.region !== '전체') {
      whereClause.recipientRegion = params.region;
    }
    if (params.search) {
      const searchTerm = params.search;
      whereClause.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
        { recipientRegion: { contains: searchTerm, mode: 'insensitive' } },
        { items: { some: { name: { contains: searchTerm, mode: 'insensitive' } } } }
      ];
    }

    // Fetch stories with related data
    const [stories, totalStories] = await Promise.all([
      prisma.story.findMany({
        where: whereClause,
        include: {
          items: true,
          partner: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.story.count({ where: whereClause })
    ]);

    // Format response
    const response: StoryResponse = {
      stories,
      totalPages: Math.ceil(totalStories / limit),
      currentPage: page,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching stories:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Failed to fetch stories', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 