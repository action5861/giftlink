import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

const inviteSchema = z.object({
  name: z.string().min(1, '기관명은 필수입니다'),
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  contactPerson: z.string().min(1, '담당자 이름은 필수입니다'),
  phoneNumber: z.string().min(1, '전화번호는 필수입니다'),
  website: z.string().url('유효한 URL을 입력해주세요').optional(),
  address: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received partner invite request:', body);

    const validatedData = inviteSchema.parse(body);

    // 이메일 중복 체크
    const existingPartner = await prisma.partner.findFirst({
      where: { email: validatedData.email },
      include: {
        _count: {
          select: {
            stories: true,
            users: true,
          },
        },
      },
    });

    if (existingPartner) {
      return NextResponse.json(
        { error: '이미 등록된 이메일 주소입니다' },
        { status: 400 }
      );
    }

    // 파트너 생성
    const partner = await prisma.partner.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        contactPerson: validatedData.contactPerson,
        phoneNumber: validatedData.phoneNumber,
        website: validatedData.website,
        address: validatedData.address,
        isVerified: false,
      },
      include: {
        _count: {
          select: {
            stories: true,
            users: true,
          },
        },
      },
    });

    // 초대 이메일 전송
    await sendEmail({
      to: validatedData.email,
      subject: 'DigiSafe 파트너 초대',
      template: 'partner-invite',
      data: {
        partnerName: validatedData.name,
        contactPerson: validatedData.contactPerson,
        inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?partnerId=${partner.id}`,
      },
    });

    return NextResponse.json({
      ...partner,
      storyCount: partner._count.stories,
      userCount: partner._count.users,
    });
  } catch (error) {
    console.error('Error inviting partner:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: '입력값이 올바르지 않습니다',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '파트너 초대 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
} 