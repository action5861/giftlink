'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings,
  Bell,
  Shield,
  Mail,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    newStory: true,
    newDonation: true,
    newMessage: true,
    systemUpdates: true,
  });
  
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAttempts: '5',
  });
  
  const [email, setEmail] = useState({
    smtpServer: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    senderEmail: '',
    senderName: '',
  });
  
  const handleSave = async (section: string) => {
    setLoading(true);
    try {
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${section} 설정이 저장되었습니다.`);
    } catch (error) {
      toast.error('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">설정</h1>
      </div>
      
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            알림 설정
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            보안 설정
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            이메일 설정
          </TabsTrigger>
        </TabsList>
        
        {/* 알림 설정 */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>
                관리자 계정의 알림 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>새로운 사연 알림</Label>
                  <p className="text-sm text-slate-500">
                    새로운 사연이 등록되면 알림을 받습니다.
                  </p>
                </div>
                <Switch
                  checked={notifications.newStory}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, newStory: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>새로운 기부 알림</Label>
                  <p className="text-sm text-slate-500">
                    새로운 기부가 발생하면 알림을 받습니다.
                  </p>
                </div>
                <Switch
                  checked={notifications.newDonation}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, newDonation: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>새로운 메시지 알림</Label>
                  <p className="text-sm text-slate-500">
                    새로운 메시지가 도착하면 알림을 받습니다.
                  </p>
                </div>
                <Switch
                  checked={notifications.newMessage}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, newMessage: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>시스템 업데이트 알림</Label>
                  <p className="text-sm text-slate-500">
                    시스템 업데이트가 있을 때 알림을 받습니다.
                  </p>
                </div>
                <Switch
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, systemUpdates: checked }))
                  }
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave('알림')}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 보안 설정 */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
              <CardDescription>
                관리자 계정의 보안 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>2단계 인증</Label>
                  <p className="text-sm text-slate-500">
                    로그인 시 추가 인증 단계를 요구합니다.
                  </p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setSecurity(prev => ({ ...prev, twoFactorAuth: checked }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>세션 타임아웃 (분)</Label>
                <Input
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => 
                    setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))
                  }
                  min="5"
                  max="120"
                />
                <p className="text-sm text-slate-500">
                  일정 시간 동안 활동이 없으면 자동으로 로그아웃됩니다.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>최대 로그인 시도 횟수</Label>
                <Input
                  type="number"
                  value={security.loginAttempts}
                  onChange={(e) => 
                    setSecurity(prev => ({ ...prev, loginAttempts: e.target.value }))
                  }
                  min="3"
                  max="10"
                />
                <p className="text-sm text-slate-500">
                  지정된 횟수 이상 로그인에 실패하면 계정이 잠깁니다.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave('보안')}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 이메일 설정 */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>이메일 설정</CardTitle>
              <CardDescription>
                시스템 이메일 발송 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SMTP 서버</Label>
                  <Input
                    value={email.smtpServer}
                    onChange={(e) => 
                      setEmail(prev => ({ ...prev, smtpServer: e.target.value }))
                    }
                    placeholder="smtp.example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>SMTP 포트</Label>
                  <Input
                    value={email.smtpPort}
                    onChange={(e) => 
                      setEmail(prev => ({ ...prev, smtpPort: e.target.value }))
                    }
                    placeholder="587"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>SMTP 사용자명</Label>
                  <Input
                    value={email.smtpUsername}
                    onChange={(e) => 
                      setEmail(prev => ({ ...prev, smtpUsername: e.target.value }))
                    }
                    placeholder="user@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>SMTP 비밀번호</Label>
                  <Input
                    type="password"
                    value={email.smtpPassword}
                    onChange={(e) => 
                      setEmail(prev => ({ ...prev, smtpPassword: e.target.value }))
                    }
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>발신자 이메일</Label>
                  <Input
                    type="email"
                    value={email.senderEmail}
                    onChange={(e) => 
                      setEmail(prev => ({ ...prev, senderEmail: e.target.value }))
                    }
                    placeholder="noreply@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>발신자 이름</Label>
                  <Input
                    value={email.senderName}
                    onChange={(e) => 
                      setEmail(prev => ({ ...prev, senderName: e.target.value }))
                    }
                    placeholder="GiftLink"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave('이메일')}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 