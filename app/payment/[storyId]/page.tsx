'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, CreditCard, Building2, Wallet } from 'lucide-react';
import Link from 'next/link';

interface PaymentPageProps {
  params: {
    storyId: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'transfer' | 'virtual'>('card');
  const itemId = searchParams.get('itemId');

  // 임시 데이터 (실제로는 API에서 가져와야 함)
  const story = {
    id: params.storyId,
    title: '겨울을 따뜻하게 보내고 싶어요',
    items: [
      {
        id: '101',
        name: '따뜻한 겨울 이불',
        price: 39000,
        coupangUrl: 'https://www.coupang.com/sample-blanket',
      },
      {
        id: '102',
        name: '전기장판',
        price: 28000,
        coupangUrl: 'https://www.coupang.com/sample-heater',
      }
    ]
  };

  const selectedItem = story.items.find(item => item.id === itemId) || story.items[0];

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 결제창 호출
      const paymentData = {
        storyId: params.storyId,
        itemId: selectedItem.id,
        amount: selectedItem.price,
        method: selectedMethod,
      };

      // 결제창 호출 (임시)
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
                    <span>${selectedItem.name}</span>
                  </div>
                  <div class="info-row">
                    <span>기부 금액</span>
                    <span>${selectedItem.price.toLocaleString()}원</span>
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
                  ${selectedItem.price.toLocaleString()}원 결제하기
                </button>
              </div>
            </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      {/* 네비게이션 */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href={`/stories/${params.storyId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            사연으로 돌아가기
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>기부 결제</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 사연 정보 */}
            <div className="space-y-2">
              <h3 className="font-semibold">사연 정보</h3>
              <p className="text-muted-foreground">{story.title}</p>
            </div>

            {/* 물품 정보 */}
            <div className="space-y-2">
              <h3 className="font-semibold">기부 물품</h3>
              <div className="flex justify-between items-center">
                <p>{selectedItem.name}</p>
                <p className="font-semibold">{selectedItem.price.toLocaleString()}원</p>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex gap-4">
              <Button
                className="flex-1"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? '결제 처리 중...' : '결제하기'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                asChild
              >
                <Link href={selectedItem.coupangUrl} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  쿠팡 상품 보기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 