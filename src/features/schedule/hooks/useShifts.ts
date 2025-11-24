"use client";
import { useMemo, useEffect, useState } from 'react';
import { getEmployees } from '@/services/employeeApi';
const DEFAULT_STORE_ID = 1;
import { fetchScheduleByDate } from '@/services/scheduleApi';

export type ShiftType = '오전' | '미들' | '오후';

export interface ShiftItem {
  id: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  employeeName: string;
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

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    async function fetchData() {
      if (!date) return;
      const [empData, schedData] = await Promise.all([
        getEmployees(DEFAULT_STORE_ID),
        fetchScheduleByDate(formatDate(date)),
      ]);
      setEmployees(empData);
      setSchedule(schedData);
    }
    fetchData();
  }, [date]);

  const shifts = useMemo<ShiftItem[]>(() => {
    if (!date) return [];
    const idToName = new Map<number, string>(employees.map(e => [e.id, e.name]));
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
