"use client";

import React, { useState, useEffect } from 'react';
import styles from './EmployeeForm.module.css';

// 타입 정의
export interface EmployeeFormData {
  name: string;
  phone: string;
  selectedDays: string[];
  selectedShift: string;
}

interface EmployeeFormProps {
  initialData?: EmployeeFormData; // 수정 시 초기 데이터
  onSubmit: (data: EmployeeFormData) => void; // 저장 버튼 클릭 시 실행될 함수
  mode: 'add' | 'edit';
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

// 타임 데이터 (예시 - 나중에는 API로 받아와야 함)
const SHIFT_OPTIONS = [
  { id: 'morning', name: '오전', time: '09:00 - 14:00' },
  { id: 'middle', name: '미들', time: '14:00 - 18:00' },
  { id: 'evening', name: '마감', time: '18:00 - 22:00' },
];

export default function EmployeeForm({ initialData, onSubmit, mode }: EmployeeFormProps) {
  // 폼 상태 관리
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedShift, setSelectedShift] = useState<string>('');

  // 초기 데이터가 있으면 채워넣기 (수정 모드)
  // initialData가 변경될 때만 실행됩니다.
  useEffect(() => {
    if (initialData) {
      // setTimeout을 사용하여 비동기적으로 상태를 업데이트합니다.
      // 이를 통해 "Calling setState synchronously within an effect" 에러를 방지합니다.
      const timer = setTimeout(() => {
        setName(initialData.name || '');
        setPhone(initialData.phone || '');
        setSelectedDays(initialData.selectedDays || []);
        setSelectedShift(initialData.selectedShift || '');
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [initialData]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phone, selectedDays, selectedShift });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {/* 이름 입력 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>이름 *</label>
        <input 
          type="text" 
          className={styles.input} 
          placeholder="이름을 입력하세요" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* 전화번호 입력 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>전화번호 *</label>
        <input 
          type="tel" 
          className={styles.input} 
          placeholder="010-0000-0000" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      {/* 근무 요일 선택 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>근무 요일 *</label>
        <div className={styles.daySelector}>
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              className={`${styles.dayButton} ${selectedDays.includes(day) ? styles.active : ''}`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* 타임 선택 */}
      <div className={styles.formGroup}>
        <label className={styles.label}>타임 선택 *</label>
        <div className={styles.timeSelectionGroup}>
          {SHIFT_OPTIONS.map((shift) => (
            <button
              key={shift.id}
              type="button"
              className={`${styles.timeButton} ${selectedShift === shift.id ? styles.active : ''}`}
              onClick={() => setSelectedShift(shift.id)}
            >
              <span className={styles.timeName}>{shift.name}</span>
              <span className={styles.timeRange}>{shift.time}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className={styles.submitButtonWrapper}>
        <button type="submit" className={styles.submitButton}>
          {mode === 'add' ? '알바생 추가' : '수정 완료'}
        </button>
      </div>
    </form>
  );
}