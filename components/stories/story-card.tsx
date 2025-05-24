'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, DollarSign } from 'lucide-react';

interface StoryCardProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  age: number;
  gender: string;
  recipientRegion: string;
  items: {
    id: string;
    name: string;
    price: number;
    coupangUrl: string | null;
    description: string | null;
  }[];
}

export function StoryCard({
  id,
  title,
  content,
  imageUrl,
  category,
  age,
  gender,
  recipientRegion,
  items
}: StoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // 모든 아이템 가격의 합산
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl || '/images/placeholder.jpg'}
          alt={title}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="font-medium">
            {category}
          </Badge>
          <Badge variant="outline" className="font-medium">
            {recipientRegion}
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex-1 pt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{age}세</span>
          <span>·</span>
          <span>{gender}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {content}
        </p>
        
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          <span>필요 물품 총액: <strong>{totalPrice.toLocaleString()}원</strong></span>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 px-6 flex justify-between items-center">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href={`/stories/${id}`}>
            자세히 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 gap-1"
        >
          <Heart className="h-4 w-4" />
          관심
        </Button>
      </CardFooter>
    </Card>
  );
} 