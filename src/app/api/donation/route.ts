// src/app/api/donation/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse } from '@/lib/api-utils'
import { verifyAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // 로그인 검증
    const user = await verifyAuth()
    
    // DONOR 권한 확인
    if (user.role !== 'DONOR') {
      return apiResponse(null, '기부자만 기부할 수 있습니다.')
    }

    const body = await req.json()
    const { storyId, itemId, amount, trackingNum } = body

    // 필수 필드 검증
    if (!storyId || !itemId || !amount) {
      return apiResponse(null, '필수 정보가 누락되었습니다.')
    }

    // Story와 StoryItem 존재 여부 확인
    const storyItem = await prisma.storyItem.findFirst({
      where: {
        id: itemId,
        storyId: storyId
      },
      include: {
        story: true
      }
    })

    if (!storyItem) {
      return apiResponse(null, '해당 물품을 찾을 수 없습니다.')
    }

    // 스토리 상태 확인
    if (storyItem.story.status !== 'ACTIVE') {
      return apiResponse(null, '진행 중인 스토리가 아닙니다.')
    }

    // 기부 수량 확인
    const existingDonations = await prisma.donation.findMany({
      where: {
        itemId: itemId
      },
      select: {
        amount: true
      }
    })

    const totalDonated = existingDonations.reduce((sum: number, donation: { amount: number }) => 
      sum + donation.amount, 0)
    const remainingNeeded = storyItem.quantity - totalDonated

    if (amount > remainingNeeded) {
      return apiResponse(null, `필요한 수량을 초과하였습니다. 남은 필요 수량: ${remainingNeeded}개`)
    }

    // 기부 내역 생성
    const donation = await prisma.donation.create({
      data: {
        donorId: user.id,
        storyId: storyId,
        itemId: itemId,
        amount: amount,
        status: trackingNum ? 'SHIPPING' : 'PAID',
        trackingNum
      },
      include: {
        story: {
          select: {
            id: true,
            story: true,
            admin: {
              select: {
                name: true
              }
            }
          }
        },
        item: {
          select: {
            name: true,
            quantity: true
          }
        }
      }
    })

    // 물품 수량 확인 후 상태 업데이트
    const updatedTotalDonated = totalDonated + amount
    if (updatedTotalDonated >= storyItem.quantity) {
      await prisma.storyItem.update({
        where: { id: itemId },
        data: { status: 'FULFILLED' }
      })

      // 모든 물품이 충족되었는지 확인
      const remainingItems = await prisma.storyItem.findMany({
        where: {
          storyId: storyId,
          status: 'NEEDED'
        }
      })

      if (remainingItems.length === 0) {
        await prisma.story.update({
          where: { id: storyId },
          data: { status: 'COMPLETED' }
        })
      }
    }

    return apiResponse(donation)

  } catch (error) {
    console.error('Donation error:', error)
    return apiResponse(null, '기부 처리 중 오류가 발생했습니다.')
  }
}

// 기부 내역 조회
export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth()
    const { searchParams } = new URL(req.url)
    
    const status = searchParams.get('status')
    const take = parseInt(searchParams.get('take') || '10')
    const skip = parseInt(searchParams.get('skip') || '0')

    const donations = await prisma.donation.findMany({
      where: {
        donorId: user.id,
        ...(status && { status: status as any })
      },
      include: {
        story: {
          select: {
            id: true,
            story: true,
            admin: {
              select: {
                name: true
              }
            }
          }
        },
        item: {
          select: {
            name: true,
            quantity: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take,
      skip
    })

    const total = await prisma.donation.count({
      where: {
        donorId: user.id,
        ...(status && { status: status as any })
      }
    })

    return apiResponse({
      donations,
      metadata: {
        total,
        take,
        skip
      }
    })

  } catch (error) {
    console.error('Get donations error:', error)
    return apiResponse(null, '기부 내역을 불러오는 중 오류가 발생했습니다.')
  }
}