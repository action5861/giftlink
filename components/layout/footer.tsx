import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col">
            <Link href="/" className="font-bold text-2xl text-primary mb-4">
              GiftLink
            </Link>
            <p className="text-muted-foreground mb-4 max-w-xs">
              필요한 사람들과 직접 연결되는 1:1 생필품 기부 플랫폼
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">메뉴</h3>
              <nav className="flex flex-col space-y-2">
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  홈
                </Link>
                <Link href="/stories" className="text-muted-foreground hover:text-foreground transition-colors">
                  사연 목록
                </Link>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  서비스 소개
                </Link>
              </nav>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">파트너</h3>
              <nav className="flex flex-col space-y-2">
                <Link href="/about/partners" className="text-muted-foreground hover:text-foreground transition-colors">
                  파트너 소개
                </Link>
                <Link href="/auth/partner-login" className="text-muted-foreground hover:text-foreground transition-colors">
                  파트너 로그인
                </Link>
              </nav>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">법적 정보</h3>
              <nav className="flex flex-col space-y-2">
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  이용약관
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GiftLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 