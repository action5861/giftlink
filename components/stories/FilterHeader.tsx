'use client';
import { useState } from 'react';
import { Category } from '@/types/story';

interface FilterHeaderProps {
  onFilterChange: (category: Category) => void;
  onSearch: (query: string) => void;
}

export default function FilterHeader({ onFilterChange, onSearch }: FilterHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all' as Category, label: 'All Stories' },
    { id: 'student' as Category, label: 'Students' },
    { id: 'elderly' as Category, label: 'Elderly' },
    { id: 'family' as Category, label: 'Families' },
    { id: 'urgent' as Category, label: 'Urgent' }
  ];

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 검색바 */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onFilterChange(category.id)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}