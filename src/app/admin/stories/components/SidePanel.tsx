// src/app/admin/stories/components/SidePanel.tsx
import React from 'react';
import { Story } from '@prisma/client';
import { StoryForm } from './StoryForm';
import axios from 'axios';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStory?: Story;
  onSuccess: () => void;
}

export function SidePanel({ isOpen, onClose, selectedStory, onSuccess }: SidePanelProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (selectedStory) {
        await axios.put(`/api/admin/stories/${selectedStory.id}`, data);
      } else {
        await axios.post('/api/admin/stories', data);
      }
      onSuccess();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-1/3 bg-white shadow-xl border-l transform transition-transform duration-200 ease-in-out">
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {selectedStory ? '스토리 수정' : '새 스토리 작성'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <StoryForm
            story={selectedStory}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}