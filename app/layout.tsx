import Link from 'next/link';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'  // 경로 수정

export default function RootLayout({
  children,
 }: {
  children: React.ReactNode
 }) {
  return (
    <html lang="en">
      <body>
        {/* 헤더/네비게이션 */}
        <header className="bg-white shadow-sm">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                GiftLink
              </Link>
              
              <div className="flex gap-6">
                <Link href="/stories" className="text-gray-600 hover:text-gray-900">
                  Browse Stories
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                  How It Works
                </Link>
                <Link href="/about-us" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
                <Link href="/sign-in" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Link>
                <Link 
                  href="/stories" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Start Giving
                </Link>
              </div>
            </div>
          </nav>
        </header>
 
        {children}
      </body>
    </html>
  );
 }