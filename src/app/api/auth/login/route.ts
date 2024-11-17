// src/app/api/auth/login/route.ts
import { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { apiResponse } from '@/lib/api-utils'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return apiResponse(null, '이메일 또는 비밀번호가 일치하지 않습니다.')
    }

    // 비밀번호 확인
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return apiResponse(null, '이메일 또는 비밀번호가 일치하지 않습니다.')
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // 쿠키에 토큰 저장
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    })

    // 비밀번호 제외하고 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user

    return apiResponse(userWithoutPassword)
  } catch (error) {
    console.error('Login error:', error)
    return apiResponse(null, '로그인 중 오류가 발생했습니다.')
  }
}