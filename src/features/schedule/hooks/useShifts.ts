"use client";
import { useMemo, useEffect, useState } from 'react';
import { getEmployees } from '@/services/employeeApi';
const DEFAULT_STORE_ID = 1;
import storeApi from '@/services/storeApi';
import { fetchScheduleByDate } from '@/services/scheduleApi';

// 서버에서 받아온 근무타입을 동적으로 사용
export type ShiftType = string;

export interface ShiftItem {
  id: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  employeeName: string;
  typeLabel?: string; // 서버에서 받아온 label
}

export type Employee = {
  id: number;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  maxWeeklyHours?: number;
};

export type Schedule = {
  id: string;
  start: string;
  end: string;
  employeeIds: number[];
};

export function useShiftsForDate(date: Date | null) {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shiftDefs, setShiftDefs] = useState<Array<{id:number; name:string; startTime:string; endTime:string; color:string;}>>([]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    async function fetchData() {
      if (!date) return;
      const [empData, schedData, defs] = await Promise.all([
        getEmployees(DEFAULT_STORE_ID),
        fetchScheduleByDate(DEFAULT_STORE_ID, formatDate(date)),
        storeApi.getShiftDefinitions(DEFAULT_STORE_ID),
      ]);
      setEmployees(empData);
      setSchedule(schedData);
      setShiftDefs(
        (defs || []).map(d => ({
          id: d.id,
          name: d.name,
          startTime: d.startTime,
          endTime: d.endTime,
          color: typeof d.color === 'string' ? d.color : 'blue',
        }))
      );
    }
    fetchData();
  }, [date]);

  const shifts = useMemo<ShiftItem[]>(() => {
    if (!date) return [];
    const idToName = new Map<number, string>(employees.map(e => [e.id, e.name]));
    return (schedule || []).map((s) => {
      // shiftDefs에서 start/end가 일치하는 정의를 찾음
      const def = shiftDefs.find(d => d.startTime === s.start && d.endTime === s.end);
      const type: ShiftType = def?.name || `${s.start}-${s.end}`;
      const typeLabel = def?.name;
      const name = (s.employeeIds || []).map((id: number) => idToName.get(id) || '직원').join(', ');
      return {
        id: s.id,
        type,
        startTime: s.start,
        endTime: s.end,
        employeeName: name,
        typeLabel,
      } as ShiftItem;
    });
  }, [date, employees, schedule, shiftDefs]);

  return { shifts };
}
