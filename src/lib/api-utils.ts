// src/lib/api-utils.ts
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { UserJwtPayload } from '@/types/auth'

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
}

export function apiResponse<T>(data?: T, error?: string): NextResponse {
  const response: ApiResponse<T> = {
    success: !error,
    ...(data && { data }),
    ...(error && { error })
  }
  return NextResponse.json(response)
}

export async function verifyAuth(): Promise<UserJwtPayload> {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const verified = jwt.verify(token.value, process.env.JWT_SECRET!) as UserJwtPayload
    return verified
  } catch (error) {
    throw new Error('Invalid token')
  }
}