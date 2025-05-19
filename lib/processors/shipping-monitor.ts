import { 
  OrderService, 
  DonationService, 
  CoupangApiService 
} from '../services';
import { Order, CoupangOrderStatus, DonationStatus } from '../types/payment';

export class ShippingMonitor {
  private orderService: OrderService;
  private donationService: DonationService;
  private coupangApiService: CoupangApiService;
  
  constructor(
    orderService: OrderService,
    donationService: DonationService,
    coupangApiService: CoupangApiService
  ) {
    this.orderService = orderService;
    this.donationService = donationService;
    this.coupangApiService = coupangApiService;
    
    // 배송 상태 모니터링 작업 스케줄링
    this.scheduleShippingStatusCheck();
  }
  
  /**
   * 배송 상태 확인 스케줄링
   */
  private scheduleShippingStatusCheck(): void {
    // 실제 구현 시 cron 또는 유사한 스케줄러 사용
    console.log('배송 상태 확인 작업 스케줄링');
    
    // 예시로 1시간마다 실행
    // 실제로는 더 정교한 스케줄링 라이브러리 사용 필요
    const checkShippingStatus = async () => {
      try {
        // 배송 중인 주문 조회
        const orders = await this.getOrdersInProgress();
        
        for (const order of orders) {
          await this.updateOrderShippingStatus(order);
        }
        
        console.log(`${orders.length}개 주문의 배송 상태 업데이트 완료`);
      } catch (error) {
        console.error('배송 상태 확인 중 오류 발생:', error);
      }
    };
    
    // 실제 구현 시 스케줄러로 1시간마다 실행
  }
  
  /**
   * 진행 중인 주문 조회 (실제 구현 시 주문 서비스에서 조회)
   */
  private async getOrdersInProgress(): Promise<Order[]> {
    // 실제 구현 시 주문 서비스에서 진행 중인 주문 조회
    // 여기서는 예시로 빈 배열 반환
    return [];
  }
  
  /**
   * 주문 배송 상태 업데이트
   */
  private async updateOrderShippingStatus(order: Order): Promise<void> {
    try {
      // 쿠팡 API로 주문 상태 조회
      const coupangOrderStatus = await this.coupangApiService.getOrderStatus(order.coupangOrderId!);
      
      // 상태가 변경된 경우에만 업데이트
      if (order.status !== coupangOrderStatus) {
        // 주문 상태 업데이트
        await this.orderService.updateOrderStatus(order.id, coupangOrderStatus);
        
        // 배송 중 상태로 변경된 경우 배송 추적 정보 업데이트
        if (coupangOrderStatus === CoupangOrderStatus.SHIPPED) {
          const trackingInfo = await this.coupangApiService.getTrackingInfo(order.coupangOrderId!);
          await this.orderService.setTrackingNumber(order.id, trackingInfo.trackingNumber);
        }
        
        // 배송 완료 상태로 변경된 경우 기부 상태 업데이트
        if (coupangOrderStatus === CoupangOrderStatus.DELIVERED) {
          // 기부 상태를 배송 완료로 업데이트
          await this.donationService.updateDonationStatus(
            order.donationId,
            DonationStatus.DELIVERED
          );
          
          // 배송 완료 알림 발송
          this.sendDeliveryNotification(order);
        }
      }
    } catch (error) {
      console.error(`주문 ${order.id}의 배송 상태 업데이트 중 오류 발생:`, error);
    }
  }
  
  /**
   * 배송 완료 알림 발송 (실제 구현 시 이메일, SMS 등으로 구현)
   */
  private sendDeliveryNotification(order: Order): void {
    // 실제 구현 시 이메일, SMS 등으로 알림 발송
    console.log(`주문 ${order.id} 배송 완료 알림 발송`);
  }
} 