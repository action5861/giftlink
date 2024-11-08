// app/api/stories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 스토리 목록 조회
export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

// POST: 새 스토리 생성
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const story = await prisma.story.create({
      data: {
        ...data,
        status: 'waiting'
      }
    });
    return NextResponse.json(story);
  } catch (error) {
    console.error('Failed to create story:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
}