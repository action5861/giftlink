import { 
  DonationService, 
  Donation, 
  DonationStatus,
  DonationCreateInput
} from '../types';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// DonationFilters 타입 정의
export interface DonationFilters {
  status?: DonationStatus;
  ngoId?: string;
  donorId?: string;
  storyId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class DonationServiceImpl implements DonationService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * 기부 생성
   * @param donationData 기부 생성에 필요한 데이터
   * @throws {Error} 필수 정보 누락 시
   * @returns 생성된 기부 정보
   */
  async createDonation(donationData: DonationCreateInput): Promise<Donation> {
    if (!donationData.storyId || !donationData.donorId || !donationData.ngoId || !donationData.amount) {
      throw new Error('필수 기부 정보가 누락되었습니다.');
    }
    const donation = await this.prisma.donation.create({
      data: {
        storyId: donationData.storyId,
        donorId: donationData.donorId,
        ngoId: donationData.ngoId,
        amount: donationData.amount,
        message: donationData.message,
        status: DonationStatus.PENDING,
      }
    });
    return donation as Donation;
  }

  /**
   * 기부 상태 업데이트
   * @param id 기부 ID
   * @param status 변경할 상태
   * @throws {Error} 기부를 찾을 수 없거나 상태 변경이 불가능한 경우
   * @returns 업데이트된 기부 정보
   */
  async updateDonationStatus(id: string, status: DonationStatus): Promise<Donation> {
    const updatedDonation = await this.prisma.donation.update({
      where: { id },
      data: { status }
    });
    return updatedDonation as Donation;
  }

  /**
   * 기부 상세 조회
   * @param id 기부 ID
   * @throws {Error} 기부를 찾을 수 없는 경우
   * @returns 기부 정보
   */
  async getDonation(id: string): Promise<Donation> {
    const donation = await this.prisma.donation.findUnique({
      where: { id }
    });
    if (!donation) {
      throw new Error(`ID가 ${id}인 기부를 찾을 수 없습니다.`);
    }
    return donation as Donation;
  }

  /**
   * 기부 목록 조회
   * @param filters 조회 필터
   * @returns 기부 목록
   */
  async getDonations(filters: DonationFilters): Promise<Donation[]> {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.ngoId) where.ngoId = filters.ngoId;
    if (filters.donorId) where.donorId = filters.donorId;
    if (filters.storyId) where.storyId = filters.storyId;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }
    const donations = await this.prisma.donation.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return donations as Donation[];
  }

  async getDonationsByStory(storyId: string): Promise<Donation[]> {
    return this.prisma.donation.findMany({ where: { storyId } }) as Promise<Donation[]>;
  }

  async getDonationsByNgo(ngoId: string): Promise<Donation[]> {
    return this.prisma.donation.findMany({ where: { ngoId } }) as Promise<Donation[]>;
  }

  /**
   * 기부금 입금 확인
   * @param donationId 기부 ID
   * @param paymentReference 결제 참조 번호
   * @throws {Error} 기부를 찾을 수 없거나 이미 처리된 경우
   * @returns 업데이트된 기부 정보
   */
  async confirmDonationPayment(donationId: string, paymentReference: string): Promise<Donation> {
    const donation = await this.prisma.donation.findUnique({ where: { id: donationId } });
    if (!donation) {
      throw new Error(`ID가 ${donationId}인 기부를 찾을 수 없습니다.`);
    }
    if (donation.status !== DonationStatus.PENDING) {
      throw new Error(`ID가 ${donationId}인 기부는 이미 처리되었습니다.`);
    }
    const updatedDonation = await this.prisma.donation.update({
      where: { id: donationId },
      data: {
        paymentReference,
        status: DonationStatus.PAYMENT_CONFIRMED,
      }
    });
    return updatedDonation as Donation;
  }

  /**
   * 상태 전이 검증 (enum 값만 사용)
   * @private
   */
  private validateStatusTransition(currentStatus: DonationStatus, newStatus: DonationStatus): void {
    const validTransitions: Record<DonationStatus, DonationStatus[]> = {
      [DonationStatus.PENDING]: [DonationStatus.PAYMENT_CONFIRMED, DonationStatus.CANCELLED],
      [DonationStatus.PAYMENT_CONFIRMED]: [DonationStatus.ORDERED, DonationStatus.SETTLEMENT_PENDING],
      [DonationStatus.ORDERED]: [DonationStatus.SETTLEMENT_PENDING],
      [DonationStatus.SETTLEMENT_PENDING]: [DonationStatus.SETTLEMENT_COMPLETED],
      [DonationStatus.SETTLEMENT_COMPLETED]: [],
      [DonationStatus.DELIVERED]: [],
      [DonationStatus.CANCELLED]: [],
    };
    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`상태를 ${currentStatus}에서 ${newStatus}로 변경할 수 없습니다.`);
    }
  }
} 