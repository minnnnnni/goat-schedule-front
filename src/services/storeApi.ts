import apiClient from '@/services/apiClient';
import type { ApiResponse } from '@/types/api';

// -------------------- Row Types (snake_case from backend) --------------------
export interface StoreRow {
  id: number;
  ownerUserId: number;
  name: string;
  address?: string;
  contact?: string;
  openTime: string;      // TIME HH:MM[:SS]
  closeTime: string;     // TIME HH:MM[:SS]
  openDays?: string;     // CSV e.g. "MON,TUE,WED"
  createdAt?: string;    // TIMESTAMP
}

export interface EmployeeRow {
  employee_id: number;
  store_id: number;
  name: string;
  role?: string;
  active?: boolean;
}

export interface ShiftDefinitionRow {
  shift_definition_id: number;
  store_id: number;
  name: string;           // API 응답에 맞게 추가
  title?: string;         // 하위 호환
  label?: string;         // 하위 호환
  start_time: string;     // HH:MM[:SS]
  end_time: string;       // HH:MM[:SS]
  color: string;         // 'blue' | 'green' | 'purple'
}

// -------------------- View / Front Types --------------------
export interface StoreView {
  id: number;
  ownerUserId: number;
  name: string;
  address?: string;
  contact?: string;
  openTime: string;   // HH:MM
  closeTime: string;  // HH:MM
  businessDays: boolean[]; // [SUN..SAT]
  closedDays?: string; // CSV e.g. "월,화"
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
  color: string;
}

const DAY_ORDER = ['SUN','MON','TUE','WED','THU','FRI','SAT'] as const;

function toHm(t: string): string {
  if (!t) return '';
  const parts = t.split(':');
  return parts.length >= 2 ? `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}` : t;
}

function parseOpenDays(csv?: string): boolean[] {
  const flags = new Array(7).fill(false) as boolean[];
  if (!csv) return flags;
  const set = new Set(csv.split(',').map(s => s.trim().toUpperCase()));
  DAY_ORDER.forEach((d, idx) => { if (set.has(d)) flags[idx] = true; });
  return flags;
}

function toOpenDaysCsv(days: boolean[]): string {
  return days
    .map((on, idx) => (on ? DAY_ORDER[idx] : null))
    .filter(Boolean)
    .join(',');
}

function mapStoreRow(row: StoreRow): StoreView {
  return {
    id: row.id,
    ownerUserId: row.ownerUserId,
    name: row.name ?? '',
    address: row.address ?? '',
    contact: row.contact ?? '',
    openTime: toHm(row.openTime),
    closeTime: toHm(row.closeTime),
    businessDays: parseOpenDays(row.openDays),
  };
}

function mapEmployeeRow(r: EmployeeRow): EmployeeView {
  return { id: r.employee_id, name: r.name, role: r.role, active: r.active };
}

function mapShiftDefinitionRow(r: ShiftDefinitionRow): ShiftDefinitionView {
  // 컬러가 없으면 기본값을 순환할당 (blue, green, purple)
  const defaultColors = ['blue', 'green', 'purple'];
  let color = r.color;
  if (!color) {
    // id 기반으로 순환
    color = defaultColors[r.shift_definition_id % defaultColors.length];
  }
  return {
    id: r.shift_definition_id,
    name: r.name ?? r.title ?? '',
    startTime: toHm(r.start_time ?? ''),
    endTime: toHm(r.end_time ?? ''),
    color,
  };
}

// -------------------- API Calls --------------------
// NOTE: baseURL already includes '/api' -> endpoints use '/stores/...'

// 매장 정보 조회
  const res = await apiClient.get(`/stores/${1}`);

export async function getStore(storeId: number): Promise<StoreView> {
    // (이 부분 삭제: data 선언 전에 접근 불가)
  console.debug('[storeApi.getStore] 응답:', res.data);
    let data = res.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('매장 정보 JSON 파싱 오류:', data);
        throw new Error('매장 정보 파싱 오류');
      }
    }
  if (!data) {
    console.error('[storeApi.getStore] 매장 정보 응답이 없습니다:', data);
    throw new Error('매장 정보가 없습니다.');
  }
  console.debug('[storeApi.getStore] 파싱된 데이터:', data);
  const storeData = data.store ?? data;
  return mapStoreRow(storeData);
}

// 매장 정보 수정 (PUT 전체 갱신 가정)
export interface StoreUpdatePayload {
  name?: string;
  open_time?: string;    // HH:MM
  close_time?: string;   // HH:MM
  open_days?: string;    // CSV
}

export async function updateStore(storeId: number, viewPatch: Partial<StoreView>): Promise<StoreView> {
  const payload: StoreUpdatePayload = {
    name: viewPatch.name,
    open_time: viewPatch.openTime,
    close_time: viewPatch.closeTime,
    open_days: viewPatch.businessDays ? toOpenDaysCsv(viewPatch.businessDays) : undefined,
  };
  const res = await apiClient.put<ApiResponse<StoreRow>>(`/stores/${storeId}`, payload);
  return mapStoreRow(res.data.data);
}

// 매장 전체 직원 조회
export async function getStoreEmployees(storeId: number): Promise<EmployeeView[]> {
  const res = await apiClient.get(`/stores/${storeId}/employees`);
  return (res.data || []).map(mapEmployeeRow);
}

// 근무 시간대(Shift Definitions) 목록 조회
export async function getShiftDefinitions(storeId: number): Promise<ShiftDefinitionView[]> {
  const res = await apiClient.get(`/stores/${storeId}/shift-definitions`);
  return (res.data || []).map(mapShiftDefinitionRow);
}

// 새 근무 시간대 추가
export interface CreateShiftDefinitionPayload {
  title?: string;
  label?: string; // sub
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  color?: string;
}

export async function createShiftDefinition(storeId: number, payload: CreateShiftDefinitionPayload): Promise<ShiftDefinitionView> {
  const res = await apiClient.post<ApiResponse<ShiftDefinitionRow>>(`/stores/${storeId}/shift-definitions`, payload);
  return mapShiftDefinitionRow(res.data.data);
}

const storeApi = {
  getStore,
  updateStore,
  getStoreEmployees,
  getShiftDefinitions,
  createShiftDefinition,
};

export default storeApi;