// src/app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { apiResponse } from '@/lib/api-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, phone, role } = body

    // 이메일 중복 체크
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return apiResponse(null, '이미 사용 중인 이메일입니다.')
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: role || 'DONOR'
      }
    })

    // 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = user

    return apiResponse(userWithoutPassword)
  } catch (error) {
    console.error('Registration error:', error)
    return apiResponse(null, '회원가입 중 오류가 발생했습니다.')
  }
}