// Service Interfaces
export interface DonationService {
  createDonation(data: DonationCreateInput): Promise<Donation>;
  updateDonationStatus(id: string, status: DonationStatus): Promise<Donation>;
  getDonation(id: string): Promise<Donation>;
  getDonationsByStory(storyId: string): Promise<Donation[]>;
  getDonationsByNgo(ngoId: string): Promise<Donation[]>;
  confirmDonationPayment(id: string, paymentReference: string): Promise<Donation>;
}

export interface OrderService {
  createOrder(donationId: string): Promise<Order>;
  updateOrderStatus(id: string, status: CoupangOrderStatus): Promise<Order>;
  getOrder(id: string): Promise<Order>;
  getOrderByDonationId(donationId: string): Promise<Order>;
  setCoupangOrderId(id: string, coupangOrderId: string): Promise<Order>;
  setTrackingNumber(id: string, trackingNumber: string): Promise<Order>;
  processCoupangOrder(orderId: string): Promise<Order>;
}

export interface SettlementService {
  createSettlement(ngoId: string, donationIds: string[]): Promise<Settlement>;
  updateSettlementStatus(id: string, status: SettlementStatus): Promise<Settlement>;
  completeSettlement(id: string, paymentReference: string): Promise<Settlement>;
  getSettlement(id: string): Promise<Settlement>;
  getSettlementsByNgo(ngoId: string, filters: SettlementFilters): Promise<Settlement[]>;
  getPendingDonationsForSettlement(ngoId: string): Promise<Donation[]>;
  createWeeklySettlements(): Promise<Settlement[]>;
  createMonthlySettlements(): Promise<Settlement[]>;
}

export interface CoupangPaymentService {
  createPayment(orderId: string, amount: number): Promise<CoupangPayment>;
  completePayment(id: string, paymentReference: string): Promise<CoupangPayment>;
  getPayment(id: string): Promise<CoupangPayment>;
  getPaymentByOrderId(orderId: string): Promise<CoupangPayment | null>;
  getPendingPayments(): Promise<CoupangPayment[]>;
}

export interface CoupangApiService {
  placeOrder(products: OrderProduct[], shippingInfo: any): Promise<{ orderId: string }>;
  getOrderStatus(coupangOrderId: string): Promise<CoupangOrderStatus>;
  getTrackingInfo(coupangOrderId: string): Promise<{ trackingNumber: string, status: string }>;
  cancelOrder(coupangOrderId: string): Promise<boolean>;
}

export interface VirtualAccountMonitorService {
  subscribeToDeposits(callback: (depositInfo: DepositInfo) => void): void;
  subscribeToNgoDeposits(ngoId: string, callback: (depositInfo: DepositInfo) => void): void;
  simulateDeposit(depositInfo: Partial<DepositInfo>): void;
}

export interface DepositInfo {
  ngoId: string;
  amount: number;
  depositorName: string;
  depositDateTime: Date;
  transactionId: string;
}

// Enums
export enum DonationStatus {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  ORDERED = 'ORDERED',
  DELIVERED = 'DELIVERED',
  SETTLEMENT_PENDING = 'SETTLEMENT_PENDING',
  SETTLEMENT_COMPLETED = 'SETTLEMENT_COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum CoupangOrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export enum SettlementStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  DISPUTED = 'DISPUTED'
}

export enum CoupangPaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Types
export interface Donation {
  id: string;
  storyId: string;
  donorId: string;
  ngoId: string;
  amount: number;
  message?: string;
  status: DonationStatus;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
  story?: Story;
  ngo?: NGO;
}

export interface Order {
  id: string;
  donationId: string;
  coupangOrderId?: string;
  trackingNumber?: string;
  totalAmount: number;
  status: CoupangOrderStatus;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  products: OrderProduct[];
  donation?: Donation;
}

export interface OrderProduct {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Settlement {
  id: string;
  ngoId: string;
  ngoName?: string;
  totalAmount: number;
  status: SettlementStatus;
  scheduledDate: Date;
  completedDate?: Date;
  paymentReference?: string;
}

export interface CoupangPayment {
  id: string;
  orderId: string;
  amount: number;
  status: CoupangPaymentStatus;
  scheduledDate: Date;
  completedDate?: Date;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
  order?: Order;
}

export interface NGO {
  id: string;
  name: string;
  settlementPeriod: 'WEEKLY' | 'MONTHLY';
  settlementDay: number;
  isActive: boolean;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  category: string;
  recipientName: string;
  recipientPhone: string;
  recipientAge: number;
  recipientGender: string;
  recipientRegion: string;
  recipientAddress: string;
  status: string;
  partnerId: string;
}

// Input Types
export interface DonationCreateInput {
  storyId: string;
  donorId: string;
  ngoId: string;
  amount: number;
  message?: string;
}

export interface SettlementFilters {
  status?: SettlementStatus;
  startDate?: Date;
  endDate?: Date;
} 