'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Loader2,
  Building,
  Mail
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { partnerApi, Partner, PartnerStats } from '@/lib/api/partners';
import { useToast } from '@/components/ui/use-toast';

export default function PartnersPage() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      console.log('파트너 목록 로딩 시작');
      
      const [partnersData, statsData] = await Promise.all([
        partnerApi.getPartners(),
        partnerApi.getPartnerStats(),
      ]);
      
      console.log('로드된 파트너 데이터:', partnersData);
      console.log('로드된 통계 데이터:', statsData);
      
      setPartners(partnersData);
      setStats(statsData);
    } catch (error) {
      console.error('파트너 데이터 로드 실패:', error);
      toast({
        title: '데이터 로드 실패',
        description: error instanceof Error ? error.message : '파트너 정보를 불러오는데 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 검색 필터링
  const filteredPartners = partners.filter(partner => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      partner.name.toLowerCase().includes(query) ||
      partner.contactPerson.toLowerCase().includes(query) ||
      partner.email.toLowerCase().includes(query)
    );
  });
  
  // 검색 핸들러
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('searchQuery') as string || '';
    setSearchQuery(query);
    
    try {
      setLoading(true);
      const data = await partnerApi.getPartners({ search: query });
      setPartners(data);
    } catch (error) {
      toast({
        title: '검색 실패',
        description: '파트너 검색에 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">파트너 관리</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">새로고침</span>
          </Button>
          <Button asChild>
            <Link href="/admin/partners/invite">
              <Plus className="h-4 w-4 mr-2" />
              파트너 초대
            </Link>
          </Button>
        </div>
      </div>
      
      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">총 파트너</p>
              <p className="text-2xl font-bold">{stats?.totalPartners || 0}</p>
            </div>
            <Building className="h-8 w-8 text-primary opacity-70" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">인증된 파트너</p>
              <p className="text-2xl font-bold">{stats?.verifiedPartners || 0}</p>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-8 w-8 text-green-500 opacity-70"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">총 등록 사연</p>
              <p className="text-2xl font-bold">{stats?.totalStories || 0}</p>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-8 w-8 text-blue-500 opacity-70"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </CardContent>
        </Card>
      </div>
      
      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="searchQuery"
                placeholder="파트너명, 담당자, 이메일로 검색..."
                className="pl-9"
                defaultValue={searchQuery}
              />
            </div>
            <Button type="submit" size="sm" className="mt-0">
              검색
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* 파트너 목록 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Building className="h-5 w-5 mr-2" />
            파트너 목록
            {loading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPartners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {loading ? '데이터를 불러오는 중...' : '검색 결과가 없습니다.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>기관명</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>사연/사용자</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.contactPerson}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm">{partner.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {partner.isVerified ? (
                        <Badge variant="default">인증됨</Badge>
                      ) : (
                        <Badge variant="outline">미인증</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {partner.storyCount} / {partner.userCount}
                    </TableCell>
                    <TableCell>{formatDate(partner.createdAt, 'yyyy-MM-dd')}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/partners/${partner.id}`}>
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