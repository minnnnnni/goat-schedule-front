# Part Time Scheduler

**사장님들을 위한 가장 간편한 알바생 근무표 관리 및 자동 생성 서비스입니다.**

본 프로젝트는 Next.js 기반의 타입스크립트 웹 애플리케이션으로, 사장님이 매장 정보를 설정하고, 알바생을 등록하며, 캘린더 기반으로 근무표를 손쉽게 생성 및 관리할 수 있도록 돕습니다.

---

##  주요 기능

* **인증:** 사장님 전용 회원가입 및 로그인 기능
* **직원 관리:** 알바생 정보 (이름, 연락처, 근무 가능 시간) 등록 및 수정/삭제
* **근무표 관리:**
    * 직관적인 UI
    * 일별/주별 근무표 생성 및 수정
    * 근무표 게시 및 알림 (예정)
* **매장 관리:** 매장 기본 정보 (오픈/마감 시간, 정기 휴일) 설정

---
## 📋 주요 기능 상세 및 화면 구성 (App Flow)

워크프레임 및 제공된 디렉토리 구조를 기반으로 앱의 주요 기능과 페이지 흐름을 정리했습니다.

### 1. 인증 (Authentication)

* **로그인 페이지 (`/login`)**
    * *경로: `src/app/(auth)/login/page.tsx`*
    * 소셜 로그인(카카오 등)을 기본으로 제공합니다.
* **이메일 로그인 (`/email-login`)**
    * *경로: `src/app/(auth)/email-login/page.tsx`*
    * '다른 이메일로 시작하기' 시 진입하는 페이지로, 아이디/비밀번호 입력 폼이 있습니다.
* **회원가입 (`/signup`)**
    * *경로: `src/app/(auth)/signup/page.tsx`*
    * 이메일, 비밀번호 등을 입력받는 회원가입 폼입니다.

### 2. 초기 설정 (Onboarding)

* **매장 정보 입력 (`/onboarding/store-setup`)**
    * *경로: `src/app/onboarding/store-setup/page.tsx`*
    * 회원가입 또는 최초 로그인 직후, 매장 정보가 없을 시 진입하는 페이지입니다.
    * 매장명, 영업 요일, 오픈/마감 시간 등을 설정합니다.

### 3. 메인 기능 (Main App)

* **메인 레이아웃 (공통)**
    * *적용 경로: `/`, `/calendar`, `/employees`, `/settings`*
    * *파일: `src/app/(main)/layout.tsx`*
    * `src/components/layout`의 **상단 헤더(Header)**와 **하단 네비게이션(BottomNavigation)**이 공통으로 적용되는 (main) 라우트 그룹입니다.
* **홈 화면 (`/`)**
    * *경로: `src/app/(main)/page.tsx`*
    * 메인 대시보드 역할을 하며, 일별 근무표(`DailyScheduleView`) 요약 및 '근무표 자동 생성' 팝업(`GenerateSchedulePopup`)을 제공합니다.
* **근무표 자동 생성 결과 (`/generate/results`)**
    * *경로: `src/app/generate/results/page.tsx`*
    * 홈 화면에서 자동 생성 요청 시 이동하는 페이지로, 생성된 여러 근무표 옵션(`ScheduleResultPicker`) 중 하나를 선택하고 확정합니다.

### 4. 근무표 관리 (Calendar & Shift)

* **월간 캘린더 (`/calendar`)**
    * *경로: `src/app/(main)/calendar/page.tsx`*
    * 월간 근무 현황(`MonthlyCalendarView`)을 한눈에 볼 수 있습니다.
    * 특정 날짜 선택 시, 하단에 해당일의 근무자 목록(`DailyShiftList`)이 나타납니다.
* **근무 추가 (`/calendar/shift/add`)**
    * *경로: `src/app/calendar/shift/add/page.tsx`*
    * 캘린더에서 특정 날짜에 수동으로 근무(시프트)를 추가하는 페이지입니다.
* **근무 수정 (`/calendar/shift/[shiftId]`)**
    * *경로: `src/app/calendar/shift/[shiftId]/page.tsx`*
    * 기존 근무(시프트)의 상세 정보를 수정하거나 삭제하는 동적 라우트 페이지입니다.

### 5. 알바생 관리

* **알바생 목록 (`/employees`)**
    * *경로: `src/app/(main)/employees/page.tsx`*
    * 등록된 알바생 목록(`EmployeeList`)을 보여주며, '알바생 추가' 버튼을 통해 신규 등록 폼(`EmployeeForm`)으로 연결됩니다.
* **알바생 추가/수정**
    * *관련 컴포넌트: `src/features/employees/components/EmployeeForm.tsx`*
    * 알바생 개인정보, 근무 가능 요일/시간 등을 입력받는 폼 컴포넌트입니다.

### 6. 설정

* **설정 페이지 (`/settings`)**
    * *경로: `src/app/(main)/settings/page.tsx`*
    * 매장 정보 수정(`StoreInfoView`) 및 로그아웃(`LogoutButton`) 기능을 제공합니다.

---




##  기술 스택

### 프론트엔드 (Client)

* **Framework:** Next.js v16+ (App Router)
* **Library:** React 
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Data Fetching:** Axios (or Fetch API)

### 개발 환경

* **Runtime:** Node.js (v22.x)
* **Package Manager:** npm

---

## 프로젝트 시작하기

프로젝트를 로컬 환경에서 실행하는 방법입니다.

1.  **레포지토리 클론**
    ```bash
    git clone https://github.com/minnnnnni/goat-schedule-front
    cd goat-schedule-front
    ```

2.  **Node.js 버전 확인 (중요)**
    본 프로젝트는 Node.js 22 버전을 기준으로 합니다. `nvm` 사용을 권장합니다.
    ```bash
    # nvm이 설치되어 있을 경우
    nvm use
    # (만약 .nvmrc 파일이 없다면)
    nvm install 22
    nvm use 22
    ```

3.  **의존성 패키지 설치 (필수!)**
    `package-lock.json`을 기반으로 모든 팀원이 동일한 버전의 패키지를 설치합니다.
    ```bash
    npm install
    ```

4.  **환경 변수 설정(추후 추가예정)**
    `.env.example` 파일을 복사하여 `.env.local` 파일을 생성하고, 내부에 필요한 API 서버 주소 등의 변수를 입력합니다.
    ```bash
    cp .env.example .env.local
    ```

5.  **개발 서버 실행**
    ```bash
    npm run dev
    ```

6.  **브라우저 확인**
    `http://localhost:3000`으로 접속하여 실행 화면을 확인합니다.

---

## 협업 규칙 (필독!)

우리 팀은 **GitHub Flow** 전략을 사용합니다. 프로젝트의 안정성을 위해 아래 규칙을 반드시 준수합니다.

### 1. 브랜치 전략 (Branch)

* **`main` 브랜치:** **배포 가능한(항상 작동하는)** 브랜치입니다.
* **`main` 브랜치에 대한 직접 `push`를 절대 금지합니다.** (GitHub에서 **Protected Branch**로 설정 완료)
* 모든 기능 개발 및 버그 수정은 **`feature` 브랜치**에서 진행합니다.

## 👩‍💻 협업 규칙 (필독!)

### Next.js 프로젝트 2인 협업 가이드

두 명의 프론트엔드 개발자가 성공적으로 협업하기 위한 핵심은 **'명확한 역할 분담'**과 **'일관된 코드 스타일 유지'**입니다. `nextjs_directory_structure.md`에서 정의한 구조는 이를 위한 훌륭한 기반이 됩니다.

---

### 1. Git 브랜치 전략: 단순하고 명확하게

2인 규모에서는 복잡한 Git-flow보다 단순한 **GitHub Flow** 또는 **간소화된 Git-flow**를 추천합니다.

* **`main` (또는 `master`)**: 항상 배포 가능한 프로덕션 코드.
* **`develop`**: `main`에서 따온 메인 개발 브랜치. 모든 기능 브랜치는 `develop`을 기준으로 생성하고, `develop`으로 머지(Merge)합니다.
* **`feature/{기능이름}`**: 각자 개발할 기능을 이 브랜치에서 작업합니다.
    * *예: `feature/auth-kakao`, `feature/schedule-generation`*

**✅ 작업 흐름 예시:**

1.  항상 `develop` 브랜치를 최신 상태로 받습니다. 

    ```bash
    git pull origin develop
    ```
2.  새 기능 개발을 위해 브랜치를 생성합니다.

    ```bash
    git checkout -b feature/login-ui
    ```
3.  기능을 개발하고 커밋합니다.
4.  작업이 완료되면 `develop` 브랜치로 **Pull Request(PR)** 를 생성합니다.
5.  **[필수]** 동료 개발자가 코드를 리뷰하고 **'Approve'** 합니다.
6.  리뷰가 완료되면 `develop` 브랜치에 머지합니다.

---

### 2. 업무 분담 방식: '기능(Feature)' 단위로 분리

`nextjs_directory_structure.md`의 `features` 폴더는 업무 분담을 위한 최고의 기준점입니다.


* **기능(feature) 단위로 분할:**
    * **개발자 A:** 인증(Auth), 온보딩(Onboarding), 알바생 관리(Employees)
    * **개발자 B:** 홈(Home), 캘린더/스케줄(Schedule), 설정(Settings)

**👍 이렇게 분리하면 좋은 이유:**

* 각자 맡은 `features` 폴더 내부의 `components`, `hooks` 등을 책임지고 개발합니다.
* 서로 다른 파일을 수정하므로 **충돌(Conflict)이 최소화**됩니다.
* `app/(main)/employees/page.tsx`와 `features/employees/`는 같은 개발자가 맡는 것이 효율적입니다.

> **⚠️ 주의:** "한 명은 UI, 한 명은 로직"처럼 **계층(Layer)별로 분리하는 것은 피해야 합니다.** 의존성이 높아져 한 명이 놀고 한 명은 바쁜 병목 현상이 발생하기 쉽습니다.

---

### 3. 코드 품질 및 일관성 유지 (가장 중요)

두 사람이 다른 스타일로 코드를 짜면 나중에 유지보수가 재앙이 됩니다.

**1. Pull Request (PR)는 필수입니다.**
`develop` 브랜치에 코드를 합치기 전, **반드시 동료의 코드 리뷰**를 거쳐야 합니다. 이는 버그를 잡는 것뿐만 아니라, 서로 "이 기능은 이렇게 만들었구나" 하고 코드를 공유하는 가장 좋은 방법입니다.

**2. Prettier와 ESLint를 설정하세요.**
* **Prettier:** 코드 포맷터(줄 바꿈, 띄어쓰기 등)를 통일합니다. 저장 시 자동으로 코드가 정리되도록 설정하세요.
* **ESLint:** 코드 문법 오류나 잠재적 버그를 잡습니다. `nextjs-recomended` 룰셋을 기본으로 사용하세요.
* **이점:** 코드 스타일에 대한 모든 논쟁(예: "세미콜론 찍을까요?")이 사라지고, 리뷰 시 로직에만 집중할 수 있습니다.

**3. `src/types`를 먼저 정의하세요.**
API 응답, `Employee`, `Store` 같은 핵심 데이터 타입을 `src/types/index.ts`에 먼저 정의하고 시작하세요. 두 개발자가 동일한 데이터 타입을 바라보고 개발할 수 있으며, TypeScript의 이점을 극대화할 수 있습니다. (`any` 타입 사용을 지양하세요.)

**4. 공통 컴포넌트 및 API 관리**
* **`src/components/ui/` (공통 UI)**
    * `Button`, `Input`, `Modal` 등 **두 사람 모두가 사용할 것 같은** 컴포넌트만 이곳에 만듭니다.
    * 만약 개발자 A가 `features/auth`에서만 쓰는 버튼을 만든다면, `features/auth/components/`에 만드는 것이 좋습니다.
* **`src/services/` (API 호출)**
    * 모든 API 호출은 이 폴더의 파일(`authApi.ts`, `scheduleApi.ts` 등)을 통해 이루어지도록 규칙을 정하세요.
    * API 명세가 나오기 전이라면, **Mock Service Worker (MSW)** 같은 도구를 사용해 가짜 API를 만들어두는 것이 좋습니다.

**5. 소통 및 작업 관리**
* **도구:** GitHub Issues, Notion, Trello, Asana 등 간단한 칸반보드 툴을 사용해 '할 일', '진행 중', '완료'를 공유하세요.
* **소통:** 매일 10분 정도의 짧은 **싱크업(Sync-up) 미팅(데일리 스크럼)** 을 통해 "어제 한 일, 오늘 할 일, 막힌 부분"을 공유하면 서로의 진행 상황을 파악하는 데 큰 도움이 됩니다.

---

### 🌟 요약

1.  **Git:** `develop` 브랜치 기준으로 `feature` 브랜치를 따서 작업하고, `develop`으로 **PR(코드 리뷰 필수)** 보낸다.
2.  **분담:** `features` 폴더 기준으로 기능을 나눠 맡는다.
3.  **품질:** Prettier, ESLint로 코드 스타일을 강제하고, `src/types`를 공유한다.
### 3. 패키지 관리 (NPM) ***(중요!!! 패키지 충돌 예방)***

* **`package-lock.json`의 중요성:** 모든 팀원의 패키지 버전을 통일하는 **'영수증'** 파일입니다.
* **패키지 설치/삭제 시:**
    * `npm install [패키지명]` 또는 `npm uninstall [패키지명]` 명령어를 사용합니다.
    * 명령어 실행 후 변경된 **`package.json`**과 **`package-lock.json`** 두 파일을 **반드시 함께 커밋**해야 합니다.
* **`git pull` 직후:**
    * `pull`을 받은 후 `package-lock.json` 파일에 변경 사항이 있다면, **항상 `npm install`을 다시 실행**하여 `node_modules`를 최신 상태로 동기화합니다.


---

## 팀원

GMG Frontend Team

