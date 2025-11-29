'use client';

import { useState } from 'react';
import Calendar from '@/components/ui/Calendar';
import DailyScheduleSection from '@/components/schedule/DailyScheduleSection';
import { useEffect } from 'react';
import EmployeeAssignModal from '@/features/schedule/components/EmployeeAssignModal';
import { useShiftsForDate } from '@/features/schedule/hooks/useShifts';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { shifts } = useShiftsForDate(selectedDate);
  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<'오전'|'미들'|'오후'|null>(null);
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

  // 임시 알바생 목록
  const employees = ["김민수", "홍길동", "이수진"];

  // 시간대별 정보
  const timeBlocks = [
    { type: "오전", color: "#e3edff", label: "오전", time: "09:00 - 13:00" },
    { type: "미들", color: "#d6f5d6", label: "미들", time: "13:00 - 18:00" },
    { type: "오후", color: "#ede3ff", label: "오후", time: "18:00 - 22:00" },
  ];

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
        setSelectedTime={setSelectedTime}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        employees={employees}
      />
    </div>
  );
}

