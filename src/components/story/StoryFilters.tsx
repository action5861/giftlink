// src/components/story/StoryFilters.tsx
import { NECESSITY_CATEGORIES, REGIONS } from '@/constants/filters'

interface StoryFiltersProps {
  onFilterChange: (category: string, region: string) => void;
  selectedCategory: string;
  selectedRegion: string;
}

export default function StoryFilters({ 
  onFilterChange,
  selectedCategory,
  selectedRegion 
}: StoryFiltersProps) {
  return (
    <div className="mb-8">
      {/* 카테고리 필터 */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-[#2D3648] mb-3">카테고리</h3>
        <div className="flex flex-wrap gap-2">
          {NECESSITY_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onFilterChange(category.id, selectedRegion)}
              className={`px-4 py-2 rounded-full text-sm transition-all
                ${selectedCategory === category.id
                  ? 'bg-[#6B77F8] text-white'
                  : 'bg-[#F8F9FF] text-[#666D7C] hover:bg-[#E8EBFF]'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* 지역 필터 */}
      <div>
        <h3 className="text-lg font-medium text-[#2D3648] mb-3">지역</h3>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => onFilterChange(selectedCategory, region.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all
                ${selectedRegion === region.id
                  ? 'bg-[#6B77F8] text-white'
                  : 'bg-[#F8F9FF] text-[#666D7C] hover:bg-[#E8EBFF]'
                }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}