import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// 파트너 목록 조회 API
export async function GET(request: Request) {
  try {
    console.log('=== 파트너 목록 조회 시작 ===');
    
    const session = await getServerSession(authOptions);
    console.log('세션 정보:', session?.user);
    
    if (!session || session.user.role !== 'ADMIN') {
      console.log('인증 실패: 권한 없음');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    console.log('검색어:', search);

    // 기본 쿼리 조건
    const where: Prisma.PartnerWhereInput = {
      isDeleted: false, // 삭제되지 않은 파트너만 조회
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { contactPerson: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
    };

    console.log('쿼리 조건:', JSON.stringify(where, null, 2));

    const partners = await prisma.partner.findMany({
      where,
      include: {
        _count: {
          select: {
            stories: true,
            users: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('조회된 파트너 수:', partners.length);
    console.log('파트너 데이터:', JSON.stringify(partners, null, 2));

    const formattedPartners = partners.map(partner => ({
      id: partner.id,
      name: partner.name,
      description: partner.description,
      address: partner.address,
      contactPerson: partner.contactPerson,
      phoneNumber: partner.phoneNumber,
      email: partner.email,
      website: partner.website,
      isVerified: partner.isVerified,
      storyCount: partner._count.stories,
      userCount: partner._count.users,
      createdAt: partner.createdAt,
    }));

    console.log('=== 파트너 목록 조회 완료 ===');
    return NextResponse.json(formattedPartners);
  } catch (error) {
    console.error('파트너 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '파트너 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 파트너 통계 조회 API
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [partnerCount, storyCount, userCount, verifiedPartnerCount] = await Promise.all([
      prisma.partner.count({
        where: { isDeleted: false }
      }),
      prisma.story.count(),
      prisma.user.count(),
      prisma.partner.count({
        where: { 
          isDeleted: false,
          isVerified: true 
        }
      }),
    ]);

    return NextResponse.json({
      totalPartners: partnerCount,
      verifiedPartners: verifiedPartnerCount,
      totalStories: storyCount,
      totalUsers: userCount,
    });
  } catch (error) {
    console.error('Error fetching partner stats:', error);
    return NextResponse.json(
      { error: '파트너 통계를 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
} 