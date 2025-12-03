# 📋 역할 분담 정리 ✅

API 명세서와 요구사항에 따라 역할을 명확히 정리했습니다.

---

## 👨‍💼 **개발자 A (인증, 온보딩, 직원 관리)**

### 📦 담당할 것

#### 타입 정의
- `User` - 사용자 정보
- `LoginRequest`, `RegisterRequest` - 인증 요청
- `Employee`, `CreateEmployeeRequest`, `UpdateEmployeeRequest` - 직원 관련
- `CreateStoreRequest` - 매장 생성 요청
- `ShiftDefinition` 관련 - 새 근무 시간대 추가/수정

#### API 서비스
- `src/services/authApi.ts` - 로그인, 회원가입, 로그아웃
- `src/services/employeeApi.ts` - 직원 조회, 생성, 수정, 삭제
- `src/services/` - ShiftDefinition 생성/수정 엔드포인트 추가

#### 스토어
- `src/store/useAuthStore.ts` - 사용자 인증 정보 관리

#### 페이지 및 컴포넌트
- `/login` - 로그인 페이지
- `/email-login` - 이메일 로그인
- `/signup` - 회원가입
- `/onboarding/store-setup` - 매장 설정
- `/employees` - 직원 관리 페이지

#### Hook 및 유틸
- `useEmployees.ts` - 직원 데이터 관리
- 폼 검증, 유틸리티 함수 등

---

## 🎯 **개발자 B (홈, 캘린더, 설정)** ← 당신!

### 📦 담당할 것

#### 타입 정의 (이미 완성됨)
```typescript
✅ Store (매장 정보)
✅ Schedule (근무 항목)
✅ ShiftDefinition (근무 시간대)
✅ GenerateScheduleOptionsRequest (생성 요청)
✅ ScheduleOption (생성 옵션)
✅ MonthlyScheduleSummary (월간 요약)
✅ ConfirmScheduleRequest (확정 요청)
```

#### API 서비스 (이미 구현됨)
```typescript
✅ src/services/scheduleApi.ts
   - getShiftDefinitions()      // 근무 시간대 조회
   - getSchedulesByDate()       // 특정 날짜 근무표
   - getMonthlySchedule()       // 월간 요약
   - getLatestSchedule()        // 최근 근무표
   - getScheduleDetail()        // 상세 조회
   - generateScheduleOptions()  // AI 생성 요청
   - confirmSchedule()          // 근무표 확정

✅ src/services/storeApi.ts
   - getStore()    // 매장 정보 조회
   - updateStore() // 매장 정보 수정
```

#### 스토어 (이미 구현됨)
```typescript
✅ src/store/useStore.ts
   - currentStore: Store
   - employees: Employee[]
   - shifts: Schedule[]
   - shiftDefinitions: ShiftDefinition[]
   
   액션:
   - setCurrentStore()
   - setEmployees()
   - setShifts() / addShift() / removeShift()
   - setShiftDefinitions()

✅ src/store/useUIStore.ts
   - 모달, 사이드바, 토스트, 로딩 상태
```

#### 페이지 및 컴포넌트 (구현 필요)
```
홈 (Home)
├── src/app/(main)/page.tsx
│   └── src/features/home/components/
│       ├── DailyScheduleView.tsx
│       └── GenerateSchedulePopup.tsx

캘린더 (Calendar/Schedule)
├── src/app/(main)/calendar/page.tsx
│   └── src/features/schedule/components/
│       ├── MonthlyCalendarView.tsx
│       └── DailyShiftList.tsx
├── src/app/calendar/shift/add/page.tsx
│   └── ShiftForm.tsx
├── src/app/calendar/shift/[shiftId]/page.tsx
│   └── ShiftForm.tsx
└── src/app/generate/results/page.tsx
    └── ScheduleResultPicker.tsx

설정 (Settings)
├── src/app/(main)/settings/page.tsx
│   └── src/features/settings/components/
│       ├── StoreInfoView.tsx
│       └── LogoutButton.tsx
```

#### Hook 및 유틸 (구현 필요)
```
src/features/schedule/
├── hooks/
│   └── useScheduleGenerator.ts    // 근무표 생성 로직
└── utils/
    └── scheduleAlgorithm.ts       // 스케줄링 알고리즘

src/features/home/
└── hooks/
    └── (필요시 추가)

src/features/settings/
└── hooks/
    └── (필요시 추가)
```

---

## 🔄 공동으로 사용할 것

### 공통 UI 컴포넌트 (`src/components/`)

#### 이미 있는 것
- `components/layout/Header.tsx`
- `components/layout/BottomNavigation.tsx`
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Modal.tsx`
- `components/ui/Sheet.tsx`
- `components/ui/Calendar.tsx`

#### 필요시 추가할 것
- Toast 컴포넌트 (useUIStore와 연동)
- Select 컴포넌트
- Tabs 컴포넌트
- 등등...

### 공통 스토어 (`src/store/`)

```typescript
// 개발자 B가 사용
import { useStore } from '@/store/useStore';
import { useUIStore } from '@/store/useUIStore';

// 개발자 A가 사용
import { useAuthStore } from '@/store/useAuthStore';
```

### 공통 API 클라이언트 (`src/services/apiClient.ts`)

```typescript
// 자동으로 처리됨:
✅ 토큰 추가
✅ 에러 처리
✅ 401 시 로그인으로 리다이렉트
```

---

## ✅ 현재 상태

| 항목 | 상태 | 담당자 |
|------|------|--------|
| **타입 정의** | ✅ 완료 | - |
| **API 클라이언트** | ✅ 완료 | - |
| **API 서비스** | ✅ 개발자B 부분만 | 개발자 B |
| **스토어** | ✅ 개발자B 부분만 | 개발자 B |
| **Auth API** | ⏳ 미구현 | 개발자 A |
| **Employee API** | ⏳ 미구현 | 개발자 A |
| **Auth 스토어** | ⏳ 미구현 | 개발자 A |

---

## 🚀 개발자 B 다음 단계

### Phase 3: 메인 기능 구현

1. **메인 레이아웃 완성**
   ```
   - Header 구현 (로고, 사용자 정보 등)
   - BottomNavigation 구현 (탭 네비게이션)
   - (main)/layout.tsx 구성
   ```

2. **홈 페이지 구현**
   ```
   - DailyScheduleView: 오늘의 근무표 표시
   - GenerateSchedulePopup: 자동 생성 팝업
   ```

3. **캘린더 페이지 구현**
   ```
   - MonthlyCalendarView: 월간 캘린더
   - DailyShiftList: 일별 근무자 목록
   - ShiftForm: 근무 추가/수정 폼
   ```

4. **설정 페이지 구현**
   ```
   - StoreInfoView: 매장 정보 조회 및 수정
   - LogoutButton: 로그아웃
   ```

5. **근무표 자동 생성**
   ```
   - useScheduleGenerator Hook
   - scheduleAlgorithm 로직
   - ScheduleResultPicker 컴포넌트
   ```

---

## 📝 중요: 팀워크를 위한 약속

### 개발자 A가 구현할 때 정의할 타입
```typescript
// 이것들을 개발자 A가 src/types/index.ts에 추가할 때
// 당신은 그걸 참고해서 자신의 코드를 작성하세요

export interface User { ... }
export interface LoginRequest { ... }
export interface RegisterRequest { ... }
export interface Employee { ... }
export interface CreateEmployeeRequest { ... }
export interface UpdateEmployeeRequest { ... }
export interface CreateShiftDefinitionRequest { ... }
export interface UpdateShiftDefinitionRequest { ... }
```

### 개발자 A가 구현할 때 추가할 API 메서드
```typescript
// src/services/scheduleApi.ts에 다음 메서드들이 추가될 것:
- createShiftDefinition()   // 근무 시간대 생성
- deleteShiftDefinition()   // 근무 시간대 삭제
- updateShiftDefinition()   // 근무 시간대 수정 (선택사항)
```

### 타입/API 충돌 피하기
```typescript
// ✅ 파일별로 명확히 구분:
// 당신: scheduleApi, storeApi만 import
import { scheduleApi, storeApi } from '@/services';

// 팀원: authApi, employeeApi만 구현
export { authApi } from './authApi';
export { employeeApi } from './employeeApi';
```

---

## 🎓 요약

### 당신의 작업 범위 (개발자 B)
- **3개 기능:** Home, Calendar/Schedule, Settings
- **API:** scheduleApi, storeApi 사용
- **스토어:** useStore, useUIStore 사용
- **페이지:** 7개 페이지 구현
- **컴포넌트:** 6개 주요 컴포넌트 구현

### 팀원의 작업 범위 (개발자 A)
- **3개 기능:** Auth, Onboarding, Employees
- **API:** authApi, employeeApi 구현
- **스토어:** useAuthStore 구현
- **페이지:** 5개 페이지 구현
- **컴포넌트:** 관련 컴포넌트 구현

### 공동으로 사용하는 것
- **공통 타입:** src/types/
- **공통 API:** apiClient (Axios 설정)
- **공통 스토어:** useUIStore
- **공통 UI:** src/components/

---

완벽합니다! 이제 각자 정해진 기능을 자유롭게 구현하면 됩니다! 🚀

필요하면 언제든지 물어봐주세요! 😊
