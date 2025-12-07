"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, CheckIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import styles from './StoreSetupForm.module.css';

interface TimeSlot {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  maxStaff: number;
}

interface ExceptionSchedule {
  id: number;
  day: string;
  openTime: string;
  closeTime: string;
  timeSlots: TimeSlot[];
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export default function StoreSetupForm() {
  const router = useRouter();
  
  const [storeName, setStoreName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: 1, name: '오전', startTime: '09:00', endTime: '13:00', maxStaff: 2 }
  ]);

  const [isExceptionMode, setIsExceptionMode] = useState(false);
  const [exceptions, setExceptions] = useState<ExceptionSchedule[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleQuickSelect = (type: 'weekday' | 'weekend') => {
    const weekdays = ['월', '화', '수', '목', '금'];
    const weekends = ['토', '일'];
    const target = type === 'weekday' ? weekdays : weekends;
    const isAllSelected = target.every(d => selectedDays.includes(d));
    
    if (isAllSelected) {
      setSelectedDays(prev => prev.filter(d => !target.includes(d)));
    } else {
      setSelectedDays(prev => [...new Set([...prev, ...target])]);
    }
  };

  const addTimeSlot = () => {
    const newId = Date.now();
    setTimeSlots([...timeSlots, { id: newId, name: '', startTime: '', endTime: '', maxStaff: 1 }]);
  };

  const removeTimeSlot = (id: number) => {
    setTimeSlots(timeSlots.filter(t => t.id !== id));
  };

  const updateTimeSlot = (id: number, field: keyof TimeSlot, value: string | number) => {
    setTimeSlots(timeSlots.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleAddException = () => {
    const newException: ExceptionSchedule = {
      id: Date.now(),
      day: '월요일',
      openTime: '',
      closeTime: '',
      timeSlots: [{ id: Date.now() + 1, name: '오전', startTime: '', endTime: '', maxStaff: 1 }]
    };
    setExceptions([...exceptions, newException]);
  };

  const handleRemoveException = (id: number) => {
    setExceptions(exceptions.filter(ex => ex.id !== id));
  };

  const updateExceptionField = (id: number, field: keyof ExceptionSchedule, value: string | number) => {
    setExceptions(exceptions.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const addExceptionTimeSlot = (exceptionId: number) => {
    setExceptions(exceptions.map(ex => {
      if (ex.id !== exceptionId) return ex;
      return {
        ...ex,
        timeSlots: [...ex.timeSlots, { id: Date.now(), name: '', startTime: '', endTime: '', maxStaff: 1 }]
      };
    }));
  };

  const removeExceptionTimeSlot = (exceptionId: number, slotId: number) => {
    setExceptions(exceptions.map(ex => {
      if (ex.id !== exceptionId) return ex;
      return {
        ...ex,
        timeSlots: ex.timeSlots.filter(slot => slot.id !== slotId)
      };
    }));
  };

  const updateExceptionTimeSlot = (exceptionId: number, slotId: number, field: keyof TimeSlot, value: string | number) => {
    setExceptions(exceptions.map(ex => {
      if (ex.id !== exceptionId) return ex;
      return {
        ...ex,
        timeSlots: ex.timeSlots.map(slot => slot.id === slotId ? { ...slot, [field]: value } : slot)
      };
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ storeName, selectedDays, openTime, closeTime, timeSlots, exceptions });
    router.push('/'); 
  };

  const getCardColor = (index: number) => {
    const colors = ['green', 'blue', 'pink'];
    return colors[index % colors.length];
  };

  return (
    <div className={styles.pageBackground}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>매장 정보 입력</h1>
        </div>

        {/* 1. 매장명 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>매장명 *</label>
          <input 
            type="text" 
            placeholder="매장 이름을 입력하세요" 
            className={styles.input}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>

        {/* 2. 오픈 요일 */}
        <div className={styles.formGroup}>
          <div className={styles.daySelectionHeader}>
            <label className={styles.label} style={{marginBottom: 0}}>오픈 요일 *</label>
            <div className={styles.quickSelectGroup}>
              <button type="button" className={styles.quickSelectButton} onClick={() => handleQuickSelect('weekday')}>
                 <div className={`${styles.checkBox} ${['월','화','수','목','금'].every(d => selectedDays.includes(d)) ? styles.active : ''}`}>
                    <CheckIcon width={12} height={12} strokeWidth={3} color="white" />
                 </div>
                 평일
              </button>
              <button type="button" className={styles.quickSelectButton} onClick={() => handleQuickSelect('weekend')}>
                 <div className={`${styles.checkBox} ${['토','일'].every(d => selectedDays.includes(d)) ? styles.active : ''}`}>
                    <CheckIcon width={12} height={12} strokeWidth={3} color="white" />
                 </div>
                 주말
              </button>
            </div>
          </div>
          <div className={styles.dayButtonContainer}>
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

        {/* 3. 오픈/마감 시간 */}
        <div className={styles.formGroup}>
          <div className={styles.timeGrid}>
            <div>
              <label className={styles.label}>오픈 시간 *</label>
              <input 
                type="time" 
                className={styles.input}
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={styles.label}>마감 시간 *</label>
              <input 
                type="time" 
                className={styles.input}
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.exceptionCheck} onClick={() => setIsExceptionMode(!isExceptionMode)}>
            <div className={`${styles.checkBox} ${isExceptionMode ? styles.active : ''}`}>
               <CheckIcon width={12} height={12} strokeWidth={3} color="white" />
            </div>
            <span>특정 요일만 근무시간이 달라요</span>
          </div>

          {/* === 예외 설정 영역 === */}
          {isExceptionMode && (
            <div className="flex flex-col gap-4 mt-2">
              {exceptions.map((ex, exIndex) => (
                <div key={ex.id} className={styles.exceptionCard}>
                  <div className={styles.exceptionHeader}>
                    <span className={styles.exceptionTitle}>예외 설정 {exIndex + 1}</span>
                    <XMarkIcon width={16} height={16} className="text-gray-400 cursor-pointer" onClick={() => handleRemoveException(ex.id)} />
                  </div>
                  
                  {/* 요일 선택 */}
                  <div className="mb-4">
                    <label className={styles.smallLabel}>요일</label>
                    <div className="relative">
                      <select 
                        className={`${styles.input} appearance-none bg-white`}
                        value={ex.day}
                        onChange={(e) => updateExceptionField(ex.id, 'day', e.target.value)}
                      >
                        {DAYS.map(d => <option key={d} value={`${d}요일`}>{d}요일</option>)}
                      </select>
                      <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* 시간 입력 */}
                  <div className={styles.timeGrid}>
                    <div>
                      <label className={styles.smallLabel}>오픈 시간</label>
                      <input 
                        type="time" 
                        className={styles.input}
                        value={ex.openTime}
                        onChange={(e) => updateExceptionField(ex.id, 'openTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={styles.smallLabel}>마감 시간</label>
                      <input 
                        type="time" 
                        className={styles.input}
                        value={ex.closeTime}
                        onChange={(e) => updateExceptionField(ex.id, 'closeTime', e.target.value)}
                      />
                    </div>
                  </div>

                  <hr className="border-t border-gray-200 my-4" />

                  {/* 예외 타임 설정 */}
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">타임 설정</span>
                    <button type="button" className={styles.addTimeButton} onClick={() => addExceptionTimeSlot(ex.id)}>
                      <PlusIcon width={12} height={12} /> 추가
                    </button>
                  </div>

                  {ex.timeSlots.map((slot, slotIndex) => (
                    <div key={slot.id} className={`${styles.timeCard} ${styles[getCardColor(slotIndex)]} !mb-2`}>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>타임 {slotIndex + 1}</span>
                        {/* [수정] 예외 타임에도 동일한 스타일 적용 가능 (필요 시) */}
                        <XMarkIcon width={16} height={16} className="text-gray-400 cursor-pointer" onClick={() => removeExceptionTimeSlot(ex.id, slot.id)} />
                      </div>
                      
                      <div style={{marginBottom: '16px'}}>
                        <label className={styles.label} style={{marginBottom: '8px', fontSize: '13px'}}>타임 이름</label>
                        <input 
                          type="text" 
                          className={`${styles.input} ${styles.cardInput}`}
                          placeholder="타임 이름"
                          value={slot.name}
                          onChange={(e) => updateExceptionTimeSlot(ex.id, slot.id, 'name', e.target.value)}
                        />
                      </div>

                      <div className={styles.timeGrid}>
                        <div>
                           <label className={styles.label} style={{marginBottom: '8px', fontSize: '13px'}}>시작 시간</label>
                           <input type="time" className={`${styles.input} ${styles.cardInput}`} value={slot.startTime} onChange={(e) => updateExceptionTimeSlot(ex.id, slot.id, 'startTime', e.target.value)} />
                        </div>
                        <div>
                           <label className={styles.label} style={{marginBottom: '8px', fontSize: '13px'}}>종료 시간</label>
                           <input type="time" className={`${styles.input} ${styles.cardInput}`} value={slot.endTime} onChange={(e) => updateExceptionTimeSlot(ex.id, slot.id, 'endTime', e.target.value)} />
                        </div>
                      </div>
                      <div style={{marginTop: '16px'}}>
                        <label className={styles.label} style={{marginBottom: '8px', fontSize: '13px'}}>인원</label>
                        <input 
                          type="number" 
                          className={`${styles.input} ${styles.cardInput}`}
                          placeholder="인원"
                          value={slot.maxStaff}
                          onChange={(e) => updateExceptionTimeSlot(ex.id, slot.id, 'maxStaff', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* 추가 버튼 */}
              <button 
                type="button" 
                className={styles.addExceptionButton}
                onClick={handleAddException} 
              >
                <PlusIcon width={16} height={16} /> 예외 요일 추가
              </button>
            </div>
          )}
        </div>

        {/* 4. 기본 타임 설정 */}
        <div className="w-full">
          <div className={styles.sectionHeader}>
            <label className={styles.label} style={{marginBottom: 0}}>타임 설정 *</label>
            <button type="button" className={styles.addTimeButton} onClick={addTimeSlot}>
              <PlusIcon width={14} height={14} /> 타임 추가
            </button>
          </div>

          {timeSlots.map((slot, index) => (
            <div key={slot.id} className={`${styles.timeCard} ${styles[getCardColor(index)]}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>타임 {index + 1}</span>
                {/* [수정] 삭제 버튼 스타일 적용 (흰색 배경, 빨간 X) */}
                <button type="button" className={styles.deleteButton} onClick={() => removeTimeSlot(slot.id)}>
                  <XMarkIcon width={16} height={16} />
                </button>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label className={styles.label} style={{marginBottom: '8px', fontSize: '13px'}}>타임 이름</label>
                <input 
                  type="text" 
                  className={`${styles.input} ${styles.cardInput}`}
                  placeholder="예: 오전"
                  value={slot.name}
                  onChange={(e) => updateTimeSlot(slot.id, 'name', e.target.value)}
                />
              </div>

              <div className={styles.timeGrid}>
                <div>
                  <label className={styles.label} style={{marginBottom: '8px', fontSize: '13px'}}>시작 시간</label>
                  <input 
                    type="time" 
                    className={`${styles.input} ${styles.cardInput}`}
                    value={slot.startTime}
                    onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.label} style={{marginBottom: '8px', fontSize: '13px'}}>종료 시간</label>
                  <input 
                    type="time" 
                    className={`${styles.input} ${styles.cardInput}`}
                    value={slot.endTime}
                    onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                  />
                </div>
              </div>

              <div style={{marginTop: '16px'}}>
                <label className={styles.label} style={{marginBottom: '8px', fontSize: '13px'}}>최대 인원수</label>
                <input 
                  type="number" 
                  className={`${styles.input} ${styles.cardInput}`}
                  placeholder="예: 3"
                  value={slot.maxStaff}
                  onChange={(e) => updateTimeSlot(slot.id, 'maxStaff', parseInt(e.target.value))}
                />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className={styles.submitButton}>완료</button>
      </form>
    </div>
  );
}