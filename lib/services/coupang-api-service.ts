import { OrderProduct, CoupangOrderStatus } from '../types/payment';

export interface CoupangApiService {
  // 상품 주문
  placeOrder(products: OrderProduct[], shippingInfo: any): Promise<{ orderId: string }>;
  
  // 주문 상태 조회
  getOrderStatus(coupangOrderId: string): Promise<CoupangOrderStatus>;
  
  // 배송 추적 조회
  getTrackingInfo(coupangOrderId: string): Promise<{ trackingNumber: string, status: string }>;
  
  // 주문 취소
  cancelOrder(coupangOrderId: string): Promise<boolean>;
} 