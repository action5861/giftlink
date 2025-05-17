import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatString = 'yyyy년 MM월 dd일') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatString, { locale: ko });
}

export function formatCurrency(amount: number) {
  return amount.toLocaleString('ko-KR') + '원';
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusText(status: string) {
  switch (status) {
    case 'pending':
      return '준비 중';
    case 'shipped':
      return '배송 중';
    case 'delivered':
      return '배송 완료';
    case 'cancelled':
      return '취소됨';
    default:
      return status;
  }
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
