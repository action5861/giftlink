import { 
  DonationService, 
  OrderService, 
  VirtualAccountMonitorService 
} from '../services';
import { Donation, DepositInfo, DonationStatus } from '../types/payment';

export class DonationProcessor {
  private donationService: DonationService;
  private orderService: OrderService;
  private virtualAccountMonitorService: VirtualAccountMonitorService;
  
  constructor(
    donationService: DonationService,
    orderService: OrderService,
    virtualAccountMonitorService: VirtualAccountMonitorService
  ) {
    this.donationService = donationService;
    this.orderService = orderService;
    this.virtualAccountMonitorService = virtualAccountMonitorService;
    
    // 가상계좌 입금 이벤트 구독
    this.virtualAccountMonitorService.subscribeToDeposits(
      this.handleDeposit.bind(this)
    );
  }
  
  /**
   * 기부 프로세스 시작
   */
  async startDonationProcess(donationData: Partial<Donation>): Promise<Donation> {
    // 기부 생성
    const donation = await this.donationService.createDonation(donationData);
    
    // 가상계좌 입금 안내
    this.sendVirtualAccountInstructions(donation);
    
    return donation;
  }
  
  /**
   * 입금 처리
   */
  private async handleDeposit(depositInfo: DepositInfo): Promise<void> {
    try {
      // 입금과 기부 매칭
      const donationId = await this.matchDepositToDonation(depositInfo);
      
      if (donationId) {
        // 결제 확인
        const donation = await this.donationService.confirmDonationPayment(
          donationId,
          depositInfo.transactionId
        );
        
        // 주문 생성 및 처리
        const order = await this.orderService.createOrder(donation.id);
        await this.orderService.processCoupangOrder(order.id);
        
        console.log(`기부 ${donationId}에 대한 입금 처리 완료`);
      } else {
        console.log('매칭되는 기부를 찾을 수 없음:', depositInfo);
      }
    } catch (error) {
      console.error('입금 처리 중 오류 발생:', error);
    }
  }
  
  /**
   * 입금과 기부 매칭 (실제 구현 시 매칭 로직 필요)
   */
  private async matchDepositToDonation(depositInfo: DepositInfo): Promise<string | null> {
    // 실제 구현 시 입금자명, 금액 등을 기반으로 매칭 로직 구현
    // 예시로 입금자명으로 매칭하는 로직
    
    const donations = await this.donationService.getDonations({
      status: DonationStatus.PENDING,
      ngoId: depositInfo.ngoId
    });
    
    // 간단한 예시: 금액이 일치하는 첫 번째 기부 매칭
    const matchedDonation = donations.find(d => d.amount === depositInfo.amount);
    
    return matchedDonation ? matchedDonation.id : null;
  }
  
  /**
   * 가상계좌 입금 안내 (실제 구현 시 이메일, SMS 등으로 안내)
   */
  private sendVirtualAccountInstructions(donation: Donation): void {
    // 실제 구현 시 이메일, SMS 등으로 가상계좌 입금 안내
    console.log(`기부 ${donation.id}에 대한 가상계좌 입금 안내`);
    // 이메일 전송 로직 또는 알림 발송 로직 구현
  }
} 