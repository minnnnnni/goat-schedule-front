// In-memory mock DB for local development

export type TimeBlock = {
  id: number;
  title: string; // e.g., 타임 1
  sub: string; // e.g., 오전 / 미들 / 오후
  start: string; // HH:MM
  end: string; // HH:MM
  color: 'blue' | 'green' | 'purple';
};

export type Store = {
  id: string;
  name: string;
  openTime: string; // HH:MM
  closeTime: string; // HH:MM
  businessDays: boolean[]; // [Sun..Sat]
  timeBlocks: TimeBlock[];
};

export type Employee = {
  id: string;
  name: string;
  role?: string;
};

export type Shift = {
  id: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
  end: string; // HH:MM
  employeeIds: string[]; // supports multi-employee shifts
};

// --- seed data ---
let store: Store = {
  id: "store_1",
  name: "카페 고트",
  openTime: "09:00",
  closeTime: "23:00",
  businessDays: [true, true, true, true, true, true, false],
  timeBlocks: [
    { id: 1, title: '타임 1', sub: '오전', start: '09:00', end: '13:00', color: 'blue' },
    { id: 2, title: '타임 2', sub: '미들', start: '13:00', end: '18:00', color: 'green' },
    { id: 3, title: '타임 3', sub: '오후', start: '18:00', end: '22:00', color: 'purple' },
  ],
};

const employees: Employee[] = [
  { id: "emp_1", name: "민지" },
  { id: "emp_2", name: "현수" },
  { id: "emp_3", name: "아라" },
];

const shifts: Shift[] = [];

function ensureShiftsFor(date: string) {
  if (shifts.some((s) => s.date === date)) return;
  shifts.push(
    { id: `sh_${date}_1`, date, start: "09:00", end: "13:00", employeeIds: ["emp_1"] },
    { id: `sh_${date}_2`, date, start: "13:00", end: "18:00", employeeIds: ["emp_2", "emp_3"] },
    { id: `sh_${date}_3`, date, start: "18:00", end: "22:00", employeeIds: ["emp_1"] }
  );
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getStore(): Promise<Store> {
  await delay(150);
  return JSON.parse(JSON.stringify(store));
}

export async function getEmployees(): Promise<Employee[]> {
  await delay(150);
  return JSON.parse(JSON.stringify(employees));
}

export async function getScheduleForDate(date: string): Promise<Shift[]> {
  await delay(150);
  ensureShiftsFor(date);
  return JSON.parse(JSON.stringify(shifts.filter((s) => s.date === date)));
}

// Optional mutators if needed later
export async function renameStore(name: string): Promise<Store> {
  store = { ...store, name };
  return getStore();
}

export async function updateStore(partial: Partial<Store>): Promise<Store> {
  // Merge partial fields, including timeBlocks/businessDays changes
  store = { ...store, ...partial } as Store;
  await delay(100);
  return getStore();
}
