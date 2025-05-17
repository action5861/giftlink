'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">GiftLink</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex mx-6 items-center space-x-4 lg:space-x-6 flex-1">
          <Link 
            href="/stories" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/stories' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            사연 목록
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            서비스 소개
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {status === 'authenticated' ? (
            <>
              <Link href="/dashboard">
                <Button variant="default" size="sm">대시보드</Button>
              </Link>
              <div className="text-sm font-medium text-muted-foreground">
                {session.user?.name}님
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => signOut()}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">로그인</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="default" size="sm">회원가입</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden ml-auto h-8 w-8 text-muted-foreground"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-4 px-6 bg-background">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/stories" 
              className={`text-base font-medium ${
                pathname === '/stories' ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              사연 목록
            </Link>
            <Link 
              href="/about" 
              className={`text-base font-medium ${
                pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              서비스 소개
            </Link>
            <div className="pt-4 border-t">
              {status === 'authenticated' ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="block mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full">대시보드</Button>
                  </Link>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {session.user?.name}님
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/signin" 
                    className="block mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">로그인</Button>
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full">회원가입</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 