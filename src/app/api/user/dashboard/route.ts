// src/app/api/user/dashboard/route.ts
import { NextResponse } from 'next/server';

const mockDashboardData = {
  statistics: {
    totalAmount: 1250000,
    monthlyAmount: 350000,
    yearlyGoal: 5000000,
    progress: 25,
  },
  recentDonations: [
    {
      id: "1",
      amount: 150000,
      status: "DELIVERED",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
      story: {
        beneficiaryName: "김OO",
        region: "서울시 강남구"
      },
      item: {
        name: "생필품 세트",
        quantity: 1
      }
    },
    {
      id: "2",
      amount: 200000,
      status: "SHIPPING",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
      story: {
        beneficiaryName: "이OO",
        region: "부산시 해운대구"
      },
      item: {
        name: "식료품 패키지",
        quantity: 2
      }
    },
    {
      id: "3",
      amount: 100000,
      status: "PENDING",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
      story: {
        beneficiaryName: null,
        region: "인천시 부평구"
      },
      item: {
        name: "아동용품",
        quantity: 1
      }
    }
  ]
};

export async function GET() {
  // API 응답에 약간의 지연 추가 (로딩 상태 테스트용)
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    return NextResponse.json(mockDashboardData);
  } catch (error) {
    return NextResponse.json(
      { error: '데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}