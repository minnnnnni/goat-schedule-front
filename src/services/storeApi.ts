// 요일 순서 상수 (parseOpenDays, toOpenDaysCsv에서 사용)
const DAY_ORDER = ['SUN','MON','TUE','WED','THU','FRI','SAT'] as const;
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
  closedDays?: string;   // CSV e.g. "월,화"
  openDaysArr?: string[];
  createdAt?: string;    // TIMESTAMP
}

export interface EmployeeRow {
  employee_id: number;
  store_id: number;
  name: string;
  role?: string;
  active?: boolean;
}

// 백엔드 응답 타입 (snake_case)
export interface ShiftDefinitionRow {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
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
  openDaysArr?: string[];
}

export interface EmployeeView {
  id: number;
  name: string;
  role?: string;
  active?: boolean;
}


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
  // closedDays가 "월,화" 등 한글 CSV로 오면, openDays(영업 요일) 배열로 변환
  const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
  let openDaysArr: string[] = [];
  if (row.closedDays) {
    const closedArr = row.closedDays
      .split(',')
      .map(s => s.trim())
      .map(s => DAY_LABELS.find(label => s.startsWith(label)) || s)
      .filter(Boolean);
    openDaysArr = DAY_LABELS.filter(day => !closedArr.includes(day));
  } else {
    openDaysArr = DAY_LABELS;
  }
  // businessDays: parseOpenDays expects English CSV (e.g. "MON,TUE"), not 한글 배열
  // If you want to support businessDays, you need a proper CSV string (e.g. from backend)
  // For UI, use openDaysArr (한글 요일 배열)
  return {
    id: row.id,
    ownerUserId: row.ownerUserId,
    name: row.name ?? '',
    address: row.address ?? '',
    contact: row.contact ?? '',
    openTime: toHm(row.openTime),
    closeTime: toHm(row.closeTime),
    businessDays: new Array(7).fill(true), // 기본값: 모두 영업 (or adjust as needed)
    closedDays: row.closedDays,
    openDaysArr,
  };
}

function mapEmployeeRow(r: EmployeeRow): EmployeeView {
  return { id: r.employee_id, name: r.name, role: r.role, active: r.active };
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
export async function getShiftDefinitions(storeId: number): Promise<ShiftDefinitionRow[]> {
  const res = await apiClient.get(`/stores/${storeId}/shift-definitions`);
  // API 응답이 camelCase로 온다고 가정
  return (res.data as ShiftDefinitionRow[]) || [];
}

// 새 근무 시간대 추가
export interface CreateShiftDefinitionPayload {
  title?: string;
  label?: string; // sub
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
}

export async function createShiftDefinition(storeId: number, payload: CreateShiftDefinitionPayload): Promise<ShiftDefinitionRow> {
  const res = await apiClient.post<ApiResponse<ShiftDefinitionRow>>(`/stores/${storeId}/shift-definitions`, payload);
  // API 응답이 camelCase로 온다고 가정
  return res.data;
}

const storeApi = {
  getStore,
  updateStore,
  getStoreEmployees,
  getShiftDefinitions,
  createShiftDefinition,
};

export default storeApi;