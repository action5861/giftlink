import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Providers } from '@/components/providers';
import { Toaster } from "@/components/ui/toaster"

const notoSansKr = Noto_Sans_KR({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-kr',
});

export const metadata = {
  title: 'GiftLink - 당신의 작은 선물이 만드는 큰 변화',
  description: '필수품 기부 플랫폼 GiftLink와 함께 누군가의 삶에 변화를 주세요.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className={`${notoSansKr.className} min-h-screen bg-background antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
