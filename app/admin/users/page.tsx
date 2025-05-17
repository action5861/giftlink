'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  RefreshCw, 
  Loader2,
  Users,
  Mail,
  Calendar,
  UserCheck,
  UserX
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// 사용자 역할 타입 정의
type UserRole = 'USER' | 'ADMIN' | 'PARTNER' | 'DONOR';

// 사용자 인터페이스 정의
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  donationCount: number;
  totalDonationAmount: number;
  partnerId?: string;
  partnerName?: string;
}

// 역할별 통계 인터페이스 정의
interface RoleCounts {
  all: number;
  user: number;
  admin: number;
  partner: number;
  donor: number;
  active: number;
  inactive: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | ''>('');
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      // TODO: 에러 처리 (토스트 메시지 등)
    } finally {
      setLoading(false);
    }
  };
  
  // 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    // 역할 필터
    if (roleFilter && user.role !== roleFilter) {
      return false;
    }
    
    // 상태 필터
    if (statusFilter === 'active' && !user.isActive) {
      return false;
    }
    if (statusFilter === 'inactive' && user.isActive) {
      return false;
    }
    
    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (user.name && user.name.toLowerCase().includes(query)) ||
        user.email.toLowerCase().includes(query) ||
        (user.partnerName && user.partnerName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // 역할별 통계
  const roleCounts: RoleCounts = {
    all: users.length,
    user: users.filter(u => u.role === 'USER').length,
    admin: users.filter(u => u.role === 'ADMIN').length,
    partner: users.filter(u => u.role === 'PARTNER').length,
    donor: users.filter(u => u.role === 'DONOR').length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
  };
  
  // 검색 핸들러
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSearchQuery(formData.get('searchQuery') as string || '');
  };
  
  // 필터 핸들러
  const handleRoleFilter = (role: UserRole | '') => {
    setRoleFilter(role === roleFilter ? '' : role);
  };
  
  const handleStatusFilter = (status: 'active' | 'inactive' | '') => {
    setStatusFilter(status === statusFilter ? '' : status);
  };
  
  // 역할 배지 렌더링 함수
  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Badge variant="destructive">관리자</Badge>;
      case 'PARTNER':
        return <Badge variant="secondary">파트너</Badge>;
      case 'DONOR':
        return <Badge variant="default">기부자</Badge>;
      case 'USER':
      default:
        return <Badge variant="outline">일반 사용자</Badge>;
    }
  };
  
  // 상태 배지 렌더링 함수
  const renderStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="gap-1">
        <UserCheck className="h-3 w-3" />
        활성
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1">
        <UserX className="h-3 w-3" />
        비활성
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">사용자 관리</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>
      
      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.all}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">일반 사용자</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.user}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">관리자</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.admin}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">파트너</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.partner}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">기부자</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.donor}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
            <UserCheck className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">비활성 사용자</CardTitle>
            <UserX className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.inactive}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* 검색 및 필터 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="searchQuery"
              placeholder="이름, 이메일, 파트너명으로 검색"
              className="pl-8"
            />
          </div>
        </form>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={roleFilter === 'USER' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRoleFilter('USER')}
          >
            일반 사용자
          </Button>
          <Button
            variant={roleFilter === 'ADMIN' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRoleFilter('ADMIN')}
          >
            관리자
          </Button>
          <Button
            variant={roleFilter === 'PARTNER' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRoleFilter('PARTNER')}
          >
            파트너
          </Button>
          <Button
            variant={roleFilter === 'DONOR' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRoleFilter('DONOR')}
          >
            기부자
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilter('active')}
          >
            활성
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilter('inactive')}
          >
            비활성
          </Button>
        </div>
      </div>
      
      {/* 사용자 목록 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>기부 횟수</TableHead>
              <TableHead>총 기부액</TableHead>
              <TableHead>마지막 로그인</TableHead>
              <TableHead>가입일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{renderRoleBadge(user.role)}</TableCell>
                  <TableCell>{renderStatusBadge(user.isActive)}</TableCell>
                  <TableCell>{user.donationCount}</TableCell>
                  <TableCell>{user.totalDonationAmount.toLocaleString()}원</TableCell>
                  <TableCell>
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : '-'}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 