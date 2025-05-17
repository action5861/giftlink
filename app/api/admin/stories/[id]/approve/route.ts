import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 관리자 권한 체크
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { note } = await request.json();
    const storyId = params.id;

    // 사연 조회
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: { partner: true }
    });

    if (!story) {
      return new NextResponse('Story not found', { status: 404 });
    }

    if (story.status !== 'PENDING') {
      return new NextResponse('Story is not in pending status', { status: 400 });
    }

    // 트랜잭션으로 상태 변경 및 이력 기록
    const result = await prisma.$transaction(async (tx) => {
      // 1. 상태 변경
      const updatedStory = await tx.story.update({
        where: { id: storyId },
        data: {
          status: 'APPROVED',
          adminReviewed: true,
          adminNotes: note || undefined,
        },
      });

      // 2. 상태 변경 이력 기록
      await tx.storyStatusHistory.create({
        data: {
          storyId,
          fromStatus: 'PENDING',
          toStatus: 'APPROVED',
          note: note || '관리자 승인',
          changedById: session.user.id,
        },
      });

      // 3. 관리자 액션 기록
      await tx.adminAction.create({
        data: {
          adminId: session.user.id,
          actionType: 'APPROVE',
          entityType: 'Story',
          entityId: storyId,
          description: '사연 승인',
          details: JSON.stringify({ note }),
        },
      });

      // 4. 알림 생성
      await tx.notification.create({
        data: {
          userId: story.partnerId,
          type: 'STORY_STATUS_CHANGE',
          title: '사연이 승인되었습니다',
          content: `"${story.title}" 사연이 승인되었습니다. 이제 이미지 생성을 진행해주세요.`,
          relatedId: storyId,
          relatedType: 'Story',
        },
      });

      return updatedStory;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error approving story:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 