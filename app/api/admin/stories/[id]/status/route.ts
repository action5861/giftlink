import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StoryStatus } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { status, note } = data;

    if (!status || !Object.values(StoryStatus).includes(status)) {
      return NextResponse.json(
        { message: '유효하지 않은 상태입니다.' },
        { status: 400 }
      );
    }

    // 현재 사연 상태 조회
    const currentStory = await prisma.story.findUnique({
      where: { id: params.id },
      select: { status: true }
    });

    if (!currentStory) {
      return NextResponse.json(
        { message: '사연을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 상태 변경
    const updatedStory = await prisma.story.update({
      where: { id: params.id },
      data: {
        status,
        statusHistory: {
          create: {
            fromStatus: currentStory.status,
            toStatus: status,
            note: note || '상태 변경',
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
        partner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        statusHistory: {
          include: {
            changedBy: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    return NextResponse.json(updatedStory);

  } catch (error) {
    console.error('Error updating story status:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: '사연 상태 변경에 실패했습니다.', error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 