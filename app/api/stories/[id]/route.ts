import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 인증 체크
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const storyId = params.id;
    if (!storyId) {
      return NextResponse.json({ message: 'Story ID is required' }, { status: 400 });
    }

    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
      include: {
        items: true,
        partner: {
          select: {
            id: true,
            name: true,
          }
        },
        statusHistory: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      },
    });

    if (!story) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    // imageUrl이 없는 경우 기본 이미지 설정
    const storyWithFallbackImage = {
      ...story,
      imageUrl: (story as any).imageUrl || '/images/placeholder.jpg',
      items: story.items.map(item => ({
        ...item,
      }))
    };

    return NextResponse.json(storyWithFallbackImage);

  } catch (error) {
    console.error(`Error fetching story ${params.id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 