// src/app/api/admin/stories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET 메서드 추가
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    // 쿼리 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    // 검색 조건 구성
    const where = {
      ...(search
        ? {
            OR: [
              { beneficiaryName: { contains: search } },
              { story: { contains: search } },
            ],
          }
        : {}),
      ...(status && status !== 'ALL'
        ? { status: status as any }
        : {}),
    };

    // 스토리 목록 조회
    const stories = await prisma.story.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return NextResponse.json(
      { error: '스토리 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST 메서드 유지
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const data = await request.json();
    
    const story = await prisma.story.create({
      data: {
        adminId: session.user.id,
        age: parseInt(data.age),
        gender: data.gender,
        region: data.region,
        story: data.story,
        beneficiaryName: data.beneficiaryName || null,
        status: 'PENDING',
        items: {
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
    console.error('Story creation error:', error);
    return NextResponse.json(
      { error: '스토리 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}