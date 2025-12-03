import apiClient from '@/services/apiClient';

// -------------------- 1. 백엔드 데이터 타입 (DB 그대로) --------------------
export interface StoreRow {
  id: number;
  ownerUserId: number;
  name: string;
  address?: string;
  contact?: string;
  openTime: string;      // "09:00:00"
  closeTime: string;     // "22:00:00"
  closeDays?: string;    // "일요일" 또는 "토,일" (한글 요일 문자열)
}

export interface EmployeeRow {
  employee_id: number;
  store_id: number;
  name: string;
  phone?: string;        // 전화번호 추가
  role?: string;
  active?: boolean;
}

export interface ShiftDefinitionRow {
  id: number;
  name: string;
  startTime: string;     // "09:00:00"
  endTime: string;       // "13:00:00"
  color?: string;
}

// -------------------- 2. 프론트엔드 데이터 타입 (화면용) --------------------
export interface StoreView {
  id: number;
  ownerUserId: number;
  name: string;
  address?: string;
  contact?: string;
  openTime: string;      // "09:00"
  closeTime: string;     // "22:00"
  openDaysArr: string[]; // ["월", "화", "수", "목", "금"]
}

export interface EmployeeView {
  id: number;
  name: string;
  role?: string;
  active?: boolean;
}

export interface ShiftDefinitionView {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

// -------------------- 3. 헬퍼 함수 (데이터 가공) --------------------

// 시간 포맷팅 (09:00:00 -> 09:00)
function toHm(t: string): string {
  if (!t) return '';
  const parts = t.split(':');
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : t;
}

// 시간 포맷팅 (09:00 -> 09:00:00)
function fromHm(t: string): string {
  if (!t || t.split(':').length >= 3) return t; // 이미 HH:MM:SS 형식이거나 비어있으면 그대로 반환
  return `${t}:00`;
}

const ALL_KOR_DAYS = ["월", "화", "수", "목", "금", "토", "일"];

// StoreRow -> StoreView 변환
function mapStoreRow(row: StoreRow): StoreView {
  // 백엔드에서 받은 closeDays (휴무일) 문자열을 기반으로 openDaysArr (영업일) 배열 생성
  let openDaysArr: string[] = [...ALL_KOR_DAYS]; // 기본값: 모든 요일 영업
  if (row.closeDays) {
    const closedDaysSet = new Set(row.closeDays.split(',').map(day => day.trim()));
    openDaysArr = ALL_KOR_DAYS.filter(day => !closedDaysSet.has(day));
  }

  return {
    id: row.id,
    ownerUserId: row.ownerUserId,
    name: row.name ?? '',
    address: row.address ?? '',
    contact: row.contact ?? '',
    openTime: toHm(row.openTime),
    closeTime: toHm(row.closeTime),
    openDaysArr,      // 영업 요일 배열
  };
}

function mapEmployeeRow(r: EmployeeRow): EmployeeView {
  return { id: r.employee_id, name: r.name, role: r.role, active: r.active };
}

function mapShiftDefinitionRow(r: ShiftDefinitionRow): ShiftDefinitionView {
  return {
    id: r.id,
    name: r.name,
    startTime: toHm(r.startTime),
    endTime: toHm(r.endTime),
  };
}

// -------------------- 4. API 호출 함수 (여기서 요청!!) --------------------

// 매장 정보 조회
export async function getStore(storeId: number): Promise<StoreView> {
  // [중요] 요청은 반드시 함수 안에서!
  const res = await apiClient.get<StoreRow>(`/stores/${storeId}`);
  
  // 백엔드가 객체를 바로 주므로 res.data가 곧 StoreRow
  const storeData = res.data; 

  if (!storeData) {
    throw new Error('매장 정보가 없습니다.');
  }
  return mapStoreRow(storeData);
}

// 매장 정보 수정 Payload
export interface StoreUpdatePayload {
  name?: string;
  address?: string;
  contact?: string;
  openTime?: string;
  closeTime?: string;
  closeDays?: string; // "일요일" 또는 "토,일" 형태로 보냄
}

// 매장 정보 수정
export async function updateStore(storeId: number, viewPatch: Partial<StoreView>): Promise<StoreView> {
  // viewPatch에서 받은 openDaysArr를 기반으로 closed_days 문자열 생성
  let closedDaysPayload: string | undefined = undefined;
  if (viewPatch.openDaysArr) {
    closedDaysPayload = ALL_KOR_DAYS.filter(day => !viewPatch.openDaysArr!.includes(day)).join(',');
  }

  const payload: Partial<StoreUpdatePayload> = {};
  if (viewPatch.name !== undefined) payload.name = viewPatch.name;
  if (viewPatch.address !== undefined) payload.address = viewPatch.address;
  if (viewPatch.contact !== undefined) payload.contact = viewPatch.contact;
  if (viewPatch.openTime !== undefined) payload.openTime = viewPatch.openTime;
  if (viewPatch.closeTime !== undefined) payload.closeTime = viewPatch.closeTime;
  if (closedDaysPayload !== undefined) payload.closeDays = closedDaysPayload;
  
  const res = await apiClient.put<StoreRow>(`/stores/${storeId}`, payload);
  return mapStoreRow(res.data);
}

// 매장 전체 직원 조회
export async function getStoreEmployees(storeId: number): Promise<EmployeeView[]> {
  const res = await apiClient.get<EmployeeRow[]>(`/stores/${storeId}/employees`);
  // 배열이 바로 옴
  return (res.data || []).map(mapEmployeeRow);
}

// 근무 시간대 목록 조회
export async function getShiftDefinitions(storeId: number): Promise<ShiftDefinitionView[]> {
  const res = await apiClient.get<ShiftDefinitionRow[]>(`/stores/${storeId}/shift-definitions`);
  return (res.data || []).map(mapShiftDefinitionRow);
}

// 새 근무 시간대 추가 Payload
export interface CreateShiftDefinitionPayload {
  name: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
}

// 새 근무 시간대 추가
export async function createShiftDefinition(storeId: number, payload: CreateShiftDefinitionPayload): Promise<ShiftDefinitionView> {
  const apiPayload = {
    ...payload,
    startTime: fromHm(payload.startTime),
    endTime: fromHm(payload.endTime),
  };
  const res = await apiClient.post<ShiftDefinitionRow>(`/stores/${storeId}/shift-definitions`, apiPayload);
  return mapShiftDefinitionRow(res.data);
}

// 근무 시간대 삭제
export async function deleteShiftDefinition(storeId: number, shiftDefinitionId: number): Promise<void> {
  await apiClient.delete(`/stores/${storeId}/shift-definitions/${shiftDefinitionId}`);
}


const storeApi = {
  getStore,
  updateStore,
  getStoreEmployees,
  getShiftDefinitions,
  createShiftDefinition,
  deleteShiftDefinition,
};

export default storeApi;