
'use client';

// 로그인 체크 및 임시 토큰 삽입 (개발용)
if (typeof window !== 'undefined') {
  // 개발용: 임시 토큰 강제 삽입 (실제 토큰 값으로 교체 필요)
  if (!localStorage.getItem('access_token')) {
    localStorage.setItem('access_token', 'test-access-token'); // 실제 토큰 값으로 교체
  }
  // 토큰 없으면 로그인 페이지로 이동
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = '/login';
    // SSR 환경에서는 return null 필요
  }
}

import { useState } from 'react';
import Calendar from '@/components/ui/Calendar';
import DailyScheduleSection from '@/components/schedule/DailyScheduleSection';
import EmployeeAssignModal from '@/features/schedule/components/EmployeeAssignModal';
import { useShiftsForDate } from '@/features/schedule/hooks/useShifts';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { shifts } = useShiftsForDate(selectedDate);
  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<'오류'|'확인'|'초기값'|null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddShift = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTime(null);
    setSelectedEmployee("");
  };

  const handleSetTime = (t: string) => 
    setSelectedTime(t as "오류" | "확인" | "초기값" | null);






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
      />

      {/* 알바생 추가/수정 모달 (분리된 컴포넌트) */}
      <EmployeeAssignModal
        open={showModal}
        onClose={handleModalClose}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setSelectedTime={handleSetTime}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />
    </div>
  );
}

