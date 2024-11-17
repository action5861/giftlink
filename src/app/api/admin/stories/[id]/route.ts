// src/app/api/admin/stories/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET 메소드 추가
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const story = await prisma.story.findUnique({
      where: { id: params.id },
      include: {
        items: true
      }
    });

    if (!story) {
      return NextResponse.json(
        { error: '스토리를 찾을 수 없습니다.' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Story fetch error:', error);
    return NextResponse.json(
      { error: '스토리를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT(수정) 메소드
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const data = await request.json();

    const story = await prisma.story.update({
      where: { id: params.id },
      data: {
        age: parseInt(data.age),
        gender: data.gender,
        region: data.region,
        story: data.story,
        beneficiaryName: data.beneficiaryName || null,
        items: {
          deleteMany: {},  // 기존 아이템 삭제
          create: data.items.map((item: any) => ({
            name: item.name,
            category: item.category,
            quantity: parseInt(item.quantity),
            status: 'NEEDED'
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Story update error:', error);
    return NextResponse.json(
      { error: '스토리 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE 메소드
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.donation.deleteMany({
        where: { storyId: params.id }
      }),
      prisma.storyItem.deleteMany({
        where: { storyId: params.id }
      }),
      prisma.story.delete({
        where: { id: params.id }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Story deletion error:', error);
    return NextResponse.json(
      { error: '스토리 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}