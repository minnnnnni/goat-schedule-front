"use client";

import React, { useState, useEffect } from 'react';
import styles from './EmployeeForm.module.css';

// 타입 정의 업데이트: selectedShift -> selectedShifts (배열)
export interface EmployeeFormData {
  name: string;
  phone: string;
  selectedDays: string[];
  selectedShifts: string[]; 
}

interface EmployeeFormProps {
  initialData?: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  mode: 'add' | 'edit';
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

const SHIFT_OPTIONS = [
  { id: 'morning', name: '오전', time: '09:00 - 14:00' },
  { id: 'middle', name: '미들', time: '14:00 - 18:00' },
  { id: 'evening', name: '마감', time: '18:00 - 22:00' },
];

export default function EmployeeForm({ initialData, onSubmit, mode }: EmployeeFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  // [수정] 다중 선택을 위해 배열로 상태 관리
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      const timer = setTimeout(() => {
        setName(initialData.name || '');
        setPhone(initialData.phone || '');
        setSelectedDays(initialData.selectedDays || []);
        // [수정] 초기 데이터도 배열로 받음
        setSelectedShifts(initialData.selectedShifts || []);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialData]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // [추가] 타임 중복 선택 토글 함수
  const toggleShift = (shiftId: string) => {
    setSelectedShifts(prev => 
      prev.includes(shiftId) 
        ? prev.filter(id => id !== shiftId) // 이미 있으면 제거
        : [...prev, shiftId] // 없으면 추가
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phone, selectedDays, selectedShifts });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
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

      <div className={styles.formGroup}>
        <label className={styles.label}>타임 선택 *</label>
        <div className={styles.timeSelectionGroup}>
          {SHIFT_OPTIONS.map((shift) => (
            <button
              key={shift.id}
              type="button"
              // [수정] 배열에 포함되어 있는지 확인하여 active 처리
              className={`${styles.timeButton} ${selectedShifts.includes(shift.id) ? styles.active : ''}`}
              // [수정] 클릭 시 토글 함수 호출
              onClick={() => toggleShift(shift.id)}
            >
              <span className={styles.timeName}>{shift.name}</span>
              <span className={styles.timeRange}>{shift.time}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.submitButtonWrapper}>
        <button type="submit" className={styles.submitButton}>
          {mode === 'add' ? '알바생 추가' : '수정 완료'}
        </button>
      </div>
    </form>
  );
}