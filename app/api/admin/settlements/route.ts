import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { container } from '@/lib/container';

// 정산 생성
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 관리자 권한 체크
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.ngoId || !data.donationIds || !data.donationIds.length) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // DI 컨테이너에서 SettlementService 가져오기
    const settlementService = container.resolve<any>('SettlementService');
    
    // 정산 생성
    const settlement = await settlementService.createSettlement(
      data.ngoId,
      data.donationIds
    );

    return NextResponse.json({
      success: true,
      settlement: {
        id: settlement.id,
        ngoId: settlement.ngoId,
        totalAmount: settlement.totalAmount,
        scheduledDate: settlement.scheduledDate,
        status: settlement.status,
        createdAt: settlement.createdAt,
      }
    });
  } catch (error) {
    console.error('정산 생성 오류:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 정산 목록 조회
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 관리자 권한 체크
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // URL 파라미터 추출
    const url = new URL(request.url);
    const ngoId = url.searchParams.get('ngoId');
    const status = url.searchParams.get('status');
    
    // 필터 객체 생성
    const filters: any = {};
    if (ngoId) filters.ngoId = ngoId;
    if (status) filters.status = status;

    // DI 컨테이너에서 SettlementService 가져오기
    const settlementService = container.resolve<any>('SettlementService');
    
    // 정산 목록 조회
    const settlements = ngoId 
      ? await settlementService.getSettlementsByNgo(ngoId, filters)
      : await settlementService.getAllSettlements(filters);

    return NextResponse.json(settlements);
  } catch (error) {
    console.error('정산 목록 조회 오류:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 