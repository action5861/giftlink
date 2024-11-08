// types/story.ts

export type StoryStatus = 'waiting' | 'matched' | 'completed';

// Category 타입 추가
export type Category = 'all' | 'student' | 'elderly' | 'family' | 'urgent';

export interface Story {
  id: string;
  status: StoryStatus;
  title: string;
  age: number;
  gender: '남' | '여';
  situation: string;
  category: Category;  // category 필드 추가
  essentialItem: {
    name: string;
    description: string;
  };
  story: string;
  imagePrompt: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  matchedAt?: Date;
  completedAt?: Date;
}

export interface CreateStoryData {
  title: string;
  age: number;
  gender: '남' | '여';
  situation: string;
  category: Category;  // category 필드 추가
  essentialItem: {
    name: string;
    description: string;
  };
  story: string;
  imagePrompt: string;
}