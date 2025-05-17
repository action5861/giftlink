import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 파트너 권한 체크
    if (!session?.user || session.user.role !== 'PARTNER') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const { title, content, category, recipientAge, recipientGender, recipientRegion } = data;

    // 필수 필드 검증
    if (!title || !content || !category || !recipientAge || !recipientGender || !recipientRegion) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // 사연 생성
    const story = await prisma.story.create({
      data: {
        title,
        content,
        category,
        recipientAge: parseInt(recipientAge),
        recipientGender,
        recipientRegion,
        status: 'DRAFT',
        partnerId: session.user.id,
      },
    });

    // 상태 변경 이력 기록
    await prisma.storyStatusHistory.create({
      data: {
        storyId: story.id,
        fromStatus: 'DRAFT',
        toStatus: 'DRAFT',
        note: '사연 등록',
        changedById: session.user.id,
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 