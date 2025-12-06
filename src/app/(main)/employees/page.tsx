"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
// 아이콘 사용을 위해 heroicons import
import { PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';
import styles from './EmployeePage.module.css';

// 알바생 타입 정의 (임시)
interface Employee {
  id: number;
  name: string;
  phone: string;
  shift: 'morning' | 'middle' | 'evening';
  shiftName: string; 
  workDays: string[];
}

// 임시 데이터 (피그마 디자인에 있는 데이터 반영)
const mockEmployees: Employee[] = [
  {
    id: 1,
    name: '박준형',
    phone: '010-1234-5678',
    shift: 'evening',
    shiftName: '오후',
    workDays: ['월', '화', '수', '목', '금'], // 평일
  },
  {
    id: 2,
    name: '이지은',
    phone: '010-1234-5678',
    shift: 'middle',
    shiftName: '미들',
    workDays: ['월', '화', '수', '목', '금', '토', '일'], // 매일
  },
  {
    id: 3,
    name: '김민수',
    phone: '010-1234-5678',
    shift: 'morning',
    shiftName: '오전',
    workDays: ['토', '일'], // 주말
  },
];

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export default function EmployeeListPage() {
  const router = useRouter();

  // [기능] 알바생 추가 페이지로 이동 (빈 폼)
  const goToAddPage = () => {
    router.push('/employees/form?mode=add'); 
  };

  // [기능] 알바생 수정 페이지로 이동 (기존 데이터 로딩용 ID 전달)
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
                <span className={`${styles.shiftBadge} ${styles[emp.shift]}`}>
                  {emp.shiftName}
                </span>
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