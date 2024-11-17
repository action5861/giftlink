// src/app/admin/stories/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Story, StoryStatus } from '@prisma/client';
import axios from 'axios';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { StatusControl } from './components/StatusControl';

export default function StoriesPage() {
  const router = useRouter();
  const [stories, setStories] = React.useState<Story[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');

  // 스토리 목록 조회
  const fetchStories = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const response = await axios.get(`/api/admin/stories?${params.toString()}`);
      setStories(response.data);
    } catch (err) {
      setError('스토리 목록을 불러오는데 실패했습니다.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // 스토리 삭제
  const handleDelete = async (storyId: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) return;

    try {
      setIsLoading(true);
      setError(null);
      await axios.delete(`/api/admin/stories/${storyId}`);
      await fetchStories();
    } catch (err) {
      setError('스토리 삭제 중 오류가 발생했습니다.');
      console.error('Delete error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 로드 시 스토리 목록 조회
  React.useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // 날짜 포맷팅
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 검색 핸들러 (디바운스 적용)
  const handleSearch = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const debounceSearch = React.useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handleSearch(value), 300);
    };
  }, [handleSearch]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 섹션 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">스토리 관리</h1>
        <button
          onClick={() => router.push('/admin/stories/create')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          새 스토리 작성
        </button>
      </div>

      {/* 검색 및 필터 섹션 */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="수혜자 이름 또는 스토리 내용으로 검색"
            onChange={(e) => debounceSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">전체 상태</option>
          <option value="PENDING">검토중</option>
          <option value="ACTIVE">활성화</option>
          <option value="COMPLETED">완료됨</option>
          <option value="REJECTED">거절됨</option>
        </select>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : stories.length > 0 ? (
        /* 스토리 목록 테이블 */
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  등록일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50">
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
                    <StatusControl
                      storyId={story.id}
                      currentStatus={story.status}
                      onStatusChange={() => fetchStories()}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(story.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/stories/${story.id}/edit`)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="inline-flex items-center text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* 검색 결과 없음 */
        <div className="text-center py-12 text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}