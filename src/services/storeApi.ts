import apiClient from '@/services/apiClient';
import type { ApiResponse } from '@/types/api';

// -------------------- Row Types (snake_case from backend) --------------------
export interface StoreRow {
  store_id: number;
  owner_user_id: number;
  name: string;
  open_time: string;      // TIME HH:MM[:SS]
  close_time: string;     // TIME HH:MM[:SS]
  open_days?: string;     // CSV e.g. "MON,TUE,WED"
  created_at?: string;    // TIMESTAMP
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
  title?: string;       // e.g. "타임 1"
  label?: string;       // e.g. "오전" (sub)
  start_time: string;   // HH:MM[:SS]
  end_time: string;     // HH:MM[:SS]
  color?: string;       // 'blue' | 'green' | 'purple'
  created_at?: string;
}

// -------------------- View / Front Types --------------------
export interface StoreView {
  id: number;
  ownerUserId: number;
  name: string;
  openTime: string;   // HH:MM
  closeTime: string;  // HH:MM
  businessDays: boolean[]; // [SUN..SAT]
}

export interface EmployeeView {
  id: number;
  name: string;
  role?: string;
  active?: boolean;
}

export interface ShiftDefinitionView {
  id: number;
  title?: string;
  sub?: string; // label
  start: string; // HH:MM
  end: string;   // HH:MM
  color?: string;
}

// -------------------- Helpers --------------------
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
    id: row.store_id,
    ownerUserId: row.owner_user_id,
    name: row.name,
    openTime: toHm(row.open_time),
    closeTime: toHm(row.close_time),
    businessDays: parseOpenDays(row.open_days),
  };
}

function mapEmployeeRow(r: EmployeeRow): EmployeeView {
  return { id: r.employee_id, name: r.name, role: r.role, active: r.active };
}

function mapShiftDefinitionRow(r: ShiftDefinitionRow): ShiftDefinitionView {
  return {
    id: r.shift_definition_id,
    title: r.title,
    sub: r.label,
    start: toHm(r.start_time),
    end: toHm(r.end_time),
    color: r.color,
  };
}

// -------------------- API Calls --------------------
// NOTE: baseURL already includes '/api' -> endpoints use '/stores/...'

// 매장 정보 조회
export async function getStore(storeId: number): Promise<StoreView> {
  const res = await apiClient.get<ApiResponse<StoreRow>>(`/stores/${storeId}`);
  return mapStoreRow(res.data.data);
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
  const res = await apiClient.get<ApiResponse<EmployeeRow[]>>(`/stores/${storeId}/employees`);
  return (res.data.data || []).map(mapEmployeeRow);
}

// 근무 시간대(Shift Definitions) 목록 조회
export async function getShiftDefinitions(storeId: number): Promise<ShiftDefinitionView[]> {
  const res = await apiClient.get<ApiResponse<ShiftDefinitionRow[]>>(`/stores/${storeId}/shift-definitions`);
  return (res.data.data || []).map(mapShiftDefinitionRow);
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