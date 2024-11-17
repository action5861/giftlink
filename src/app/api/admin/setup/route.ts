// src/app/api/admin/setup/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN'
      }
    });

    return NextResponse.json({ success: true, admin });
  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { error: '관리자 계정 생성 중 오류가 발생했습니다: ' + (error as Error).message },
      { status: 500 }
    );
  }
}