// components/layout/MasonryGrid.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { Story } from '@/types/story';
import StoryCard from '../StoryCard';

interface MasonryGridProps {
  items: Story[];
  onMatch?: (storyId: string) => void;
}

export default function MasonryGrid({ items, onMatch }: MasonryGridProps) {
  // 브라우저 창 크기에 따른 컬럼 수 조정
  const [columns, setColumns] = useState(4);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);        // 모바일
      else if (width < 1024) setColumns(2);  // 태블릿
      else if (width < 1280) setColumns(3);  // 작은 데스크탑
      else setColumns(4);                    // 큰 데스크탑
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // 아이템을 컬럼별로 분배
  const columnItems = Array.from({ length: columns }, (_, i) => 
    items.filter((_, index) => index % columns === i)
  );

  return (
    <div
      ref={gridRef}
      className="w-full grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      }}
    >
      {columnItems.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4">
          {column.map((item) => (
            <div 
              key={item.id}
              className="break-inside-avoid transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <StoryCard story={item} onMatch={onMatch} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}