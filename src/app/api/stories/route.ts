// src/app/api/stories/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { StoryStatus } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const region = searchParams.get('region')
    const search = searchParams.get('search')

    // 쿼리 조건 구성
    const where = {
      status: 'ACTIVE' as StoryStatus,
      ...(category && category !== 'all' ? {
        items: {
          some: {
            category
          }
        }
      } : {}),
      ...(region && region !== 'all' ? { region } : {}),
      ...(search ? {
        OR: [
          { story: { contains: search } },
          { items: { some: { name: { contains: search } } } }
        ]
      } : {})
    }

    const stories = await prisma.story.findMany({
      where,
      include: {
        items: {
          where: {
            status: 'NEEDED'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(stories)
  } catch (error) {
    console.error('Stories fetch error:', error)
    return NextResponse.json(
      { error: '스토리 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}