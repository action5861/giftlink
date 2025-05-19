import { DonationProcessor } from '../processors/donation-processor';
import { DonationServiceImpl } from './services/donation-service-impl';
import { PrismaClient } from '@prisma/client';
import { VirtualAccountMonitorServiceImpl } from './services/virtual-account-monitor-service-impl';
import { SettlementServiceImpl } from './services/settlement-service-impl';

const prisma = new PrismaClient();
const donationService = new DonationServiceImpl(prisma);
const donationProcessor = new DonationProcessor(donationService);
const virtualAccountMonitorService = new VirtualAccountMonitorServiceImpl();
const settlementService = new SettlementServiceImpl(prisma);

export const container = {
  resolve<T>(token: string | (new (...args: any[]) => T)): T {
    if (token === DonationProcessor) {
      return donationProcessor as T;
    }
    if (token === 'VirtualAccountMonitorService') {
      return virtualAccountMonitorService as T;
    }
    if (token === 'SettlementService') {
      return settlementService as T;
    }
    throw new Error(`No provider for ${token}`);
  }
}; 