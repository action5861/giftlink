import { PrismaClient, Prisma } from '@prisma/client';
import { 
  SettlementService, 
  Settlement, 
  SettlementStatus, 
  SettlementFilters,
  Donation,
  NGO,
  DonationStatus
} from '../types';
import { logger } from '../utils/logger';

export class SettlementServiceImpl implements SettlementService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createSettlement(ngoId: string, donationIds: string[]): Promise<Settlement> {
    try {
      // Get total amount from donations
      const donations = await this.prisma.donation.findMany({
        where: {
          id: { in: donationIds },
          ngoId,
          status: DonationStatus.SETTLEMENT_PENDING
        }
      });

      const totalAmount = donations.reduce((sum: number, d: Donation) => sum + d.amount, 0);

      // Create settlement
      const settlement = await this.prisma.$transaction(async (tx) => {
        const settlement = await tx.settlement.create({
          data: {
            ngoId,
            totalAmount,
            status: SettlementStatus.PENDING,
            scheduledDate: new Date(),
            donations: {
              connect: donationIds.map(id => ({ id }))
            }
          },
          include: {
            donations: true,
            ngo: true
          }
        });

        // Update donation statuses
        await tx.donation.updateMany({
          where: {
            id: { in: donationIds }
          },
          data: {
            status: DonationStatus.SETTLEMENT_PENDING
          }
        });

        return settlement;
      });

      logger.info('Settlement created', { settlementId: settlement.id, ngoId, totalAmount });
      return settlement;
    } catch (error) {
      logger.error('Error creating settlement', { error, ngoId, donationIds });
      throw error;
    }
  }

  async updateSettlementStatus(id: string, status: SettlementStatus): Promise<Settlement> {
    try {
      const settlement = await this.prisma.$transaction(async (tx) => {
        const settlement = await tx.settlement.update({
          where: { id },
          data: { 
            status,
            updatedAt: new Date()
          },
          include: {
            donations: true,
            ngo: true
          }
        });

        // Update donation statuses if settlement is completed
        if (status === SettlementStatus.COMPLETED) {
          await tx.donation.updateMany({
            where: {
              id: { in: settlement.donations.map(d => d.id) }
            },
            data: {
              status: DonationStatus.SETTLEMENT_COMPLETED
            }
          });
        }

        return settlement;
      });

      logger.info('Settlement status updated', { settlementId: id, status });
      return settlement;
    } catch (error) {
      logger.error('Error updating settlement status', { error, settlementId: id, status });
      throw error;
    }
  }

  async completeSettlement(id: string, paymentReference: string): Promise<Settlement> {
    try {
      const settlement = await this.prisma.$transaction(async (tx) => {
        const settlement = await tx.settlement.update({
          where: { id },
          data: {
            status: SettlementStatus.COMPLETED,
            completedDate: new Date(),
            paymentReference,
            updatedAt: new Date()
          },
          include: {
            donations: true,
            ngo: true
          }
        });

        // Update donation statuses
        await tx.donation.updateMany({
          where: {
            id: { in: settlement.donations.map(d => d.id) }
          },
          data: {
            status: DonationStatus.SETTLEMENT_COMPLETED
          }
        });

        return settlement;
      });

      logger.info('Settlement completed', { settlementId: id, paymentReference });
      return settlement;
    } catch (error) {
      logger.error('Error completing settlement', { error, settlementId: id, paymentReference });
      throw error;
    }
  }

  async getSettlement(id: string): Promise<Settlement> {
    try {
      const settlement = await this.prisma.settlement.findUnique({
        where: { id },
        include: {
          donations: true,
          ngo: true
        }
      });

      if (!settlement) {
        throw new Error(`Settlement not found: ${id}`);
      }

      return settlement;
    } catch (error) {
      logger.error('Error getting settlement', { error, settlementId: id });
      throw error;
    }
  }

  async getSettlementsByNgo(ngoId: string, filters: SettlementFilters): Promise<Settlement[]> {
    try {
      const where = this.buildWhereClause(ngoId, filters);
      
      const settlements = await this.prisma.settlement.findMany({
        where,
        include: {
          donations: true,
          ngo: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return settlements;
    } catch (error) {
      logger.error('Error getting settlements by NGO', { error, ngoId, filters });
      throw error;
    }
  }

  async getPendingDonationsForSettlement(ngoId: string): Promise<Donation[]> {
    try {
      const donations = await this.prisma.donation.findMany({
        where: {
          ngoId,
          status: DonationStatus.SETTLEMENT_PENDING
        },
        include: {
          story: true
        }
      });

      return donations;
    } catch (error) {
      logger.error('Error getting pending donations', { error, ngoId });
      throw error;
    }
  }

  async createWeeklySettlements(): Promise<Settlement[]> {
    try {
      const ngos = await this.prisma.ngo.findMany({
        where: {
          isActive: true,
          settlementPeriod: 'WEEKLY'
        }
      });

      const settlements: Settlement[] = [];
      for (const ngo of ngos) {
        const pendingDonations = await this.getPendingDonationsForSettlement(ngo.id);
        if (pendingDonations.length > 0) {
          const settlement = await this.createSettlement(
            ngo.id,
            pendingDonations.map(d => d.id)
          );
          settlements.push(settlement);
        }
      }

      logger.info('Weekly settlements created', { count: settlements.length });
      return settlements;
    } catch (error) {
      logger.error('Error creating weekly settlements', { error });
      throw error;
    }
  }

  async createMonthlySettlements(): Promise<Settlement[]> {
    try {
      const ngos = await this.prisma.ngo.findMany({
        where: {
          isActive: true,
          settlementPeriod: 'MONTHLY'
        }
      });

      const settlements: Settlement[] = [];
      for (const ngo of ngos) {
        const pendingDonations = await this.getPendingDonationsForSettlement(ngo.id);
        if (pendingDonations.length > 0) {
          const settlement = await this.createSettlement(
            ngo.id,
            pendingDonations.map(d => d.id)
          );
          settlements.push(settlement);
        }
      }

      logger.info('Monthly settlements created', { count: settlements.length });
      return settlements;
    } catch (error) {
      logger.error('Error creating monthly settlements', { error });
      throw error;
    }
  }

  private buildWhereClause(ngoId: string, filters: SettlementFilters): Prisma.SettlementWhereInput {
    const where: Prisma.SettlementWhereInput = { ngoId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return where;
  }
} 