// src/app/stories/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import StoryCard from "@/components/story/StoryCard"
import StoryFilters from "@/components/story/StoryFilters"
import Masonry from 'react-masonry-css'
import axios from 'axios'

const breakpointColumns = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1
}

interface Story {
  id: string
  age: number
  gender: string
  story: string
  region: string
  status: string
  items: Array<{
    id: string
    name: string
    category: string
    quantity: number
    status: string
  }>
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStories = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedRegion !== 'all') params.append('region', selectedRegion)
      if (searchTerm) params.append('search', searchTerm)

      const response = await axios.get(`/api/stories?${params.toString()}`)
      setStories(response.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch stories:', err)
      setError('스토리 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [selectedCategory, selectedRegion, searchTerm])

  const handleFilterChange = (category: string, region: string) => {
    setSelectedCategory(category)
    setSelectedRegion(region)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4">
        {/* 검색 바 */}
        <div className="mb-8">
          <div className="relative w-full max-w-xl mx-auto">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6B77F8]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* 필터 */}
        <StoryFilters 
          onFilterChange={handleFilterChange}
          selectedCategory={selectedCategory}
          selectedRegion={selectedRegion}
        />

        {/* 에러 메시지 */}
        {error && (
          <div className="text-center py-4 text-red-600">
            {error}
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B77F8]" />
          </div>
        ) : stories.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {stories.map((story) => (
              <div key={story.id} className="mb-6">
                <StoryCard
                  id={story.id}
                  age={story.age}
                  gender={story.gender}
                  story={story.story}
                  items={story.items.map(item => item.name)}
                  region={story.region}
                  regionId={story.region.toLowerCase()}
                  status={story.status as 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'REJECTED'}
                />
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}