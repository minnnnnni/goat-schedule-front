"use client";

import styles from "./DailyScheduleSection.module.css";

interface Shift {
  id: string;
  type: '오전' | '미들' | '오후';
  startTime: string;
  endTime: string;
  employeeName: string;
}

interface DailyScheduleSectionProps {
  selectedDate: Date | null;
  shifts: Shift[];
  onAddShift: () => void;
}

export default function DailyScheduleSection({ selectedDate, shifts, onAddShift }: DailyScheduleSectionProps) {
  if (!selectedDate) {
    return null;
  }

  const formatDate = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek}) 근무표`;
  };

  return (
    <div className={`${styles.panel} ${styles.scale90}`}>
      {/* 제목과 추가 버튼 */}
      <div className={styles.header}>
        <h2 className={styles.title}>{formatDate(selectedDate)}</h2>
        <button onClick={onAddShift} className={styles.addButton}>
          알바생 추가
        </button>
      </div>

      {/* 안내 메시지 */}
      <p className={styles.hint}>이름을 눌러 수정하세요!</p>

      {/* 근무 시간표 리스트 */}
      {shifts.length === 0 ? (
        <div className={styles.empty}>등록된 근무가 없습니다</div>
      ) : (
        <div className={styles.list}>
          {shifts.map((shift) => {
            const typeClass =
              shift.type === '오전'
                ? styles.badgeMorning
                : shift.type === '미들'
                ? styles.badgeMiddle
                : styles.badgeAfternoon;

            return (
              <div key={shift.id} className={styles.card}>
                <div className={styles.meta}>
                  <span className={`${styles.badge} ${typeClass}`}>{shift.type}</span>
                  <span className="text-sm text-gray-600 font-medium">
                    {shift.startTime} - {shift.endTime}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {shift.employeeName}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
