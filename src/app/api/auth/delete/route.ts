// src/app/api/auth/delete/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse } from '@/lib/api-utils'
import { verifyAuth } from '@/lib/auth'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { PrismaClient, Prisma } from '@prisma/client'

export async function DELETE(req: NextRequest) {
  try {
    // 현재 로그인된 사용자 확인
    const user = await verifyAuth()

    const body = await req.json()
    const { password } = body

    if (!password) {
      return apiResponse(null, '비밀번호를 입력해주세요.')
    }

    // 현재 사용자의 비밀번호 확인
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true }
    })

    if (!userWithPassword) {
      return apiResponse(null, '사용자를 찾을 수 없습니다.')
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(
      password,
      userWithPassword.password
    )

    if (!isPasswordValid) {
      return apiResponse(null, '비밀번호가 일치하지 않습니다.')
    }

    // 트랜잭션으로 관련 데이터 함께 삭제
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 기부자인 경우 기부 내역 삭제
      if (user.role === 'DONOR') {
        await tx.donation.deleteMany({
          where: { donorId: user.id }
        })
      }

      // 수혜자인 경우 스토리 및 관련 물품 삭제
      if (user.role === 'RECIPIENT') {
        // 스토리에 연결된 물품들 삭제
        await tx.storyItem.deleteMany({
          where: {
            story: {
              authorId: user.id
            }
          }
        })
        
        // 스토리에 연결된 기부 내역 삭제
        await tx.donation.deleteMany({
          where: {
            story: {
              authorId: user.id
            }
          }
        })

        // 스토리 삭제
        await tx.story.deleteMany({
          where: { authorId: user.id }
        })
      }

      // 사용자 삭제
      await tx.user.delete({
        where: { id: user.id }
      })
    })

    // 로그인 토큰 삭제
    cookies().delete('token')

    return apiResponse({ success: true, message: '회원 탈퇴가 완료되었습니다.' })

  } catch (error) {
    console.error('Delete user error:', error)
    return apiResponse(null, '회원 탈퇴 중 오류가 발생했습니다.')
  }
}