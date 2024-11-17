// src/utils/date.ts

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}분 전`;
    }
    return `${diffInHours}시간 전`;
  } else if (diffInHours < 48) {
    return '어제';
  } else if (diffInHours < 72) {
    return '2일 전';
  } else if (diffInHours < 168) { // 7일
    return `${Math.floor(diffInHours / 24)}일 전`;
  }
  
  return format(date, 'yyyy.MM.dd', { locale: ko });
};

export const formatTime = (dateString: string) => {
  return format(new Date(dateString), 'HH:mm', { locale: ko });
};