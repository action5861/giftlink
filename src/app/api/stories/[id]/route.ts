// src/app/api/stories/[id]/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse } from '@/lib/api-utils'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const story = await prisma.story.findUnique({
      where: {
        id: params.id
      },
      include: {
        admin: {
          select: {
            name: true,
            email: true
          }
        },
        items: true
      }
    })

    if (!story) {
      return apiResponse(null, '스토리를 찾을 수 없습니다.')
    }

    return apiResponse(story)
  } catch (error) {
    console.error('Error fetching story:', error)
    return apiResponse(null, '스토리를 불러오는 중 오류가 발생했습니다.')
  }
}