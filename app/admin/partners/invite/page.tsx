'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Loader2, Mail, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { partnerApi } from '@/lib/api/partners';
import { useToast } from '@/components/ui/use-toast';

export default function PartnerInvitePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('organization') as string,
      email: formData.get('email') as string,
      contactPerson: formData.get('name') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      website: formData.get('website') as string || undefined,
      address: formData.get('address') as string || undefined,
    };

    // 데이터 유효성 검사
    if (!data.name || !data.email || !data.contactPerson || !data.phoneNumber) {
      setError('필수 항목을 모두 입력해주세요.');
      setLoading(false);
      return;
    }

    if (data.website && !data.website.startsWith('http')) {
      data.website = `https://${data.website}`;
    }
    
    try {
      const response = await partnerApi.invitePartner(data);
      setSuccess(true);
      
      toast({
        title: '초대 성공',
        description: '파트너 초대장이 성공적으로 발송되었습니다.',
      });
      
      // 3초 후 파트너 목록 페이지로 리디렉션
      setTimeout(() => {
        router.push('/admin/partners');
      }, 3000);
    } catch (err: any) {
      console.error('Partner invite error:', err);
      setError(err.message || '초대장 발송 중 오류가 발생했습니다.');
      toast({
        title: '초대 실패',
        description: err.message || '파트너 초대장 발송에 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          asChild
          className="gap-1"
        >
          <Link href="/admin/partners">
            <ChevronLeft className="h-4 w-4" />
            파트너 목록으로
          </Link>
        </Button>
        
        <h1 className="text-2xl font-bold">
          파트너 초대
        </h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            파트너 초대장 발송
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-green-700">초대장 발송 완료</h3>
              <p className="text-green-600">
                파트너 초대장이 성공적으로 발송되었습니다.
              </p>
              <p className="text-sm text-muted-foreground">
                잠시 후 파트너 목록 페이지로 이동합니다...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">기관명 *</Label>
                  <Input
                    id="organization"
                    name="organization"
                    required
                    placeholder="예: 굿네이버스"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">담당자 이름 *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="예: 홍길동"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 주소 *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="예: partner@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">전화번호 *</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    placeholder="예: 010-1234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="예: example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="예: 서울시 강남구"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="font-medium">초대장 발송 안내</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>파트너 초대장은 입력한 이메일 주소로 발송됩니다.</li>
                  <li>초대 링크는 7일간 유효하며, 그 후에는 새로운 초대장을 발송해야 합니다.</li>
                  <li>초대받은 파트너는 가입 후 기관 정보를 추가로 입력해야 합니다.</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="gap-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      발송 중...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      초대장 발송
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 