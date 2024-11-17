// src/app/admin/stories/components/StoryTable.tsx
import React from 'react';
import { Story, StoryStatus } from '@prisma/client';
import { formatDate } from '@/lib/utils';

interface StoryTableProps {
  stories: Story[];
  onSelect: (story: Story) => void;
  selectedId?: string;
}

export function StoryTable({ stories, onSelect, selectedId }: StoryTableProps) {
  const getStatusColor = (status: StoryStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              수혜자 정보
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              스토리
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              물품
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              등록일
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stories.map((story) => (
            <tr 
              key={story.id}
              onClick={() => onSelect(story)}
              className={`cursor-pointer hover:bg-gray-50 ${
                selectedId === story.id ? 'bg-blue-50' : ''
              }`}
            >
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {story.beneficiaryName || '익명'}
                </div>
                <div className="text-sm text-gray-500">
                  {story.age}세 / {story.gender} / {story.region}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 line-clamp-2">
                  {story.story}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                  {story.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  물품 정보
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(story.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}