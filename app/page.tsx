import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        {/* 배경 이미지 (실제 배포 시 이미지 최적화 필요) */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-20"></div>
        
        <div className="container relative py-20 md:py-32 flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl">
            Simple Gifts,<br />
            <span className="text-primary">Meaningful Connections</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            필요한 사람들과 직접 연결되는 1:1 생필품 기부 플랫폼
          </p>
          
          <p className="text-base md:text-lg text-gray-500 max-w-2xl">
            한 번의 클릭으로 전하는 따뜻한 연결,<br />
            필요한 곳에 닿는 진심 어린 손길
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button asChild size="lg" className="flex-1">
              <Link href="/stories">
                지금 기부하기
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1">
              <Link href="/about">
                서비스 소개
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 신뢰할 수 있는 파트너십 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              신뢰할 수 있는 파트너십
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              굿네이버스를 비롯한 신뢰할 수 있는 복지단체와 함께합니다.
              모든 사연은 전문가의 검증을 거쳐 선정되며,
              실제 도움이 필요한 분들에게 직접 전달됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 전문가 검증 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">전문가 검증</h3>
              <p className="text-gray-600">
                굿네이버스의 전문가가<br />
                모든 사연을 철저히 검증합니다
              </p>
            </div>

            {/* 직접 지원 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">직접 지원</h3>
              <p className="text-gray-600">
                복지단체를 통해<br />
                실제 필요한 곳에 직접 전달됩니다
              </p>
            </div>

            {/* 투명한 관리 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">투명한 관리</h3>
              <p className="text-gray-600">
                모든 기부 과정이<br />
                투명하게 관리됩니다
              </p>
            </div>
          </div>

          {/* 파트너 로고 */}
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-gray-900 mb-8">신뢰할 수 있는 파트너</p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-2xl font-bold text-blue-600">굿네이버스</div>
              <div className="text-2xl font-bold text-green-600">세이브더칠드런</div>
              <div className="text-2xl font-bold text-red-600">유니세프</div>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 특징 섹션 */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              GiftLink가 특별한 이유
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 정확한 기부 */}
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">정확한 기부</h3>
              <p className="text-gray-600">
                당신의 선물이 필요한 곳에 정확히 전달되어<br />
                최대의 효과를 발휘합니다.
              </p>
            </div>

            {/* 완벽한 투명성 */}
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">완벽한 투명성</h3>
              <p className="text-gray-600">
                구매부터 배송까지 모든 과정을<br />
                실시간으로 확인할 수 있습니다.
              </p>
            </div>

            {/* 존중받는 지원 */}
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="16" height="20" x="4" y="2" rx="2"></rect>
                  <path d="M12 6v4"></path>
                  <path d="M12 14h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">존중받는 지원</h3>
              <p className="text-gray-600">
                AI 캐릭터를 통한 개인정보 보호로<br />
                인간다운 연결을 유지합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 기부 과정 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              변화를 만드는 4단계
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold mb-6">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">
                  {step}
                </h3>
                <p className="text-center text-gray-600">
                  {descriptions[index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            당신의 작은 기부가 큰 변화를 만듭니다
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            지금 바로 GiftLink와 함께 필요한 곳에 따뜻한 손길을 전해보세요.
            작은 기부가 누군가의 인생을 바꿀 수 있습니다.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-primary">
            <Link href="/stories">사연 둘러보기</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

const steps = [
  "사연 선택하기",
  "필수품 선택하기",
  "직접 구매하기",
  "연결 완료하기"
];

const descriptions = [
  "검증된 사연들을 둘러보고 도움이 필요한 분을 찾아보세요.",
  "예산 내에서 필요한 필수품 목록에서 선택하세요.",
  "신뢰할 수 있는 유통 파트너를 통해 직접 구매하세요.",
  "기부 현황을 추적하고 변화의 순간을 함께하세요."
];
