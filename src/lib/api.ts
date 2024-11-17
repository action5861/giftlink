// src/lib/api.ts
import axios from 'axios'

export const api = {
  // 스토리 생성
  createStory: async (data: any) => {
    const response = await axios.post('/api/admin/stories', data)
    return response.data
  },

  // 스토리 목록 조회
  getStories: async (params: { status?: string; search?: string }) => {
    const response = await axios.get('/api/admin/stories', { params })
    return response.data
  }
}