// src/components/story/StoryCard.tsx
'use client';

import { Button } from "@/components/ui/button"
import { Gift, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { UNSPLASH_ACCESS_KEY } from '@/utils/unsplash'
import axios from 'axios';

interface StoryCardProps {
  id: string;
  age: number;
  gender: string;
  story: string;
  items: string[];
  regionId: string;
  region: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'REJECTED';
}

export default function StoryCard({
  id,
  age,
  gender,
  story,
  items,
  region,
  regionId,
  status
}: StoryCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDonating, setIsDonating] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // 캐시된 이미지 확인
        const cachedImageUrl = localStorage.getItem(`story-image-${id}`);
        
        if (cachedImageUrl) {
          setImageUrl(cachedImageUrl);
          setIsLoading(false);
          return;
        }

        const genderTerm = gender === '여성' ? 'woman portrait' : 'man portrait';
        const query = encodeURIComponent(`${genderTerm} person face`);
        
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${query}&orientation=portrait&content_filter=high&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const data = await response.json();
        const newImageUrl = data.urls.regular;
        
        // 새 이미지 URL 캐시
        localStorage.setItem(`story-image-${id}`, newImageUrl);
        setImageUrl(newImageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
        const fallbackUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${id}${gender}`;
        setImageUrl(fallbackUrl);
        localStorage.setItem(`story-image-${id}`, fallbackUrl);
      } finally {
        setIsLoading(false);
      }
    };

    if (status !== 'COMPLETED') {
      fetchImage();
    }
  }, [id, gender, status]);

  const handleCoupangSearch = (item: string) => {
    const searchTerm = encodeURIComponent(item);
    window.open(`https://www.coupang.com/np/search?q=${searchTerm}&from=giftlink`, '_blank');
  };

  const handleDonation = async () => {
    if (isDonating) return;

    try {
      setIsDonating(true);
      
      // 기부 처리
      const donationResponse = await axios.post('/api/donations', {
        storyId: id,
        items: items
      });

      if (donationResponse.data.success) {
        // 스토리 상태 업데이트
        await axios.patch(`/api/admin/stories/${id}/status`, {
          status: 'COMPLETED'
        });

        // 이미지 캐시 제거
        localStorage.removeItem(`story-image-${id}`);

        alert('기부가 완료되었습니다. 감사합니다!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert('기부 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsDonating(false);
    }
  };

  if (status === 'COMPLETED') return null;

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#E8EBFF] bg-white 
      transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
      opacity-0 translate-y-4 animate-fade-in-up">
      <div className="relative w-full h-[280px] overflow-hidden bg-[#F8F9FF]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B77F8]"></div>
          </div>
        ) : (
          <div className="relative w-full h-[280px] overflow-hidden bg-[#F8F9FF]">
            <img
              src={imageUrl}
              alt={`${age}세 ${gender}의 이미지`}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-[#F8F9FF] px-3 py-1 text-sm text-[#6B77F8]">
            {age}세 {gender}
          </span>
          <span className="inline-flex items-center rounded-full bg-[#F8F9FF] px-3 py-1 text-sm text-[#6B77F8]">
            <MapPin className="w-4 h-4 mr-1" />
            {region}
          </span>
        </div>

        <p className="text-[#2D3648] mb-4 line-clamp-3 text-base">
          {story}
        </p>

        <div className="mb-6">
          <h4 className="text-base font-semibold text-[#666D7C] mb-3">필요한 물품:</h4>
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <span 
                key={index}
                onClick={() => handleCoupangSearch(item)}
                className="inline-flex items-center rounded-full px-3 py-1 text-sm
                  transform transition-all duration-300 bg-[#F8F9FF] text-[#666D7C]
                  hover:scale-105 hover:shadow-lg hover:bg-[#6B77F8] hover:text-white
                  cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleDonation}
          disabled={isDonating}
          className="w-full bg-[#6B77F8] text-white rounded-full
            transform transition-all duration-300
            hover:bg-[#5563F7] hover:scale-105 hover:shadow-lg
            active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Gift className="mr-2 h-4 w-4" />
          {isDonating ? '처리 중...' : '기부하기'}
        </Button>
      </div>
    </div>
  );
}