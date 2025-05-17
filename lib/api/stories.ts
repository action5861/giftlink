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
const STORY_API = {
  LIST: '/api/admin/stories',
  DETAIL: (id: string) => `/api/admin/stories/${id}`,
  CREATE: '/api/admin/stories',
  UPDATE: (id: string) => `/api/admin/stories/${id}`,
  APPROVE: (id: string) => `/api/admin/stories/${id}/approve`,
  REJECT: (id: string) => `/api/admin/stories/${id}/reject`,
  REQUEST_REVISION: (id: string) => `/api/admin/stories/${id}/request-revision`,
  GENERATE_IMAGE: (id: string) => `/api/admin/stories/${id}/generate-image`,
  STATS: '/api/admin/stories/stats',
};

// API 호출 함수
export const storyApi = {
  // 사연 목록 조회 (목업 데이터)
  getStories: async (params?: { 
    search?: string;
    status?: string;
    category?: string;
  }): Promise<Story[]> => {
    // 임시 목업 데이터
    const mockStories: Story[] = [
      {
        id: '1',
        title: '겨울을 따뜻하게 보내고 싶어요',
        content: '추운 겨울이 다가오는데 난방비가 너무 부담됩니다...',
        status: 'PENDING',
        category: '생활용품',
        recipientAge: 67,
        recipientGender: '여성',
        recipientRegion: '서울',
        partner: {
          id: 'p1',
          name: '굿네이버스',
        },
        imageUrl: 'https://picsum.photos/seed/winter1/800/600',
        createdAt: new Date('2023-12-15T09:32:00').toISOString(),
        items: [
          {
            id: '101',
            name: '따뜻한 겨울 이불',
            description: '거위털 충전재로 보온성이 뛰어난 겨울용 이불입니다.',
            price: 39000,
            coupangUrl: 'https://www.coupang.com/sample-blanket',
          },
        ],
        statusHistory: [
          {
            id: 'sh1',
            fromStatus: 'DRAFT',
            toStatus: 'PENDING',
            note: '검토 요청합니다.',
            changedBy: '김파트너',
            createdAt: new Date('2023-12-15T09:32:00').toISOString(),
          }
        ],
        donations: [],
      },
      // ... 더 많은 목업 데이터
    ];

    // 필터링
    let filteredStories = [...mockStories];
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredStories = filteredStories.filter(
        story => 
          story.title.toLowerCase().includes(search) ||
          story.partner.name.toLowerCase().includes(search)
      );
    }
    
    if (params?.status) {
      filteredStories = filteredStories.filter(
        story => story.status === params.status
      );
    }
    
    if (params?.category && params.category !== '전체') {
      filteredStories = filteredStories.filter(
        story => story.category === params.category
      );
    }

    return filteredStories;
  },

  // 사연 상세 조회 (목업 데이터)
  getStoryDetail: async (id: string): Promise<Story> => {
    // 임시 목업 데이터
    const mockStory: Story = {
      id: '1',
      title: '겨울을 따뜻하게 보내고 싶어요',
      content: '추운 겨울이 다가오는데 난방비가 너무 부담됩니다...',
      status: 'PENDING',
      category: '생활용품',
      recipientAge: 67,
      recipientGender: '여성',
      recipientRegion: '서울',
      partner: {
        id: 'p1',
        name: '굿네이버스',
      },
      imageUrl: 'https://picsum.photos/seed/winter1/800/600',
      createdAt: new Date('2023-12-15T09:32:00').toISOString(),
      items: [
        {
          id: '101',
          name: '따뜻한 겨울 이불',
          description: '거위털 충전재로 보온성이 뛰어난 겨울용 이불입니다.',
          price: 39000,
          coupangUrl: 'https://www.coupang.com/sample-blanket',
        },
      ],
      statusHistory: [
        {
          id: 'sh1',
          fromStatus: 'DRAFT',
          toStatus: 'PENDING',
          note: '검토 요청합니다.',
          changedBy: '김파트너',
          createdAt: new Date('2023-12-15T09:32:00').toISOString(),
        }
      ],
      donations: [],
    };

    return mockStory;
  },

  // 사연 통계 조회 (목업 데이터)
  getStoryStats: async (): Promise<StoryStats> => {
    // 임시 목업 데이터
    const mockStats: StoryStats = {
      total: 7,
      pending: 2,
      revision: 1,
      approved: 1,
      published: 3,
    };

    return mockStats;
  },

  // 사연 승인 (목업 데이터)
  approveStory: async (id: string, note: string): Promise<void> => {
    console.log('사연 승인 요청:', { id, note });
    return Promise.resolve();
  },

  // 사연 거부 (목업 데이터)
  rejectStory: async (id: string, note: string): Promise<void> => {
    console.log('사연 거부 요청:', { id, note });
    return Promise.resolve();
  },

  // 사연 수정 요청 (목업 데이터)
  requestRevision: async (id: string, note: string): Promise<void> => {
    console.log('사연 수정 요청:', { id, note });
    return Promise.resolve();
  },

  // 이미지 생성 (목업 데이터)
  generateImage: async (id: string, prompt: string): Promise<void> => {
    console.log('이미지 생성 요청:', { id, prompt });
    return Promise.resolve();
  },
}; 