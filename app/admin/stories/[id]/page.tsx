'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  Edit, 
  XCircle, 
  CheckCircle,
  CreditCard,
  ImagePlus,
  MessageSquare,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { storyApi } from '@/lib/api/stories';

// Type definitions
type StoryStatus = 'DRAFT' | 'PENDING' | 'REVISION' | 'APPROVED' | 'PUBLISHED' | 'FULFILLED' | 'REJECTED';

interface StoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  coupangUrl: string;
  imageUrl?: string;
}

interface StatusHistory {
  id: string;
  fromStatus: StoryStatus;
  toStatus: StoryStatus;
  note: string;
  changedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
}

interface Story {
  id: string;
  title: string;
  content: string;
  status: StoryStatus;
  category: string;
  recipientAge: number;
  recipientGender: string;
  partner: {
    id: string;
    name: string;
  };
  imageUrl?: string;
  imagePrompt?: string;
  adminNotes?: string;
  createdAt: Date;
  publishedAt?: Date;
  items: StoryItem[];
  statusHistory: StatusHistory[];
  donations: any[];
}

// 상태별 배지 스타일 설정
const statusStyles: Record<StoryStatus, { variant: string; text: string }> = {
  DRAFT: { variant: 'outline', text: '작성 중' },
  PENDING: { variant: 'secondary', text: '검토 대기' },
  REVISION: { variant: 'warning', text: '수정 요청' },
  APPROVED: { variant: 'info', text: '승인됨' },
  PUBLISHED: { variant: 'success', text: '게시됨' },
  FULFILLED: { variant: 'primary', text: '완료됨' },
  REJECTED: { variant: 'destructive', text: '거부됨' },
};

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [note, setNote] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [userRole, setUserRole] = useState<'ADMIN' | 'PARTNER'>('ADMIN'); // 기본값은 ADMIN

  useEffect(() => {
    loadStory();
    // 사용자 역할 확인
    const checkUserRole = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };
    checkUserRole();
  }, [params.id]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const data = await storyApi.getStory(params.id);
      setStory(data);
      setImagePrompt(data.imagePrompt || '');
    } catch (error) {
      console.error('Error loading story:', error);
      toast({
        title: '오류',
        description: '사연을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!story) return;
    
    try {
      setGeneratingImage(true);
      await storyApi.generateImage(story.id, imagePrompt);
      await loadStory();
      toast({
        title: '이미지 생성 완료',
        description: '이미지가 생성되었습니다.',
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: '오류',
        description: '이미지 생성에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  // 관리자 액션 카드 렌더링
  const renderAdminActions = () => {
    if (userRole !== 'ADMIN') return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>관리자 액션</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">메모</h3>
            <Textarea
              placeholder="메모를 입력하세요"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {/* DRAFT 상태일 때 */}
            {story.status === 'DRAFT' && (
              <Button
                variant="default"
                onClick={() => handleStatusChange('PENDING')}
                disabled={actionLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                검토 대기로 변경
              </Button>
            )}

            {/* PENDING 상태일 때 */}
            {story.status === 'PENDING' && (
              <>
                <Button
                  variant="default"
                  onClick={() => handleStatusChange('APPROVED')}
                  disabled={actionLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  승인
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange('REJECTED')}
                  disabled={actionLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  거부
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange('REVISION')}
                  disabled={actionLoading}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  수정 요청
                </Button>
              </>
            )}

            {/* APPROVED 상태일 때 */}
            {story.status === 'APPROVED' && (
              <Button
                variant="default"
                onClick={() => handleStatusChange('PUBLISHED')}
                disabled={actionLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                게시
              </Button>
            )}

            {/* PUBLISHED 상태일 때 */}
            {story.status === 'PUBLISHED' && (
              <Button
                variant="default"
                onClick={() => handleStatusChange('FULFILLED')}
                disabled={actionLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                완료 처리
              </Button>
            )}

            {/* 이미지 생성 (APPROVED 상태일 때만) */}
            {story.status === 'APPROVED' && (
              <div className="w-full mt-4">
                <h3 className="font-semibold mb-2">이미지 생성 프롬프트</h3>
                <Textarea
                  placeholder="이미지 생성을 위한 프롬프트를 입력하세요"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                />
                <Button
                  variant="default"
                  onClick={handleGenerateImage}
                  disabled={generatingImage || !imagePrompt}
                  className="mt-2"
                >
                  {generatingImage ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4 mr-2" />
                  )}
                  이미지 생성
                </Button>
              </div>
            )}
          </div>

          {story.adminNotes && (
            <div>
              <h3 className="font-semibold mb-2">관리자 메모</h3>
              <p className="text-muted-foreground">{story.adminNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // 상태 변경 핸들러
  const handleStatusChange = async (newStatus: StoryStatus) => {
    if (!story) return;
    
    try {
      setActionLoading(true);
      await storyApi.updateStoryStatus(story.id, newStatus, note);
      await loadStory();
      toast({
        title: '상태 변경 완료',
        description: '사연의 상태가 변경되었습니다.',
      });
    } catch (error) {
      console.error('Error changing story status:', error);
      toast({
        title: '오류',
        description: '상태 변경에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">사연을 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-4">
          요청하신 사연이 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <Button asChild>
          <Link href="/admin/stories">
            <ChevronLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/stories">
              <ChevronLeft className="h-4 w-4 mr-2" />
              목록으로
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{story.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={statusStyles[story.status].variant as any}>
                {statusStyles[story.status].text}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(story.createdAt, 'yyyy-MM-dd HH:mm')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 사연 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>사연 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">내용</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{story.content}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">카테고리</h3>
                <p className="text-muted-foreground">{story.category}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">수혜자 정보</h3>
                <p className="text-muted-foreground">
                  {story.recipientAge}세 {story.recipientGender}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">파트너</h3>
              <p className="text-muted-foreground">{story.partner.name}</p>
            </div>
          </CardContent>
        </Card>

        {/* 관리자 액션 */}
        {renderAdminActions()}
      </div>

      {/* 물품 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>물품 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>물품명</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="text-right">가격</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {story.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">
                    {item.price.toLocaleString()}원
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={item.coupangUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        구매하기
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 상태 이력 */}
      <Card>
        <CardHeader>
          <CardTitle>상태 이력</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {story.statusHistory.map((history) => (
              <div key={history.id} className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={statusStyles[history.toStatus].variant as any}>
                      {statusStyles[history.toStatus].text}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(history.createdAt, 'yyyy-MM-dd HH:mm')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {history.note}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    변경자: {history.changedBy.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 