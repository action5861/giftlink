'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Gift, 
  Building, 
  Loader2,
  AlertCircle,
  Save,
  MessageSquare,
  KeyRound,
  FileText,
  Lock,
  Unlock
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// 사용자 역할 타입 정의
type UserRole = 'USER' | 'ADMIN' | 'PARTNER';

// 사연 상태 타입 정의
type StoryStatus = 'DRAFT' | 'PENDING' | 'REVISION' | 'APPROVED' | 'PUBLISHED' | 'FULFILLED' | 'REJECTED';

// 기부 내역 인터페이스
interface Donation {
  id: string;
  storyId: string;
  storyTitle: string;
  amount: number;
  createdAt: Date;
  status: string;
}

// 관심 사연 인터페이스
interface FavoriteStory {
  id: string;
  title: string;
  createdAt: Date;
}

// 파트너 사연 인터페이스
interface PartnerStory {
  id: string;
  title: string;
  status: StoryStatus;
  createdAt: Date;
}

// 사용자 인터페이스
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  donationCount: number;
  totalDonationAmount: number;
  partnerId?: string;
  partnerName?: string;
  partnerPosition?: string;
  donations?: Donation[];
  favoriteStories?: FavoriteStory[];
  stories?: PartnerStory[];
}

// 상태별 배지 스타일 설정
const statusStyles: Record<StoryStatus, { variant: string; text: string }> = {
  DRAFT: { variant: 'outline', text: '작성 중' },
  PENDING: { variant: 'secondary', text: '검토 대기' },
  REVISION: { variant: 'warning', text: '수정 요청' },
  APPROVED: { variant: 'info', text: '승인됨' },
  PUBLISHED: { variant: 'success', text: '게시됨' },
  FULFILLED: { variant: 'primary', text: '완료됨' },
  REJECTED: { variant: 'destructive', text: '거부됨' },
};

// 임시 사용자 데이터
const mockUsers: Record<string, User> = {
  // ... existing mock users ...
};

// 상태 배지 렌더링 함수
const renderStatusBadge = (status: StoryStatus) => {
  const style = statusStyles[status];
  return (
    <Badge variant={style.variant as any} className="capitalize">
      {style.text}
    </Badge>
  );
};

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    role: UserRole;
    isActive: boolean;
  }>({
    role: 'USER',
    isActive: true,
  });
  
  useEffect(() => {
    // 데이터 로드
    setLoading(true);
    setError(null);
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const userData = mockUsers[params.id];
      if (userData) {
        setUser(userData);
        setEditData({
          role: userData.role,
          isActive: userData.isActive,
        });
      } else {
        setError('사용자 정보를 찾을 수 없습니다.');
      }
      setLoading(false);
    }, 500);
  }, [params.id]);
  
  // 업데이트 핸들러
  const handleUpdate = async () => {
    if (!user) return;
    
    setSaving(true);
    setError(null);
    
    try {
      // 실제 구현에서는 API 호출
      setTimeout(() => {
        // 업데이트된 사용자 정보
        const updatedUser: User = {
          ...user,
          role: editData.role,
          isActive: editData.isActive,
          updatedAt: new Date(),
        };
        
        setUser(updatedUser);
        setSaving(false);
      }, 1000);
    } catch (err) {
      setError('사용자 정보 업데이트 중 오류가 발생했습니다.');
      setSaving(false);
    }
  };
  
  // 역할 배지 렌더링 함수
  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Badge variant="destructive">관리자</Badge>;
      case 'PARTNER':
        return <Badge variant="secondary">파트너</Badge>;
      case 'USER':
      default:
        return <Badge variant="outline">일반 사용자</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">불러오는 중...</span>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center justify-center mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error || '사용자 정보를 찾을 수 없습니다.'}</span>
        </div>
        <Button asChild>
          <Link href="/admin/users">목록으로 돌아가기</Link>
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
          <Link href="/admin/users">
            <ChevronLeft className="h-4 w-4" />
            사용자 목록으로
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              최종 업데이트: {formatDate(user.updatedAt, 'yyyy-MM-dd HH:mm')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 사용자 정보 및 상세 내용 */}
        <div className="md:col-span-2 space-y-6">
          {/* 사용자 기본 정보 카드 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">사용자 ID: {user.id}</h3>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <User className="h-6 w-6" />
                    {user.name || '이름 없음'}
                  </CardTitle>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {renderRoleBadge(user.role)}
                  {user.isActive ? (
                    <Badge variant="default" className="gap-1">
                      <Unlock className="h-3 w-3" />
                      활성
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <Lock className="h-3 w-3" />
                      비활성
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">이메일</h4>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">가입일</h4>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(user.createdAt, 'yyyy년 MM월 dd일')}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">마지막 로그인</h4>
                  {user.lastLoginAt ? (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(user.lastLoginAt, 'yyyy년 MM월 dd일 HH:mm')}</span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">로그인 이력 없음</p>
                  )}
                </div>
                
                {user.role === 'PARTNER' && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">소속 기관</h4>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{user.partnerName}</span>
                      {user.partnerPosition && (
                        <span className="text-xs text-muted-foreground">({user.partnerPosition})</span>
                      )}
                    </div>
                  </div>
                )}
                
                {user.role === 'USER' && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">기부 현황</h4>
                    <div className="flex flex-col">
                      <span>{user.donationCount}회 기부</span>
                      <span className="text-sm text-muted-foreground">
                        총 {user.totalDonationAmount.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* 사용자 유형별 상세 정보 */}
          {user.role === 'USER' && (
            <Tabs defaultValue="donations">
              <TabsList>
                <TabsTrigger value="donations" className="gap-1">
                  <Gift className="h-4 w-4" />
                  기부 내역
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-1">
                  <FileText className="h-4 w-4" />
                  관심 사연
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="donations">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">기부 내역</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.donations && user.donations.length > 0 ? (
                      <div className="space-y-4">
                        {user.donations.map((donation) => (
                          <div key={donation.id} className="flex justify-between items-center p-4 border rounded-md">
                            <div>
                              <h4 className="font-medium">{donation.storyTitle}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm font-medium text-primary">
                                  {donation.amount.toLocaleString()}원
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(donation.createdAt, 'yyyy-MM-dd')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {renderStatusBadge(donation.status as StoryStatus)}
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link href={`/admin/donations/${donation.id}`}>
                                  상세보기
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        기부 내역이 없습니다.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="favorites">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">관심 사연</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.favoriteStories && user.favoriteStories.length > 0 ? (
                      <div className="space-y-4">
                        {user.favoriteStories.map((story) => (
                          <div key={story.id} className="flex justify-between items-center p-4 border rounded-md">
                            <div>
                              <h4 className="font-medium">{story.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(story.createdAt, 'yyyy-MM-dd')}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={`/admin/stories/${story.id}`}>
                                사연 보기
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        관심 사연이 없습니다.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          {user.role === 'PARTNER' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">등록한 사연</CardTitle>
              </CardHeader>
              <CardContent>
                {user.stories && user.stories.length > 0 ? (
                  <div className="space-y-4">
                    {user.stories.map((story) => (
                      <div key={story.id} className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">{story.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            {renderStatusBadge(story.status)}
                            <span className="text-sm text-muted-foreground">
                              {formatDate(story.createdAt, 'yyyy-MM-dd')}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/admin/stories/${story.id}`}>
                            상세보기
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    등록한 사연이 없습니다.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* 관리 사이드바 */}
        <div className="space-y-6">
          {/* 계정 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">계정 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">역할 설정</h4>
                <RadioGroup
                  value={editData.role}
                  onValueChange={(value: UserRole) => setEditData(prev => ({ ...prev, role: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="USER" id="user" />
                    <Label htmlFor="user">일반 사용자</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PARTNER" id="partner" />
                    <Label htmlFor="partner">파트너</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ADMIN" id="admin" />
                    <Label htmlFor="admin">관리자</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">계정 상태</h4>
                  <p className="text-xs text-muted-foreground">
                    비활성화된 계정은 로그인할 수 없습니다.
                  </p>
                </div>
                <Switch
                  checked={editData.isActive}
                  onCheckedChange={(checked) => setEditData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
              
              <Button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full gap-1"
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
          
          {/* 비밀번호 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">비밀번호 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                사용자의 비밀번호를 초기화하면 이메일로 재설정 링크가 전송됩니다.
              </div>
              <Button
                variant="outline"
                className="w-full gap-1"
              >
                <KeyRound className="h-4 w-4" />
                비밀번호 초기화
              </Button>
            </CardContent>
          </Card>
          
          {/* 메시지 보내기 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">메시지 보내기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full gap-1"
                asChild
              >
                <Link href={`/admin/messages?user=${user.id}`}>
                  <MessageSquare className="h-4 w-4" />
                  메시지 보내기
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* 추가 작업 */}
          {user.role === 'PARTNER' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">파트너 관련 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/admin/partners/${user.partnerId}`}>
                    <Building className="h-4 w-4 mr-2" />
                    파트너 정보 보기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 