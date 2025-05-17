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
  changedBy: string;
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

// 임시 사연 데이터
const mockStories: Record<string, Story> = {
  '1': {
    id: '1',
    title: '겨울을 따뜻하게 보내고 싶어요',
    content: '추운 겨울이 다가오는데 난방비가 너무 부담됩니다. 오래된 이불로는 추위를 막기 어려워 밤에 잠을 이루기가 힘듭니다. 따뜻한 이불과 전기장판이 있으면 이번 겨울을 덜 춥게 보낼 수 있을 것 같습니다. 도움 주시면 정말 감사하겠습니다.',
    status: 'PENDING',
    category: '생활용품',
    recipientAge: 67,
    recipientGender: '여성',
    partner: {
      id: 'p1',
      name: '굿네이버스',
    },
    imageUrl: 'https://picsum.photos/seed/winter1/800/600',
    createdAt: new Date('2023-12-15T09:32:00'),
    items: [
      {
        id: '101',
        name: '따뜻한 겨울 이불',
        description: '거위털 충전재로 보온성이 뛰어난 겨울용 이불입니다.',
        price: 39000,
        coupangUrl: 'https://www.coupang.com/sample-blanket',
      },
      {
        id: '102',
        name: '전기장판',
        description: '에너지 효율이 높은 전기장판으로 취침 시 따뜻함을 유지해 줍니다.',
        price: 28000,
        coupangUrl: 'https://www.coupang.com/sample-heater',
      }
    ],
    statusHistory: [
      {
        id: 'sh1',
        fromStatus: 'DRAFT',
        toStatus: 'PENDING',
        note: '검토 요청합니다.',
        changedBy: '김파트너',
        createdAt: new Date('2023-12-15T09:32:00'),
      }
    ],
    donations: [],
  },
  '2': {
    id: '2',
    title: '학교 준비물이 필요해요',
    content: '새 학기가 시작되었는데 필요한 학용품을 살 형편이 안 됩니다. 도움 필요합니다.',
    status: 'APPROVED',
    category: '교육',
    recipientAge: 11,
    recipientGender: '남성',
    partner: {
      id: 'p2',
      name: '세이브더칠드런',
    },
    imageUrl: 'https://picsum.photos/seed/education1/800/600',
    createdAt: new Date('2023-12-10T14:25:00'),
    items: [
      {
        id: '201',
        name: '기본 학용품 세트',
        description: '연필, 지우개, 공책 등 기본 학용품이 포함된 세트입니다.',
        price: 25000,
        coupangUrl: 'https://www.coupang.com/school-supplies',
      }
    ],
    statusHistory: [
      {
        id: 'sh2',
        fromStatus: 'DRAFT',
        toStatus: 'PENDING',
        note: '검토 요청합니다.',
        changedBy: '이파트너',
        createdAt: new Date('2023-12-09T10:15:00'),
      },
      {
        id: 'sh3',
        fromStatus: 'PENDING',
        toStatus: 'APPROVED',
        note: '내용 확인 완료. 승인합니다.',
        changedBy: '관리자',
        createdAt: new Date('2023-12-10T14:25:00'),
      }
    ],
    donations: [],
  }
};

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

  useEffect(() => {
    loadStory();
  }, [params.id]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/stories/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch story');
      }
      const data = await response.json();
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

  const handleApprove = async () => {
    if (!story) return;
    
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/stories/${story.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve story');
      }

      await loadStory();
      toast({
        title: '승인 완료',
        description: '사연이 승인되었습니다.',
      });
    } catch (error) {
      console.error('Error approving story:', error);
      toast({
        title: '오류',
        description: '사연 승인에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!story) return;
    
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/stories/${story.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject story');
      }

      await loadStory();
      toast({
        title: '거부 완료',
        description: '사연이 거부되었습니다.',
      });
    } catch (error) {
      console.error('Error rejecting story:', error);
      toast({
        title: '오류',
        description: '사연 거부에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!story) return;
    
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/stories/${story.id}/request-revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        throw new Error('Failed to request revision');
      }

      await loadStory();
      toast({
        title: '수정 요청 완료',
        description: '수정 요청이 전송되었습니다.',
      });
    } catch (error) {
      console.error('Error requesting revision:', error);
      toast({
        title: '오류',
        description: '수정 요청에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!story) return;
    
    try {
      setGeneratingImage(true);
      const response = await fetch(`/api/admin/stories/${story.id}/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

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
        <p className="text-muted-foreground mb-4">요청하신 사연이 존재하지 않거나 삭제되었습니다.</p>
        <Button onClick={() => router.back()}>뒤로 가기</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{story.title}</h1>
          <Badge variant={statusStyles[story.status].variant as any}>
            {statusStyles[story.status].text}
          </Badge>
        </div>
      </div>

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
        <Card>
          <CardHeader>
            <CardTitle>관리자 액션</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {story.status === 'PENDING' && (
              <>
                <div>
                  <h3 className="font-semibold mb-2">메모</h3>
                  <Textarea
                    placeholder="메모를 입력하세요"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    onClick={handleApprove}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    승인
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    거부
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleRequestRevision}
                    disabled={actionLoading}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    수정 요청
                  </Button>
                </div>
              </>
            )}

            {story.status === 'APPROVED' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">이미지 생성 프롬프트</h3>
                  <Textarea
                    placeholder="이미지 생성을 위한 프롬프트를 입력하세요"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                  />
                </div>
                <Button
                  variant="default"
                  onClick={handleGenerateImage}
                  disabled={generatingImage || !imagePrompt}
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

            {story.adminNotes && (
              <div>
                <h3 className="font-semibold mb-2">관리자 메모</h3>
                <p className="text-muted-foreground">{story.adminNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 물품 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>필요한 물품</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>물품명</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>링크</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {story.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.price.toLocaleString()}원</TableCell>
                  <TableCell>
                    <Link
                      href={item.coupangUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      쿠팡 링크
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 상태 변경 이력 */}
      <Card>
        <CardHeader>
          <CardTitle>상태 변경 이력</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>변경일시</TableHead>
                <TableHead>이전 상태</TableHead>
                <TableHead>변경 상태</TableHead>
                <TableHead>변경 사유</TableHead>
                <TableHead>담당자</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {story.statusHistory.map((history) => (
                <TableRow key={history.id}>
                  <TableCell>{formatDate(history.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={statusStyles[history.fromStatus].variant as any}>
                      {statusStyles[history.fromStatus].text}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusStyles[history.toStatus].variant as any}>
                      {statusStyles[history.toStatus].text}
                    </Badge>
                  </TableCell>
                  <TableCell>{history.note}</TableCell>
                  <TableCell>{history.changedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 