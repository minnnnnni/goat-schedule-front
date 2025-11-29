import React from "react";
import styles from "./EmployeeAssignModal.module.css";

interface EmployeeAssignModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedTime: '오전'|'미들'|'오후'|null;
  setSelectedTime: (t: '오전'|'미들'|'오후') => void;
  selectedEmployee: string;
  setSelectedEmployee: (e: string) => void;
  employees: string[];
}

const timeBlocks = [
  { type: "오전", color: "#e3edff", label: "오전", time: "09:00 - 13:00" },
  { type: "미들", color: "#d6f5d6", label: "미들", time: "13:00 - 18:00" },
  { type: "오후", color: "#ede3ff", label: "오후", time: "18:00 - 22:00" },
];

export default function EmployeeAssignModal({
  open,
  onClose,
  selectedDate,
  selectedTime,
  setSelectedTime,
  selectedEmployee,
  setSelectedEmployee,
  employees,
}: EmployeeAssignModalProps) {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <button onClick={onClose} className={styles.backBtn}>&lt;</button>
          <div>
            <div className={styles.headerTitle}>알바생 배정</div>
            <div className={styles.headerDate}>{selectedDate ? selectedDate.toLocaleDateString("ko-KR", { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }) : ""}</div>
          </div>
        </div>
        {/* 시간 선택 */}
        <div className={styles.body}>
          <div className={styles.label}>타임 선택</div>
          <div className={styles.timeBlockRow}>
            {timeBlocks.map(tb => (
              <button
                key={tb.type}
                className={[ 
                  styles.timeBlockBtn,
                  selectedTime === tb.type ? styles.selected : '',
                  tb.type === '오전' && selectedTime === tb.type ? styles.morning : '',
                  tb.type === '미들' && selectedTime === tb.type ? styles.middle : '',
                  tb.type === '오후' && selectedTime === tb.type ? styles.afternoon : '',
                ].join(' ')}
                onClick={() => setSelectedTime(tb.type as '오전'|'미들'|'오후')}
              >
                <span>{tb.label}</span>
                <span className={styles.timeBlockTime}>{tb.time}</span>
              </button>
            ))}
          </div>
          {/* 알바생 이름 선택 */}
          <div className={styles.selectLabel}>알바생 이름</div>
          <select
            className={styles.select}
            value={selectedEmployee}
            onChange={e => setSelectedEmployee(e.target.value)}
          >
            <option value="">알바생 선택</option>
            {employees.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
          {/* 완료 버튼 */}
          <button
            className={styles.confirmBtn}
            onClick={onClose}
            disabled={!selectedTime || !selectedEmployee}
          >
            배정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
