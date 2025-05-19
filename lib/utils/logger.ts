import winston from 'winston';

// 로그 포맷 정의
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// 로거 인스턴스 생성
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'giftlink' },
  transports: [
    // 콘솔 출력
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // 파일 출력 (에러)
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // 파일 출력 (모든 로그)
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// 개발 환경에서만 디버그 로그 활성화
if (process.env.NODE_ENV !== 'production') {
  logger.debug('로깅이 초기화되었습니다.');
}

// 로그 레벨별 헬퍼 함수
export const logError = (message: string, meta?: any) => {
  logger.error(message, meta);
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

// 에러 객체 로깅을 위한 헬퍼 함수
export const logErrorWithStack = (error: Error, message?: string) => {
  logger.error(message || error.message, {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    }
  });
}; 