// src/constants/status.ts
export const STATUS_STYLES = {
    PENDING: {
      label: '검토중',
      color: 'bg-yellow-100 text-yellow-800'
    },
    ACTIVE: {
      label: '활성화',
      color: 'bg-green-100 text-green-800'
    },
    COMPLETED: {
      label: '완료됨',
      color: 'bg-blue-100 text-blue-800'
    },
    REJECTED: {
      label: '거절됨',
      color: 'bg-red-100 text-red-800'
    }
  } as const;