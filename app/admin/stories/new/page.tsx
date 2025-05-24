'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { storyApi } from '@/lib/api/stories';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';

const categories = {
  regions: [
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '세종',
    '경기',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주'
  ],
  itemCategories: [
    '의류',
    '가전제품',
    '가구',
    '생활용품',
    '식품',
    '장난감',
    '도서',
    '기타'
  ]
};

export default function NewStoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recipientAge: '',
    recipientGender: '',
    recipientRegion: '',
    items: [
      {
        name: '',
        description: '',
        price: '',
        coupangUrl: '',
        category: '',
      },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 필수 필드 검증
      if (!formData.title || !formData.content || 
          !formData.recipientAge || !formData.recipientGender || !formData.recipientRegion) {
        toast({
          title: '필수 항목 누락',
          description: '모든 필수 항목을 입력해주세요.',
          variant: 'destructive',
        });
        return;
      }

      // 물품 검증
      if (formData.items.length === 0) {
        toast({
          title: '물품 정보 누락',
          description: '최소 1개 이상의 물품을 등록해주세요.',
          variant: 'destructive',
        });
        return;
      }

      // 물품 필수 필드 검증
      const invalidItem = formData.items.find(
        item => !item.name || !item.description || !item.price || !item.coupangUrl || !item.category
      );
      if (invalidItem) {
        toast({
          title: '물품 정보 누락',
          description: '모든 물품의 필수 정보를 입력해주세요.',
          variant: 'destructive',
        });
        return;
      }

      // 수령인 나이 검증
      const age = parseInt(formData.recipientAge);
      if (isNaN(age) || age < 0 || age > 120) {
        toast({
          title: '잘못된 나이',
          description: '수령인의 나이는 0-120 사이여야 합니다.',
          variant: 'destructive',
        });
        return;
      }

      const response = await storyApi.createStory({
        ...formData,
        recipientAge: age,
        items: formData.items.map(item => ({
          ...item,
          price: parseFloat(item.price),
        })),
      });

      toast({
        title: '사연 등록 완료',
        description: '사연이 성공적으로 등록되었습니다.',
      });

      router.push('/admin/stories');
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: '사연 등록 실패',
        description: '사연 등록 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: '',
          description: '',
          price: '',
          coupangUrl: '',
          category: '',
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link href="/admin/stories">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-2">새 사연 등록</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientRegion">수혜자 지역 *</Label>
                <Select
                  value={formData.recipientRegion}
                  onValueChange={(value) => handleSelectChange('recipientRegion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용 *</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientAge">수령인 나이 *</Label>
                <Input
                  id="recipientAge"
                  name="recipientAge"
                  type="number"
                  min="0"
                  max="120"
                  value={formData.recipientAge}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientGender">수령인 성별 *</Label>
                <Select
                  value={formData.recipientGender}
                  onValueChange={(value) => handleSelectChange('recipientGender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">남성</SelectItem>
                    <SelectItem value="FEMALE">여성</SelectItem>
                    <SelectItem value="OTHER">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>물품 정보</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.items.map((item, index) => (
              <div key={index} className="space-y-4 mb-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">물품 {index + 1}</h3>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`item-name-${index}`}>물품명 *</Label>
                    <Input
                      id={`item-name-${index}`}
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`item-category-${index}`}>물품 카테고리 *</Label>
                    <Select
                      value={item.category}
                      onValueChange={(value) => handleItemChange(index, 'category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.itemCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`item-price-${index}`}>가격 *</Label>
                    <Input
                      id={`item-price-${index}`}
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`item-coupang-url-${index}`}>쿠팡 URL *</Label>
                    <Input
                      id={`item-coupang-url-${index}`}
                      type="url"
                      value={item.coupangUrl}
                      onChange={(e) => handleItemChange(index, 'coupangUrl', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`item-description-${index}`}>설명 *</Label>
                  <Textarea
                    id={`item-description-${index}`}
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                    rows={3}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              물품 추가
            </Button>
          </CardContent>
        </Card>

        <CardFooter className="mt-6 flex justify-end space-x-4">
          <Link href="/admin/stories">
            <Button variant="outline" type="button">
              취소
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '등록 중...' : '사연 등록'}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}