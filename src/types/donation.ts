export interface DonationItem {
    id: string;
    name: string;
    quantity: number;
    price: number | null;
  }
  
  export interface DonationStory {
    beneficiaryName: string | null;
    region: string;
  }
  
  export interface DonationHistory {
    id: string;
    createdAt: Date;
    amount: number;
    status: 'PENDING' | 'PAID' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
    story: DonationStory;
    item: DonationItem;
    userId: string;
  }
  
  