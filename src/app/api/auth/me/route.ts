// src/app/api/auth/me/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse } from '@/lib/api-utils'
import { verifyAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
 try {
   // JWT 토큰 검증 및 사용자 정보 가져오기
   const user = await verifyAuth()

   // 사용자 정보 조회
   const userData = await prisma.user.findUnique({
     where: { id: user.id },
     select: {
       id: true,
       email: true,
       name: true,
       phone: true,
       role: true,
       createdAt: true,
       // 기부 내역 포함
       donations: {
         select: {
           id: true,
           status: true,
           amount: true,
           createdAt: true,
           story: {
             select: {
               id: true,
               story: true
             }
           },
           item: {
             select: {
               name: true,
               quantity: true
             }
           }
         }
       },
       // 수혜자인 경우 작성한 스토리 포함
       stories: user.role === 'RECIPIENT' ? {
         select: {
           id: true,
           story: true,
           status: true,
           createdAt: true,
           items: {
             select: {
               id: true,
               name: true,
               quantity: true,
               status: true
             }
           }
         }
       } : false
     }
   })

   if (!userData) {
     return apiResponse(null, '사용자를 찾을 수 없습니다.')
   }

   return apiResponse(userData)

 } catch (error) {
   console.error('Get user info error:', error)
   return apiResponse(null, '사용자 정보를 불러오는 중 오류가 발생했습니다.')
 }
}