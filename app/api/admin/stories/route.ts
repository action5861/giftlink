import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma, StoryStatus } from '@prisma/client';

// Type definitions for better type safety
interface StoryQueryParams {
  status?: string;
  search?: string;
  page?: string;
  limit?: string;
}

interface StoryResponse {
  stories: any[];
  totalPages: number;
  currentPage: number;
  stats: {
    DRAFT: number;
    PENDING: number;
    REVIEW: number;
    REVISION_REQUESTED: number;
    APPROVED: number;
    PUBLISHED: number;
    REJECTED: number;
  };
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const params: StoryQueryParams = {
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
    };

    const page = parseInt(params.page!, 10);
    const limit = parseInt(params.limit!, 10);

    // Validate pagination parameters
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { message: '잘못된 페이지 매개변수입니다.' },
        { status: 400 }
      );
    }

    // Build where clause
    const whereClause: Prisma.StoryWhereInput = {};

    if (params.status) {
      whereClause.status = params.status as StoryStatus;
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

    // Fetch stories with related data and stats
    const [stories, totalStories, stats] = await Promise.all([
      prisma.story.findMany({
        where: whereClause,
        include: {
          items: true,
          partner: {
            select: {
              id: true,
              name: true,
            }
          },
          statusHistory: {
            include: {
              changedBy: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.story.count({ where: whereClause }),
      prisma.story.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      })
    ]);

    // Format stats
    const formattedStats = {
      DRAFT: 0,
      PENDING: 0,
      REVIEW: 0,
      REVISION_REQUESTED: 0,
      APPROVED: 0,
      PUBLISHED: 0,
      REJECTED: 0
    };

    stats.forEach(stat => {
      if (stat.status in formattedStats) {
        formattedStats[stat.status as keyof typeof formattedStats] = stat._count.status;
      }
    });

    // Format response
    const response: StoryResponse = {
      stories,
      totalPages: Math.ceil(totalStories / limit),
      currentPage: page,
      stats: formattedStats
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching stories:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: '사연 목록 조회에 실패했습니다.', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Check if user is admin
    const isAdmin = session.user.role === 'ADMIN';

    // partnerId: from body (for admin) or from session (for partner)
    const partnerId = isAdmin ? data.partnerId : session.user.partnerId;

    // Validate required fields
    if (!data.title || !data.content || !data.recipientAge || !data.recipientGender || !data.recipientRegion) {
      return NextResponse.json(
        { message: '필수 항목이 누락되었습니다.' },
        { status: 400 }
      );
    }

    const story = await prisma.story.create({
      data: {
        title: data.title,
        content: data.content,
        recipientAge: parseInt(data.recipientAge),
        recipientGender: data.recipientGender,
        recipientRegion: data.recipientRegion,
        status: StoryStatus.DRAFT,
        partner: partnerId ? {
          connect: {
            id: partnerId
          }
        } : undefined,
        items: {
          create: data.items.map((item: any) => ({
            name: item.name,
            description: item.description,
            price: parseFloat(item.price),
            coupangUrl: item.coupangUrl,
            category: item.category,
          })),
        },
        statusHistory: {
          create: {
            fromStatus: 'DRAFT',
            toStatus: 'DRAFT',
            note: '사연 등록',
            changedBy: {
              connect: {
                id: session.user.id
              }
            }
          }
        }
      },
      include: {
        items: true,
        statusHistory: {
          include: {
            changedBy: true
          }
        },
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: '사연 등록에 실패했습니다.', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 