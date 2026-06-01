# MAKCHA (막차)

지각 방지용 **행동 교정** 서비스. 대중교통 소요 시간만이 아니라 **준비 시간(버퍼)** 과 **실시간 지하철 정보**를 합쳐, 지금 당장 나가지 않으면 지각하는 **진짜 데드라인(막차 시간)** 을 계산하고, 카운트다운과 직설적인 카피로 행동을 압박합니다.

## 폴더 구조

```
MAKCHA/
├── apps/
│   ├── landing/              # Waitlist · 마케팅 랜딩 (Vite + React)
│   └── web/                  # 본 서비스 PWA (Next.js App Router + TS + Tailwind)
│       ├── public/           # 정적 자산, PWA 아이콘
│       └── src/
│           ├── app/          # 라우트, 레이아웃, manifest
│           ├── components/   # 공용 UI (버튼, 레이아웃 셸 등)
│           ├── features/     # 도메인별 기능 모듈
│           │   ├── deadline/   # 막차(leave-by) 시간 계산
│           │   ├── transit/    # 실시간 지하철·경로
│           │   ├── countdown/  # 카운트다운·압박 카피 UI
│           │   └── settings/   # 버퍼·목적지·알림 설정
│           ├── lib/          # 유틸, 상수, API 클라이언트
│           └── types/        # 공용 TypeScript 타입
├── package.json              # npm workspaces 루트
└── README.md
```

## 실행 방법

루트에서 의존성 설치 (최초 1회):

```bash
npm install
```

| 명령 | 설명 | URL |
|------|------|-----|
| `npm run dev` | **본 서비스** 개발 서버 | http://localhost:3000 |
| `npm run dev:web` | 위와 동일 | http://localhost:3000 |
| `npm run dev:landing` | 랜딩 개발 서버 | http://localhost:5173 |
| `npm run build` | 웹 앱 프로덕션 빌드 | `apps/web/.next` |
| `npm run build:landing` | 랜딩 빌드 | `apps/landing/dist` |
| `npm run preview:landing` | 랜딩 빌드 미리보기 | |

## SheetDB 연동 (랜딩, 선택)

사전 신청 폼을 Google Sheet에 저장하려면 `apps/landing/.env` 파일을 만들고 SheetDB URL을 설정하세요.

```
VITE_SHEETDB_URL=https://sheetdb.io/api/v1/YOUR_ID
```

## Vercel 배포

**랜딩** (`apps/landing`):

| 설정 | 값 |
|------|-----|
| Framework Preset | Vite |
| Root Directory | `apps/landing` (또는 모노레포 루트 + Output 아래 참고) |
| Build Command | `npm run build:landing` |
| Output Directory | `apps/landing/dist` |

**본 서비스** (`apps/web`):

| 설정 | 값 |
|------|-----|
| Framework Preset | Next.js |
| Root Directory | `apps/web` |
| Build Command | `npm run build:web` |
