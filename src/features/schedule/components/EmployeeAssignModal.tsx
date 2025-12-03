import React, { useEffect, useState } from "react";
import storeApi from "@/services/storeApi";
import styles from "./EmployeeAssignModal.module.css";
import type { ShiftDefinitionRow } from "@/services/storeApi";
import type { EmployeeRow } from "@/services/storeApi";


interface EmployeeAssignModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedTime: string | null;
  setSelectedTime: (t: string) => void;
  selectedEmployee: string;
  setSelectedEmployee: (e: string) => void;
}



export default function EmployeeAssignModal({
  open,
  onClose,
  selectedDate,
  selectedTime,
  setSelectedTime,
  selectedEmployee,
  setSelectedEmployee,
}: EmployeeAssignModalProps) {
  const [timeBlocks, setTimeBlocks] = useState<ShiftDefinitionRow[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);

  useEffect(() => {
    const storeId = 1;
    storeApi.getShiftDefinitions(storeId)
      .then(defs => {
        setTimeBlocks(defs);
      })
      .catch(err => {
        console.error("Failed to fetch shift definitions", err);
        setTimeBlocks([]);
      });
    storeApi.getStoreEmployees(storeId)
      .then(emps => {
        setEmployees(Array.isArray(emps) ? emps.map(e => e.name) : []);
      })
      .catch(err => {
        console.error("Failed to fetch employees", err);
        setEmployees([]);
      });
  }, []);
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} style={{ background: '#e3edff', borderRadius: 20, boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>
        {/* 헤더 */}
        <div className={styles.header}>
          <button onClick={onClose} className={styles.backBtn} style={{ color: '#2563eb', fontWeight: 700 }}>&lt;</button>
          <div>
            <div className={styles.headerTitle}>알바생 배정</div>
            <div className={styles.headerDate}>{selectedDate ? selectedDate.toLocaleDateString("ko-KR", { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }) : ""}</div>
          </div>
        </div>
        {/* 시간 선택 */}
        <div className={styles.body}>
          <div className={styles.label} style={{ color: '#2563eb', fontWeight: 700 }}>타임 선택</div>
          <div className={styles.timeBlockRow} style={{ gap: 8 }}>
            {timeBlocks.map(tb => (
              <button
                key={tb.id}
                className={styles.timeBlockBtn}
                style={{ background: selectedTime === tb.name ? '#2563eb' : '#fff', color: selectedTime === tb.name ? '#fff' : '#2563eb', borderRadius: 12, border: '1.5px solid #2563eb', padding: '8px 16px', fontWeight: 700, boxShadow: selectedTime === tb.name ? '0 2px 8px rgba(37,99,235,0.10)' : 'none' }}
                onClick={() => setSelectedTime(tb.name)}
              >
                <span>{tb.name}</span>
                <span className={styles.timeBlockTime} style={{ marginLeft: 8 }}>{tb.startTime}~{tb.endTime}</span>
              </button>
            ))}
          </div>
          {/* 알바생 이름 선택 */}
          <div className={styles.selectLabel} style={{ color: '#2563eb', fontWeight: 700 }}>알바생 이름</div>
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
            style={{ background: '#2563eb', color: '#fff', borderRadius: 12, padding: '10px 0', fontWeight: 700, border: 'none', boxShadow: '0 2px 8px rgba(37,99,235,0.10)' }}
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
