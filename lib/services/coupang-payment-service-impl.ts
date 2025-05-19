import { 
  CoupangPaymentService, 
  OrderService, 
  CoupangPayment,
  CoupangPaymentStatus
} from '../types';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export class CoupangPaymentServiceImpl implements CoupangPaymentService {
  private prisma: PrismaClient;
  private orderService: OrderService;

  constructor(
    prisma: PrismaClient,
    orderService: OrderService
  ) {
    this.prisma = prisma;
    this.orderService = orderService;
  }

  /**
   * 결제 생성
   * @param orderId 주문 ID
   * @param amount 결제 금액
   * @throws {Error} 주문을 찾을 수 없거나 이미 결제가 존재하는 경우
   * @returns 생성된 결제 정보
   */
  async createPayment(orderId: string, amount: number): Promise<CoupangPayment> {
    try {
      // 주문 정보 조회
      const order = await this.orderService.getOrder(orderId);
      
      // 이미 결제가 있는지 확인
      const existingPayment = await this.getPaymentByOrderId(orderId);
      if (existingPayment) {
        throw new Error(`ID가 ${orderId}인 주문에 대한 결제가 이미 존재합니다.`);
      }

      // Prisma를 사용하여 결제 생성
      const payment = await this.prisma.coupangPayment.create({
        data: {
          orderId,
          amount,
          scheduledDate: this.calculateScheduledDate(),
          status: CoupangPaymentStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          order: true
        }
      });

      logger.info('쿠팡 결제 생성 완료', { 
        paymentId: payment.id, 
        orderId,
        amount,
        scheduledDate: payment.scheduledDate 
      });

      return payment as CoupangPayment;
    } catch (error) {
      logger.error('쿠팡 결제 생성 중 오류 발생', { error, orderId, amount });
      throw error;
    }
  }

  /**
   * 결제 완료 처리
   * @param id 결제 ID
   * @param paymentReference 결제 참조 번호
   * @throws {Error} 결제를 찾을 수 없거나 이미 완료된 경우
   * @returns 업데이트된 결제 정보
   */
  async completePayment(id: string, paymentReference: string): Promise<CoupangPayment> {
    try {
      // 결제 정보 조회
      const payment = await this.prisma.coupangPayment.findUnique({
        where: { id },
        include: {
          order: true
        }
      });

      if (!payment) {
        throw new Error(`ID가 ${id}인 결제를 찾을 수 없습니다.`);
      }

      // 이미 완료된 결제인지 확인
      if (payment.status === CoupangPaymentStatus.COMPLETED) {
        throw new Error(`ID가 ${id}인 결제는 이미 완료되었습니다.`);
      }

      // 결제 정보 업데이트
      const updatedPayment = await this.prisma.coupangPayment.update({
        where: { id },
        data: {
          paymentReference,
          status: CoupangPaymentStatus.COMPLETED,
          completedDate: new Date(),
          updatedAt: new Date()
        },
        include: {
          order: true
        }
      });

      logger.info('쿠팡 결제 완료 처리 완료', { 
        paymentId: id, 
        orderId: payment.orderId,
        paymentReference 
      });

      return updatedPayment as CoupangPayment;
    } catch (error) {
      logger.error('쿠팡 결제 완료 처리 중 오류 발생', { error, paymentId: id, paymentReference });
      throw error;
    }
  }

  /**
   * 결제 상세 조회
   * @param id 결제 ID
   * @throws {Error} 결제를 찾을 수 없는 경우
   * @returns 결제 정보
   */
  async getPayment(id: string): Promise<CoupangPayment> {
    try {
      const payment = await this.prisma.coupangPayment.findUnique({
        where: { id },
        include: {
          order: true
        }
      });

      if (!payment) {
        throw new Error(`ID가 ${id}인 결제를 찾을 수 없습니다.`);
      }

      return payment as CoupangPayment;
    } catch (error) {
      logger.error('쿠팡 결제 조회 중 오류 발생', { error, paymentId: id });
      throw error;
    }
  }

  /**
   * 주문 ID로 결제 조회
   * @param orderId 주문 ID
   * @returns 결제 정보 또는 null
   */
  async getPaymentByOrderId(orderId: string): Promise<CoupangPayment | null> {
    try {
      const payment = await this.prisma.coupangPayment.findFirst({
        where: { orderId },
        include: {
          order: true
        }
      });

      return payment as CoupangPayment;
    } catch (error) {
      logger.error('주문 ID로 쿠팡 결제 조회 중 오류 발생', { error, orderId });
      throw error;
    }
  }

  /**
   * 결제 예정 주문 목록 조회
   * @returns 결제 예정 주문 목록
   */
  async getPendingPayments(): Promise<CoupangPayment[]> {
    try {
      const pendingPayments = await this.prisma.coupangPayment.findMany({
        where: { 
          status: CoupangPaymentStatus.PENDING 
        },
        orderBy: { 
          scheduledDate: 'asc' 
        },
        include: {
          order: true
        }
      });

      return pendingPayments as CoupangPayment[];
    } catch (error) {
      logger.error('쿠팡 결제 예정 주문 목록 조회 중 오류 발생', { error });
      throw error;
    }
  }

  /**
   * 결제 예정일 계산
   * @private
   */
  private calculateScheduledDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 30일 후 (실제 쿠팡 비즈 계약에 따라 조정)
    return date;
  }
} 