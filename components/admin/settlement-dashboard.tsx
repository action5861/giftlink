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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Settlement, SettlementStatus } from '@/lib/types';

interface SettlementDashboardProps {
  // 프롭 정의
}

export function SettlementDashboard({}: SettlementDashboardProps) {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentReference, setPaymentReference] = useState('');
  const [selectedSettlementId, setSelectedSettlementId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 정산 목록 로드
  useEffect(() => {
    loadSettlements();
  }, []);

  const loadSettlements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settlements');
      const data = await response.json();
      setSettlements(data);
    } catch (error) {
      console.error('정산 목록 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 정산 완료 처리
  const handleCompleteSettlement = async (id: string) => {
    if (!paymentReference) {
      alert('결제 참조 번호를 입력해주세요.');
      return;
    }

    try {
      setProcessingId(id);
      const response = await fetch(`/api/admin/settlements/${id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentReference }),
      });

      if (response.ok) {
        // 성공적으로 처리 완료
        await loadSettlements(); // 정산 목록 새로고침
        setSelectedSettlementId(null);
        setPaymentReference('');
      } else {
        const errorData = await response.json();
        alert(`정산 완료 처리 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('정산 완료 처리 오류:', error);
      alert('정산 완료 처리 중 오류가 발생했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  // 상태별 배지 컬러 매핑
  const getStatusBadgeVariant = (status: SettlementStatus) => {
    switch (status) {
      case SettlementStatus.PENDING: return 'secondary';
      case SettlementStatus.CONFIRMED: return 'default';
      case SettlementStatus.PAID: return 'default';
      case SettlementStatus.COMPLETED: return 'default';
      case SettlementStatus.OVERDUE: return 'destructive';
      case SettlementStatus.DISPUTED: return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>정산 관리</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : settlements.length === 0 ? (
            <div className="text-center py-4">정산 내역이 없습니다.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>정산 ID</TableHead>
                  <TableHead>NGO</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>예정일</TableHead>
                  <TableHead>완료일</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell>{settlement.id}</TableCell>
                    <TableCell>{settlement.ngoName || settlement.ngoId}</TableCell>
                    <TableCell>{formatCurrency(settlement.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(settlement.status)}>
                        {settlement.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(settlement.scheduledDate)}</TableCell>
                    <TableCell>
                      {settlement.completedDate ? formatDate(settlement.completedDate) : '-'}
                    </TableCell>
                    <TableCell>
                      {settlement.status === 'PENDING' || settlement.status === 'CONFIRMED' ? (
                        <Button
                          size="sm"
                          onClick={() => setSelectedSettlementId(settlement.id)}
                          disabled={processingId === settlement.id}
                        >
                          {processingId === settlement.id ? '처리 중...' : '완료 처리'}
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          {settlement.status === 'COMPLETED' ? '완료됨' : '처리 불가'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* 정산 완료 처리 모달 */}
          {selectedSettlementId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">정산 완료 처리</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">결제 참조 번호</label>
                    <Input
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="은행 거래 참조 번호 입력"
                    />
                    <p className="text-xs text-gray-500">
                      NGO에게 입금한 은행 거래 번호 또는 참조 번호를 입력하세요.
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedSettlementId(null);
                        setPaymentReference('');
                      }}
                    >
                      취소
                    </Button>
                    <Button 
                      onClick={() => handleCompleteSettlement(selectedSettlementId)} 
                      disabled={!paymentReference || processingId !== null}
                    >
                      {processingId ? '처리 중...' : '완료 처리'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 