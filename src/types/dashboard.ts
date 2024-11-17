// src/types/dashboard.ts
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
  
  export interface DashboardStatistics {
    totalAmount: number;
    monthlyAmount: number;
    yearlyGoal: number;
    progress: number;
    totalDonations: number;
  }
  
  export interface DashboardData {
    statistics: DashboardStatistics;
    recentDonations: DonationHistory[];
    upcomingPayments: Array<{
      id: string;
      amount: number;
      dueDate: Date;
      story: {
        beneficiaryName: string | null;
      };
    }>;
  }
  
  export interface UserProfile {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
    role: 'DONOR' | 'ADMIN';
  }