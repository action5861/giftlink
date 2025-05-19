import { DonationService } from '../lib/types';

export class DonationProcessor {
  private donationService: DonationService;

  constructor(donationService: DonationService) {
    this.donationService = donationService;
  }

  async startDonationProcess(donationData: any) {
    return this.donationService.createDonation(donationData);
  }
} 