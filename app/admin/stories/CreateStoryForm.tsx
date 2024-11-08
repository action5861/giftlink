// components/admin/CreateStoryForm.tsx
'use client';
import { useState } from 'react';
import { CreateStoryData, Category } from '@/types/story';

interface CreateStoryFormProps {
  onSubmit: (data: CreateStoryData) => Promise<void>;
  onCancel: () => void;
}

export default function CreateStoryForm({ onSubmit, onCancel }: CreateStoryFormProps) {
  const [formData, setFormData] = useState<CreateStoryData>({
    title: '',
    age: 0,
    gender: '남',
    situation: '',
    category: 'student',
    essentialItem: {
      name: '',
      description: '',
      coupangUrl: '',    // 추가
      priceRange: ''     // 추가
    },
    story: '',
    imagePrompt: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to create story:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 섹션 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">기본 정보</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">제목</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">나이</label>
            <input
              type="number"
              required
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">성별</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value as '남' | '여'})}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            >
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">카테고리</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          >
            <option value="student">학생</option>
            <option value="elderly">노인</option>
            <option value="family">가정</option>
            <option value="urgent">긴급</option>
          </select>
        </div>
      </div>

      {/* 필요 물품 섹션 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">필요 물품 정보</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">물품명</label>
          <input
            type="text"
            required
            value={formData.essentialItem.name}
            onChange={(e) => setFormData({
              ...formData,
              essentialItem: { ...formData.essentialItem, name: e.target.value }
            })}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">설명</label>
          <textarea
            required
            value={formData.essentialItem.description}
            onChange={(e) => setFormData({
              ...formData,
              essentialItem: { ...formData.essentialItem, description: e.target.value }
            })}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">쿠팡 상품 URL</label>
          <input
            type="url"
            required
            value={formData.essentialItem.coupangUrl}
            onChange={(e) => setFormData({
              ...formData,
              essentialItem: { ...formData.essentialItem, coupangUrl: e.target.value }
            })}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            placeholder="https://www.coupang.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">가격대</label>
          <input
            type="text"
            required
            value={formData.essentialItem.priceRange}
            onChange={(e) => setFormData({
              ...formData,
              essentialItem: { ...formData.essentialItem, priceRange: e.target.value }
            })}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            placeholder="15,000원 ~ 20,000원"
          />
        </div>
      </div>

      {/* 스토리 섹션 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">스토리 정보</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">상황 설명</label>
          <textarea
            required
            value={formData.situation}
            onChange={(e) => setFormData({...formData, situation: e.target.value})}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">상세 스토리</label>
          <textarea
            required
            value={formData.story}
            onChange={(e) => setFormData({...formData, story: e.target.value})}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            rows={4}
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
        >
          {loading ? '처리중...' : '저장하기'}
        </button>
      </div>
    </form>
  );
}