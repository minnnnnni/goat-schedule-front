 "use client";

import { useState } from 'react';
import Calendar from '@/components/ui/Calendar';

type Props = {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
};

// Thin wrapper around the shared Calendar UI
export default function MonthlyCalendarView({ onDateSelect, selectedDate: controlledDate }: Props) {
  const [uncontrolledDate, setUncontrolledDate] = useState<Date | null>(null);
  const selectedDate = controlledDate ?? uncontrolledDate;

  const handleSelect = (date: Date) => {
    if (!controlledDate) setUncontrolledDate(date);
    onDateSelect?.(date);
  };

  return 
    <Calendar selectedDate={selectedDate ?? null} onDateSelect={handleSelect} />
  );
}

