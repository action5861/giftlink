'use client';

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Share2, DollarSign, ExternalLink } from 'lucide-react';

interface StoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  coupangUrl: string;
  imageUrl: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  age: number;
  gender: string;
  items: StoryItem[];
}

// 임시 데이터 (나중에 DB 연동으로 대체)
const mockStories: Record<string, Story> = {
  '1': {
    id: '1',
    title: '겨울을 따뜻하게 보내고 싶어요',
    content: '추운 겨울이 다가오는데 난방비가 너무 부담됩니다. 오래된 이불로는 추위를 막기 어려워 밤에 잠을 이루기가 힘듭니다. 따뜻한 이불과 전기장판이 있으면 이번 겨울을 덜 춥게 보낼 수 있을 것 같습니다. 도움 주시면 정말 감사하겠습니다.',
    imageUrl: 'https://picsum.photos/seed/winter1/800/600',
    category: '생활용품',
    age: 67,
    gender: '여성',
    items: [
      {
        id: '101',
        name: '따뜻한 겨울 이불',
        description: '거위털 충전재로 보온성이 뛰어난 겨울용 이불입니다.',
        price: 39000,
        coupangUrl: 'https://www.coupang.com/sample-blanket',
        imageUrl: 'https://picsum.photos/seed/blanket/150/150'
      },
      {
        id: '102',
        name: '전기장판',
        description: '에너지 효율이 높은 전기장판으로 취침 시 따뜻함을 유지해 줍니다.',
        price: 28000,
        coupangUrl: 'https://www.coupang.com/sample-heater',
        imageUrl: 'https://picsum.photos/seed/heater/150/150'
      }
    ]
  },
  '2': {
    id: '2',
    title: '아이의 교육을 위해 도움이 필요해요',
    content: '초등학생 아이의 학습 도구가 필요합니다. 특히 수학 학습에 도움이 될 교구가 있으면 좋겠어요. 현재 경제적 어려움으로 인해 아이의 교육에 필요한 기본적인 도구들도 구매하기 어려운 상황입니다.',
    imageUrl: 'https://picsum.photos/seed/education1/800/600',
    category: '교육',
    age: 35,
    gender: '여성',
    items: [
      {
        id: '201',
        name: '초등 수학 교구 세트',
        description: '기초 수학 개념을 쉽게 이해할 수 있는 교구 세트입니다.',
        price: 45000,
        coupangUrl: 'https://www.coupang.com/sample-math',
        imageUrl: 'https://picsum.photos/seed/math/150/150'
      }
    ]
  }
};

interface StoryPageProps {
  params: {
    id: string;
  };
}

function PaymentButton({ story, item }: { story: Story; item: StoryItem }) {
  const handlePayment = () => {
    const paymentWindow = window.open('', 'payment', 'width=500,height=700');
    if (paymentWindow) {
      paymentWindow.document.write(`
        <html>
          <head>
            <title>기부 결제</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                padding: 24px;
                background: #f9fafb;
                color: #111827;
              }
              .container {
                max-width: 500px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                margin-bottom: 24px;
              }
              .header h1 {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 8px;
              }
              .header p {
                color: #6b7280;
                font-size: 14px;
              }
              .payment-info {
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 24px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .payment-info h2 {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 16px;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                font-size: 14px;
              }
              .info-row:last-child {
                margin-bottom: 0;
                padding-top: 12px;
                border-top: 1px solid #e5e7eb;
                font-weight: 600;
              }
              .payment-methods {
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 24px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .payment-methods h2 {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 16px;
              }
              .method-list {
                display: grid;
                gap: 12px;
              }
              .method-item {
                display: flex;
                align-items: center;
                padding: 16px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
              }
              .method-item:hover {
                border-color: #0F52BA;
                background: #f8fafc;
              }
              .method-item.selected {
                border-color: #0F52BA;
                background: #f0f7ff;
              }
              .method-icon {
                margin-right: 12px;
                color: #4b5563;
              }
              .method-info {
                flex: 1;
              }
              .method-name {
                font-weight: 500;
                margin-bottom: 4px;
              }
              .method-desc {
                font-size: 12px;
                color: #6b7280;
              }
              .payment-button {
                width: 100%;
                padding: 16px;
                background: #0F52BA;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
              }
              .payment-button:hover {
                background: #0a3d8c;
              }
              .payment-button:disabled {
                background: #9ca3af;
                cursor: not-allowed;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>기부 결제</h1>
                <p>${story.title}</p>
              </div>

              <div class="payment-info">
                <h2>결제 정보</h2>
                <div class="info-row">
                  <span>상품명</span>
                  <span>${item.name}</span>
                </div>
                <div class="info-row">
                  <span>기부 금액</span>
                  <span>${item.price.toLocaleString()}원</span>
                </div>
              </div>

              <div class="payment-methods">
                <h2>결제 수단</h2>
                <div class="method-list">
                  <div class="method-item selected">
                    <div class="method-icon">💳</div>
                    <div class="method-info">
                      <div class="method-name">신용카드</div>
                      <div class="method-desc">모든 카드사 이용 가능</div>
                    </div>
                  </div>
                  <div class="method-item">
                    <div class="method-icon">🏦</div>
                    <div class="method-info">
                      <div class="method-name">계좌이체</div>
                      <div class="method-desc">실시간 계좌이체</div>
                    </div>
                  </div>
                  <div class="method-item">
                    <div class="method-icon">📝</div>
                    <div class="method-info">
                      <div class="method-name">가상계좌</div>
                      <div class="method-desc">입금 후 자동 결제</div>
                    </div>
                  </div>
                </div>
              </div>

              <button class="payment-button">
                ${item.price.toLocaleString()}원 결제하기
              </button>
            </div>
          </body>
        </html>
      `);
    }
  };

  return (
    <Button onClick={handlePayment}>
      구매하여 기부하기
    </Button>
  );
}

export default function StoryPage({ params }: StoryPageProps) {
  const story = mockStories[params.id];
  
  if (!story) {
    notFound();
  }
  
  return (
    <div className="container py-10">
      {/* 네비게이션 */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href="/stories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-2">
          {/* 이미지 및 헤더 */}
          <div className="relative rounded-xl overflow-hidden h-[400px] mb-8">
            <Image
              src={story.imageUrl}
              alt={story.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="font-medium">
                {story.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {story.age}세 · {story.gender}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-6">{story.title}</h1>
            
            <div className="flex gap-4 mb-6">
              <Button variant="outline" size="sm" className="gap-1">
                <Heart className="h-4 w-4" />
                관심 등록
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                공유하기
              </Button>
            </div>
            
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{story.content}</p>
            </div>
          </div>
          
          {/* 필요한 물품 섹션 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">필요한 물품</h2>
            <div className="grid gap-4">
              {story.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                        <p className="font-semibold text-lg">{item.price.toLocaleString()}원</p>
                      </div>
                      <div className="flex gap-2">
                        <PaymentButton story={story} item={item} />
                        <Button variant="outline" asChild>
                          <Link href={item.coupangUrl} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            쿠팡 상품 보기
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* 사이드바 */}
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
                      {story.items.reduce((sum: number, item: StoryItem) => sum + item.price, 0).toLocaleString()}원
                    </span>
                  </div>
                </div>
                
                <Button className="w-full gap-2 mb-4">
                  <DollarSign className="h-4 w-4" />
                  모든 물품 기부하기
                </Button>
                
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <p>기부하시면 쿠팡을 통해 직접 물품이 수혜자에게 전달됩니다.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 