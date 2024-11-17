// src/app/api/user/donations/[id]/receipt/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import PDFDocument from 'pdfkit';
import { ItemStatus } from '@prisma/client';

interface DonationItem {
  id: string;
  status: ItemStatus;
  imageUrl: string | null;
  storyId: string;
  name: string;
  category: string;
  quantity: number;
  description: string | null;
  price: number | null;
  priority: number;
}

interface DonationWithItem {
  id: string;
  donorId: string;
  amount: number;
  createdAt: Date;
  story: {
    beneficiaryName: string | null;
  };
  item: DonationItem;  // items -> item으로 수정
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const donation = await prisma.donation.findUnique({
      where: {
        id: params.id,
        donorId: session.user.id
      },
      include: {
        story: true,
        item: true  // items -> item으로 수정
      }
    }) as DonationWithItem | null;

    if (!donation) {
      return NextResponse.json(
        { error: '기부 내역을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // PDF 생성 로직
    const doc = new PDFDocument();
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    // PDF 내용 작성
    doc.fontSize(25).text('기부 영수증', 100, 80);
    doc.fontSize(12).text(`기부자: ${session.user.name}`, 100, 160);
    doc.text(`기부일: ${donation.createdAt.toLocaleDateString()}`, 100, 180);
    doc.text(`기부금액: ${donation.amount.toLocaleString()}원`, 100, 200);
    doc.text(`수혜자: ${donation.story.beneficiaryName || '익명'}`, 100, 220);
    doc.text('기부물품:', 100, 240);

    // 단일 item에 대한 정보 작성
    doc.text(`- ${donation.item.name} ${donation.item.quantity}개`, 120, 260);
    if (donation.item.price) {
      doc.text(`  가격: ${donation.item.price.toLocaleString()}원`, 140, 280);
    }

    doc.end();

    const pdfData = Buffer.concat(buffers);
    return new Response(pdfData, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=donation-receipt-${params.id}.pdf`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: '영수증 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}