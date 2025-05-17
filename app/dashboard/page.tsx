'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Gift, Clock, ArrowRight } from 'lucide-react';

interface DonationSummary {
  totalDonations: number;
  totalAmount: number;
  favoriteStories: number;
}

interface RecentDonation {
  id: string;
  storyId: string;
  storyTitle: string;
  amount: number;
  date: string;
  status: 'pending' | 'shipped' | 'delivered';
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [summary, setSummary] = useState<DonationSummary | null>(null);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 비인증 사용자 리디렉션
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    }

    // 인증된 사용자에 대한 데이터 로드
    if (status === 'authenticated') {
      // 실제 구현에서는 API 호출
      // 지금은 예시 데이터 사용
      setTimeout(() => {
        setSummary({
          totalDonations: 5,
          totalAmount: 150000,
          favoriteStories: 3,
        });
        
        setRecentDonations([
          {
            id: 'd1',
            storyId: '1',
            storyTitle: '겨울을 따뜻하게 보내고 싶어요',
            amount: 67000,
            date: '2023-12-15',
            status: 'delivered',
          },
          {
            id: 'd2',
            storyId: '3',
            storyTitle: '생리대가 필요해요',
            amount: 36000,
            date: '2023-11-02',
            status: 'delivered',
          },
          {
            id: 'd3',
            storyId: '4',
            storyTitle: '면접 준비를 위한 정장이 필요합니다',
            amount: 47000,
            date: '2023-10-18',
            status: 'shipped',
          },
        ]);
        
        setLoading(false);
      }, 1000);
    }
  }, [status, router]);

  // 로딩 중 상태
  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="container py-10">
        <div className="mb-8">
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
        
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">안녕하세요, {session?.user?.name}님</h1>
        <p className="text-muted-foreground">오늘도 당신의 관심과 기부로 세상이 더 따뜻해집니다.</p>
      </div>
      
      {/* 요약 카드 */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 기부 횟수</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalDonations || 0}회</div>
            <p className="text-xs text-muted-foreground">
              당신의 매 기부가 변화를 만듭니다
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 기부 금액</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalAmount?.toLocaleString() || 0}원</div>
            <p className="text-xs text-muted-foreground">
              소중한 나눔으로 따뜻한 변화를 만들었습니다
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">관심 등록한 사연</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.favoriteStories || 0}개</div>
            <p className="text-xs text-muted-foreground">
              더 많은 사연에 관심을 가져보세요
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* 활동 내역 탭 */}
      <Tabs defaultValue="donations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="donations">기부 내역</TabsTrigger>
          <TabsTrigger value="favorites">관심 사연</TabsTrigger>
          <TabsTrigger value="profile">내 정보</TabsTrigger>
        </TabsList>
        
        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>최근 기부 내역</CardTitle>
              <CardDescription>
                내가 기부한 물품과 상태를 확인할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentDonations.length > 0 ? (
                <div className="space-y-6">
                  {recentDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={`https://picsum.photos/seed/${donation.storyId}/100/100`}
                          alt={donation.storyTitle}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium line-clamp-1">{donation.storyTitle}</p>
                        <div className="flex items-center text-sm">
                          <Clock className="w-3 h-3 mr-1" />
                          <span className="text-muted-foreground">
                            {new Date(donation.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{donation.amount.toLocaleString()}원</p>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="whitespace-nowrap"
                        >
                          <a href={`/stories/${donation.storyId}`}>
                            상세보기
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="ghost"
                    className="w-full text-primary"
                    asChild
                  >
                    <a href="/dashboard/donations">
                      모든 기부 내역 보기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">아직 기부 내역이 없습니다.</p>
                  <Button asChild>
                    <a href="/stories">
                      사연 둘러보기
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>관심 등록한 사연</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  관심 있는 사연을 ♥ 버튼으로 등록해보세요.
                </p>
                <Button asChild>
                  <a href="/stories">
                    사연 둘러보기
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>내 정보 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">이름</h3>
                    <p>{session?.user?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">이메일</h3>
                    <p>{session?.user?.email}</p>
                  </div>
                </div>
                
                <Button variant="outline">
                  개인정보 수정
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 