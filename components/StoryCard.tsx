// components/StoryCard.tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Story } from '@/types/story';
import { ExternalLink } from 'lucide-react'; // 외부 링크 아이콘

interface StoryCardProps {
 story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
 const [isLoading, setIsLoading] = useState(false);

 const handleCoupangClick = () => {
   // 쿠팡 링크로 새 창에서 열기
   window.open(story.essentialItem.coupangUrl, '_blank');
 };

 return (
   <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300">
     {/* 이미지 섹션 */}
     <div className="relative w-full aspect-[4/3]">
       {story.imageUrl ? (
         <Image
           src={story.imageUrl}
           alt={story.title}
           fill
           className="object-cover"
           priority
         />
       ) : (
         <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
           <div className="text-gray-400">이미지 준비중...</div>
         </div>
       )}
       {/* 스토리 상태 배지 */}
       <div className="absolute top-2 right-2">
         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
           story.status === 'waiting' 
             ? 'bg-green-100 text-green-800'
             : 'bg-gray-100 text-gray-800'
         }`}>
           {story.status === 'waiting' ? '도움이 필요해요' : '지원 완료'}
         </span>
       </div>
     </div>

     {/* 컨텐츠 섹션 */}
     <div className="p-4">
       <h3 className="text-lg font-semibold text-gray-900 mb-2">
         {story.title}
       </h3>
       
       <div className="text-sm text-gray-600 mb-3">
         <p>나이: {story.age}세 / 성별: {story.gender}</p>
         <p className="mt-1">{story.situation}</p>
       </div>

       {/* 필요한 물품 정보 */}
       <div className="bg-blue-50 p-3 rounded-md mb-4">
         <h4 className="font-medium text-sm text-gray-900 mb-1">필요한 물품</h4>
         <p className="text-blue-600 font-medium">{story.essentialItem.name}</p>
         <p className="text-sm text-gray-600 mt-1">{story.essentialItem.description}</p>
         <p className="text-sm text-blue-600 mt-2 font-medium">
           예상 가격: {story.essentialItem.priceRange}
         </p>
       </div>

       {/* 구매 버튼 */}
       {story.status === 'waiting' && (
         <button
           onClick={handleCoupangClick}
           className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
         >
           <ExternalLink className="w-4 h-4" />
           <span>쿠팡에서 물품 구매하기</span>
         </button>
       )}

       {story.status === 'completed' && (
         <div className="text-center text-gray-500 py-2">
           지원이 완료된 스토리입니다
         </div>
       )}
     </div>

     {/* 스토리 내용 */}
     <div className="px-4 pb-4">
       <p className="text-sm text-gray-600 line-clamp-3">
         {story.story}
       </p>
     </div>
   </div>
 );
}