// components/StoryCard.tsx 수정
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Story } from '@/types/story';

interface StoryCardProps {
 story: Story;
 onMatch?: (storyId: string) => void;
}

export default function StoryCard({ story, onMatch }: StoryCardProps) {
 const [isLoading, setIsLoading] = useState(false);
 const [imageUrl, setImageUrl] = useState<string | null>(null);
 const [imageError, setImageError] = useState(false);

 useEffect(() => {
   const generateImage = async () => {
     try {
       const response = await fetch('/api/generate-image', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ prompt: story.imagePrompt }),
       });

       const data = await response.json();
       if (data.url) {
         setImageUrl(data.url);
       }
     } catch (error) {
       console.error('Image generation failed:', error);
       setImageError(true);
     }
   };

   generateImage();
 }, [story.imagePrompt]);

 return (
   <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm mx-auto hover:shadow-lg transition-shadow">
     {/* 이미지 섹션 - 비율 수정 */}
     <div className="relative w-full aspect-[4/3]">
       {imageUrl ? (
         <Image
           src={imageUrl}
           alt={story.title}
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           className="object-cover"
           priority
           onError={() => setImageError(true)}
         />
       ) : (
         <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
           {imageError ? 'Image generation failed' : 'Generating image...'}
         </div>
       )}
     </div>

     {/* 컨텐츠 섹션 - 여백 및 텍스트 크기 수정 */}
     <div className="p-4">
       <h3 className="text-lg font-semibold text-gray-900 mb-1">
         {story.title}
       </h3>
       
       <div className="text-xs text-gray-600 mb-3">
         <p>나이: {story.age}세 / 성별: {story.gender}</p>
         <p className="mt-0.5">{story.situation}</p>
       </div>

       <div className="mb-3 p-3 bg-blue-50 rounded">
         <h4 className="font-medium text-gray-900 mb-0.5 text-sm">필요한 물품</h4>
         <p className="text-blue-600 font-medium text-sm">{story.essentialItem.name}</p>
         <p className="text-xs text-gray-600 mt-0.5">
           {story.essentialItem.description}
         </p>
       </div>

       <p className="text-xs text-gray-700 mb-4 line-clamp-3 leading-relaxed">
         {story.story}
       </p>

       <button
         onClick={() => onMatch?.(story.id)}
         disabled={isLoading || story.status !== 'waiting'}
         className={`w-full py-2 px-3 rounded text-white font-medium text-sm transition-colors
           ${story.status === 'waiting' 
             ? 'bg-blue-600 hover:bg-blue-700' 
             : 'bg-gray-400'}`}
       >
         {story.status === 'waiting' 
           ? (isLoading ? '매칭 중...' : '도움의 손길 보내기')
           : '매칭 완료'}
       </button>
     </div>
   </div>
 );
}