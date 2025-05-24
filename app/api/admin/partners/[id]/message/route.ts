import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

const messageSchema = z.object({
  message: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message } = messageSchema.parse(body);

    // 파트너 정보 조회
    const partner = await prisma.partner.findUnique({
      where: { id: params.id },
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // 메시지 저장
    const savedMessage = await prisma.message.create({
      data: {
        content: message,
        partnerId: partner.id,
        senderId: session.user.id,
        senderRole: 'ADMIN',
      },
    });

    // 이메일 전송
    await sendEmail({
      to: partner.email,
      subject: 'DigiSafe 관리자 메시지',
      template: 'admin-message',
      data: {
        partnerName: partner.name,
        message: message,
        adminName: session.user.name,
      },
    });

    return NextResponse.json(savedMessage);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 