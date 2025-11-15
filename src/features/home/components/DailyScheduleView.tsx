"use client";

import { useMemo, useState } from "react";
import styles from "./DailyScheduleView.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useDummyEmployees, useDummySchedule } from "@/app/dummy/useDummyData";

// 초기 날짜 계산 함수 (컴포넌트 외부)
function getInitialDate(): Date {
  const today = new Date();
  return today;
}

type Position = '오픈' | '미들' | '마감' | '오후';

export default function DailyScheduleView() {
  const [currentDate, setCurrentDate] = useState<Date>(getInitialDate());
  const { schedule, loading: schedLoading } = useDummySchedule(currentDate);
  const { employees, loading: empLoading } = useDummyEmployees();

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekDay = (date: Date): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()] + '요일';
  };


  const currentDateStr = formatDate(currentDate);
  const currentWeekDay = getWeekDay(currentDate);

  const positionClassMap: Record<Position, string> = {
    '오픈': styles.badgeOpen,
    '미들': styles.badgeMiddle,
    '오후': styles.badgeAfternoon,
    '마감': styles.badgeClose,
  };

  const resolvedShifts = useMemo(() => {
    const idToName = new Map<string, string>(employees.map(e => [e.id, e.name]));
    return schedule
      .filter(s => s.date === currentDateStr)
      .map(s => {
        const pos: Position = s.start === '09:00' ? '오픈' : s.start === '13:00' ? '미들' : s.start === '18:00' ? '오후' : '미들';
        const names = (s.employeeIds || []).map((id: string) => idToName.get(id) || '직원');
        return {
          id: s.id,
          position: pos,
          time: { start: s.start, end: s.end },
          employees: names,
        };
      });
  }, [schedule, employees, currentDateStr]);

  return (
    <div className={styles.container}>

      {/* 주간 근무표 섹션 */}
      <div className={styles.card}>
        <h2 className={styles.title}>주간 근무표</h2>

        {/* 날짜 선택 */}
        <div className={styles.dateNav}>
          <h3 className={styles.weekdayTitle}>{currentWeekDay}</h3>
          <div className={styles.dateNavBar}>
            <button
              type="button"
              onClick={handlePrevDay}
              className={styles.navButton}
              aria-label="이전 날"
            >
              <ChevronLeftIcon className={styles.navIcon} aria-hidden="true" />
            </button>
            <span className={styles.dateText}>{currentDateStr}</span>
            <button
              type="button"
              onClick={handleNextDay}
              className={styles.navButton}
              aria-label="다음 날"
            >
              <ChevronRightIcon className={styles.navIcon} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 근무 리스트 (홈 화면: 패널/추가 버튼 없이 단순 카드) */}
        <div className={styles.shiftList}>
          {schedLoading || empLoading ? (
            <div className={styles.emptyState}>불러오는 중...</div>
          ) : resolvedShifts.length > 0 ? (
            resolvedShifts.map((shift) => (
              <div key={shift.id} className={styles.shiftRow}>
                <div className={styles.shiftMeta}>
                  <span className={`${styles.badge} ${positionClassMap[shift.position]}`}>
                    {shift.position}
                  </span>
                  <span className="text-sm text-gray-600">{shift.time.start} - {shift.time.end}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{shift.employees.join(", ")}</span>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>근무표를 생성해주세요</div>
          )}
        </div>
      </div>
    </div>
  );
}


