import { VirtualAccountMonitorService, DepositInfo } from '../types';
import { EventEmitter } from 'events';

export class VirtualAccountMonitorServiceImpl implements VirtualAccountMonitorService {
  private depositEmitter: EventEmitter;
  private ngoDepositEmitters: Map<string, EventEmitter>;
  
  // 실제 구현에서는 은행 API 연동
  private bankApiClient: any;

  constructor(bankApiClient?: any) {
    this.depositEmitter = new EventEmitter();
    this.ngoDepositEmitters = new Map<string, EventEmitter>();
    this.bankApiClient = bankApiClient;
    
    // 입금 이벤트 리스너 설정
    this.setupDepositListener();
  }

  /**
   * 가상계좌 입금 이벤트 구독
   */
  subscribeToDeposits(callback: (depositInfo: DepositInfo) => void): void {
    this.depositEmitter.on('deposit', callback);
  }

  /**
   * 특정 NGO 가상계좌 입금 이벤트 구독
   */
  subscribeToNgoDeposits(ngoId: string, callback: (depositInfo: DepositInfo) => void): void {
    if (!this.ngoDepositEmitters.has(ngoId)) {
      this.ngoDepositEmitters.set(ngoId, new EventEmitter());
    }
    
    const emitter = this.ngoDepositEmitters.get(ngoId);
    if (emitter) {
      emitter.on('deposit', callback);
    }
  }

  /**
   * 입금 이벤트 시뮬레이션 (개발 환경에서만 사용)
   */
  simulateDeposit(depositInfo: Partial<DepositInfo>): void {
    const defaultInfo: Partial<DepositInfo> = {
      ngoId: `ngo_${Math.floor(Math.random() * 3) + 1}`,
      amount: Math.floor(Math.random() * 100000) + 10000,
      depositorName: `기부자${Math.floor(Math.random() * 100)}`,
      depositDateTime: new Date(),
      transactionId: `trans_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
    
    const fullDepositInfo = { ...defaultInfo, ...depositInfo } as DepositInfo;
    
    // 전역 입금 이벤트 발생
    this.depositEmitter.emit('deposit', fullDepositInfo);
    
    // NGO별 입금 이벤트 발생
    const ngoEmitter = this.ngoDepositEmitters.get(fullDepositInfo.ngoId);
    if (ngoEmitter) {
      ngoEmitter.emit('deposit', fullDepositInfo);
    }
  }

  /**
   * 입금 리스너 설정
   */
  private setupDepositListener(): void {
    // 실제 구현에서는 은행 API 연동
    console.log('가상계좌 입금 모니터링 시작');
    
    // 실제 구현 예시: 은행 API 웹훅 설정
    if (this.bankApiClient) {
      this.bankApiClient.on('deposit', (depositInfo: DepositInfo) => {
        // 입금 이벤트 처리
        this.depositEmitter.emit('deposit', depositInfo);
        // NGO별 입금 이벤트 발생
        const ngoEmitter = this.ngoDepositEmitters.get(depositInfo.ngoId);
        if (ngoEmitter) {
          ngoEmitter.emit('deposit', depositInfo);
        }
      });
    } else {
      // 개발 환경에서 입금 이벤트 시뮬레이션
      setInterval(() => {
        // 10% 확률로 입금 이벤트 발생
        if (Math.random() > 0.9) {
          this.simulateDeposit({});
        }
      }, 5000); // 5초마다 확인
    }
  }
} 