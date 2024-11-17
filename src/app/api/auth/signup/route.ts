// src/app/api/auth/signup/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, phone } = body;

    // 필수 필드 검증
    if (!email || !password || !name) {
      return apiResponse(null, '필수 정보를 모두 입력해주세요.');
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiResponse(null, '올바른 이메일 형식이 아닙니다.');
    }

    // 이메일 중복 체크
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return apiResponse(null, '이미 사용중인 이메일입니다.');
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'DONOR'  // 기본값은 기부자로 설정
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    return apiResponse(user);
  } catch (error) {
    console.error('Signup error:', error);
    return apiResponse(null, '회원가입 중 오류가 발생했습니다.');
  }
}