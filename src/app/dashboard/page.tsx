// src/app/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  TrendingUp, 
  Calendar, 
  Target,
  Gift
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';


// 타입 정의
interface DashboardData {
  statistics: {
    totalAmount: number;
    monthlyAmount: number;
    yearlyGoal: number;
    progress: number;
  };
  recentDonations: Array<{
    id: string;
    amount: number;
    status: DonationStatus;
    createdAt: string;
    story: {
      beneficiaryName: string | null;
      region: string;
    };
    item: {
      name: string;
      quantity: number;
    };
  }>;
}

type DonationStatus = 'PENDING' | 'PAID' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

// 공통 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="h-8 w-8 animate-spin text-[#1A4747]" />
  </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div role="alert" className="p-6 bg-red-50 rounded-xl max-w-lg mx-auto mt-8">
    <h2 className="text-xl font-semibold text-red-800 mb-2">오류가 발생했습니다</h2>
    <p className="text-red-600 mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      다시 시도
    </button>
  </div>
);

const StatCard = ({ 
  title, 
  value, 
  icon: Icon,
  subValue,
  className = "" 
}: { 
  title: string; 
  value: string | number;
  icon: any;
  subValue?: string;
  className?: string;
}) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
    <div className="flex items-center gap-4">
      <div className="p-3 bg-[#F0F7F7] rounded-lg">
        <Icon className="h-6 w-6 text-[#1A4747]" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-[#1A4747]">{value}</p>
        {subValue && (
          <p className="text-sm text-gray-500 mt-1">{subValue}</p>
        )}
      </div>
    </div>
  </div>
);

const DonationStatusBadge = ({ status }: { status: DonationStatus }) => {
  const statusConfig = {
    DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', label: '전달완료' },
    SHIPPING: { bg: 'bg-blue-100', text: 'text-blue-800', label: '배송중' },
    PAID: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '결제완료' },
    PENDING: { bg: 'bg-gray-100', text: 'text-gray-800', label: '대기중' },
    CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: '취소됨' },
  };

  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

function DashboardContent() {
  const [mounted, setMounted] = useState(false);
  
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/user/dashboard');
      if (!response.ok) {
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }
      return response.json();
    },
    enabled: mounted,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F7F7] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F0F7F7] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A4747]">대시보드</h1>
          <p className="text-gray-600">나의 기부 현황을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="총 기부금액"
            value={`₩${data.statistics.totalAmount.toLocaleString()}`}
            icon={TrendingUp}
          />
          <StatCard
            title="이번 달 기부"
            value={`₩${data.statistics.monthlyAmount.toLocaleString()}`}
            icon={Calendar}
          />
          <StatCard
            title="연간 목표"
            value={`₩${data.statistics.yearlyGoal.toLocaleString()}`}
            subValue={`${data.statistics.progress}% 달성`}
            icon={Target}
          />
          <StatCard
            title="최근 기부"
            value={data.recentDonations.length}
            subValue="건의 기부 진행중"
            icon={Gift}
          />
        </div>

        {/* 기부 내역 테이블 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#1A4747]">최근 기부 내역</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    일시
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수혜자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    물품
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recentDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
  <div className="flex flex-col">
    <span className="text-sm font-medium text-gray-900">
      {format(new Date(donation.createdAt), 'yyyy.MM.dd', { locale: ko })}
    </span>
    <span className="text-xs text-gray-500">
      {format(new Date(donation.createdAt), 'HH:mm', { locale: ko })}
    </span>
  </div>
</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {donation.story.beneficiaryName || '익명'}
                        </div>
                        <div className="text-sm text-gray-500">{donation.story.region}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.item.name}</div>
                      <div className="text-sm text-gray-500">{donation.item.quantity}개</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₩{donation.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DonationStatusBadge status={donation.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DashboardContent />
    </ErrorBoundary>
  );
}