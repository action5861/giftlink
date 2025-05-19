import { SettlementService } from '../lib/services/settlement-service';
import { CoupangPaymentService } from '../lib/services/coupang-payment-service';

export class SettlementProcessor {
  constructor(
    private settlementService: SettlementService,
    private coupangPaymentService: CoupangPaymentService
  ) {}

  async completeSettlement(settlementId: string, paymentReference: string): Promise<void> {
    // 정산 완료 로직 구현
    await this.settlementService.completeSettlement(settlementId, paymentReference);
  }
} 