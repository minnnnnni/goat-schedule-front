
'use client';

import { useState, useEffect, useCallback } from 'react';
import Calendar from '@/components/ui/Calendar';
import DailyScheduleSection from '@/components/schedule/DailyScheduleSection';
import EmployeeAssignModal from '@/features/schedule/components/EmployeeAssignModal';
import { useShiftsForDate } from '@/features/schedule/hooks/useShifts';

export default function CalendarPage() {
  // 인증 로직을 useEffect로 이동하여 컴포넌트 생명주기에 맞게 관리
  useEffect(() => {
    // 개발용: 임시 토큰 강제 삽입
    if (!localStorage.getItem('access_token')) {
      localStorage.setItem('access_token', 'test-access-token');
    }
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { shifts } = useShiftsForDate(selectedDate);
  const [showModal, setShowModal] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddShift = () => {
    setShowModal(true);
  };

  // useCallback으로 함수 재생성 방지
  const handleModalClose = useCallback(() => {
    setShowModal(false);
  }, []);

  // 모달에서 '배정하기' 버튼 클릭 시 실행될 콜백 함수
  const handleAssignEmployee = (timeBlock: string, employeeId: string) => {
    console.log(
      `[배정 완료] 날짜: ${selectedDate?.toLocaleDateString()}, 시간대: ${timeBlock}, 근무자 ID: ${employeeId}`
    );
    // TODO: 실제 배정 로직 구현 (API 호출 등)
    // 예: useMutation 훅을 사용하여 서버에 데이터 전송
  };

  // 날짜 포맷팅 함수 (예: "7월 26일 (금)")
  const formatDateForModal = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

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
      {selectedDate && (
        <EmployeeAssignModal
        isOpen={showModal}
        onClose={handleModalClose}
        date={formatDateForModal(selectedDate)}
        // TODO: 실제 매장 ID를 동적으로 전달해야 합니다.
        storeId={1}
        onAssign={handleAssignEmployee}
      />)}
    </div>
  );
}
