'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  User, 
  FileText, 
  Package, 
  Truck, 
  Clock, 
  RefreshCw,
  MessageSquare,
  Loader2,
  Save,
  CreditCard,
  AlertCircle,
  Building
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// 기부 상태 타입 정의
type DonationStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

// 상태 이력 타입 정의
interface StatusHistory {
  status: DonationStatus;
  timestamp: Date;
  note: string;
}

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
  itemId: string;
  itemName: string;
  trackingNumber: string | null;
  message: string;
  thankyouMessage: string;
  partnerId: string;
  partnerName: string;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: StatusHistory[];
}

// 임시 기부 데이터
const mockDonations: Record<string, Donation> = {
  'd1': {
    id: 'd1',
    donorId: 'user1',
    donorName: '홍길동',
    donorEmail: 'hong@example.com',
    storyId: '1',
    storyTitle: '겨울을 따뜻하게 보내고 싶어요',
    amount: 67000,
    status: 'COMPLETED',
    itemId: 'item1',
    itemName: '따뜻한 겨울 이불 세트',
    trackingNumber: '1234567890',
    message: '추운 겨울 따뜻하게 보내시길 바랍니다.',
    thankyouMessage: '따뜻한 마음 감사합니다. 덕분에 이번 겨울을 따뜻하게 보낼 수 있을 것 같아요.',
    partnerId: 'p1',
    partnerName: '굿네이버스',
    createdAt: new Date('2023-12-15T09:30:00'),
    updatedAt: new Date('2023-12-16T13:45:00'),
    statusHistory: [
      {
        status: 'PENDING',
        timestamp: new Date('2023-12-15T09:30:00'),
        note: '기부 접수',
      },
      {
        status: 'PROCESSING',
        timestamp: new Date('2023-12-15T14:20:00'),
        note: '결제 확인 및 처리 중',
      },
      {
        status: 'SHIPPED',
        timestamp: new Date('2023-12-16T09:15:00'),
        note: '배송 시작',
      },
      {
        status: 'COMPLETED',
        timestamp: new Date('2023-12-16T13:45:00'),
        note: '배송 완료',
      },
    ],
  },
  'd2': {
    id: 'd2',
    donorId: 'user2',
    donorName: '김철수',
    donorEmail: 'kim@example.com',
    storyId: '3',
    storyTitle: '생리대가 필요해요',
    amount: 36000,
    status: 'SHIPPED',
    itemId: 'item2',
    itemName: '생리대 6개월 세트',
    trackingNumber: '0987654321',
    message: '힘내세요. 응원합니다.',
    thankyouMessage: '',
    partnerId: 'p1',
    partnerName: '굿네이버스',
    createdAt: new Date('2023-12-12T15:45:00'),
    updatedAt: new Date('2023-12-13T10:30:00'),
    statusHistory: [
      {
        status: 'PENDING',
        timestamp: new Date('2023-12-12T15:45:00'),
        note: '기부 접수',
      },
      {
        status: 'PROCESSING',
        timestamp: new Date('2023-12-13T09:20:00'),
        note: '결제 확인 및 처리 중',
      },
      {
        status: 'SHIPPED',
        timestamp: new Date('2023-12-13T10:30:00'),
        note: '배송 시작',
      },
    ],
  },
  'd3': {
    id: 'd3',
    donorId: 'user3',
    donorName: '이영희',
    donorEmail: 'lee@example.com',
    storyId: '2',
    storyTitle: '학교 준비물이 필요해요',
    amount: 25000,
    status: 'PENDING',
    itemId: 'item3',
    itemName: '기본 학용품 세트',
    trackingNumber: null,
    message: '학업에 열중하세요.',
    thankyouMessage: '',
    partnerId: 'p2',
    partnerName: '세이브더칠드런',
    createdAt: new Date('2023-12-10T11:20:00'),
    updatedAt: new Date('2023-12-10T11:20:00'),
    statusHistory: [
      {
        status: 'PENDING',
        timestamp: new Date('2023-12-10T11:20:00'),
        note: '기부 접수',
      },
    ],
  },
};

// 상태별 배지 스타일 설정
const donationStatusStyles: Record<DonationStatus, { variant: string; text: string }> = {
  PENDING: { variant: 'secondary', text: '대기 중' },
  PROCESSING: { variant: 'warning', text: '처리 중' },
  SHIPPED: { variant: 'info', text: '배송 중' },
  COMPLETED: { variant: 'success', text: '완료됨' },
  FAILED: { variant: 'destructive', text: '실패' },
  CANCELLED: { variant: 'outline', text: '취소됨' },
};

export default function DonationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    status: DonationStatus;
    trackingNumber: string;
  }>({
    status: 'PENDING',
    trackingNumber: '',
  });
  
  useEffect(() => {
    // 데이터 로드
    setLoading(true);
    setError(null);
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const donationData = mockDonations[params.id];
      if (donationData) {
        setDonation(donationData);
        setEditData({
          status: donationData.status,
          trackingNumber: donationData.trackingNumber || '',
        });
      } else {
        setError('기부 정보를 찾을 수 없습니다.');
      }
      setLoading(false);
    }, 500);
  }, [params.id]);
  
  // 업데이트 핸들러
  const handleUpdate = async () => {
    if (!donation) return;
    
    setSaving(true);
    setError(null);
    
    try {
      // 실제 구현에서는 API 호출
      setTimeout(() => {
        // 상태 변경 시 히스토리 추가
        let updatedStatusHistory = [...donation.statusHistory];
        if (editData.status !== donation.status) {
          updatedStatusHistory.push({
            status: editData.status,
            timestamp: new Date(),
            note: `상태 변경: ${donationStatusStyles[donation.status].text} → ${donationStatusStyles[editData.status].text}`,
          });
        }
        
        // 업데이트된 기부 정보
        const updatedDonation: Donation = {
          ...donation,
          status: editData.status,
          trackingNumber: editData.trackingNumber || null,
          updatedAt: new Date(),
          statusHistory: updatedStatusHistory,
        };
        
        setDonation(updatedDonation);
        setSaving(false);
      }, 1000);
    } catch (err) {
      setError('기부 정보 업데이트 중 오류가 발생했습니다.');
      setSaving(false);
    }
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">불러오는 중...</span>
      </div>
    );
  }
  
  if (error || !donation) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center justify-center mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error || '기부 정보를 찾을 수 없습니다.'}</span>
        </div>
        <Button asChild>
          <Link href="/admin/donations">목록으로 돌아가기</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          asChild
          className="gap-1"
        >
          <Link href="/admin/donations">
            <ChevronLeft className="h-4 w-4" />
            기부 목록으로
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              최종 업데이트: {formatDate(donation.updatedAt, 'yyyy-MM-dd HH:mm')}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            새로고침
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* 기부 정보 카드 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">기부 ID: {donation.id}</h3>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CreditCard className="h-6 w-6" />
                    기부 정보
                  </CardTitle>
                </div>
                {renderStatusBadge(donation.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">기부자</h4>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{donation.donorName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{donation.donorEmail}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">기부 날짜</h4>
                  <p>{formatDate(donation.createdAt, 'yyyy년 MM월 dd일 HH:mm')}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">파트너 기관</h4>
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{donation.partnerName}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">금액</h4>
                  <p className="font-bold text-lg">{donation.amount.toLocaleString()}원</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">사연</h4>
                <div className="flex gap-2">
                  <FileText className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{donation.storyTitle}</p>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      asChild
                    >
                      <Link href={`/admin/stories/${donation.storyId}`}>
                        사연 상세보기
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">기부 물품</h4>
                <div className="flex gap-2">
                  <Package className="h-5 w-5 flex-shrink-0" />
                  <p>{donation.itemName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">기부자 메시지</h4>
                  {donation.message ? (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm italic">"{donation.message}"</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">메시지 없음</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">감사 메시지</h4>
                  {donation.thankyouMessage ? (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm italic">"{donation.thankyouMessage}"</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">아직 감사 메시지가 없습니다.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 상태 이력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">상태 이력</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donation.statusHistory.map((history, index) => (
                  <div key={index} className="relative pl-6 pb-4 last:pb-0">
                    {/* 타임라인 라인 */}
                    {index < donation.statusHistory.length - 1 && (
                      <div className="absolute top-6 left-[0.6875rem] h-full w-px bg-border" />
                    )}
                    
                    {/* 타임라인 점 */}
                    <div className="absolute top-1 left-0 h-4 w-4 rounded-full border border-primary bg-background" />
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(history.status)}
                        <span className="text-sm text-muted-foreground">
                          {formatDate(history.timestamp, 'yyyy-MM-dd HH:mm')}
                        </span>
                      </div>
                      
                      {history.note && (
                        <p className="text-sm">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 관리 사이드바 */}
        <div className="space-y-6">
          {/* 상태 및 배송 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">기부 상태 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  value={editData.status}
                  onValueChange={(value: DonationStatus) => setEditData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">대기 중</SelectItem>
                    <SelectItem value="PROCESSING">처리 중</SelectItem>
                    <SelectItem value="SHIPPED">배송 중</SelectItem>
                    <SelectItem value="COMPLETED">완료됨</SelectItem>
                    <SelectItem value="FAILED">실패</SelectItem>
                    <SelectItem value="CANCELLED">취소됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">배송 추적 번호</Label>
                <div className="flex gap-2">
                  <Input
                    id="trackingNumber"
                    value={editData.trackingNumber}
                    onChange={(e) => setEditData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                    placeholder="예: 1234567890"
                  />
                  {donation.trackingNumber && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => window.open(`https://tracker.delivery/#/${donation.trackingNumber}`, '_blank')}
                    >
                      <Truck className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  배송이 시작되면 추적 번호를 입력하세요
                </p>
              </div>
              
              <Button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full gap-1 mt-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    변경사항 저장
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {/* 감사 메시지 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">감사 메시지</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="수혜자로부터 기부자에게 보낼 감사 메시지를 입력하세요..."
                rows={4}
                value={donation.thankyouMessage}
                onChange={(e) => setDonation(prev => prev ? { ...prev, thankyouMessage: e.target.value } : null)}
              />
              
              <Button
                variant={donation.thankyouMessage ? 'default' : 'outline'}
                className="w-full gap-1"
                disabled={saving}
              >
                <MessageSquare className="h-4 w-4" />
                {donation.thankyouMessage ? '감사 메시지 업데이트' : '감사 메시지 전송'}
              </Button>
            </CardContent>
          </Card>
          
          {/* 연관 링크 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">연관 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/admin/users/${donation.donorId}`}>
                  <User className="h-4 w-4 mr-2" />
                  기부자 정보 보기
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/admin/stories/${donation.storyId}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  사연 상세 보기
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/admin/partners/${donation.partnerId}`}>
                  <Building className="h-4 w-4 mr-2" />
                  파트너 정보 보기
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 