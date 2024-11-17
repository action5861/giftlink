// src/app/admin/stories/components/StoryForm.tsx
import React from 'react';
import { Story, StoryStatus } from '@prisma/client';
import { REGIONS, NECESSITY_CATEGORIES } from '@/constants/filters';

// 타입 정의
interface StoryItem {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  priority: number;
  description: string;
  price: number;
  status?: 'NEEDED' | 'FULFILLED';
}

interface StoryFormData {
  age: number | string;
  gender: string;
  region: string;
  beneficiaryName: string;
  story: string;
  status?: StoryStatus;
  items: StoryItem[];
}

interface StoryFormProps {
  story?: Story & { items?: StoryItem[] };
  onSubmit: (data: StoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function StoryForm({ story, onSubmit, onCancel, isLoading }: StoryFormProps) {
  const [formData, setFormData] = React.useState<StoryFormData>({
    age: story?.age || '',
    gender: story?.gender || '',
    region: story?.region || '',
    beneficiaryName: story?.beneficiaryName || '',
    story: story?.story || '',
    status: story?.status,
    items: story?.items || [{
      name: '',
      category: '',
      quantity: 1,
      priority: 0,
      description: '',
      price: 0,
      status: 'NEEDED'
    }]
  });

  const [error, setError] = React.useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: StoryFormData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: keyof StoryItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setFormData((prev: StoryFormData) => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData((prev: StoryFormData) => ({
      ...prev,
      items: [...prev.items, {
        name: '',
        category: '',
        quantity: 1,
        priority: 0,
        description: '',
        price: 0,
        status: 'NEEDED'
      }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return;
    
    setFormData((prev: StoryFormData) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">스토리</label>
          <textarea
            name="story"
            value={formData.story}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">필요한 물품</label>
          {formData.items.map((item: StoryItem, index: number) => (
            <div key={index} className="flex gap-4 mb-4">
              <select
                value={item.category}
                onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">카테고리 선택</option>
                {NECESSITY_CATEGORIES.slice(1).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              <input
                placeholder="물품명"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                required
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                min="1"
                required
                disabled={isLoading}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={isLoading || formData.items.length <= 1}
                className="p-2 text-gray-500 hover:text-red-500 disabled:opacity-50"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            disabled={isLoading}
            className="w-full mt-2 px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
          >
            + 물품 추가
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isLoading ? '저장 중...' : (story ? '수정하기' : '저장하기')}
        </button>
      </div>
    </form>
  );
}