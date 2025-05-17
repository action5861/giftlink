'use client'

import { Button } from '@/components/ui/button';
import { StoryCard } from '@/components/stories/story-card';
import { FilterX, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

// 임시 데이터 (나중에 DB 연동으로 대체)
const mockStories = [
  {
    id: '1',
    title: '겨울을 따뜻하게 보내고 싶어요',
    content: '추운 겨울이 다가오는데 난방비가 너무 부담됩니다. 따뜻한 이불이 있으면 좋겠어요.',
    imageUrl: 'https://picsum.photos/seed/winter1/800/600',
    category: '생활용품',
    age: 67,
    gender: '여성',
    recipientRegion: '서울특별시',
    items: [
      {
        id: '101',
        name: '따뜻한 겨울 이불',
        price: 39000,
        coupangUrl: 'https://www.coupang.com/vp/products/1234567890',
      },
      {
        id: '102',
        name: '전기장판',
        price: 28000,
        coupangUrl: 'https://www.coupang.com/vp/products/2345678901',
      }
    ]
  },
  {
    id: '2',
    title: '아이의 교육을 위해 도움이 필요해요',
    content: '초등학생 아이의 학습 도구가 필요합니다. 특히 수학 학습에 도움이 될 교구가 있으면 좋겠어요.',
    imageUrl: 'https://picsum.photos/seed/education1/800/600',
    category: '교육',
    age: 35,
    gender: '여성',
    recipientRegion: '경기도',
    items: [
      {
        id: '201',
        name: '초등 수학 교구 세트',
        price: 45000,
        coupangUrl: 'https://www.coupang.com/vp/products/3456789012',
      }
    ]
  },
  {
    id: '3',
    title: '건강한 식사를 위한 도움이 필요합니다',
    content: '영양가 있는 식재료를 구매하기 어려운 상황입니다. 건강한 식사를 위한 기본 식재료가 필요해요.',
    imageUrl: 'https://picsum.photos/seed/food1/800/600',
    category: '생활용품',
    age: 42,
    gender: '남성',
    recipientRegion: '인천광역시',
    items: [
      {
        id: '301',
        name: '영양식품 세트',
        price: 55000,
        coupangUrl: 'https://www.coupang.com/vp/products/4567890123',
      }
    ]
  }
];

// 카테고리 목록
const categories = [
  '전체',
  '생활용품',
  '교육',
  '위생용품',
  '의류',
  '육아',
  '건강',
  '의료용품'
];

// 시/도 목록
const regions = [
  '전체',
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도'
];

export default function StoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedRegion, setSelectedRegion] = useState('전체');

  // 필터링된 사연 목록
  const filteredStories = mockStories.filter((story) => {
    const categoryMatch = selectedCategory === '전체' || story.category === selectedCategory;
    const regionMatch = selectedRegion === '전체' || story.recipientRegion === selectedRegion;
    return categoryMatch && regionMatch;
  });

  return (
    <div className="container py-10">
      {/* 페이지 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">사연 목록</h1>
          <p className="text-muted-foreground mt-1">
            도움이 필요한 이웃들의 사연을 확인하고 기부에 참여해보세요
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="검색..."
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          
          <Button variant="outline" size="icon">
            <FilterX className="h-4 w-4" />
            <span className="sr-only">필터 초기화</span>
          </Button>
        </div>
      </div>
      
      {/* 카테고리 & 거주지 필터 */}
      <div className="flex flex-wrap gap-2 pb-2 items-center">
        <div className="flex space-x-2">
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="ml-4 min-w-[160px]">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="거주지 선택" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* 사연 그리드 */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              title={story.title}
              content={story.content}
              imageUrl={story.imageUrl}
              category={story.category}
              age={story.age}
              gender={story.gender}
              items={story.items}
              recipientRegion={story.recipientRegion}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium">등록된 사연이 없습니다.</h3>
          <p className="text-muted-foreground mt-1">나중에 다시 확인해주세요.</p>
        </div>
      )}
    </div>
  );
} 