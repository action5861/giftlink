'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Building, 
  Gift, 
  MessageSquare, 
  Settings,
  LogOut,
  Banknote,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '사연 관리',
    href: '/admin/stories',
    icon: FileText,
  },
  {
    title: '파트너 관리',
    href: '/admin/partners',
    icon: Building,
  },
  {
    title: '기부 관리',
    href: '/admin/donations',
    icon: Gift,
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: '메시지 관리',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    title: '설정',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    title: '정산관리',
    href: '/admin/settlements',
    icon: Banknote,
  },
  {
    title: '주문관리',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-800 text-white p-4 flex flex-col h-screen">
      <div className="mb-8 pt-4">
        <Link href="/admin" className="flex items-center space-x-2">
          <span className="font-bold text-xl">GiftLink</span>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-md">
            관리자
          </span>
        </Link>
      </div>
      
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
      
      <div className="pt-4 border-t border-slate-700 mt-6">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700 px-3"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="h-5 w-5 mr-3" />
          로그아웃
        </Button>
      </div>
    </div>
  );
} 