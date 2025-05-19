/**
 * GiftLink 결제 및 구매대행 시스템 타입 정의
 */

// 핵심 상태 열거형
export enum DonationStatus {
  PENDING = 'PENDING',           // 대기 중
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED', // 결제 확인됨
  ORDERED = 'ORDERED',           // 주문됨
  SHIPPED = 'SHIPPED',           // 배송 중
  DELIVERED = 'DELIVERED',       // 배송 완료
  SETTLEMENT_PENDING = 'SETTLEMENT_PENDING', // 정산 대기 중
  SETTLEMENT_COMPLETED = 'SETTLEMENT_COMPLETED', // 정산 완료
  FAILED = 'FAILED'              // 실패
}

export enum SettlementStatus {
  PENDING = 'PENDING',           // 대기 중
  CONFIRMED = 'CONFIRMED',       // 확인됨
  PAID = 'PAID',                 // 지불됨
  OVERDUE = 'OVERDUE',           // 지연됨
  DISPUTED = 'DISPUTED',         // 분쟁 중
  COMPLETED = 'COMPLETED'        // 완료됨
}

export enum CoupangOrderStatus {
  PENDING = 'PENDING',           // 대기 중
  ACCEPTED = 'ACCEPTED',         // 접수됨
  PREPARING = 'PREPARING',       // 상품 준비 중
  SHIPPED = 'SHIPPED',           // 배송 중
  DELIVERED = 'DELIVERED',       // 배송 완료
  CANCELLED = 'CANCELLED',       // 취소됨
  FAILED = 'FAILED'              // 실패
}

// 핵심 인터페이스 정의
export interface Donation {
  id: string;                    // 기부 ID
  storyId: string;               // 사연 ID
  donorId: string;               // 기부자 ID
  ngoId: string;                 // NGO ID
  amount: number;                // 기부 금액
  paymentReference: string;      // 결제 참조 번호 (가상계좌 입금 참조)
  message?: string;              // 기부자 메시지
  status: DonationStatus;        // 상태
  createdAt: Date;               // 생성일
  updatedAt: Date;               // 업데이트일
}

export interface Order {
  id: string;                    // 주문 ID
  donationId: string;            // 기부 ID
  coupangOrderId?: string;       // 쿠팡 주문 ID
  products: OrderProduct[];      // 주문 상품 목록
  totalAmount: number;           // 총 금액
  trackingNumber?: string;       // 배송 추적 번호
  status: CoupangOrderStatus;    // 상태
  errorMessage?: string;         // 오류 메시지
  createdAt: Date;               // 생성일
  updatedAt: Date;               // 업데이트일
}

export interface OrderProduct {
  id: string;                    // 상품 ID
  orderId: string;               // 주문 ID
  productId: string;             // 상품 ID
  productName: string;           // 상품명
  quantity: number;              // 수량
  unitPrice: number;             // 단가
  totalPrice: number;            // 총 가격
}

export interface Settlement {
  id: string;                    // 정산 ID
  ngoId: string;                 // NGO ID
  donations: string[];           // 기부 ID 목록
  totalAmount: number;           // 총 금액
  scheduledDate: Date;           // 예정일
  completedDate?: Date;          // 완료일
  paymentReference?: string;     // 결제 참조 번호
  status: SettlementStatus;      // 상태
  createdAt: Date;               // 생성일
  updatedAt: Date;               // 업데이트일
}

export interface CoupangPayment {
  id: string;                    // 결제 ID
  orderId: string;               // 주문 ID
  amount: number;                // 금액
  scheduledDate: Date;           // 예정일
  completedDate?: Date;          // 완료일
  status: string;                // 상태
  paymentReference?: string;     // 결제 참조 번호
  createdAt: Date;               // 생성일
  updatedAt: Date;               // 업데이트일
}

export interface NGO {
  id: string;                    // NGO ID
  name: string;                  // 이름
  virtualAccountNumber: string;  // 가상계좌 번호
  virtualAccountBank: string;    // 가상계좌 은행
  settlementDay: number;         // 정산일 (1-28)
  settlementPeriod: 'WEEKLY' | 'MONTHLY'; // 정산 주기
  contactEmail: string;          // 연락 이메일
  contactPhone: string;          // 연락 전화
  isActive: boolean;             // 활성 여부
}

export interface DepositInfo {
  ngoId: string;                 // NGO ID
  accountNumber: string;         // 계좌번호
  amount: number;                // 금액
  depositorName: string;         // 입금자명
  depositDateTime: Date;         // 입금일시
  transactionId: string;         // 거래 ID
} 