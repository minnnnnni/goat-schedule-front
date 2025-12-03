# 프로젝트 구조 및 역할 분담 완벽 가이드

## 📐 전체 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 앱 구조                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ src/app/ - 페이지 및 라우팅 (Next.js App Router)     │  │
│  │ ├── layout.tsx (루트 레이아웃)                       │  │
│  │ ├── (auth)/ - 인증 관련 페이지                      │  │
│  │ ├── (main)/ - 메인 앱 페이지 (Header/Nav 포함)      │  │
│  │ ├── onboarding/ - 초기 설정 페이지                 │  │
│  │ └── api/ - API 라우트                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ src/features/ - 기능별 모듈 (Business Logic)        │  │
│  │ ├── auth/                                           │  │
│  │ ├── employees/                                      │  │
│  │ ├── onboarding/                                     │  │
│  │ ├── home/ ← 개발자 B                                │  │
│  │ ├── schedule/ ← 개발자 B                            │  │
│  │ └── settings/ ← 개발자 B                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ src/components/ - 공통 UI 컴포넌트                   │  │
│  │ ├── layout/ (Header, BottomNavigation)             │  │
│  │ └── ui/ (Button, Input, Modal 등)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ src/services/ - API 통신 계층                        │  │
│  │ ├── apiClient.ts (Axios/Fetch 설정)                │  │
│  │ ├── authApi.ts                                     │  │
│  │ ├── employeeApi.ts                                 │  │
│  │ ├── scheduleApi.ts                                 │  │
│  │ └── storeApi.ts                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ src/store/ - 상태 관리 (Zustand)                     │  │
│  │ ├── useAuthStore.ts (로그인 정보, 사용자 정보)       │  │
│  │ ├── useStore.ts (데이터 캐시: 직원, 매장, 근무표)    │  │
│  │ └── useUIStore.ts (UI 상태: 모달, 사이드바 등)       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ src/types/ - 타입 정의                               │  │
│  │ ├── index.ts (Employee, Store, Shift 등)           │  │
│  │ └── api.ts (ApiResponse 등)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ src/lib/ - 유틸리티 및 헬퍼                          │  │
│  │ ├── utils.ts (공통 함수)                             │  │
│  │ ├── validation.ts (폼 검증)                          │  │
│  │ ├── db.ts (DB 클라이언트)                            │  │
│  │ └── kakao.ts (카카오 로그인)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 데이터 흐름

```
User Interaction (UI)
        ↓
   Component (features/*/components/)
        ↓
  Hook (features/*/hooks/)
        ↓
  State Management (store/)
        ↓
  API Call (services/)
        ↓
  Backend API
        ↓
  Response
        ↓
  State Update
        ↓
  Re-render Component
```

---

## 📋 각 계층(Layer)의 역할

### 1️⃣ `src/app/` - 페이지 레이어 (Pages)

**역할:** 라우팅 및 페이지 레이아웃 정의

```
- (auth)/login/page.tsx         → 로그인 페이지
- (auth)/email-login/page.tsx   → 이메일 로그인 페이지
- (auth)/signup/page.tsx        → 회원가입 페이지
- (main)/layout.tsx             → 메인 앱 레이아웃 (Header + Nav)
- (main)/page.tsx               → 홈 대시보드 ← 개발자 B
- (main)/calendar/page.tsx      → 캘린더 페이지 ← 개발자 B
- (main)/employees/page.tsx     → 알바생 관리 페이지 ← 개발자 A
- (main)/settings/page.tsx      → 설정 페이지 ← 개발자 B
- onboarding/store-setup/page.tsx → 매장 설정 페이지 ← 개발자 A
- calendar/shift/add/page.tsx   → 근무 추가 페이지 ← 개발자 B
- calendar/shift/[shiftId]/page.tsx → 근무 수정 페이지 ← 개발자 B
- generate/results/page.tsx     → 근무표 생성 결과 페이지 ← 개발자 B
```

**중요 규칙:**
- 페이지는 **컴포넌트만 import해서 렌더링**하고, 비즈니스 로직은 포함하지 않음
- 모든 페이지는 `src/app/(main)/layout.tsx`에서 Header & Navigation을 자동으로 적용받음

---

### 2️⃣ `src/features/` - 기능 모듈 계층 (Features)

**역할:** 기능별로 컴포넌트, 훅, 유틸을 모아두는 계층

```
각 feature 내부 구조:
features/
├── {feature-name}/
│   ├── components/      → React 컴포넌트
│   ├── hooks/           → Custom Hooks (상태 관리, 데이터 페칭)
│   ├── utils/           → 기능별 유틸리티 함수
│   └── types.ts (optional) → 기능별 타입 정의
```

**예시:**

```typescript
// src/features/home/components/DailyScheduleView.tsx
import { useSchedule } from "../hooks/useSchedule";
import Button from "@/components/ui/Button";

export default function DailyScheduleView() {
  const { schedule } = useSchedule();
  return <div>{/* UI */}</div>;
}
```

```typescript
// src/features/home/hooks/useSchedule.ts
import { useEffect, useState } from "react";
import { scheduleApi } from "@/services/scheduleApi";

export function useSchedule() {
  const [schedule, setSchedule] = useState(null);
  
  useEffect(() => {
    scheduleApi.getToday().then(setSchedule);
  }, []);
  
  return { schedule };
}
```

---

### 3️⃣ `src/components/` - 공통 UI 컴포넌트 계층

**역할:** 프로젝트 전체에서 재사용되는 UI 컴포넌트

```
components/
├── layout/
│   ├── Header.tsx              → 상단 헤더 (로고, 메뉴)
│   └── BottomNavigation.tsx    → 하단 네비게이션 (탭)
└── ui/
    ├── Button.tsx              → 일반 버튼
    ├── Input.tsx               → 입력 필드
    ├── Modal.tsx               → 모달
    ├── Sheet.tsx               → 시트 (바텀시트)
    └── Calendar.tsx            → 캘린더 UI
```

**중요:** 공통 UI는 여기에만 만들고, 기능 특화 UI는 `features/{feature}/components/`에서 만들 것

---

### 4️⃣ `src/services/` - API 통신 계층

**역할:** 백엔드 API 호출 담당 (비즈니스 로직 X, 순수 API 호출만)

```typescript
// src/services/apiClient.ts
// Axios 또는 Fetch 기반 HTTP 클라이언트 설정
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// 인증 토큰 자동 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

```typescript
// src/services/scheduleApi.ts
import apiClient from './apiClient';
import { ApiResponse } from '@/types/api';
import { Shift } from '@/types';

export const scheduleApi = {
  // 오늘 근무표 조회
  getToday: async () => {
    const response = await apiClient.get<ApiResponse<Shift[]>>('/schedule/today');
    return response.data.data;
  },

  // 월간 근무표 조회
  getMonth: async (year: number, month: number) => {
    const response = await apiClient.get<ApiResponse<Shift[]>>(`/schedule/${year}/${month}`);
    return response.data.data;
  },

  // 근무표 생성
  generate: async (params: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/schedule/generate', params);
    return response.data.data;
  },

  // 근무 추가
  createShift: async (data: any) => {
    const response = await apiClient.post<ApiResponse<Shift>>('/schedule/shift', data);
    return response.data.data;
  },

  // 근무 수정
  updateShift: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<Shift>>(`/schedule/shift/${id}`, data);
    return response.data.data;
  },

  // 근무 삭제
  deleteShift: async (id: string) => {
    await apiClient.delete(`/schedule/shift/${id}`);
  },
};
```

**규칙:**
- 모든 API 호출은 여기서만 수행
- 컴포넌트에서 `apiClient` 직접 사용 금지
- 응답은 그대로 반환하고, 가공은 Hook에서 수행

---

### 5️⃣ `src/store/` - 상태 관리 계층 (Zustand)

**역할:** 전역 상태 관리 (사용자 정보, 캐시 데이터, UI 상태)

```typescript
// src/store/useAuthStore.ts
// 사용자 인증 정보 관리
import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await authApi.login(email, password);
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    set({ user: null });
    localStorage.removeItem('token');
  },
  
  setUser: (user) => set({ user }),
}));
```

```typescript
// src/store/useStore.ts
// 비즈니스 데이터 캐시 (직원, 매장, 근무표)
import { create } from 'zustand';
import { Employee, Store, Shift } from '@/types';

interface StoreState {
  employees: Employee[];
  store: Store | null;
  shifts: Shift[];
  
  setEmployees: (employees: Employee[]) => void;
  setStore: (store: Store) => void;
  setShifts: (shifts: Shift[]) => void;
  addShift: (shift: Shift) => void;
  removeShift: (shiftId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  employees: [],
  store: null,
  shifts: [],
  
  setEmployees: (employees) => set({ employees }),
  setStore: (store) => set({ store }),
  setShifts: (shifts) => set({ shifts }),
  addShift: (shift) => set((state) => ({ shifts: [...state.shifts, shift] })),
  removeShift: (shiftId) => set((state) => ({
    shifts: state.shifts.filter((s) => s.id !== shiftId),
  })),
}));
```

```typescript
// src/store/useUIStore.ts
// UI 상태 (모달, 사이드바, 토스트 등)
import { create } from 'zustand';

interface UIState {
  isModalOpen: boolean;
  isSidebarOpen: boolean;
  toast: { message: string; type: 'success' | 'error' } | null;
  
  openModal: () => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  isSidebarOpen: false,
  toast: null,
  
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));
```

---

### 6️⃣ `src/types/` - 타입 정의 계층

**역할:** TypeScript 인터페이스 및 타입 정의 (모든 곳에서 공유)

```typescript
// src/types/index.ts
// 핵심 비즈니스 타입

export interface User {
  id: string;
  email: string;
  name: string;
  storeId: string;
  createdAt: Date;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  phone: string;
  address: string;
  businessHours: {
    monday: TimeRange;
    tuesday: TimeRange;
    wednesday: TimeRange;
    thursday: TimeRange;
    friday: TimeRange;
    saturday: TimeRange;
    sunday: TimeRange;
  };
  closedDays: string[]; // 정기 휴일
}

export interface TimeRange {
  start: string; // "09:00"
  end: string;   // "22:00"
  isClosed: boolean;
}

export interface Employee {
  id: string;
  storeId: string;
  name: string;
  phone: string;
  availableDays: DayAvailability[];
  availableHours: TimeRange[];
}

export interface DayAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isAvailable: boolean;
}

export interface Shift {
  id: string;
  storeId: string;
  employeeId: string;
  date: string; // "2025-11-11"
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
  position?: string; // 주방, 홀 등
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeBlock {
  start: string;
  end: string;
}
```

```typescript
// src/types/api.ts
// API 응답 형식

export type ApiResponse<T> = {
  data: T;
  error?: string;
  message?: string;
};

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};
```

---

## 📝 `.ts` 파일은 무엇인가?

**네, 맞습니다!** `.ts` 파일들은 **내부 로직만** 구현하기 위해 만들어진 것입니다.

| 파일 타입 | 목적 | 내용 |
|---------|------|------|
| `.tsx` | React 컴포넌트 | UI 렌더링 + 상호작용 |
| `.ts` | 비즈니스 로직 | 함수, 훅, API 호출, 유틸리티 |

**예시:**

```typescript
// ❌ 잘못된 예 - Hook에 UI 로직
export function useSchedule() {
  const [loading, setLoading] = useState(false);
  
  const loadSchedule = async () => {
    setLoading(true);
    // 로직...
    return <div>{/* UI */}</div>; // 이건 Hook에서 하면 안됨
  };
}

// ✅ 올바른 예 - Hook은 데이터만 반환
export function useSchedule() {
  const [schedule, setSchedule] = useState<Shift[] | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      const data = await scheduleApi.getToday();
      setSchedule(data);
      setLoading(false);
    };
    
    fetchSchedule();
  }, []);
  
  return { schedule, loading };
}

// ✅ 컴포넌트에서 Hook 사용해서 UI 렌더링
export default function DailyScheduleView() {
  const { schedule, loading } = useSchedule();
  
  return (
    <div>
      {loading ? <p>로딩 중...</p> : <div>{/* 근무표 렌더링 */}</div>}
    </div>
  );
}
```

---

## 🚀 개발자 B (당신)의 담당 부분

### 📦 담당 Features

```
src/features/
├── home/                          ← 개발자 B
│   ├── components/
│   │   ├── DailyScheduleView.tsx     (오늘의 근무표 요약)
│   │   └── GenerateSchedulePopup.tsx (근무표 자동 생성 팝업)
│   └── hooks/
│       └── useHome.ts (필요시)
│
├── schedule/                      ← 개발자 B (핵심!)
│   ├── components/
│   │   ├── MonthlyCalendarView.tsx   (월간 캘린더)
│   │   ├── DailyShiftList.tsx        (일별 근무자 목록)
│   │   ├── ShiftForm.tsx             (근무 추가/수정 폼)
│   │   └── ScheduleResultPicker.tsx  (생성 결과 선택)
│   ├── hooks/
│   │   └── useScheduleGenerator.ts   (근무표 생성 로직)
│   └── utils/
│       └── scheduleAlgorithm.ts      (스케줄링 알고리즘)
│
└── settings/                      ← 개발자 B
    ├── components/
    │   ├── StoreInfoView.tsx         (매장 정보 조회)
    │   └── LogoutButton.tsx          (로그아웃)
    └── hooks/
        └── useSettings.ts (필요시)
```

### 📄 담당 페이지

```
src/app/(main)/
├── page.tsx                        ← 홈 대시보드 (/)
├── calendar/
│   └── page.tsx                    ← 캘린더 (/calendar)
└── settings/
    └── page.tsx                    ← 설정 (/settings)

src/app/
├── calendar/shift/add/page.tsx     ← 근무 추가 (/calendar/shift/add)
├── calendar/shift/[shiftId]/page.tsx ← 근무 수정 (/calendar/shift/[shiftId])
└── generate/results/page.tsx       ← 생성 결과 (/generate/results)
```

### 🔧 담당 API 서비스

```typescript
// src/services/scheduleApi.ts
// - getToday()         → 오늘 근무표
// - getMonth()         → 월간 근무표
// - generate()         → 근무표 자동 생성
// - createShift()      → 근무 추가
// - updateShift()      → 근무 수정
// - deleteShift()      → 근무 삭제

// src/services/storeApi.ts
// - getStore()         → 매장 정보 조회
// - updateStore()      → 매장 정보 수정
```

---

## ⚠️ 공통으로 먼저 구현해야 하는 부분 (매우 중요!)

### 1️⃣ **타입 정의 (`src/types/index.ts`)**

두 개발자가 동일한 데이터 타입을 사용해야 합니다.

```typescript
// 최소한 다음은 정의되어야 함:
export interface User { /* ... */ }
export interface Store { /* ... */ }
export interface Employee { /* ... */ }
export interface Shift { /* ... */ }
export interface TimeRange { /* ... */ }
```

**담당:** 팀원 A와 함께 협의 후 정의

---

### 2️⃣ **API 클라이언트 (`src/services/apiClient.ts`)**

```typescript
// Axios 기본 설정
// - baseURL 설정
// - 인증 토큰 자동 추가 (interceptor)
// - 에러 핸들링
```

**담당:** 누군가는 먼저 구성 필요

---

### 3️⃣ **상태 관리 스토어 (`src/store/`)**

```typescript
// 세 가지 스토어 구조 정의:
// 1. useAuthStore     (사용자 인증)
// 2. useStore         (데이터 캐시)
// 3. useUIStore       (UI 상태)
```

**담당:** 팀원 A와 함께 협의

---

### 4️⃣ **공통 UI 컴포넌트 (`src/components/ui/`)**

```typescript
// 이미 있는 것:
// - Button.tsx
// - Input.tsx
// - Modal.tsx
// - Sheet.tsx
// - Calendar.tsx

// 추가로 필요한 것:
// - Alert.tsx
// - Tabs.tsx
// - Select.tsx (필요시)
// - Checkbox.tsx (필요시)
```

**담당:** 공통으로 필요한 것부터 구현

---

### 5️⃣ **메인 레이아웃 (`src/app/(main)/layout.tsx`)**

```typescript
// Header + BottomNavigation을 포함하는 레이아웃
// 모든 (main) 페이지에 자동으로 적용됨

import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-auto">{children}</main>
      <BottomNavigation />
    </div>
  );
}
```

**담당:** 누군가는 먼저 구현 필요

---

## 🎯 개발 순서 (권장)

### Phase 1: 기초 설정 (1-2일)
1. **타입 정의** (`src/types/index.ts`) - 팀 협의
2. **API 클라이언트** (`src/services/apiClient.ts`) - 누군가 선행
3. **상태 관리** (`src/store/`) - 팀 협의
4. **공통 UI** (`src/components/ui/`) - 필요한 것부터

### Phase 2: 기본 구조 (2-3일)
5. **메인 레이아웃** - Header, BottomNavigation
6. **라우팅 구조** - 페이지 연결
7. **API 서비스 정의** - `scheduleApi.ts`, `storeApi.ts` 등

### Phase 3: 기능 구현 (시작 가능)
- **개발자 A:** Auth, Employees, Onboarding 기능
- **개발자 B:** Home, Schedule, Settings 기능

---

## 💾 커밋 전 체크리스트

당신의 코드를 커밋하기 전에:

- [ ] 모든 `.ts` 파일에 함수/타입이 제대로 내보내지는가? (`export`)
- [ ] `.tsx` 컴포넌트는 명확한 props를 받는가?
- [ ] `src/types`에 정의된 타입만 사용하는가? (`any` 금지)
- [ ] API 호출은 모두 `services/`를 통해 이루어지는가?
- [ ] 상태는 `store/`를 통해 관리되는가?
- [ ] ESLint 에러가 없는가? (`npm run lint`)

---

## 📞 팀원 간 인터페이스

**개발자 A가 구현하면 개발자 B가 사용할 것:**
- `useAuthStore` → 로그인 정보 가져오기
- `useEmployees` hook → 직원 목록 가져오기
- `Employee` 타입 → 직원 데이터 사용

**개발자 B가 구현하면 개발자 A가 사용할 것:**
- `useUIStore` → UI 상태 관리
- `Button`, `Input` 등 공통 UI → 모든 곳에서 사용
- `useScheduleGenerator` hook → 근무표 생성 로직

---

이 구조를 따르면 두 개발자가 **충돌 없이 효율적으로 협업**할 수 있습니다! 🚀
