import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { 
  FileText, 
  Users, 
  Building, 
  Gift, 
  TrendingUp,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

// 임시 통계 및 최근 활동 데이터
const stats = [
  {
    title: '총 사연',
    value: '24',
    icon: FileText,
    color: 'text-blue-500',
    link: '/admin/stories',
  },
  {
    title: '총 기부',
    value: '132',
    icon: Gift,
    color: 'text-green-500',
    link: '/admin/donations',
  },
  {
    title: '총 파트너',
    value: '8',
    icon: Building,
    color: 'text-orange-500',
    link: '/admin/partners',
  },
  {
    title: '총 사용자',
    value: '156',
    icon: Users,
    color: 'text-purple-500',
    link: '/admin/users',
  },
];

// 최근 활동 데이터
const recentActivities = [
  {
    id: '1',
    type: 'story',
    title: '새로운 사연 등록',
    description: '"겨울을 따뜻하게 보내고 싶어요" 사연이 등록되었습니다.',
    date: new Date('2023-12-15T09:32:00'),
    status: 'pending',
  },
  {
    id: '2',
    type: 'donation',
    title: '새로운 기부',
    description: '홍길동님이 "생리대가 필요해요" 사연에 36,000원을 기부했습니다.',
    date: new Date('2023-12-14T15:47:00'),
    status: 'completed',
  },
  {
    id: '3',
    type: 'partner',
    title: '파트너 가입',
    description: '행복나눔재단이 새로운 파트너로 가입했습니다.',
    date: new Date('2023-12-13T11:20:00'),
    status: 'approved',
  },
  {
    id: '4',
    type: 'story',
    title: '사연 승인',
    description: '"학교 준비물이 필요해요" 사연이 승인되었습니다.',
    date: new Date('2023-12-12T14:05:00'),
    status: 'approved',
  },
  {
    id: '5',
    type: 'message',
    title: '새로운 메시지',
    description: '굿네이버스에서 새로운 메시지가 도착했습니다.',
    date: new Date('2023-12-11T16:30:00'),
    status: 'unread',
  },
];

// 상태별 색상 클래스
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  unread: 'bg-purple-100 text-purple-800',
};

// 타입별 링크 및 아이콘
const typeConfig = {
  story: { link: '/admin/stories', icon: FileText },
  donation: { link: '/admin/donations', icon: Gift },
  partner: { link: '/admin/partners', icon: Building },
  user: { link: '/admin/users', icon: Users },
  message: { link: '/admin/messages', icon: MessageSquare },
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <p className="text-muted-foreground">
          {formatDate(new Date(), 'yyyy년 MM월 dd일 EEEE')}
        </p>
      </div>
      
      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 p-0 h-auto text-xs text-muted-foreground"
                asChild
              >
                <Link href={stat.link}>
                  자세히 보기
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* 통계 차트 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              기부 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              여기에 기부 통계 차트가 표시됩니다
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              사연 카테고리 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              여기에 사연 카테고리 분포 차트가 표시됩니다
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 최근 활동 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const { link, icon: Icon } = typeConfig[activity.type as keyof typeof typeConfig];
              const statusClass = statusColors[activity.status as keyof typeof statusColors];
              
              return (
                <div key={activity.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-full bg-slate-100`}>
                    <Icon className="h-5 w-5 text-slate-700" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{activity.title}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(activity.date, 'MM/dd HH:mm')}</p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    asChild
                  >
                    <Link href={`${link}/${activity.id}`}>
                      자세히
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">더 많은 활동 보기</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 