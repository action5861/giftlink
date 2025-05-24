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
export const ENDPOINTS = {
  LIST: '/api/admin/partners',
  INVITE: '/api/admin/partners/invite',
  DETAIL: (id: string) => `/api/admin/partners/${id}`,
  MESSAGE: (id: string) => `/api/admin/partners/${id}/message`,
} as const;

// 파트너 초대 요청 스키마
export const invitePartnerSchema = z.object({
  name: z.string().min(1, '기관명을 입력해주세요'),
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  contactPerson: z.string().min(1, '담당자 이름을 입력해주세요'),
  phoneNumber: z.string().min(1, '전화번호를 입력해주세요'),
  website: z.string().url('유효한 URL을 입력해주세요').optional(),
  address: z.string().optional(),
});

export type InvitePartnerRequest = z.infer<typeof invitePartnerSchema>;

// 파트너 메시지 전송 요청 스키마
export const sendMessageSchema = z.object({
  subject: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  sendEmail: z.boolean().optional(),
  sendSms: z.boolean().optional(),
});

export type SendMessageRequest = z.infer<typeof sendMessageSchema>;

// API 호출 함수
export const partnerApi = {
  // 파트너 목록 조회
  async getPartners(params?: { search?: string }) {
    const url = new URL(ENDPOINTS.LIST, window.location.origin);
    if (params?.search) {
      url.searchParams.set('search', params.search);
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '파트너 목록을 불러오는데 실패했습니다');
    }
    return response.json();
  },

  // 파트너 통계 조회
  async getPartnerStats() {
    const response = await fetch(ENDPOINTS.LIST, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '파트너 통계를 불러오는데 실패했습니다');
    }
    return response.json();
  },

  // 파트너 초대
  async invitePartner(data: InvitePartnerRequest) {
    const response = await fetch(ENDPOINTS.INVITE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '파트너 초대에 실패했습니다');
    }

    return response.json();
  },

  // 파트너 상세 정보 조회
  async getPartner(id: string) {
    const response = await fetch(ENDPOINTS.DETAIL(id));
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '파트너 정보를 불러오는데 실패했습니다');
    }
    return response.json();
  },

  // 파트너 정보 수정
  async updatePartner(id: string, data: Partial<Partner>) {
    const response = await fetch(ENDPOINTS.DETAIL(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '파트너 정보 수정에 실패했습니다');
    }

    return response.json();
  },

  // 파트너에게 메시지 전송
  async sendMessage(id: string, data: { content: string; subject: string; sendEmail?: boolean; sendSms?: boolean }) {
    const response = await fetch(ENDPOINTS.MESSAGE(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '메시지 전송에 실패했습니다');
    }

    return response.json();
  },
}; 