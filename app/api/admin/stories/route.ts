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
    const { 
      title, 
      content, 
      category, 
      recipientName,
      recipientPhone,
      recipientAge, 
      recipientGender, 
      recipientRegion,
      recipientAddress,
      items 
    } = data;

    // 필수 필드 검증
    if (!title || !content || !category || !recipientName || !recipientPhone || 
        !recipientAge || !recipientGender || !recipientRegion || !recipientAddress) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // 사연 생성 (트랜잭션으로 처리)
    const story = await prisma.$transaction(async (tx) => {
      // 1. 사연 생성
      const story = await tx.story.create({
        data: {
          title,
          content,
          category,
          recipientName,
          recipientPhone,
          recipientAge: parseInt(recipientAge),
          recipientGender,
          recipientRegion,
          recipientAddress,
          status: 'DRAFT',
          partnerId: session.user.id,
        },
      });

      // 2. 상품 정보 생성
      if (items && items.length > 0) {
        await tx.item.createMany({
          data: items.map((item: any) => ({
            name: item.name,
            description: item.description,
            price: item.price,
            coupangUrl: item.coupangUrl,
            storyId: story.id,
          })),
        });
      }

      // 3. 상태 변경 이력 기록
      await tx.storyStatusHistory.create({
        data: {
          storyId: story.id,
          fromStatus: 'DRAFT',
          toStatus: 'DRAFT',
          note: '사연 등록',
          changedById: session.user.id,
        },
      });

      return story;
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 