// types/story.ts
export type StoryStatus = 'waiting' | 'completed';
export type Category = 'all' | 'student' | 'elderly' | 'family' | 'urgent';

export interface Story {
  id: string;
  status: StoryStatus;
  title: string;
  age: number;
  gender: '남' | '여';
  situation: string;
  category: Category;
  essentialItem: {
    name: string;
    description: string;
    coupangUrl: string;    // 쿠팡 상품 링크 추가
    priceRange: string;    // 가격대 정보 추가
  };
  story: string;
  imagePrompt: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface CreateStoryData {
  title: string;
  age: number;
  gender: '남' | '여';
  situation: string;
  category: Category;
  essentialItem: {
    name: string;
    description: string;
    coupangUrl: string;    // 쿠팡 상품 링크 추가
    priceRange: string;    // 가격대 정보 추가
  };
  story: string;
  imagePrompt: string;
}