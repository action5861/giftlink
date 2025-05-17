import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 기본 유효성 검사
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: '모든 필수 필드를 입력해주세요' },
        { status: 400 }
      );
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: '유효한 이메일 형식이 아닙니다' },
        { status: 400 }
      );
    }

    // 비밀번호 길이 검사
    if (password.length < 8) {
      return NextResponse.json(
        { message: '비밀번호는 8자 이상이어야 합니다' },
        { status: 400 }
      );
    }

    // 사용자 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: '이미 사용 중인 이메일입니다' },
        { status: 400 }
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // 민감한 정보 제외하고 응답
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: '회원가입이 완료되었습니다', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
} 