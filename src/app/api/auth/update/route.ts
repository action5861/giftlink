// src/app/api/auth/update/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiResponse } from '@/lib/api-utils'
import { verifyAuth } from '@/lib/auth'
import bcrypt from 'bcrypt'

export async function PATCH(req: NextRequest) {
 try {
   // 현재 로그인된 사용자 확인
   const user = await verifyAuth()

   const body = await req.json()
   const { name, phone, currentPassword, newPassword } = body

   // 업데이트할 데이터 객체
   const updateData: any = {}

   // 이름 업데이트
   if (name) {
     updateData.name = name
   }

   // 전화번호 업데이트
   if (phone) {
     updateData.phone = phone
   }

   // 비밀번호 변경 로직
   if (currentPassword && newPassword) {
     // 현재 사용자의 비밀번호 정보 조회
     const userWithPassword = await prisma.user.findUnique({
       where: { id: user.id },
       select: { password: true }
     })

     if (!userWithPassword) {
       return apiResponse(null, '사용자를 찾을 수 없습니다.')
     }

     // 현재 비밀번호 확인
     const isPasswordValid = await bcrypt.compare(
       currentPassword,
       userWithPassword.password
     )

     if (!isPasswordValid) {
       return apiResponse(null, '현재 비밀번호가 일치하지 않습니다.')
     }

     // 새 비밀번호 암호화
     updateData.password = await bcrypt.hash(newPassword, 10)
   }

   // 업데이트할 데이터가 없는 경우
   if (Object.keys(updateData).length === 0) {
     return apiResponse(null, '변경할 정보를 입력해주세요.')
   }

   // 사용자 정보 업데이트
   const updatedUser = await prisma.user.update({
     where: { id: user.id },
     data: updateData,
     select: {
       id: true,
       email: true,
       name: true,
       phone: true,
       role: true,
       updatedAt: true
     }
   })

   return apiResponse(updatedUser)

 } catch (error) {
   console.error('Update user error:', error)
   return apiResponse(null, '회원정보 수정 중 오류가 발생했습니다.')
 }
}