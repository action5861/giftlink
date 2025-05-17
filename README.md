# GiftLink - Digital Gift Management Platform

GiftLink는 디지털 선물을 쉽고 안전하게 관리할 수 있는 플랫폼입니다.

## 주요 기능

- 디지털 선물 등록 및 관리
- 선물 공유 및 전달
- 실시간 선물 상태 추적
- 모바일 최적화 인터페이스
- 접근성 표준 준수

## 기술 스택

- Next.js
- TypeScript
- Prisma
- Tailwind CSS
- PostgreSQL

## 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- npm 또는 yarn
- PostgreSQL 데이터베이스

### 설치

1. 저장소 클론
```bash
git clone https://github.com/yourusername/giftlink.git
cd giftlink
```

2. 의존성 설치
```bash
npm install
# 또는
yarn install
```

3. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:
```
DATABASE_URL="postgresql://username:password@localhost:5432/giftlink"
```

4. 데이터베이스 마이그레이션
```bash
npx prisma migrate dev
```

5. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

## 프로젝트 구조

```
giftlink/
├── app/              # Next.js 13+ app directory
├── components/       # React components
├── lib/             # Utility functions
├── prisma/          # Database schema and migrations
├── public/          # Static assets
└── types/           # TypeScript type definitions
```

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.
