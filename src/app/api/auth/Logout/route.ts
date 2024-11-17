// src/app/api/auth/logout/route.ts
import { NextRequest } from 'next/server'
import { apiResponse } from '@/lib/api-utils'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    // 토큰 쿠키 삭제
    cookies().delete('token')
    return apiResponse({ message: '로그아웃 되었습니다.' })
  } catch (error) {
    console.error('Logout error:', error)
    return apiResponse(null, '로그아웃 중 오류가 발생했습니다.')
  }
}