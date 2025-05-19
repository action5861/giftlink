import { Donation, DonationStatus } from '../types/payment';

export interface DonationService {
  // 기부 생성
  createDonation(donationData: Partial<Donation>): Promise<Donation>;
  
  // 기부 상태 업데이트
  updateDonationStatus(id: string, status: DonationStatus): Promise<Donation>;
  
  // 기부 상세 조회
  getDonation(id: string): Promise<Donation>;
  
  // 기부 목록 조회
  getDonations(filters: any): Promise<Donation[]>;
  
  // 기부금 입금 확인
  confirmDonationPayment(donationId: string, paymentReference: string): Promise<Donation>;
} 