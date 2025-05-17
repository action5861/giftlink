import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 세션이 없거나 role이 'ADMIN'이 아닌 경우 메인 페이지로 리디렉션
  if (!session?.user || session.user.role !== 'ADMIN') {
    console.log('Access denied:', { 
      hasSession: !!session, 
      userRole: session?.user?.role 
    });
    redirect('/');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
} 