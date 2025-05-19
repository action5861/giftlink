import { Settlement, SettlementStatus, Donation } from '../types/payment';

export interface SettlementService {
  // 정산 생성
  createSettlement(ngoId: string, donationIds: string[]): Promise<Settlement>;
  
  // 정산 상태 업데이트
  updateSettlementStatus(id: string, status: SettlementStatus): Promise<Settlement>;
  
  // 정산 완료 처리
  completeSettlement(id: string, paymentReference: string): Promise<Settlement>;
  
  // 정산 상세 조회
  getSettlement(id: string): Promise<Settlement>;
  
  // NGO ID로 정산 목록 조회
  getSettlementsByNgo(ngoId: string, filters: any): Promise<Settlement[]>;
  
  // 정산 예정 기부 목록 조회
  getPendingDonationsForSettlement(ngoId: string): Promise<Donation[]>;
  
  // 주간 정산 생성
  createWeeklySettlements(): Promise<Settlement[]>;
  
  // 월간 정산 생성
  createMonthlySettlements(): Promise<Settlement[]>;
} 