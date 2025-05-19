import { container } from './container';
import { 
  DonationProcessor, 
  SettlementProcessor, 
  ShippingMonitor 
} from '../processors/index';

/**
 * GiftLink 시스템 설정 인터페이스
 */
export interface GiftLinkConfig {
  coupangApi: {
    apiKey: string;
    secretKey: string;
    baseUrl: string;
  };
  schedulers: {
    settlementCheck: string; // cron 패턴
    shippingStatusCheck: string; // cron 패턴
  };
}

/**
 * GiftLink 시스템 클래스
 */
export class GiftLinkSystem {
  private config: GiftLinkConfig;
  private isRunning: boolean = false;
  
  constructor(config: GiftLinkConfig) {
    this.config = config;
  }
  
  /**
   * 시스템 실행
   */
  start(): void {
    if (this.isRunning) {
      console.log('시스템이 이미 실행 중입니다.');
      return;
    }
    
    console.log('GiftLink 시스템 실행');
    
    // 프로세서 인스턴스 가져오기
    const donationProcessor = container.resolve<DonationProcessor>('DonationProcessor');
    const settlementProcessor = container.resolve<SettlementProcessor>('SettlementProcessor');
    const shippingMonitor = container.resolve<ShippingMonitor>('ShippingMonitor');
    
    // 스케줄러 시작 (프로세서 내부에서 처리)
    
    // 실행 중 상태로 설정
    this.isRunning = true;
  }
  
  /**
   * 시스템 중지
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('시스템이 이미 중지되었습니다.');
      return;
    }
    
    console.log('GiftLink 시스템 종료');
    
    // 실행 중지 상태로 설정
    this.isRunning = false;
    
    // 추가 정리 작업이 필요할 경우 여기에 구현
  }
  
  /**
   * 기부 처리기 반환
   */
  getDonationProcessor(): DonationProcessor {
    return container.resolve<DonationProcessor>('DonationProcessor');
  }
  
  /**
   * 정산 처리기 반환
   */
  getSettlementProcessor(): SettlementProcessor {
    return container.resolve<SettlementProcessor>('SettlementProcessor');
  }
  
  /**
   * 배송 모니터링 반환
   */
  getShippingMonitor(): ShippingMonitor {
    return container.resolve<ShippingMonitor>('ShippingMonitor');
  }
} 