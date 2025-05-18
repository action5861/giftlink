'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, Loader2 } from 'lucide-react';

// 카테고리 목록
const categories = [
  '생활용품',
  '교육',
  '위생용품',
  '의류',
  '육아',
  '건강',
  '의료용품'
];

// 시/도 목록
const regions = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도'
];

interface StoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  coupangUrl: string;
}

export default function NewStoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    recipientAge: '',
    recipientGender: '',
    recipientRegion: '',
    items: [] as StoryItem[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create story');
      }

      toast({
        title: '사연이 등록되었습니다',
        description: '관리자의 검토 후 게시될 예정입니다.',
      });

      router.push('/admin/stories');
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: '오류',
        description: '사연 등록에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: Date.now().toString(),
        name: '',
        description: '',
        price: 0,
        coupangUrl: ''
      }]
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleItemChange = (itemId: string, field: keyof StoryItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">새 사연 등록</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="사연의 제목을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="사연의 내용을 입력하세요"
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientAge">수혜자 연령</Label>
                <Input
                  id="recipientAge"
                  name="recipientAge"
                  type="number"
                  value={formData.recipientAge}
                  onChange={handleChange}
                  placeholder="연령 입력"
                  min="0"
                  max="120"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientGender">수혜자 성별</Label>
                <Select
                  value={formData.recipientGender}
                  onValueChange={(value) => handleSelectChange('recipientGender', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="남성">남성</SelectItem>
                    <SelectItem value="여성">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientRegion">수혜자 거주지</Label>
                <Select
                  value={formData.recipientRegion}
                  onValueChange={(value) => handleSelectChange('recipientRegion', value)}
                  required
                >
                  <SelectTrigger>
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

            {/* 수혜자 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">수혜자 정보</h3>
              
              <div className="space-y-2">
                <Label htmlFor="recipientName">수혜자 성명 *</Label>
                <Input
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="수혜자 성명을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientPhone">연락처 *</Label>
                <Input
                  id="recipientPhone"
                  name="recipientPhone"
                  value={formData.recipientPhone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientRegion">거주지역 *</Label>
                <Select
                  value={formData.recipientRegion}
                  onValueChange={(value) => handleSelectChange('recipientRegion', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="거주지역 선택" />
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

              <div className="space-y-2">
                <Label htmlFor="recipientAddress">상세주소 *</Label>
                <Input
                  id="recipientAddress"
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleChange}
                  placeholder="상세주소를 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientAge">연령 *</Label>
                <Input
                  id="recipientAge"
                  name="recipientAge"
                  type="number"
                  value={formData.recipientAge}
                  onChange={handleChange}
                  placeholder="연령 입력"
                  min="0"
                  max="120"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientGender">성별 *</Label>
                <Select
                  value={formData.recipientGender}
                  onValueChange={(value) => handleSelectChange('recipientGender', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="남성">남성</SelectItem>
                    <SelectItem value="여성">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상품 정보 섹션 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>필요한 물품</CardTitle>
            <Button type="button" onClick={handleAddItem}>
              물품 추가
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.items.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">물품 정보</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    삭제
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>물품명</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      placeholder="물품명을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>가격</Label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', parseInt(e.target.value))}
                      placeholder="가격을 입력하세요"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    placeholder="물품에 대한 설명을 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>쿠팡 상품 링크</Label>
                  <Input
                    value={item.coupangUrl}
                    onChange={(e) => handleItemChange(item.id, 'coupangUrl', e.target.value)}
                    placeholder="https://www.coupang.com/..."
                    required
                  />
                </div>
              </div>
            ))}

            {formData.items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                필요한 물품을 추가해주세요
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                등록 중...
              </>
            ) : (
              '사연 등록'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 