# Phase 1 & 2 구현 완료 ✅

API 명세서와 데이터베이스 스키마에 맞게 기초 설정과 기본 구조를 모두 구현했습니다.

## 📋 구현된 항목

### 1️⃣ 타입 정의 (`src/types/`)

```
src/types/
├── index.ts (핵심 비즈니스 타입)
│   ├── User (사용자)
│   ├── Store (매장)
│   ├── Employee (직원)
│   ├── ShiftDefinition (근무 시간대)
│   ├── Schedule (확정된 근무표)
│   ├── 그리고 요청/응답 타입들
│
└── api.ts (API 응답 형식)
    ├── ApiResponse<T>
    ├── ApiError
    └── PaginatedResponse<T>
```

**특징:**

- DB 스키마를 그대로 반영한 타입 정의
- camelCase로 통일 (JavaScript 관례)
- 모든 요청/응답 타입 포함

### 2️⃣ API 클라이언트 (`src/services/apiClient.ts`)

```typescript
✅ Axios 기본 설정 (baseURL, timeout)
✅ 요청 인터셉터: 자동으로 Bearer 토큰 추가
✅ 응답 인터셉터: 401, 403, 500 에러 처리
✅ 토큰 만료 시 로그인 페이지로 리다이렉트
```

### 3️⃣ API 서비스 (`src/services/`)

4개의 API 서비스로 모든 엔드포인트를 관리:

#### `authApi.ts`

```typescript
✅ login()       - /api/auth/login
✅ register()    - /api/auth/register
✅ logout()      - /api/auth/logout
```

#### `storeApi.ts`

```typescript
✅ getStore()    - /api/stores/{storeId}
✅ createStore() - /api/stores
✅ updateStore() - /api/stores/{storeId}
```

#### `employeeApi.ts`

```typescript
✅ getAllEmployees()   - /api/stores/{storeId}/employees
✅ getEmployee()       - /api/stores/{storeId}/employees/{employeeId}
✅ createEmployee()    - /api/stores/{storeId}/employees
✅ updateEmployee()    - /api/stores/{storeId}/employees/{employeeId}
✅ deleteEmployee()    - /api/stores/{storeId}/employees/{employeeId}
```

#### `scheduleApi.ts`

```typescript
✅ getShiftDefinitions()      - /api/stores/{storeId}/shift-definitions
✅ createShiftDefinition()    - /api/stores/{storeId}/shift-definitions
✅ deleteShiftDefinition()    - /api/stores/{storeId}/shift-definitions/{id}
✅ getSchedulesByDate()       - /api/stores/{storeId}/schedules?date=...
✅ getMonthlySchedule()       - /api/stores/{storeId}/schedules/monthly
✅ getLatestSchedule()        - /api/stores/{storeId}/schedules/latest
✅ getScheduleDetail()        - /api/stores/{storeId}/schedules/{scheduleId}
✅ generateScheduleOptions()  - /api/stores/{storeId}/schedules/generate-options
✅ confirmSchedule()          - /api/stores/{storeId}/schedules/{scheduleId}/confirm
```

### 4️⃣ 상태 관리 스토어 (`src/store/`)

#### `useAuthStore.ts` (인증 상태)

```typescript
상태:
  ├── user: User | null
  ├── token: string | null
  ├── isLoading: boolean
  └── error: string | null

액션:
  ├── login()
  ├── register()
  ├── logout()
  ├── setUser()
  └── clearError()

특징:
  ✅ localStorage에 자동 저장 (persist)
  ✅ 앱 새로고침 시에도 로그인 상태 유지
```

#### `useStore.ts` (비즈니스 데이터 캐시)

```typescript
상태:
  ├── currentStore: Store
  ├── employees: Employee[]
  ├── shifts: Schedule[]
  └── shiftDefinitions: ShiftDefinition[]

액션:
  ├── setCurrentStore()
  ├── setEmployees() / addEmployee() / updateEmployee() / removeEmployee()
  ├── setShifts() / addShift() / removeShift()
  ├── setShiftDefinitions() / addShiftDefinition() / removeShiftDefinition()
  └── clear()
```

#### `useUIStore.ts` (UI 상태)

```typescript
상태:
  ├── 모달: isModalOpen, modalTitle, modalContent
  ├── 사이드바: isSidebarOpen
  ├── 토스트: toasts[]
  └── 로딩: isLoading

액션:
  ├── openModal() / closeModal()
  ├── openSidebar() / closeSidebar() / toggleSidebar()
  ├── addToast() / removeToast() / clearToasts()
  └── setIsLoading()

특징:
  ✅ 토스트는 duration 후 자동 제거
  ✅ 토스트 타입: success, error, info, warning
```

### 5️⃣ 환경 변수 설정

`.env.local` 파일 생성:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 6️⃣ TypeScript 경로 별칭

`tsconfig.json`에 추가:

```json
"paths": {
  "@/*": ["src/*"]
}
```

이제 다음처럼 import할 수 있습니다:

```typescript
// ✅ Good
import { Employee } from "@/types";
import { employeeApi } from "@/services";
import { useAuthStore } from "@/store/useAuthStore";

// ❌ Bad (이제 필요 없음)
import { Employee } from "../../../types";
import { employeeApi } from "../../../services/employeeApi";
```

---

## 🚀 사용 방법

### 1. API 호출하기

```typescript
// src/features/employees/hooks/useEmployees.ts
import { employeeApi } from "@/services";

export function useEmployees(storeId: number) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await employeeApi.getAllEmployees(storeId);
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [storeId]);

  return { employees, loading };
}
```

### 2. 상태 관리 사용하기

```typescript
// src/app/(main)/page.tsx
import { useAuthStore } from "@/store/useAuthStore";
import { useStore } from "@/store/useStore";
import { useUIStore } from "@/store/useUIStore";

export default function HomePage() {
  // 인증 정보 가져오기
  const { user, logout } = useAuthStore();

  // 비즈니스 데이터 가져오기
  const { currentStore, employees } = useStore();

  // UI 상태 가져오기
  const { addToast } = useUIStore();

  const handleDelete = async () => {
    try {
      // API 호출
      addToast("삭제되었습니다", "success");
    } catch (error) {
      addToast("삭제 실패했습니다", "error");
    }
  };

  return <div>{/* UI */}</div>;
}
```

---

## 🔗 다음 단계 (Phase 3)

이제 각자의 기능을 개발할 준비가 완료되었습니다:

### 개발자 A (인증, 온보딩, 직원 관리)

- `src/app/(auth)/` 페이지들
- `src/app/onboarding/` 페이지들
- `src/app/(main)/employees/` 페이지들
- 해당 컴포넌트, 훅 구현

### 개발자 B (홈, 캘린더, 설정)

- `src/app/(main)/page.tsx` (홈)
- `src/app/(main)/calendar/` 페이지들
- `src/app/(main)/settings/` 페이지들
- `src/app/calendar/shift/` 페이지들
- `src/app/generate/` 페이지들
- 해당 컴포넌트, 훅, 유틸 구현

---

## 📝 주의사항

1. **토큰 저장**

   - `localStorage.setItem('access_token', token)` 사용
   - API 클라이언트가 자동으로 Bearer 토큰 추가

2. **상태 업데이트**

   - API 호출 후 항상 상태를 업데이트하세요
   - `useStore()`와 `useAuthStore()` 활용

3. **에러 처리**

   - 모든 API 호출에 try-catch 사용
   - `useUIStore().addToast()` 로 사용자에게 피드백

4. **성능**
   - 불필요한 API 호출 피하기
   - 데이터 캐싱은 `useStore()` 활용

---

## ✨ 축하합니다! 🎉

기초 설정과 기본 구조가 모두 완성되었습니다!
이제 각자의 기능을 자유롭게 구현할 수 있습니다.

질문이나 문제가 있으면 언제든 말씀해주세요! 🚀
