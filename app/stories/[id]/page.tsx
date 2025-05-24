'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, usePathname, useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Share2, DollarSign, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/components/ui/use-toast"

interface StoryItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  coupangUrl: string | null;
  imageUrl?: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  recipientAge: number;
  recipientGender: string;
  recipientRegion: string;
  items: StoryItem[];
  partner?: {
    id: string;
    name: string | null;
  };
}

interface StoryPageProps {
  params: {
    id: string;
  };
}

function PaymentButton({ storyId, itemId, itemName, itemPrice }: { storyId: string; itemId: string; itemName: string; itemPrice: number; }) {
  const router = useRouter();
  const { toast } = useToast();

  const handlePaymentClick = () => {
    // TODO: 실제 결제 시스템 연동
    const paymentWindow = window.open('', 'payment', 'width=500,height=700');
    if (paymentWindow) {
      paymentWindow.document.write(`
        <html>
          <head><title>기부 결제</title><style>/* 스타일 생략 */</style></head>
          <body>
            <div class="container">
              <h1>기부 결제</h1>
              <p>사연: ${storyId}</p>
              <p>물품: ${itemName} (${itemPrice.toLocaleString()}원)</p>
              <button onclick="alert('결제가 시작됩니다.'); window.close();">결제하기</button>
            </div>
          </body>
        </html>
      `);
      toast({
        title: "결제 준비 중",
        description: `${itemName}에 대한 결제창이 열립니다.`,
      });
    } else {
      toast({
        title: "결제창 열기 실패",
        description: "팝업 차단 기능을 확인해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handlePaymentClick}>
      <DollarSign className="mr-2 h-4 w-4" />
      구매하여 기부하기
    </Button>
  );
}

function StoryPageContent({ params }: StoryPageProps) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      setError(null);
      fetch(`/api/stories/${params.id}`)
        .then(async (res) => {
          if (!res.ok) {
            if (res.status === 404) {
              throw new Error('사연을 찾을 수 없습니다.');
            }
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Error: ${res.status}`);
          }
          return res.json();
        })
        .then((data: Story) => {
          setStory(data);
        })
        .catch((err) => {
          console.error('Failed to fetch story details:', err);
          setError(err.message);
          setStory(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-10 w-3/4 mb-6" />
            <Skeleton className="h-8 w-40 mb-6" />
            <Skeleton className="h-20 w-full mb-8" />
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full sticky top-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">오류 발생</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button asChild variant="outline">
          <Link href="/stories">사연 목록으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  if (!story) {
    return null;
  }
  
  const totalAmount = story.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href="/stories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px] mb-8">
            <Image
              src={story.imageUrl || '/images/placeholder.jpg'}
              alt={story.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 67vw, 800px"
            />
          </div>
          
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary" className="font-medium">
                {story.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {story.recipientAge}세 · {story.recipientGender} · {story.recipientRegion}
              </span>
              {story.partner && (
                <span className="text-sm text-muted-foreground">
                  | 파트너: {story.partner.name}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-6">{story.title}</h1>
            
            <div className="flex gap-4 mb-6">
              <Button variant="outline" size="sm" className="gap-1">
                <Heart className="h-4 w-4" />
                관심 등록
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "링크 복사 완료", description: "사연 링크가 클립보드에 복사되었습니다." });
              }}>
                <Share2 className="h-4 w-4" />
                공유하기
              </Button>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-line">{story.content}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">필요한 물품</h2>
            {story.items.length > 0 ? (
              <div className="grid gap-4">
                {story.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {item.imageUrl && (
                             <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-md overflow-hidden flex-shrink-0">
                              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                            </div>
                          )}
                          <div className="space-y-1">
                            <h3 className="font-semibold text-base md:text-lg">{item.name}</h3>
                            {item.description && (
                              <p className="text-muted-foreground text-sm">{item.description}</p>
                            )}
                            <p className="font-semibold text-md md:text-lg">{item.price.toLocaleString()}원</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
                          <PaymentButton storyId={story.id} itemId={item.id} itemName={item.name} itemPrice={item.price} />
                          {item.coupangUrl && (
                            <Button variant="outline" asChild className="w-full sm:w-auto">
                              <a href={item.coupangUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                쿠팡 상품 보기
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">이 사연에 등록된 필요 물품이 없습니다.</p>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">기부 요약</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">필요한 물품</span>
                    <span className="font-medium">{story.items.length}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">총 금액</span>
                    <span className="font-bold text-lg">
                      {totalAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>
                
                {story.items.length > 0 && (
                  <Button className="w-full gap-2 mb-4">
                    <DollarSign className="h-4 w-4" />
                    모든 물품 한번에 기부하기 (구현 예정)
                  </Button>
                )}
                
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <p>기부하시면 쿠팡을 통해 직접 물품이 수혜자에게 전달됩니다.</p>
                  <p className="mt-1">모든 기부 과정은 투명하게 관리됩니다.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StoryPageWrapper({ params }: StoryPageProps) {
  return (
    <Suspense fallback={<StoryDetailLoadingSkeleton />}>
      <StoryPageContent params={params} />
    </Suspense>
  );
}

function StoryDetailLoadingSkeleton() {
  return (
    <div className="container py-10">
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-3/4 mb-6" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-8" />
          
          <Skeleton className="h-8 w-1/3 mb-6" />
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-36" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 