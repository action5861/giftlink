import { OrderService } from '../lib/services/order-service';
import { DonationService } from '../lib/services/donation-service';
import { CoupangApiService } from '../lib/services/coupang-api-service';

export class ShippingMonitor {
  constructor(
    private orderService: OrderService,
    private donationService: DonationService,
    private coupangApiService: CoupangApiService
  ) {}

  async checkShippingStatus(): Promise<void> {
    // 배송 상태 체크 로직 구현
    // 예: 주문 목록 조회 후 쿠팡 API로 배송 상태 확인
  }
} 