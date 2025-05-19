import { NextResponse } from 'next/server';
import { VirtualAccountMonitorService } from '@/services';
import { container } from '@/lib/container';

export async function POST(request: Request) {
  try {
    // 요청 바디에서 입금 정보 추출
    const depositInfo = await request.json();
    
    // 데이터 유효성 검증
    if (!depositInfo.ngoId || !depositInfo.accountNumber || !depositInfo.amount || !depositInfo.transactionId) {
      return new NextResponse('Invalid deposit information', { status: 400 });
    }

    // VirtualAccountMonitorService 가져오기
    const virtualAccountMonitorService = container.resolve<VirtualAccountMonitorService>('VirtualAccountMonitorService');
    
    // 입금 이벤트 시뮬레이션 (실제로는 웹훅 이벤트를 받기만 함)
    virtualAccountMonitorService.simulateDeposit({
      ngoId: depositInfo.ngoId,
      accountNumber: depositInfo.accountNumber,
      amount: depositInfo.amount,
      depositorName: depositInfo.depositorName,
      depositDateTime: new Date(depositInfo.depositDateTime || Date.now()),
      transactionId: depositInfo.transactionId
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('가상계좌 입금 웹훅 처리 오류:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 