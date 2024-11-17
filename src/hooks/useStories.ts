// src/hooks/useStories.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export function useStories(params: { status?: string; search?: string }) {
  return useQuery(
    ['stories', params],
    () => api.getStories(params),
    {
      staleTime: 1000 * 60 * 5 // 5분
    }
  )
}

export function useCreateStory() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(api.createStory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['stories'])
      router.push('/admin/stories')
    }
  })
}