// src/app/admin/stories/create/page.tsx


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, X } from 'lucide-react'
import { NECESSITY_CATEGORIES, REGIONS } from '@/constants/filters'
import axios from 'axios'

interface StoryItem {
  name: string
  category: string
  quantity: number
}

export default function CreateStoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    region: '',
    beneficiaryName: '',
    story: '',
  })

  const [items, setItems] = useState<StoryItem[]>([
    { name: '', category: '', quantity: 1 }
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleItemChange = (index: number, field: keyof StoryItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value
    }
    setItems(newItems)
  }

  const addItem = () => {
    setItems(prev => [...prev, { name: '', category: '', quantity: 1 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // 데이터 유효성 검사
      if (!formData.age || !formData.gender || !formData.region || !formData.story) {
        throw new Error('필수 항목을 모두 입력해주세요.')
      }

      // 물품 유효성 검사
      if (!items.every(item => item.name && item.category)) {
        throw new Error('모든 물품 정보를 입력해주세요.')
      }

      // API 요청
      await axios.post('/api/admin/stories', {
        ...formData,
        items
      })

      // 성공 시 목록 페이지로 이동
      router.push('/admin/stories')
      router.refresh()

    } catch (err) {
      setError(err instanceof Error ? err.message : '스토리 생성 중 오류가 발생했습니다.')
      console.error('Story creation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">새 스토리 작성</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 섹션 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="0"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                          disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleSelectChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white
                          disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">성별 선택</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleSelectChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white
                        disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">지역 선택</option>
              {REGIONS.slice(1).map((region) => (
                <option key={region.id} value={region.id}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              수혜자 이름 (선택사항)
            </label>
            <input
              name="beneficiaryName"
              value={formData.beneficiaryName}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                        disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* 스토리 내용 섹션 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">스토리 내용</h2>
          <textarea
            name="story"
            value={formData.story}
            onChange={handleInputChange}
            placeholder="스토리 내용을 입력하세요"
            required
            disabled={isLoading}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
                      disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* 필요한 물품 섹션 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">필요한 물품</h2>
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <div className="flex-1">
                <select
                  value={item.category}
                  onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white
                            disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">카테고리 선택</option>
                  {NECESSITY_CATEGORIES.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <input
                  placeholder="물품명"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                            disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                            disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-red-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            disabled={isLoading}
            className="w-full mt-2 px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 
                     flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="h-5 w-5" />
            물품 추가
          </button>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  )
}