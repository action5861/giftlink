// app/test/page.tsx
'use client';
import { stories } from '@/data/stories';
import StoryCard from '@/components/StoryCard';
import { Story } from '@/types/story';

export default function TestPage() {
  const handleMatch = async (storyId: string) => {
    console.log('Matching story:', storyId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Story Card Test Page
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stories.map((story: Story) => (
          <StoryCard
            key={story.id}
            story={story}
            onMatch={handleMatch}
          />
        ))}
      </div>
    </div>
  );
}