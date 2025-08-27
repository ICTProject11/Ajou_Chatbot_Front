# Ajou Admissions Chat – Frontend

아주대 신입생 학사 안내 챗봇의 프론트엔드입니다.  
React + TypeScript + Vite 기반이며, FastAPI 백엔드(`localhost:8000`)와 통신합니다.


## 🚀 Quick Start

### 0) Prerequisites
- **Node.js**: v18 이상 권장 (LTS)
- **npm**: v9 이상
- **백엔드**: FastAPI 서버가 `http://127.0.0.1:8000` 에서 실행 중이면 바로 연동됨

### 1) Install
```bash
npm ci          # package-lock.json 기준 빠르게 설치 (처음/CI 권장)
# 또는
npm install
```

### 2) Run (dev)
```bash
npm run dev
```

- 브라우저: http://localhost:5173
- React DevTools 설치 안내 메시지는 정상입니다.

### 3) Build
```bash
npm run build    # dist/에 정적 파일 생성
npm run preview  # 로컬 프리뷰 서버로 빌드 결과 확인
```

---

## 🔧 환경설정

프론트가 백엔드와 통신하는 기본 주소는 `src/lib/api.ts` 의 `BASE` 상수로 관리합니다.

```ts
// src/lib/api.ts
const BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000';
```

환경변수로 오버라이드하려면 루트에 `.env` 파일을 추가:

```
VITE_API_BASE=http://127.0.0.1:8000
```

---

## 📂 프로젝트 구조 (예시)

```
src/
 ├─ components/   # UI 컴포넌트
 ├─ lib/          # API, 유틸
 ├─ types/        # 타입 정의
 ├─ App.tsx       # 진입 컴포넌트
 └─ main.tsx      # Vite 엔트리
```

---

## 🤝 기여 방법

1. Fork → Branch 생성 (`feat/my-feature`)
2. 코드 수정 및 커밋
3. PR 요청