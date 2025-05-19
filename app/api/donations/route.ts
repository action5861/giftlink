import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DonationProcessor } from '@/processors/donation-processor';
import { container } from '@/lib/container';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 인증 확인
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.storyId || !data.amount) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // DI 컨테이너에서 DonationProcessor 가져오기
    const donationProcessor = container.resolve(DonationProcessor);
    
    // 기부 데이터 생성
    const donationData = {
      storyId: data.storyId,
      donorId: session.user.id,
      ngoId: data.ngoId, // 사연에서 가져온 NGO ID
      amount: data.amount,
      message: data.message || '',
    };

    // 기부 프로세스 시작
    const donation = await donationProcessor.startDonationProcess(donationData);

    return NextResponse.json({
      success: true,
      donation: {
        id: donation.id,
        storyId: donation.storyId,
        amount: donation.amount,
        status: donation.status,
        createdAt: donation.createdAt,
      }
    });
  } catch (error) {
    console.error('기부 생성 오류:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 