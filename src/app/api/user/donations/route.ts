// src/app/api/user/donations/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const donations = await prisma.donation.findMany({
      where: {
        donorId: session.user.id
      },
      include: {
        story: {
          select: {
            beneficiaryName: true,
            region: true
          }
        },
        item: {
          select: {
            name: true,
            quantity: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json(
      { error: '기부 내역을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
