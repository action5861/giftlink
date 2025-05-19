import { Order, OrderProduct, CoupangOrderStatus } from '../types/payment';

export interface OrderService {
  // 주문 생성
  createOrder(donationId: string): Promise<Order>;
  
  // 주문 상태 업데이트
  updateOrderStatus(id: string, status: CoupangOrderStatus): Promise<Order>;
  
  // 주문 상세 조회
  getOrder(id: string): Promise<Order>;
  
  // 기부 ID로 주문 조회
  getOrderByDonationId(donationId: string): Promise<Order>;
  
  // 쿠팡 주문 ID 설정
  setCoupangOrderId(id: string, coupangOrderId: string): Promise<Order>;
  
  // 배송 추적 번호 설정
  setTrackingNumber(id: string, trackingNumber: string): Promise<Order>;
} 