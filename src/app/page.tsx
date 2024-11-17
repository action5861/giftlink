// src/app/page.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/header"  
import { 
  ChevronRight, 
  BookOpen, 
  Gift, 
  ShoppingCart, 
  Truck,
  LucideIcon 
} from "lucide-react"
import StoryCard from "@/components/story/StoryCard"
import AuthModal from "@/components/auth/AuthModal"
import { StoryStatus } from '@prisma/client'

// Types
interface ProcessStep {
  icon: LucideIcon;
  title: string;
  points: string[];
}

interface PreviewStory {
  id: string;
  age: number;
  gender: string;
  story: string;
  items: string[];
  regionId: string;
  region: string;
  status: StoryStatus;
}

// Constants
const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: BookOpen,
    title: "진정성 있는 스토리",
    points: [
      "AI 캐릭터와 함께하는 익명성 보장",
      "검증된 수혜자 스토리",
      "필요한 물품 리스트 확인"
    ]
  },
  {
    icon: Gift,
    title: "원하는 물품 직접 선택",
    points: [
      "생필품 카테고리 별 구분",
      "수혜자가 직접 선정한 물품",
      "합리적인 가격대 제시"
    ]
  },
  {
    icon: ShoppingCart,
    title: "믿을 수 있는 구매 프로세스",
    points: [
      "쿠팡 직접 구매 연동",
      "안전한 결제 시스템",
      "로켓배송으로 빠른 전달"
    ]
  },
  {
    icon: Truck,
    title: "투명한 전달 과정",
    points: [
      "실시간 배송 현황 확인",
      "배송 완료 알림",
      "감사 메시지 전달"
    ]
  }
];

const previewStories: PreviewStory[] = [
  {
    id: "1",
    age: 35,
    gender: "여성",
    story: "두 아이와 함께 살고 있는 한부모 가정입니다. 이번 달 생필품이 많이 부족한 상황입니다.",
    items: ["세제", "휴지", "샴푸"],
    regionId: "seoul",
    region: "서울특별시",
    status: StoryStatus.ACTIVE,
  },
  {
    id: "2", 
    age: 45,
    gender: "남성",
    story: "갑작스러운 실직으로 어려움을 겪고 있습니다. 당장의 생필품이 필요한 상황입니다.",
    items: ["쌀", "라면", "식용유"],
    regionId: "busan",
    region: "부산광역시",
    status: StoryStatus.ACTIVE,
  },
  {
    id: "3",
    age: 28,
    gender: "여성",
    story: "청년 가장으로 홀어머니를 모시고 있습니다. 이번 달 생활비가 부족해 도움이 필요합니다.",
    items: ["반찬", "휴지", "세제"],
    regionId: "incheon",
    region: "인천광역시", 
    status: StoryStatus.ACTIVE,
  }
];

// Components
const ProcessStepCard = ({ step, index }: { step: ProcessStep; index: number }) => (
  <div className="group p-8 bg-white rounded-3xl hover:bg-[#F8F9FF] transition-all border border-[#E8EBFF]">
    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <step.icon className="h-6 w-6 text-[#6B77F8]" />
    </div>
    <h3 className="text-lg font-medium text-[#2D3648] mb-4">{step.title}</h3>
    <ul className="space-y-3 text-[#666D7C] text-sm">
      {step.points.map((point, pointIndex) => (
        <li key={pointIndex} className="flex items-center gap-3">
          <span className="h-px w-4 bg-[#6B77F8]"></span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

const HeroSection = ({ onOpenAuth }: { onOpenAuth: () => void }) => (
  <section className="pt-32 pb-20">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
        투명한 기부로
        <br />
        <span className="text-[#da4bd2]">따뜻한 변화</span>를 만듭니다
      </h1>
      <p className="mt-6 text-lg leading-8 text-[#666D7C]">
        giftLink와 함께 직접적이고 투명한 방식으로 도움이 필요한 분들에게 
        생필품을 전달해보세요.
      </p>
      <div className="mt-10">
        <Button 
          size="lg" 
          onClick={onOpenAuth}
          className="bg-[#6B77F8] hover:bg-[#5563F7] text-white rounded-full px-8 py-6 text-base"
        >
          지금 바로 시작하기
        </Button>
      </div>
    </div>
  </section>
);

const ProcessSection = () => (
  <section className="py-24 bg-white">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-light text-[#2D3648]">
        쉽고 투명한 기부, giftLink와 함께 시작해보세요
      </h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {PROCESS_STEPS.map((step, index) => (
        <ProcessStepCard key={index} step={step} index={index} />
      ))}
    </div>
  </section>
);

const StoriesSection = ({ onOpenAuth }: { onOpenAuth: () => void }) => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-[#2D3648]">
          도움이 필요한 이웃들의 이야기
        </h2>
        <p className="mt-4 text-[#666D7C]">
          여러분의 작은 관심이 큰 변화를 만들 수 있습니다
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {previewStories.map((story) => (
          <StoryCard 
            key={story.id}
            {...story}
          />
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button 
          size="lg"
          className="bg-white text-[#6B77F8] hover:bg-[#F8F9FF] border-2 border-[#6B77F8] rounded-full px-8 py-6 text-base group"
          onClick={onOpenAuth}
        >
          더 많은 스토리 보기
          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  </section>
);

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const handleOpenAuth = () => setIsAuthModalOpen(true);
  const handleCloseAuth = () => setIsAuthModalOpen(false);

  return (
    <>
      <div className="relative min-h-screen">
        <Header onOpenAuth={handleOpenAuth} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F9FF] to-white -z-10" />
        
        <div className="container mx-auto px-4">
          <HeroSection onOpenAuth={handleOpenAuth} />
          <ProcessSection />
          <StoriesSection onOpenAuth={handleOpenAuth} />
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuth}
      />
    </>
  );
}