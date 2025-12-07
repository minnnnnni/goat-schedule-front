"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
// 아이콘 사용을 위해 heroicons import
import { PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';
import styles from './EmployeePage.module.css';

// [수정] 알바생 타입 정의 (다중 타임 지원)
interface Employee {
  id: number;
  name: string;
  phone: string;
  shifts: ('morning' | 'middle' | 'evening')[]; // 배열로 변경
  shiftNames: string[]; // ['오전', '미들'] 등
  workDays: string[];
}

// [수정] 임시 데이터 (다중 타임 예시 포함)
const mockEmployees: Employee[] = [
  {
    id: 1,
    name: '박준형',
    phone: '010-1234-5678',
    shifts: ['evening', 'middle'], // 예시: 두 가지 타임
    shiftNames: ['오후', '미들'],
    workDays: ['월', '화', '수', '목', '금'], 
  },
  {
    id: 2,
    name: '이지은',
    phone: '010-1234-5678',
    shifts: ['middle'],
    shiftNames: ['미들'],
    workDays: ['월', '화', '수', '목', '금', '토', '일'],
  },
  {
    id: 3,
    name: '김민수',
    phone: '010-1234-5678',
    shifts: ['morning'],
    shiftNames: ['오전'],
    workDays: ['토', '일'], 
  },
];

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export default function EmployeeListPage() {
  const router = useRouter();

  const goToAddPage = () => {
    router.push('/employees/form?mode=add'); 
  };

  const goToEditPage = (id: number) => {
    router.push(`/employees/form?mode=edit&id=${id}`);
  };

  return (
    <div className={styles.container}>
      {/* 1. 상단 헤더 섹션 */}
      <header className={styles.headerSection}>
        <h1 className={styles.title}>알바생 관리</h1>
        
        {/* 요약 카드 */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryInfo}>
            <span className={styles.summaryCount}>{mockEmployees.length}명</span>
            <span className={styles.summaryLabel}>총 알바생 수</span>
          </div>
          
          <div className={styles.divider} />

          <button className={styles.addButton} onClick={goToAddPage}>
            알바생 추가 +
          </button>
        </div>
      </header>

      {/* 2. 알바생 리스트 섹션 */}
      <main className={styles.listSection}>
        {mockEmployees.map((emp) => (
          <div key={emp.id} className={styles.employeeCard}>
            
            {/* 카드 헤더 */}
            <div className={styles.cardHeader}>
              <div className={styles.profileGroup}>
                {/* [수정] 여러 개의 타임 뱃지 렌더링 */}
                {emp.shifts.map((shiftType, index) => (
                  <span key={index} className={`${styles.shiftBadge} ${styles[shiftType]}`}>
                    {emp.shiftNames[index]}
                  </span>
                ))}
                <span className={styles.employeeName}>{emp.name}</span>
              </div>
              <button className={styles.editButton} onClick={() => goToEditPage(emp.id)}>
                편집
              </button>
            </div>

            <hr className={styles.cardDivider} />

            {/* 전화번호 정보 */}
            <div className={styles.infoRow}>
              <PhoneIcon className={styles.icon} />
              <span className={styles.infoText}>{emp.phone}</span>
            </div>

            {/* 근무 요일 정보 */}
            <div className={styles.infoRow}>
              <ClockIcon className={styles.icon} />
              <div className={styles.dayButtons}>
                {DAYS.map((day) => (
                  <div 
                    key={day} 
                    className={`${styles.dayChip} ${emp.workDays.includes(day) ? styles.active : styles.inactive}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </main>
    </div>
  );
}