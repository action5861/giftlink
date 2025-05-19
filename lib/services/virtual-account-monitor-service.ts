import { DepositInfo } from '../types/payment';

export interface VirtualAccountMonitorService {
  // 가상계좌 입금 이벤트 구독
  subscribeToDeposits(callback: (depositInfo: DepositInfo) => void): void;
  
  // 특정 NGO 가상계좌 입금 이벤트 구독
  subscribeToNgoDeposits(ngoId: string, callback: (depositInfo: DepositInfo) => void): void;
} 