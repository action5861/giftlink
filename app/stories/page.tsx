'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { StoryCard } from '@/components/stories/story-card';
import { FilterX, Search, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// 인터페이스 정의
interface StoryItem {
  id: string;
  name: string;
  price: number;
  coupangUrl: string | null;
  description: string | null;
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

// 카테고리 및 지역 목록
const categories = [
  '전체', '생활용품', '교육', '위생용품', '의류', '육아', '건강', '의료용품'
];

const regions = [
  '전체', '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시',
  '세종특별자치시', '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도',
  '경상남도', '제주특별자치도'
];

function StoriesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '전체');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || '전체');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [inputSearchTerm, setInputSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchStories(1);
  }, [selectedCategory, selectedRegion, searchTerm]);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '전체');
    setSelectedRegion(searchParams.get('region') || '전체');
    setSearchTerm(searchParams.get('search') || '');
    setInputSearchTerm(searchParams.get('search') || '');
    const page = parseInt(searchParams.get('page') || '1', 10);
    setCurrentPage(page);
  }, [searchParams]);

  const fetchStories = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== '전체') params.append('category', selectedCategory);
      if (selectedRegion !== '전체') params.append('region', selectedRegion);
      if (searchTerm) params.append('search', searchTerm);
      params.append('page', page.toString());
      params.append('limit', '9');

      const response = await fetch(`/api/stories?${params.toString()}`);
      if (!response.ok) {
        throw new Error('사연 목록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setStories(data.stories);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: 'category' | 'region' | 'search', value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value && value !== '전체') {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    newParams.set('page', '1');
    router.push(`/stories?${newParams.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', inputSearchTerm);
  };

  const handleResetFilters = () => {
    router.push('/stories');
    setInputSearchTerm('');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('page', newPage.toString());
      router.push(`/stories?${newParams.toString()}`);
      fetchStories(newPage);
    }
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">사연 목록</h1>
          <p className="text-muted-foreground mt-1">
            도움이 필요한 이웃들의 사연을 확인하고 기부에 참여해보세요
          </p>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="검색..."
              value={inputSearchTerm}
              onChange={(e) => setInputSearchTerm(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">검색</span>
          </Button>
          <Button variant="outline" size="icon" type="button" onClick={handleResetFilters}>
            <FilterX className="h-4 w-4" />
            <span className="sr-only">필터 초기화</span>
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 pb-6 items-center border-b mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => handleFilterChange('category', category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="ml-0 md:ml-4 min-w-[160px]">
          <Select value={selectedRegion} onValueChange={(value) => handleFilterChange('region', value)}>
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="pt-6">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-5 w-1/2" />
              </CardContent>
              <CardFooter className="border-t pt-4 px-6 flex justify-between items-center">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium text-destructive">오류 발생</h3>
          <p className="text-muted-foreground mt-1 mb-4">{error}</p>
          <Button onClick={() => fetchStories(currentPage)}>다시 시도</Button>
        </div>
      ) : stories.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                content={story.content}
                imageUrl={story.imageUrl}
                category={story.category}
                age={story.recipientAge}
                gender={story.recipientGender}
                items={story.items}
                recipientRegion={story.recipientRegion}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
              >
                이전
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <Button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                >
                  {pageNumber}
                </Button>
              ))}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                다음
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">해당 조건의 사연이 없습니다.</h3>
          <p className="text-muted-foreground mt-1">다른 필터로 검색해보세요.</p>
        </div>
      )}
    </div>
  );
}

export default function StoriesPageWrapper() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <StoriesPageContent />
    </Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-72" />
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <Skeleton className="h-10 w-full md:w-64" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pb-6 items-center border-b mb-6">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 md:ml-4 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-5 w-1/2" />
            </CardContent>
            <CardFooter className="border-t pt-4 px-6 flex justify-between items-center">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 