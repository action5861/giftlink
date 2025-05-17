'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ImagePlus, Loader2, RefreshCw } from 'lucide-react';

// Type definitions
interface Story {
  id: string;
  title: string;
  content: string;
  category: string;
}

// 임시 사연 데이터
const mockStories: Record<string, Story> = {
  '1': {
    id: '1',
    title: '겨울을 따뜻하게 보내고 싶어요',
    content: '추운 겨울이 다가오는데 난방비가 너무 부담됩니다. 오래된 이불로는 추위를 막기 어려워 밤에 잠을 이루기가 힘듭니다. 따뜻한 이불과 전기장판이 있으면 이번 겨울을 덜 춥게 보낼 수 있을 것 같습니다.',
    category: '생활용품',
  },
  '2': {
    id: '2',
    title: '학교 준비물이 필요해요',
    content: '새 학기가 시작되었는데 필요한 학용품을 살 형편이 안 됩니다. 도움 필요합니다.',
    category: '교육',
  },
};

type ImageStyle = 'realistic' | 'cartoon' | 'watercolor' | 'oil';
type AspectRatio = '1:1' | '4:3' | '3:4' | '16:9';

export default function StoryImagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [imageStyle, setImageStyle] = useState<ImageStyle>('realistic');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:3');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  useEffect(() => {
    // 데이터 로드
    setLoading(true);
    setTimeout(() => {
      const storyData = mockStories[params.id];
      if (storyData) {
        setStory(storyData);
        // 초기 프롬프트 생성
        const initialPrompt = `${storyData.category} 관련 도움이 필요한 ${storyData.title}. ${storyData.content.slice(0, 100)}`;
        setPrompt(initialPrompt);
      }
      setLoading(false);
    }, 500);
  }, [params.id]);
  
  // 이미지 생성 로직
  const handleGenerateImage = async () => {
    setProcessing(true);
    
    try {
      // 실제 구현에서는 API 호출
      // 임시로 이미지 생성 과정을 시뮬레이션
      setTimeout(() => {
        // 임시 이미지 URL
        const fakeImageUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
        setGeneratedImage(fakeImageUrl);
        setProcessing(false);
      }, 3000);
    } catch (error) {
      console.error('이미지 생성 중 오류 발생:', error);
      setProcessing(false);
    }
  };
  
  // 이미지 게시 (사연 상태를 PUBLISHED로 변경)
  const handlePublish = async () => {
    setProcessing(true);
    
    try {
      // 실제 구현에서는 API 호출
      setTimeout(() => {
        // 성공 후 사연 상세 페이지로 리디렉션
        router.push(`/admin/stories/${params.id}?published=true`);
      }, 1000);
    } catch (error) {
      console.error('게시 중 오류 발생:', error);
      setProcessing(false);
    }
  };
  
  // 새 프롬프트 자동 생성
  const handleRegeneratePrompt = () => {
    if (!story) return;
    
    const templates = [
      `${story.category}와 관련된 도움이 필요한 사람을 위한 이미지. ${story.title}`,
      `${story.title}에 대한 감동적인 장면. ${story.content.slice(0, 100)}`,
      `따뜻한 도움의 손길이 필요한 ${story.category} 상황. ${story.title}`,
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setPrompt(randomTemplate);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">불러오는 중...</span>
      </div>
    );
  }
  
  if (!story) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">사연을 찾을 수 없습니다</h2>
        <Button asChild>
          <Link href="/admin/stories">목록으로 돌아가기</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          asChild
          className="gap-1"
        >
          <Link href={`/admin/stories/${params.id}`}>
            <ChevronLeft className="h-4 w-4" />
            사연으로 돌아가기
          </Link>
        </Button>
        
        <h1 className="text-2xl font-bold">
          사연 이미지 생성
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 사연 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">사연 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">제목</h3>
              <p className="font-medium">{story.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">카테고리</h3>
              <p>{story.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">내용</h3>
              <p className="text-sm">{story.content}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* 이미지 생성 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">이미지 생성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="prompt">이미지 프롬프트</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 gap-1 text-xs"
                  onClick={handleRegeneratePrompt}
                >
                  <RefreshCw className="h-3 w-3" />
                  새로 생성
                </Button>
              </div>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                placeholder="이미지 생성을 위한 프롬프트를 입력하세요"
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                구체적인 프롬프트를 작성할수록 더 관련성 높은 이미지가 생성됩니다.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>이미지 스타일</Label>
              <RadioGroup
                value={imageStyle}
                onValueChange={(value: ImageStyle) => setImageStyle(value)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="realistic" id="realistic" />
                  <Label htmlFor="realistic">사실적</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cartoon" id="cartoon" />
                  <Label htmlFor="cartoon">만화</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="watercolor" id="watercolor" />
                  <Label htmlFor="watercolor">수채화</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oil" id="oil" />
                  <Label htmlFor="oil">유화</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aspectRatio">화면 비율</Label>
              <Select
                value={aspectRatio}
                onValueChange={(value: AspectRatio) => setAspectRatio(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="비율 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">정사각형 (1:1)</SelectItem>
                  <SelectItem value="4:3">가로형 (4:3)</SelectItem>
                  <SelectItem value="3:4">세로형 (3:4)</SelectItem>
                  <SelectItem value="16:9">와이드 (16:9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleGenerateImage}
              disabled={processing || !prompt}
              className="w-full gap-1"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  이미지 생성 중...
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" />
                  이미지 생성하기
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* 생성된 이미지 미리보기 */}
        {generatedImage && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">생성된 이미지</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative w-full max-w-2xl h-[400px]">
                <Image
                  src={generatedImage}
                  alt="생성된 이미지"
                  fill
                  className="object-contain"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button 
                variant="outline"
                onClick={handleGenerateImage}
                disabled={processing}
              >
                다시 생성
              </Button>
              <Button
                onClick={handlePublish}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    게시 중...
                  </>
                ) : (
                  '이미지 확정 및 게시'
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
} 