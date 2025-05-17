'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Loader2, Mail, Send } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
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
      name: formData.get('name') as string,
      organization: formData.get('organization') as string,
      email: formData.get('email') as string,
      sendCopy: formData.get('sendCopy') === 'on',
    };
    
    try {
      await partnerApi.invitePartner(data);
      setSuccess(true);
      
      // 3초 후 파트너 목록 페이지로 리디렉션
      setTimeout(() => {
        router.push('/admin/partners');
      }, 3000);
    } catch (err) {
      setError('초대장 발송 중 오류가 발생했습니다.');
      toast({
        title: '초대 실패',
        description: '파트너 초대장 발송에 실패했습니다. 다시 시도해주세요.',
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
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="sendCopy" name="sendCopy" />
                  <Label htmlFor="sendCopy" className="font-normal">
                    초대장 사본을 내 이메일로도 받기
                  </Label>
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