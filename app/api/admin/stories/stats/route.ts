import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const [
      totalStories,
      draftStories,
      pendingStories,
      approvedStories,
      publishedStories,
      fulfilledStories,
      rejectedStories
    ] = await Promise.all([
      prisma.story.count(),
      prisma.story.count({ where: { status: 'DRAFT' } }),
      prisma.story.count({ where: { status: 'PENDING' } }),
      prisma.story.count({ where: { status: 'APPROVED' } }),
      prisma.story.count({ where: { status: 'PUBLISHED' } }),
      prisma.story.count({ where: { status: 'FULFILLED' } }),
      prisma.story.count({ where: { status: 'REJECTED' } })
    ]);

    return NextResponse.json({
      total: totalStories,
      byStatus: {
        draft: draftStories,
        pending: pendingStories,
        approved: approvedStories,
        published: publishedStories,
        fulfilled: fulfilledStories,
        rejected: rejectedStories
      }
    });

  } catch (error) {
    console.error('Error fetching story stats:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 