// src/app/admin/stories/components/StatusControl.tsx
'use client';

import React from 'react';
import axios from 'axios';
import { StoryStatus } from '@prisma/client';

interface StatusControlProps {
  storyId: string;
  currentStatus: StoryStatus;
  onStatusChange: (newStatus: StoryStatus) => void;
}

const statusOptions = [
  { value: 'PENDING', label: '검토중', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ACTIVE', label: '활성화', color: 'bg-green-100 text-green-800' },
  { value: 'COMPLETED', label: '완료됨', color: 'bg-blue-100 text-blue-800' },
  { value: 'REJECTED', label: '거절됨', color: 'bg-red-100 text-red-800' },
] as const;

export function StatusControl({ storyId, currentStatus, onStatusChange }: StatusControlProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleStatusChange = async (newStatus: StoryStatus) => {
    if (newStatus === currentStatus) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.patch(`/api/admin/stories/${storyId}/status`, {
        status: newStatus
      });
      
      onStatusChange(response.data.status);
    } catch (err) {
      setError('상태 변경에 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value as StoryStatus)}
        disabled={isLoading}
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          statusOptions.find(opt => opt.value === currentStatus)?.color
        } border-0 cursor-pointer disabled:opacity-50`}
      >
        {statusOptions.map(option => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-white text-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="absolute top-full mt-1 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}