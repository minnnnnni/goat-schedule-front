"use client";
import { useMemo } from 'react';
// import { formatDateKey } from '../utils/date';
import { useDummyEmployees, useDummySchedule } from '@/app/dummy/useDummyData';

export type ShiftType = '오전' | '미들' | '오후';

export interface ShiftItem {
  id: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  employeeName: string;
}

export function useShiftsForDate(date: Date | null) {
  const { schedule } = useDummySchedule(date);
  const { employees } = useDummyEmployees();

  const shifts = useMemo<ShiftItem[]>(() => {
    if (!date) return [];
    const idToName = new Map<string, string>(employees.map(e => [e.id, e.name]));
    return (schedule || []).map((s) => {
      const type: ShiftType = s.start === '09:00' ? '오전' : s.start === '13:00' ? '미들' : '오후';
      const name = (s.employeeIds || []).map((id: string) => idToName.get(id) || '직원').join(', ');
      return {
        id: s.id,
        type,
        startTime: s.start,
        endTime: s.end,
        employeeName: name,
      } as ShiftItem;
    });
  }, [date, employees, schedule]);

  return { shifts };
}
