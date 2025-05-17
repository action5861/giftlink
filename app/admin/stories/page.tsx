'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Loader2, 
  Filter,
  FileText,
  RefreshCw
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// 임시 사연 데이터
const mockStories = [
  {
    id: '1',
    title: '겨울을 따뜻하게 보내고 싶어요',
    status: 'PENDING',
    category: '생활용품',
    partner: '굿네이버스',
    createdAt: new Date('2023-12-15T09:32:00'),
  },
  {
    id: '2',
    title: '학교 준비물이 필요해요',
    status: 'APPROVED',
    category: '교육',
    partner: '세이브더칠드런',
    createdAt: new Date('2023-12-10T14:25:00'),
  },
  {
    id: '3',
    title: '생리대가 필요해요',
    status: 'PUBLISHED',
    category: '위생용품',
    partner: '굿네이버스',
    createdAt: new Date('2023-11-28T11:43:00'),
  },
  {
    id: '4',
    title: '면접 준비를 위한 정장이 필요합니다',
    status: 'PUBLISHED',
    category: '의류',
    partner: '사랑의 열매',
    createdAt: new Date('2023-11-22T16:15:00'),
  },
  {
    id: '5',
    title: '아기 기저귀가 필요해요',
    status: 'REVISION',
    category: '육아',
    partner: '유니세프',
    createdAt: new Date('2023-12-05T10:08:00'),
  },
  {
    id: '6',
    title: '노인 영양제가 필요합니다',
    status: 'REJECTED',
    category: '건강',
    partner: '행복나눔재단',
    createdAt: new Date('2023-11-30T13:22:00'),
  },
  {
    id: '7',
    title: '장애인용 휠체어가 필요합니다',
    status: 'PENDING',
    category: '의료용품',
    partner: '대한적십자사',
    createdAt: new Date('2023-12-12T09:15:00'),
  },
];

// 상태별 배지 스타일 설정
const statusStyles = {
  DRAFT: { variant: 'outline', text: '작성 중' },
  PENDING: { variant: 'secondary', text: '검토 대기' },
  REVISION: { variant: 'warning', text: '수정 요청' },
  APPROVED: { variant: 'info', text: '승인됨' },
  PUBLISHED: { variant: 'success', text: '게시됨' },
  FULFILLED: { variant: 'primary', text: '완료됨' },
  REJECTED: { variant: 'destructive', text: '거부됨' },
};

// 카테고리 옵션
const categories = [
  '전체',
  '생활용품',
  '교육',
  '위생용품',
  '의류',
  '육아',
  '건강',
  '의료용품',
];

// 상태 옵션
const statuses = [
  { value: '', label: '전체' },
  { value: 'DRAFT', label: '작성 중' },
  { value: 'PENDING', label: '검토 대기' },
  { value: 'REVISION', label: '수정 요청' },
  { value: 'APPROVED', label: '승인됨' },
  { value: 'PUBLISHED', label: '게시됨' },
  { value: 'FULFILLED', label: '완료됨' },
  { value: 'REJECTED', label: '거부됨' },
];

// 상태별 통계 카드 생성
const generateStatusCards = (stories: any[]) => {
  const counts = {
    TOTAL: stories.length,
    PENDING: stories.filter(s => s.status === 'PENDING').length,
    REVISION: stories.filter(s => s.status === 'REVISION').length,
    APPROVED: stories.filter(s => s.status === 'APPROVED').length,
    PUBLISHED: stories.filter(s => s.status === 'PUBLISHED').length,
  };

  return [
    {
      title: '전체 사연',
      value: counts.TOTAL,
      status: 'TOTAL',
      color: 'bg-slate-100 text-slate-800',
    },
    {
      title: '검토 대기',
      value: counts.PENDING,
      status: 'PENDING',
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      title: '수정 요청',
      value: counts.REVISION,
      status: 'REVISION',
      color: 'bg-orange-100 text-orange-800',
    },
    {
      title: '승인됨',
      value: counts.APPROVED,
      status: 'APPROVED',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      title: '게시됨',
      value: counts.PUBLISHED,
      status: 'PUBLISHED',
      color: 'bg-green-100 text-green-800',
    },
  ];
};

export default function StoriesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // URL 파라미터에서 필터 가져오기
  const statusFilter = searchParams.get('status') || '';
  const categoryFilter = searchParams.get('category') || '';
  
  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    setLoading(true);
    
    // 상태 및 카테고리 필터 적용
    let filteredStories = [...mockStories];
    
    if (statusFilter) {
      filteredStories = filteredStories.filter(story => story.status === statusFilter);
    }
    
    if (categoryFilter && categoryFilter !== '전체') {
      filteredStories = filteredStories.filter(story => story.category === categoryFilter);
    }
    
    // 검색어 필터 적용
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredStories = filteredStories.filter(
        story => 
          story.title.toLowerCase().includes(query) ||
          story.partner.toLowerCase().includes(query)
      );
    }
    
    // 정렬: 최신순
    filteredStories.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    setStories(filteredStories);
    setLoading(false);
  }, [statusFilter, categoryFilter, searchQuery]);
  
  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== '전체') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`/admin/stories?${params.toString()}`);
  };
  
  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setSearchQuery(formData.get('searchQuery') as string || '');
  };
  
  // 새로고침 핸들러
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStories([...mockStories]);
      setLoading(false);
    }, 500);
  };
  
  // 상태 배지 렌더링 함수
  const renderStatusBadge = (status: string) => {
    const style = statusStyles[status as keyof typeof statusStyles] || statusStyles.DRAFT;
    return (
      <Badge variant={style.variant as any} className="capitalize">
        {style.text}
      </Badge>
    );
  };
  
  const statusCards = generateStatusCards(mockStories);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">사연 관리</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">새로고침</span>
          </Button>
          <Button asChild>
            <Link href="/admin/stories/new">
              <Plus className="h-4 w-4 mr-2" />
              새 사연 등록
            </Link>
          </Button>
        </div>
      </div>
      
      {/* 상태별 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusCards.map((card) => (
          <Card 
            key={card.status} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleFilterChange('status', card.status === 'TOTAL' ? '' : card.status)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className={`text-xs px-2 py-1 rounded-full ${card.color} mb-2`}>
                {card.title}
              </span>
              <span className="text-2xl font-bold">{card.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-4">
              {/* 상태 필터 */}
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium mb-1 block">
                  상태
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={statusFilter}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 카테고리 필터 */}
              <div className="w-full md:w-1/3">
                <label className="text-sm font-medium mb-1 block">
                  카테고리
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={categoryFilter}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 검색 폼 */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">
                  검색
                </label>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      name="searchQuery"
                      placeholder="제목 또는 파트너로 검색..."
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit" size="sm" className="mt-0">
                    검색
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 사연 목록 테이블 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            사연 목록
            {loading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {loading ? '데이터를 불러오는 중...' : '조건에 맞는 사연이 없습니다.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>파트너</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell className="font-medium">{story.title}</TableCell>
                    <TableCell>{story.category}</TableCell>
                    <TableCell>{story.partner}</TableCell>
                    <TableCell>{renderStatusBadge(story.status)}</TableCell>
                    <TableCell>{formatDate(story.createdAt, 'yyyy-MM-dd')}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/stories/${story.id}`}>
                          상세보기
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 