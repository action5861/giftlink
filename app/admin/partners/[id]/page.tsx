'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  Building, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  FileText, 
  Users,
  Loader2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Save
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { partnerApi, Partner } from '@/lib/api/partners';
import { useToast } from '@/components/ui/use-toast';

// 상태별 배지 스타일 설정
const statusStyles = {
  DRAFT: { variant: 'outline', text: '작성 중' },
  PENDING: { variant: 'secondary', text: '검토 대기' },
  REVISION: { variant: 'warning', text: '수정 요청' },
  APPROVED: { variant: 'info', text: '승인됨' },
  PUBLISHED: { variant: 'success', text: '게시됨' },
  FULFILLED: { variant: 'primary', text: '완료됨' },
  REJECTED: { variant: 'destructive', text: '거부됨' },
};

export default function PartnerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partner | null>(null);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  useEffect(() => {
    loadPartnerData();
  }, [params.id]);
  
  const loadPartnerData = async () => {
    try {
      setLoading(true);
      const data = await partnerApi.getPartner(params.id);
      setPartner(data);
      setFormData(data);
    } catch (error) {
      toast({
        title: '데이터 로드 실패',
        description: '파트너 정보를 불러오는데 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      isVerified: checked,
    }));
  };
  
  const handleSave = async () => {
    if (!formData) return;
    
    try {
      setSaving(true);
      const updatedPartner = await partnerApi.updatePartner(params.id, formData);
      setPartner(updatedPartner);
      setEditMode(false);
      toast({
        title: '저장 완료',
        description: '파트너 정보가 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      toast({
        title: '저장 실패',
        description: '파트너 정보 저장에 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      setSendingMessage(true);
      await partnerApi.sendMessage(params.id, {
        content: message,
        subject: `${partner.name} 파트너에게 보내는 메시지`,
        sendEmail: true
      });
      setMessage('');
      toast({
        title: '메시지 전송 완료',
        description: '파트너에게 메시지가 전송되었습니다.',
      });
    } catch (error) {
      toast({
        title: '메시지 전송 실패',
        description: '메시지 전송에 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setSendingMessage(false);
    }
  };
  
  // 상태 배지 렌더링 함수
  const renderStatusBadge = (status: string) => {
    const style = statusStyles[status as keyof typeof statusStyles] || statusStyles.DRAFT;
    return (
      <Badge variant={style.variant as any} className="capitalize">
        {style.text}
      </Badge>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">불러오는 중...</span>
      </div>
    );
  }
  
  if (!partner) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">파트너를 찾을 수 없습니다</h2>
        <Button asChild>
          <Link href="/admin/partners">목록으로 돌아가기</Link>
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
          <Link href="/admin/partners">
            <ChevronLeft className="h-4 w-4" />
            파트너 목록으로
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(partner);
                  setEditMode(false);
                }}
                disabled={saving}
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="gap-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    저장
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              정보 수정
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-3 md:col-span-2 space-y-6">
          {/* 파트너 정보 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    {editMode ? (
                      <Input
                        name="name"
                        value={formData?.name}
                        onChange={handleInputChange}
                        className="text-2xl font-bold h-auto py-0"
                      />
                    ) : (
                      partner.name
                    )}
                  </CardTitle>
                </div>
                {partner.isVerified ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    인증됨
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    미인증
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">기관 소개</h3>
                  {editMode ? (
                    <Textarea
                      name="description"
                      value={formData?.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  ) : (
                    <p>{partner.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                      <User className="h-4 w-4 mr-1" />
                      담당자
                    </h3>
                    {editMode ? (
                      <Input
                        name="contactPerson"
                        value={formData?.contactPerson}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{partner.contactPerson}</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                      <Phone className="h-4 w-4 mr-1" />
                      연락처
                    </h3>
                    {editMode ? (
                      <Input
                        name="phoneNumber"
                        value={formData?.phoneNumber}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{partner.phoneNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                      <Mail className="h-4 w-4 mr-1" />
                      이메일
                    </h3>
                    {editMode ? (
                      <Input
                        name="email"
                        value={formData?.email}
                        onChange={handleInputChange}
                        type="email"
                      />
                    ) : (
                      <p>{partner.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                      <Globe className="h-4 w-4 mr-1" />
                      웹사이트
                    </h3>
                    {editMode ? (
                      <Input
                        name="website"
                        value={formData?.website}
                        onChange={handleInputChange}
                        type="url"
                      />
                    ) : (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {partner.website}
                      </a>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    주소
                  </h3>
                  {editMode ? (
                    <Input
                      name="address"
                      value={formData?.address}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{partner.address}</p>
                  )}
                </div>
                
                {editMode && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData?.isVerified}
                      onCheckedChange={handleSwitchChange}
                      id="verification"
                    />
                    <Label htmlFor="verification">인증된 파트너</Label>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  가입일: {formatDate(partner.createdAt, 'yyyy년 MM월 dd일')}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 탭 콘텐츠: 사연 & 소속 사용자 */}
          <Tabs defaultValue="stories" className="space-y-4">
            <TabsList>
              <TabsTrigger value="stories" className="gap-1">
                <FileText className="h-4 w-4" />
                등록 사연 ({partner.storyCount})
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-1">
                <Users className="h-4 w-4" />
                소속 사용자 ({partner.userCount})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stories">
              <Card>
                <CardContent className="p-4">
                  <p className="text-muted-foreground">
                    등록된 사연이 없습니다.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardContent className="p-4">
                  <p className="text-muted-foreground">
                    소속된 사용자가 없습니다.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* 사이드바 - 메시지 및 기타 작업 */}
        <div className="col-span-3 md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">메시지 보내기</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="파트너에게 메시지를 보내세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full gap-1"
                onClick={handleSendMessage}
                disabled={sendingMessage || !message.trim()}
              >
                {sendingMessage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    메시지 전송
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">관리 작업</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/admin/partners/${partner.id}/invite`}>
                  <User className="h-4 w-4 mr-2" />
                  사용자 초대
                </Link>
              </Button>
              
              {!partner.isVerified && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                  onClick={async () => {
                    try {
                      setSaving(true);
                      const updatedPartner = await partnerApi.updatePartner(params.id, { isVerified: true });
                      setPartner(updatedPartner);
                      toast({
                        title: '인증 완료',
                        description: '파트너가 성공적으로 인증되었습니다.',
                      });
                    } catch (error) {
                      toast({
                        title: '인증 실패',
                        description: '파트너 인증에 실패했습니다. 다시 시도해주세요.',
                        variant: 'destructive',
                      });
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      인증 중...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      파트너 인증
                    </>
                  )}
                </Button>
              )}
              
              <Separator />
              
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                비활성화
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 