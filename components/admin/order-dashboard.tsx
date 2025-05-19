'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableHead 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Order, CoupangOrderStatus } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

interface OrderDashboardProps {
  // 프롭 정의
}

export function OrderDashboard({}: OrderDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // 주문 목록 로드
  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const queryParams = statusFilter && statusFilter !== 'ALL' ? `?status=${statusFilter}` : '';
      const response = await fetch(`/api/admin/orders${queryParams}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('주문 목록 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 주문 상태 색상 매핑
  const getStatusBadgeVariant = (status: CoupangOrderStatus) => {
    switch (status) {
      case CoupangOrderStatus.PENDING: return 'secondary';
      case CoupangOrderStatus.ACCEPTED: return 'default';
      case CoupangOrderStatus.PREPARING: return 'default';
      case CoupangOrderStatus.SHIPPED: return 'default';
      case CoupangOrderStatus.DELIVERED: return 'default';
      case CoupangOrderStatus.CANCELLED: return 'destructive';
      case CoupangOrderStatus.FAILED: return 'destructive';
      default: return 'outline';
    }
  };

  // 추적 링크 열기
  const openTrackingLink = (trackingNumber: string | undefined) => {
    if (trackingNumber) {
      window.open(`https://tracker.delivery/#/${trackingNumber}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>주문 관리</CardTitle>
          <div className="flex items-center space-x-2">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="모든 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모든 상태</SelectItem>
                <SelectItem value="PENDING">대기 중</SelectItem>
                <SelectItem value="ACCEPTED">접수됨</SelectItem>
                <SelectItem value="PREPARING">상품 준비 중</SelectItem>
                <SelectItem value="SHIPPED">배송 중</SelectItem>
                <SelectItem value="DELIVERED">배송 완료</SelectItem>
                <SelectItem value="CANCELLED">취소됨</SelectItem>
                <SelectItem value="FAILED">실패</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadOrders}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-4">주문 내역이 없습니다.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>주문 ID</TableHead>
                  <TableHead>쿠팡 주문 ID</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>배송 추적</TableHead>
                  <TableHead>생성일</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.coupangOrderId || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>
                      {order.trackingNumber ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openTrackingLink(order.trackingNumber)}
                        >
                          추적하기
                        </Button>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        상세보기
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