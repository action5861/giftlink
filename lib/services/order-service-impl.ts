import { 
  OrderService, 
  DonationService, 
  CoupangApiService,
  Order,
  CoupangOrderStatus,
  OrderProduct,
  ShippingInfo
} from '../types';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export class OrderServiceImpl implements OrderService {
  private prisma: PrismaClient;
  private donationService: DonationService;
  private coupangApiService: CoupangApiService;

  constructor(
    prisma: PrismaClient,
    donationService: DonationService,
    coupangApiService: CoupangApiService
  ) {
    this.prisma = prisma;
    this.donationService = donationService;
    this.coupangApiService = coupangApiService;
  }

  /**
   * 주문 생성
   * @param donationId 기부 ID
   * @throws {Error} 기부가 존재하지 않거나 결제가 확인되지 않은 경우
   * @returns 생성된 주문 정보
   */
  async createOrder(donationId: string): Promise<Order> {
    try {
      // 기부 정보 조회
      const donation = await this.donationService.getDonation(donationId);
      
      // 기부 상태 확인
      if (donation.status !== 'PAYMENT_CONFIRMED') {
        throw new Error(`ID가 ${donationId}인 기부는 결제가 확인되지 않았습니다.`);
      }

      // 주문 상품 정보 조회
      const products = await this.getProductsForDonation(donation);

      // Prisma를 사용하여 주문 생성
      const order = await this.prisma.order.create({
        data: {
          donationId,
          totalAmount: products.reduce((sum, p) => sum + p.totalPrice, 0),
          status: CoupangOrderStatus.PENDING,
          products: {
            create: products.map(p => ({
              productId: p.productId,
              productName: p.productName,
              quantity: p.quantity,
              unitPrice: p.unitPrice,
              totalPrice: p.totalPrice
            }))
          }
        },
        include: {
          products: true,
          donation: {
            include: {
              story: true
            }
          }
        }
      });

      // 기부 상태 업데이트
      await this.donationService.updateDonationStatus(donationId, 'ORDERED');

      logger.info('주문 생성 완료', { 
        orderId: order.id, 
        donationId,
        productCount: products.length 
      });

      return order as Order;
    } catch (error) {
      logger.error('주문 생성 중 오류 발생', { error, donationId });
      throw error;
    }
  }

  /**
   * 주문 상태 업데이트
   * @param id 주문 ID
   * @param status 변경할 상태
   * @throws {Error} 주문을 찾을 수 없는 경우
   * @returns 업데이트된 주문 정보
   */
  async updateOrderStatus(id: string, status: CoupangOrderStatus): Promise<Order> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { 
          status,
          updatedAt: new Date()
        },
        include: { 
          products: true,
          donation: {
            include: {
              story: true
            }
          }
        }
      });

      logger.info('주문 상태 업데이트 완료', { 
        orderId: id, 
        status 
      });

      return updatedOrder as Order;
    } catch (error) {
      logger.error('주문 상태 업데이트 중 오류 발생', { error, orderId: id, status });
      throw error;
    }
  }

  /**
   * 주문 상세 조회
   * @param id 주문 ID
   * @throws {Error} 주문을 찾을 수 없는 경우
   * @returns 주문 정보
   */
  async getOrder(id: string): Promise<Order> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { 
          products: true,
          donation: {
            include: {
              story: true
            }
          }
        }
      });

      if (!order) {
        throw new Error(`ID가 ${id}인 주문을 찾을 수 없습니다.`);
      }

      return order as Order;
    } catch (error) {
      logger.error('주문 조회 중 오류 발생', { error, orderId: id });
      throw error;
    }
  }

  /**
   * 기부 ID로 주문 조회
   * @param donationId 기부 ID
   * @throws {Error} 주문을 찾을 수 없는 경우
   * @returns 주문 정보
   */
  async getOrderByDonationId(donationId: string): Promise<Order> {
    try {
      const order = await this.prisma.order.findFirst({
        where: { donationId },
        include: { 
          products: true,
          donation: {
            include: {
              story: true
            }
          }
        }
      });

      if (!order) {
        throw new Error(`기부 ID가 ${donationId}인 주문을 찾을 수 없습니다.`);
      }

      return order as Order;
    } catch (error) {
      logger.error('기부 ID로 주문 조회 중 오류 발생', { error, donationId });
      throw error;
    }
  }

  /**
   * 쿠팡 주문 ID 설정
   * @param id 주문 ID
   * @param coupangOrderId 쿠팡 주문 ID
   * @throws {Error} 주문을 찾을 수 없는 경우
   * @returns 업데이트된 주문 정보
   */
  async setCoupangOrderId(id: string, coupangOrderId: string): Promise<Order> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { 
          coupangOrderId,
          updatedAt: new Date()
        },
        include: { 
          products: true,
          donation: {
            include: {
              story: true
            }
          }
        }
      });

      logger.info('쿠팡 주문 ID 설정 완료', { 
        orderId: id, 
        coupangOrderId 
      });

      return updatedOrder as Order;
    } catch (error) {
      logger.error('쿠팡 주문 ID 설정 중 오류 발생', { error, orderId: id, coupangOrderId });
      throw error;
    }
  }

  /**
   * 배송 추적 번호 설정
   * @param id 주문 ID
   * @param trackingNumber 배송 추적 번호
   * @throws {Error} 주문을 찾을 수 없는 경우
   * @returns 업데이트된 주문 정보
   */
  async setTrackingNumber(id: string, trackingNumber: string): Promise<Order> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { 
          trackingNumber,
          updatedAt: new Date()
        },
        include: { 
          products: true,
          donation: {
            include: {
              story: true
            }
          }
        }
      });

      logger.info('배송 추적 번호 설정 완료', { 
        orderId: id, 
        trackingNumber 
      });

      return updatedOrder as Order;
    } catch (error) {
      logger.error('배송 추적 번호 설정 중 오류 발생', { error, orderId: id, trackingNumber });
      throw error;
    }
  }

  /**
   * 쿠팡에 주문 처리
   * @param orderId 주문 ID
   * @throws {Error} 주문을 찾을 수 없거나 이미 처리된 경우
   * @returns 업데이트된 주문 정보
   */
  async processCoupangOrder(orderId: string): Promise<Order> {
    try {
      // 주문 정보 조회
      const order = await this.getOrder(orderId);

      // 이미 처리된 주문인지 확인
      if (order.status !== CoupangOrderStatus.PENDING) {
        throw new Error(`ID가 ${orderId}인 주문은 이미 처리되었습니다.`);
      }

      // 기부 정보 조회하여 배송 정보 획득
      const donation = await this.donationService.getDonation(order.donationId);
      const shippingInfo = await this.getShippingInfoForDonation(donation);

      // 쿠팡 API로 주문 요청
      const coupangOrderResult = await this.coupangApiService.placeOrder(order.products, shippingInfo);

      // 주문 정보 업데이트
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          coupangOrderId: coupangOrderResult.orderId,
          status: CoupangOrderStatus.ACCEPTED,
          updatedAt: new Date()
        },
        include: { 
          products: true,
          donation: {
            include: {
              story: true
            }
          }
        }
      });

      logger.info('쿠팡 주문 처리 완료', { 
        orderId, 
        coupangOrderId: coupangOrderResult.orderId 
      });

      return updatedOrder as Order;
    } catch (error) {
      // 오류 발생 시 주문 상태 업데이트
      const failedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: CoupangOrderStatus.FAILED,
          errorMessage: error.message,
          updatedAt: new Date()
        },
        include: { 
          products: true,
          donation: {
            include: {
              story: true
            }
          }
        }
      });

      logger.error('쿠팡 주문 처리 중 오류 발생', { 
        error, 
        orderId,
        coupangOrderId: failedOrder.coupangOrderId 
      });

      throw error;
    }
  }

  /**
   * 기부에 필요한 상품 목록 조회
   * @private
   */
  private async getProductsForDonation(donation: any): Promise<OrderProduct[]> {
    try {
      const storyItems = await this.prisma.item.findMany({
        where: { storyId: donation.storyId }
      });

      return storyItems.map(item => ({
        id: `order_product_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        orderId: '', // 아직 주문 ID가 없으므로 빈 문자열로 설정
        productId: item.id,
        productName: item.name,
        quantity: 1,
        unitPrice: item.price,
        totalPrice: item.price
      }));
    } catch (error) {
      logger.error('상품 목록 조회 중 오류 발생', { error, donationId: donation.id });
      throw error;
    }
  }

  /**
   * 기부에 필요한 배송 정보 조회
   * @private
   */
  private async getShippingInfoForDonation(donation: any): Promise<ShippingInfo> {
    try {
      const story = await this.prisma.story.findUnique({
        where: { id: donation.storyId }
      });

      if (!story) {
        throw new Error(`ID가 ${donation.storyId}인 사연을 찾을 수 없습니다.`);
      }

      return {
        recipientName: story.recipientName,
        address: `${story.recipientRegion} ${story.recipientAddress}`,
        phone: story.recipientPhone,
        message: donation.message || '기부해주셔서 감사합니다.'
      };
    } catch (error) {
      logger.error('배송 정보 조회 중 오류 발생', { error, donationId: donation.id });
      throw error;
    }
  }
} 