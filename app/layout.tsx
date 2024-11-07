import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'  // 경로 수정

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GiftLink - Connect Hearts, Share Essentials',
  description: 'Direct 1:1 essentials donation platform that connects you with those in need',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}