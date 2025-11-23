"use client";
import { useEffect, useState } from 'react';
import { getStore, getEmployees, getScheduleForDate, type Employee, type Shift, type Store } from './db';

export function useDummyStore() {
  const [data, setData] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    setLoading(true);
    setData(await getStore());
    setLoading(false);
  };
  useEffect(() => { (async () => { await refresh(); })(); }, []);
  return { store: data, loading, refresh };
}

export function useDummyEmployees() {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { setLoading(true); setData(await getEmployees()); setLoading(false); })(); }, []);
  return { employees: data, loading };
}

export function useDummySchedule(date: Date | null) {
  const [data, setData] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => { (async () => { if (!date) return; setLoading(true); setData(await getScheduleForDate(date.toISOString().slice(0,10))); setLoading(false); })(); }, [date]);
  return { schedule: data, loading };
}
