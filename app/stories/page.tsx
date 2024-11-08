'use client';
import { useState, useEffect } from 'react';
import { stories } from '@/data/stories';
import { Story, Category } from '@/types/story';
import MasonryGrid from '@/components/layout/MasonryGrid';
import FilterHeader from '@/components/stories/FilterHeader';

export default function StoriesPage() {
  const [filteredStories, setFilteredStories] = useState(stories);
  const [visibleStories, setVisibleStories] = useState(12);

  const handleFilterChange = (category: Category) => {
    if (category === 'all') {
      setFilteredStories(stories);
    } else {
      const filtered = stories.filter(story => {
        switch(category) {
          case 'student':
            return story.age < 20;
          case 'elderly':
            return story.age >= 65;
          case 'family':
            return story.category === 'family';
          case 'urgent':
            return story.essentialItem.isUrgent;
          default:
            return true;
        }
      });
      setFilteredStories(filtered);
    }
    setVisibleStories(12);
  };

  const handleSearch = (query: string) => {
    const searched = stories.filter(story =>
      story.title.toLowerCase().includes(query.toLowerCase()) ||
      story.story.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStories(searched);
    setVisibleStories(12);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {/* 상단 헤더 */}
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Stories of Hope
          </h1>
          <p className="text-lg text-gray-600">
            Every story represents a real person waiting for your support.
            Choose someone to help today.
          </p>
        </div>

        {/* 필터 컴포넌트 */}
        <div className="mb-8">
          <FilterHeader
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>

        {/* 메인 그리드 */}
        <div className="max-w-7xl mx-auto">
          <MasonryGrid 
            items={filteredStories.slice(0, visibleStories)}
            onMatch={(id) => console.log('Matching:', id)}
          />
        </div>
      </div>
    </main>
  );
}