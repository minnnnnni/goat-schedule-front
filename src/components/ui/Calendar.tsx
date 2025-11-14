"use client";

import { useState } from "react";
import { getDaysInMonth, getFirstDayOfMonth, isSameDay, isToday } from "@/features/schedule/utils/date";
import styles from "./Calendar.module.css";

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 날짜 유틸리티는 공유 모듈에서 사용

  const formatMonthYear = (date: Date) => {
    // 'November' 포맷을 위해 getMonth() 사용
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    // 브라우저 기본 언어 대신 영어(US)로 고정
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // isSameDay / isToday 도 공유

  // 이전/다음 달로 이동
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // 달력 그리드 생성
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // 이전 달의 빈 칸
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i);
      days.push({ date, isCurrentMonth: false });
    }

    // 현재 달
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push({ date, isCurrentMonth: true });
    }

    // 다음 달의 빈 칸 (6주 표시)
    const remainingDays = 42 - days.length; // 6주 * 7일
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={`${styles.calendarCard} ${styles.scale90}`}>
      {/* 월/년 헤더 with 네비게이션 */}
      <div className={styles.navBar}>
        <button
          onClick={goToPrevMonth}
          className={styles.navBtn}
          aria-label="Previous month"
        >
          <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className={styles.monthTitle}>{formatMonthYear(currentMonth)}</h2>
        <button
          onClick={goToNextMonth}
          className={styles.navBtn}
          aria-label="Next month"
        >
          <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      {/* 요일 헤더 */}
      <div className={styles.weekGrid}>
        {weekDays.map((day) => (
          <div key={day} className={styles.weekCell}>{day}</div>
        ))}
      </div>
      {/* 날짜 그리드 */}
      <div className={styles.daysGrid}>
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const selected = isSameDay(selectedDate, date);
          const today = isToday(date);
          const dayClasses = [styles.dayBtn];
          if (!isCurrentMonth) dayClasses.push(styles.dayDisabled);
          if (selected) dayClasses.push(styles.daySelected);
          else if (today) dayClasses.push(styles.dayToday);
          return (
            <button
              key={index}
              onClick={() => isCurrentMonth && onDateSelect(date)}
              disabled={!isCurrentMonth}
              className={dayClasses.join(" ")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}