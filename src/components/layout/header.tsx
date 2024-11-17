// src/components/layout/header.tsx
'use client'
import Link from 'next/link'
import { Button } from '../ui/button'

interface HeaderProps {
  onOpenAuth?: () => void;
}

export default function Header({ onOpenAuth }: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              giftLink
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/stories" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                스토리
              </Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                소개
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onOpenAuth}
              className="text-gray-600 hover:text-gray-900"
            >
              로그인
            </Button>
            <Button 
              size="sm" 
              onClick={onOpenAuth}
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6"
            >
              회원가입
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}