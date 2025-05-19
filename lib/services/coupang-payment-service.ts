import { CoupangPayment } from '../types/payment';

export interface CoupangPaymentService {
  // 결제 생성
  createPayment(orderId: string, amount: number): Promise<CoupangPayment>;
  
  // 결제 완료 처리
  completePayment(id: string, paymentReference: string): Promise<CoupangPayment>;
  
  // 결제 상세 조회
  getPayment(id: string): Promise<CoupangPayment>;
  
  // 주문 ID로 결제 조회
  getPaymentByOrderId(orderId: string): Promise<CoupangPayment>;
  
  // 결제 예정 주문 목록 조회
  getPendingPayments(): Promise<CoupangPayment[]>;
} 