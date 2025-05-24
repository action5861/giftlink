import { z } from 'zod';

// API 응답 스키마 정의
export const StorySchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  status: z.enum(['DRAFT', 'PENDING', 'REVISION', 'APPROVED', 'PUBLISHED', 'FULFILLED', 'REJECTED']),
  category: z.string(),
  recipientAge: z.number(),
  recipientGender: z.string(),
  recipientRegion: z.string(),
  recipientName: z.string(),
  recipientPhone: z.string(),
  recipientAddress: z.string(),
  partner: z.object({
    id: z.string(),
    name: z.string(),
  }),
  imageUrl: z.string().optional(),
  createdAt: z.string(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    coupangUrl: z.string(),
  })),
  statusHistory: z.array(z.object({
    id: z.string(),
    fromStatus: z.string(),
    toStatus: z.string(),
    note: z.string(),
    changedBy: z.string(),
    createdAt: z.string(),
  })),
  donations: z.array(z.object({
    id: z.string(),
    amount: z.number(),
    donorName: z.string(),
    message: z.string(),
    createdAt: z.string(),
  })),
});

export const StoryStatsSchema = z.object({
  total: z.number(),
  pending: z.number(),
  revision: z.number(),
  approved: z.number(),
  published: z.number(),
});

export type Story = z.infer<typeof StorySchema>;
export type StoryStats = z.infer<typeof StoryStatsSchema>;

// API 엔드포인트
const LIST = '/api/admin/stories';
const DETAIL = (id: string) => `/api/admin/stories/${id}`;
const APPROVE = (id: string) => `/api/admin/stories/${id}/approve`;
const REJECT = (id: string) => `/api/admin/stories/${id}/reject`;
const REVISION = (id: string) => `/api/admin/stories/${id}/revision`;
const GENERATE_IMAGE = (id: string) => `/api/admin/stories/${id}/image`;
const STATS = '/api/admin/stories/stats';

// API 클라이언트
export const storyApi = {
  // 사연 목록 조회
  getStories: async (params?: {
    search?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ stories: Story[]; totalPages: number; currentPage: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${LIST}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }
    return response.json();
  },

  // 사연 상세 조회
  getStory: async (id: string): Promise<Story> => {
    const response = await fetch(DETAIL(id));
    if (!response.ok) {
      throw new Error('Failed to fetch story');
    }
    return response.json();
  },

  // 사연 승인
  approveStory: async (id: string, note?: string): Promise<Story> => {
    const response = await fetch(APPROVE(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note }),
    });
    if (!response.ok) {
      throw new Error('Failed to approve story');
    }
    return response.json();
  },

  // 사연 거절
  rejectStory: async (id: string, note: string): Promise<Story> => {
    const response = await fetch(REJECT(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note }),
    });
    if (!response.ok) {
      throw new Error('Failed to reject story');
    }
    return response.json();
  },

  // 사연 수정 요청
  requestRevision: async (id: string, note: string): Promise<Story> => {
    const response = await fetch(REVISION(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note }),
    });
    if (!response.ok) {
      throw new Error('Failed to request revision');
    }
    return response.json();
  },

  // 이미지 생성
  generateImage: async (id: string, prompt: string): Promise<Story> => {
    const response = await fetch(GENERATE_IMAGE(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate image');
    }
    return response.json();
  },

  // 통계 조회
  getStats: async (): Promise<StoryStats> => {
    const response = await fetch(STATS);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  },

  // 사연 생성
  createStory: async (data: {
    title: string;
    content: string;
    recipientAge: string;
    recipientGender: string;
    recipientRegion: string;
    items: {
      name: string;
      description: string;
      price: string;
      coupangUrl: string;
      category: string;
    }[];
  }): Promise<Story> => {
    const response = await fetch(LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        recipientAge: parseInt(data.recipientAge),
        items: data.items.map(item => ({
          ...item,
          price: parseFloat(item.price),
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create story');
    }

    return response.json();
  },

  updateStoryStatus: async (storyId: string, status: string, note?: string) => {
    const response = await fetch(`/api/admin/stories/${storyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, note }),
    });

    if (!response.ok) {
      throw new Error('Failed to update story status');
    }

    return response.json();
  },
}; 