'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  RefreshCw, 
  Loader2,
  FileText,
  CreditCard
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// 기부 상태 타입 정의
type DonationStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

// 기부 데이터 타입 정의
interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  storyId: string;
  storyTitle: string;
  amount: number;
  status: DonationStatus;
  itemName: string;
  trackingNumber: string | null;
  createdAt: Date;
  partner: string;
}

// 임시 기부 데이터
const mockDonations: Donation[] = [
  {
    id: 'd1',
    donorId: 'user1',
    donorName: '홍길동',
    donorEmail: 'hong@example.com',
    storyId: '1',
    storyTitle: '겨울을 따뜻하게 보내고 싶어요',
    amount: 67000,
    status: 'COMPLETED',
    itemName: '따뜻한 겨울 이불 세트',
    trackingNumber: '1234567890',
    createdAt: new Date('2023-12-15T09:30:00'),
    partner: '굿네이버스',
  },
  {
    id: 'd2',
    donorId: 'user2',
    donorName: '김철수',
    donorEmail: 'kim@example.com',
    storyId: '3',
    storyTitle: '생리대가 필요해요',
    amount: 36000,
    status: 'SHIPPED',
    itemName: '생리대 6개월 세트',
    trackingNumber: '0987654321',
    createdAt: new Date('2023-12-12T15:45:00'),
    partner: '굿네이버스',
  },
  {
    id: 'd3',
    donorId: 'user3',
    donorName: '이영희',
    donorEmail: 'lee@example.com',
    storyId: '2',
    storyTitle: '학교 준비물이 필요해요',
    amount: 25000,
    status: 'PENDING',
    itemName: '기본 학용품 세트',
    trackingNumber: null,
    createdAt: new Date('2023-12-10T11:20:00'),
    partner: '세이브더칠드런',
  },
  {
    id: 'd4',
    donorId: 'user4',
    donorName: '박지민',
    donorEmail: 'park@example.com',
    storyId: '4',
    storyTitle: '면접 준비를 위한 정장이 필요합니다',
    amount: 120000,
    status: 'PROCESSING',
    itemName: '면접용 정장 세트',
    trackingNumber: null,
    createdAt: new Date('2023-12-08T14:10:00'),
    partner: '사랑의 열매',
  },
  {
    id: 'd5',
    donorId: 'user5',
    donorName: '최민수',
    donorEmail: 'choi@example.com',
    storyId: '5',
    storyTitle: '아기 기저귀가 필요해요',
    amount: 58000,
    status: 'SHIPPED',
    itemName: '아기 기저귀 3개월분',
    trackingNumber: '5647382910',
    createdAt: new Date('2023-12-05T09:55:00'),
    partner: '유니세프',
  },
  {
    id: 'd6',
    donorId: 'user1',
    donorName: '홍길동',
    donorEmail: 'hong@example.com',
    storyId: '6',
    storyTitle: '노인 영양제가 필요합니다',
    amount: 47000,
    status: 'COMPLETED',
    itemName: '종합 영양제 세트',
    trackingNumber: '1928374650',
    createdAt: new Date('2023-11-30T15:30:00'),
    partner: '행복나눔재단',
  },
  {
    id: 'd7',
    donorId: 'user6',
    donorName: '정수진',
    donorEmail: 'jung@example.com',
    storyId: '7',
    storyTitle: '장애인용 휠체어가 필요합니다',
    amount: 250000,
    status: 'CANCELLED',
    itemName: '휠체어',
    trackingNumber: null,
    createdAt: new Date('2023-11-25T10:45:00'),
    partner: '대한적십자사',
  },
];

// 상태별 배지 스타일 설정
const donationStatusStyles: Record<DonationStatus, { variant: string; text: string }> = {
  PENDING: { variant: 'secondary', text: '대기 중' },
  PROCESSING: { variant: 'warning', text: '처리 중' },
  SHIPPED: { variant: 'info', text: '배송 중' },
  COMPLETED: { variant: 'success', text: '완료됨' },
  FAILED: { variant: 'destructive', text: '실패' },
  CANCELLED: { variant: 'outline', text: '취소됨' },
};

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DonationStatus | ''>('');
  
  useEffect(() => {
    // 데이터 로드
    loadDonations();
  }, []);
  
  const loadDonations = () => {
    setLoading(true);
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      setDonations(mockDonations);
      setLoading(false);
    }, 500);
  };
  
  // 필터링된 기부 목록
  const filteredDonations = donations.filter(donation => {
    // 상태 필터
    if (statusFilter && donation.status !== statusFilter) {
      return false;
    }
    
    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        donation.donorName.toLowerCase().includes(query) ||
        donation.storyTitle.toLowerCase().includes(query) ||
        donation.itemName.toLowerCase().includes(query) ||
        donation.partner.toLowerCase().includes(query) ||
        (donation.trackingNumber && donation.trackingNumber.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // 상태별 통계
  const statusCounts = {
    total: donations.length,
    pending: donations.filter(d => d.status === 'PENDING').length,
    processing: donations.filter(d => d.status === 'PROCESSING').length,
    shipped: donations.filter(d => d.status === 'SHIPPED').length,
    completed: donations.filter(d => d.status === 'COMPLETED').length,
    cancelled: donations.filter(d => d.status === 'CANCELLED' || d.status === 'FAILED').length,
  };
  
  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setSearchQuery(formData.get('searchQuery') as string || '');
  };
  
  // 상태 필터 핸들러
  const handleStatusFilter = (status: DonationStatus | '') => {
    setStatusFilter(status === statusFilter ? '' : status);
  };
  
  // 상태 배지 렌더링 함수
  const renderStatusBadge = (status: DonationStatus) => {
    const style = donationStatusStyles[status];
    return (
      <Badge variant={style.variant as any} className="capitalize">
        {style.text}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">기부 관리</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadDonations}
          disabled={loading}
          className="gap-1"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>새로고침</span>
        </Button>
      </div>
      
      {/* 상태별 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === '' ? 'border-primary' : ''}`}
          onClick={() => handleStatusFilter('')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold mb-1">{statusCounts.total}</div>
            <div className="text-sm text-muted-foreground">전체</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === 'PENDING' ? 'border-primary' : ''}`}
          onClick={() => handleStatusFilter('PENDING')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold mb-1">{statusCounts.pending}</div>
            <div className="text-sm text-muted-foreground">대기 중</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === 'PROCESSING' ? 'border-primary' : ''}`}
          onClick={() => handleStatusFilter('PROCESSING')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold mb-1">{statusCounts.processing}</div>
            <div className="text-sm text-muted-foreground">처리 중</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === 'SHIPPED' ? 'border-primary' : ''}`}
          onClick={() => handleStatusFilter('SHIPPED')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold mb-1">{statusCounts.shipped}</div>
            <div className="text-sm text-muted-foreground">배송 중</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === 'COMPLETED' ? 'border-primary' : ''}`}
          onClick={() => handleStatusFilter('COMPLETED')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold mb-1">{statusCounts.completed}</div>
            <div className="text-sm text-muted-foreground">완료됨</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${statusFilter === 'CANCELLED' ? 'border-primary' : ''}`}
          onClick={() => handleStatusFilter('CANCELLED')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold mb-1">{statusCounts.cancelled}</div>
            <div className="text-sm text-muted-foreground">취소/실패</div>
          </CardContent>
        </Card>
      </div>
      
      {/* 검색 */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="searchQuery"
                placeholder="기부자, 사연, 물품, 트래킹 번호로 검색..."
                className="pl-9"
                defaultValue={searchQuery}
              />
            </div>
            <Button type="submit" size="sm" className="mt-0">
              검색
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* 기부 목록 테이블 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            기부 목록
            {loading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDonations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {loading ? '데이터를 불러오는 중...' : '조건에 맞는 기부 내역이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>기부자</TableHead>
                    <TableHead>사연</TableHead>
                    <TableHead>물품</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>파트너</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>배송 번호</TableHead>
                    <TableHead>기부일</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{donation.donorName}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={donation.storyTitle}>
                        {donation.storyTitle}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={donation.itemName}>
                        {donation.itemName}
                      </TableCell>
                      <TableCell>{donation.amount.toLocaleString()}원</TableCell>
                      <TableCell>{donation.partner}</TableCell>
                      <TableCell>{renderStatusBadge(donation.status)}</TableCell>
                      <TableCell>
                        {donation.trackingNumber ? (
                          <span className="text-xs">{donation.trackingNumber}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">없음</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(donation.createdAt, 'yyyy-MM-dd')}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/admin/donations/${donation.id}`}>
                            상세보기
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 