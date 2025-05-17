import { z } from 'zod';

// API 응답 스키마 정의
export const PartnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  contactPerson: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  website: z.string(),
  isVerified: z.boolean(),
  storyCount: z.number(),
  userCount: z.number(),
  createdAt: z.string(),
});

export const PartnerDetailSchema = PartnerSchema.extend({
  users: z.array(z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
    lastLogin: z.string(),
  })),
  stories: z.array(z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    createdAt: z.string(),
  })),
});

export const PartnerStatsSchema = z.object({
  totalPartners: z.number(),
  verifiedPartners: z.number(),
  totalStories: z.number(),
});

export type Partner = z.infer<typeof PartnerSchema>;
export type PartnerDetail = z.infer<typeof PartnerDetailSchema>;
export type PartnerStats = z.infer<typeof PartnerStatsSchema>;

// API 엔드포인트
const PARTNER_API = {
  LIST: '/api/admin/partners',
  DETAIL: (id: string) => `/api/admin/partners/${id}`,
  UPDATE: (id: string) => `/api/admin/partners/${id}`,
  INVITE: '/api/admin/partners/invite',
  STATS: '/api/admin/partners/stats',
  MESSAGE: (id: string) => `/api/admin/partners/${id}/message`,
};

// API 호출 함수
export const partnerApi = {
  // 파트너 목록 조회 (목업 데이터)
  getPartners: async (params?: { search?: string }): Promise<Partner[]> => {
    // 임시 목업 데이터
    const mockPartners: Partner[] = [
      {
        id: '1',
        name: '파트너 1',
        description: '파트너 1 설명',
        address: '서울시 강남구',
        contactPerson: '홍길동',
        phoneNumber: '010-1234-5678',
        email: 'partner1@example.com',
        website: 'https://partner1.com',
        isVerified: true,
        storyCount: 5,
        userCount: 10,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: '파트너 2',
        description: '파트너 2 설명',
        address: '서울시 서초구',
        contactPerson: '김철수',
        phoneNumber: '010-8765-4321',
        email: 'partner2@example.com',
        website: 'https://partner2.com',
        isVerified: false,
        storyCount: 3,
        userCount: 5,
        createdAt: new Date().toISOString(),
      },
    ];

    // 검색어가 있으면 필터링
    if (params?.search) {
      const search = params.search.toLowerCase();
      return mockPartners.filter(
        (partner) =>
          partner.name.toLowerCase().includes(search) ||
          partner.contactPerson.toLowerCase().includes(search) ||
          partner.email.toLowerCase().includes(search)
      );
    }

    return mockPartners;
  },

  // 파트너 상세 조회 (목업 데이터)
  getPartnerDetail: async (id: string): Promise<PartnerDetail> => {
    // 임시 목업 데이터
    const mockPartnerDetail: PartnerDetail = {
      id: '1',
      name: '파트너 1',
      description: '파트너 1 설명',
      address: '서울시 강남구',
      contactPerson: '홍길동',
      phoneNumber: '010-1234-5678',
      email: 'partner1@example.com',
      website: 'https://partner1.com',
      isVerified: true,
      storyCount: 5,
      userCount: 10,
      createdAt: new Date().toISOString(),
      users: [
        {
          id: '1',
          name: '홍길동',
          email: 'hong@example.com',
          role: '관리자',
          lastLogin: new Date().toISOString(),
        },
        {
          id: '2',
          name: '김철수',
          email: 'kim@example.com',
          role: '일반',
          lastLogin: new Date().toISOString(),
        },
      ],
      stories: [
        {
          id: '1',
          title: '스토리 1',
          status: '완료',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: '스토리 2',
          status: '진행중',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    return mockPartnerDetail;
  },

  // 파트너 정보 수정 (목업 데이터)
  updatePartner: async (id: string, data: Partial<Partner>): Promise<Partner> => {
    // 임시 목업 데이터: 실제 API 호출 대신 성공 응답 시뮬레이션
    console.log('파트너 정보 수정 요청:', { id, data });
    // 실제 API 호출 대신 성공 응답 시뮬레이션
    return {
      id,
      name: data.name || '파트너 1',
      description: data.description || '파트너 1 설명',
      address: data.address || '서울시 강남구',
      contactPerson: data.contactPerson || '홍길동',
      phoneNumber: data.phoneNumber || '010-1234-5678',
      email: data.email || 'partner1@example.com',
      website: data.website || 'https://partner1.com',
      isVerified: data.isVerified ?? true,
      storyCount: 5,
      userCount: 10,
      createdAt: new Date().toISOString(),
    };
  },

  // 파트너 초대 (목업 데이터)
  invitePartner: async (data: {
    name: string;
    organization: string;
    email: string;
    sendCopy: boolean;
  }): Promise<void> => {
    // 임시 목업 데이터: 실제 API 호출 대신 성공 응답 시뮬레이션
    console.log('파트너 초대 요청:', data);
    // 실제 API 호출 대신 성공 응답 시뮬레이션
    return Promise.resolve();
  },

  // 파트너 통계 조회 (목업 데이터)
  getPartnerStats: async (): Promise<PartnerStats> => {
    // 임시 목업 데이터
    const mockStats: PartnerStats = {
      totalPartners: 2,
      verifiedPartners: 1,
      totalStories: 8,
    };

    return mockStats;
  },

  // 파트너 메시지 전송 (목업 데이터)
  sendMessage: async (id: string, message: string): Promise<void> => {
    // 임시 목업 데이터: 실제 API 호출 대신 성공 응답 시뮬레이션
    console.log('파트너 메시지 전송 요청:', { id, message });
    // 실제 API 호출 대신 성공 응답 시뮬레이션
    return Promise.resolve();
  },
}; 