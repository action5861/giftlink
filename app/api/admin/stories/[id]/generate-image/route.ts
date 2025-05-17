import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { generateImage } from '@/lib/image-generation';

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

    const { prompt } = await request.json();
    const storyId = params.id;

    // 사연 조회
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: { partner: true }
    });

    if (!story) {
      return new NextResponse('Story not found', { status: 404 });
    }

    if (story.status !== 'APPROVED') {
      return new NextResponse('Story must be approved before generating image', { status: 400 });
    }

    // 이미지 생성
    const imageResult = await generateImage(prompt);
    
    if (!imageResult.success) {
      return new NextResponse('Failed to generate image', { status: 500 });
    }

    // 트랜잭션으로 이미지 URL 저장 및 상태 변경
    const result = await prisma.$transaction(async (tx) => {
      // 1. 이미지 URL 저장 및 상태 변경
      const updatedStory = await tx.story.update({
        where: { id: storyId },
        data: {
          imageUrl: imageResult.url,
          imagePrompt: prompt,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });

      // 2. 상태 변경 이력 기록
      await tx.storyStatusHistory.create({
        data: {
          storyId,
          fromStatus: 'APPROVED',
          toStatus: 'PUBLISHED',
          note: '이미지 생성 완료',
          changedById: session.user.id,
        },
      });

      // 3. 관리자 액션 기록
      await tx.adminAction.create({
        data: {
          adminId: session.user.id,
          actionType: 'IMAGE_GENERATE',
          entityType: 'Story',
          entityId: storyId,
          description: '사연 이미지 생성',
          details: JSON.stringify({ prompt, imageUrl: imageResult.url }),
        },
      });

      // 4. 알림 생성
      await tx.notification.create({
        data: {
          userId: story.partnerId,
          type: 'STORY_STATUS_CHANGE',
          title: '사연이 게시되었습니다',
          content: `"${story.title}" 사연이 게시되었습니다.`,
          relatedId: storyId,
          relatedType: 'Story',
        },
      });

      return updatedStory;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating story image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 