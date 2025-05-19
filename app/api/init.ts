import { GiftLinkSystem, GiftLinkConfig } from '@/lib/system';

// 환경 변수에서 설정 로드
const config: GiftLinkConfig = {
  coupangApi: {
    apiKey: process.env.COUPANG_API_KEY || '',
    secretKey: process.env.COUPANG_SECRET_KEY || '',
    baseUrl: process.env.COUPANG_API_URL || 'https://api.coupang.com'
  },
  schedulers: {
    settlementCheck: process.env.SETTLEMENT_CHECK_CRON || '0 9 * * 1', // 매주 월요일 오전 9시
    shippingStatusCheck: process.env.SHIPPING_STATUS_CHECK_CRON || '0 * * * *' // 매시간
  }
};

// 시스템 인스턴스 생성 및 실행
const giftLinkSystem = new GiftLinkSystem(config);

// 서버 시작 시 시스템 초기화
if (process.env.NODE_ENV === 'production') {
  giftLinkSystem.start();
  
  // 프로세스 종료 시 시스템 중지
  process.on('SIGTERM', () => {
    giftLinkSystem.stop();
    process.exit(0);
  });
  
  process.on('SIGINT', () => {
    giftLinkSystem.stop();
    process.exit(0);
  });
}

export { giftLinkSystem }; 