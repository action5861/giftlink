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
import { useToast } from '@/components/ui/use-toast';
import { storyApi } from '@/lib/api/stories';

// 상태별 배지 스타일 설정
const statusStyles: Record<string, { variant: string; text: string }> = {
  DRAFT: { variant: 'outline', text: '작성 중' },
  PENDING: { variant: 'secondary', text: '검토 대기' },
  REVISION: { variant: 'warning', text: '수정 요청' },
  APPROVED: { variant: 'info', text: '승인됨' },
  PUBLISHED: { variant: 'success', text: '게시됨' },
  FULFILLED: { variant: 'primary', text: '완료됨' },
  REJECTED: { variant: 'destructive', text: '거부됨' },
};

// 상태별 통계 카드 설정
const statusCards = [
  { status: 'TOTAL', title: '전체', color: 'bg-gray-100 text-gray-800' },
  { status: 'PENDING', title: '검토 대기', color: 'bg-yellow-100 text-yellow-800' },
  { status: 'REVISION', title: '수정 요청', color: 'bg-orange-100 text-orange-800' },
  { status: 'APPROVED', title: '승인됨', color: 'bg-blue-100 text-blue-800' },
  { status: 'PUBLISHED', title: '게시됨', color: 'bg-green-100 text-green-800' },
];

export default function StoriesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  // URL 파라미터에서 필터 가져오기
  const statusFilter = searchParams.get('status') || '';
  const categoryFilter = searchParams.get('category') || '';
  
  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    loadData();
  }, [statusFilter, categoryFilter, searchQuery, currentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 사연 목록 조회
      const storiesData = await storyApi.getStories({
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter,
        page: currentPage,
        limit: 10,
      });
      setStories(storiesData.stories);
      setTotalPages(storiesData.totalPages);
      setCurrentPage(storiesData.currentPage);

      // 통계 데이터 조회
      const statsData = await storyApi.getStats();
      setStats(statsData.byStatus);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: '오류',
        description: '데이터를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
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

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    loadData();
  };

  // 상태 배지 렌더링
  const renderStatusBadge = (status: string) => {
    const style = statusStyles[status] || { variant: 'outline', text: status };
    return (
      <Badge variant={style.variant as any}>
        {style.text}
      </Badge>
    );
  };
  
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
              <span className="text-2xl font-bold">
                {card.status === 'TOTAL' ? stats.total || 0 : stats[card.status] || 0}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="제목 또는 파트너 검색..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('status', '')}
                className={!statusFilter ? 'bg-primary text-primary-foreground' : ''}
              >
                전체
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('status', 'PENDING')}
                className={statusFilter === 'PENDING' ? 'bg-primary text-primary-foreground' : ''}
              >
                검토 대기
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('status', 'REVISION')}
                className={statusFilter === 'REVISION' ? 'bg-primary text-primary-foreground' : ''}
              >
                수정 요청
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 사연 목록 */}
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
                    <TableCell>{story.partner.name}</TableCell>
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