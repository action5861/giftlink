// src/app/api/admin/stories/[id]/status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StoryStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const { status } = await request.json();

    const story = await prisma.story.update({
      where: { id: params.id },
      data: { 
        status: status as StoryStatus,
        updatedAt: new Date()
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: '상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}