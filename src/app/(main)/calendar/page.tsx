'use client';

import { useState } from 'react';
import Calendar from '@/components/ui/Calendar';
import DailyScheduleSection from '@/components/schedule/DailyScheduleSection';
import { useShiftsForDate } from '@/features/schedule/hooks/useShifts';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { shifts, loading } = useShiftsForDate(selectedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddShift = () => {
    // TODO: 근무 추가 모달 또는 페이지로 이동
    alert('근무 추가 기능은 추후 구현됩니다');
  };

  // shifts는 훅에서 관리 (현재는 목 데이터)

  return (
    <div className="max-w-[600px] mx-auto px-4 py-5">

      {/* 월간 캘린더 위젯 (헤더와의 간격 추가) */}
      <div className="mb-8">
        <br/>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* 선택된 날짜의 일간 스케줄 - 홈 스타일 */}
      <DailyScheduleSection
        selectedDate={selectedDate}
        shifts={shifts}
        onAddShift={handleAddShift}
        loading={loading}
      />
    </div>
  );
}

