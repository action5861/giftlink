// app/admin/stories/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Story } from '@/types/story';
import CreateStoryForm from './CreateStoryForm';

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      const data = await response.json();
      setStories(data);
    } catch (err) {
      setError('Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (data: any) => {
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create story');

      await fetchStories();
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create story');
    }
  };

 return (
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
     <div className="flex justify-between items-center mb-6">
       <h1 className="text-2xl font-bold text-gray-900">스토리 관리</h1>
       <button
         onClick={() => setShowCreateForm(true)}
         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
       >
         새 스토리 생성
       </button>
     </div>

     {showCreateForm && (
       <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
         <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
           <CreateStoryForm
             onSubmit={handleCreateStory}
             onCancel={() => setShowCreateForm(false)}
           />
         </div>
       </div>
     )}

     {loading ? (
       <div className="text-center py-12">Loading...</div>
     ) : (
       <div className="bg-white shadow overflow-hidden sm:rounded-md">
         <ul className="divide-y divide-gray-200">
           {stories.map((story) => (
             <li key={story.id} className="px-6 py-4 hover:bg-gray-50">
               <div className="flex items-center justify-between">
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center space-x-3">
                     <h3 className="text-sm font-medium text-gray-900 truncate">
                       {story.title}
                     </h3>
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                       story.status === 'waiting'
                         ? 'bg-green-100 text-green-800'
                         : 'bg-gray-100 text-gray-800'
                     }`}>
                       {story.status === 'waiting' ? '대기중' : '완료'}
                     </span>
                   </div>
                   <div className="mt-1">
                     <p className="text-sm text-gray-500 truncate">
                       {story.essentialItem.name} - {story.essentialItem.priceRange}
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-4">
                   <span className="text-sm text-gray-500">
                     {new Date(story.createdAt).toLocaleDateString()}
                   </span>
                   <button
                     onClick={() => {/* 상세 보기 또는 수정 */}}
                     className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                   >
                     상세
                   </button>
                 </div>
               </div>
             </li>
           ))}
         </ul>
       </div>
     )}
   </div>
 );
}