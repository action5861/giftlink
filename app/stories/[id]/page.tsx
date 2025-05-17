import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Share2, DollarSign } from 'lucide-react';

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
          <div>
            <h2 className="text-2xl font-bold mb-4">필요한 물품</h2>
            <div className="space-y-4">
              {story.items.map((item: StoryItem) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {item.imageUrl && (
                      <div className="relative w-full md:w-24 h-24 md:h-auto flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <CardContent className="flex-1 p-4 md:p-6">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      {item.description && (
                        <p className="text-muted-foreground mt-1 mb-2">{item.description}</p>
                      )}
                      <p className="text-xl font-bold text-primary">{item.price.toLocaleString()}원</p>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col justify-center p-4 md:p-6 bg-muted/20 gap-2">
                      <Button 
                        asChild 
                        className="w-full md:w-auto gap-1"
                      >
                        <a 
                          href={item.coupangUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <DollarSign className="h-4 w-4" />
                          구매하여 기부하기
                        </a>
                      </Button>
                    </CardFooter>
                  </div>
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