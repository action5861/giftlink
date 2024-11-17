// src/app/admin/stories/types.ts
export interface StoryItem {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  description?: string;
  imageUrl?: string;
  price?: number;
  priority: number;
}

export interface StoryFormData {
  age: string | number;
  gender: string;
  region: string;
  beneficiaryName: string;
  story: string;
  imageUrls: string[];
  thumbnailUrl?: string;
  targetAmount: number;
  deadline?: Date;
  items: StoryItem[];
}

export interface StoryComment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: {
    name: string;
    profileImage?: string;
  };
}