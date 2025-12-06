"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import EmployeeForm, { EmployeeFormData } from '@/features/employees/components/EmployeeForm';


import styles from './EmployeeFormPage.module.css';

function EmployeeFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const mode = (searchParams.get('mode') as 'add' | 'edit') || 'add';
  const editId = searchParams.get('id');

  const [initialData, setInitialData] = useState<EmployeeFormData | null>(null);
  const [isLoading, setIsLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && editId) {
      const loadData = async () => {
        // [TODO] 실제 API 연결 시 교체
        // await new Promise(resolve => setTimeout(resolve, 500)); 
        
        setInitialData({
          name: '박준형',
          phone: '010-1234-5678',
          selectedDays: ['월', '수', '금'],
          selectedShift: 'evening',
        });
        setIsLoading(false);
      };
      
      loadData();
    }
  }, [mode, editId]);

  const handleFormSubmit = (data: EmployeeFormData) => {
    console.log('최종 저장 데이터:', data);
    alert(mode === 'add' ? '추가되었습니다.' : '수정되었습니다.');
    router.back();
  };

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <ChevronLeftIcon width={24} height={24} />
        </button>
        <h1 className={styles.headerTitle}>
          {mode === 'add' ? '알바생 추가' : '알바생 정보 수정'}
        </h1>
      </header>

      {/* 로딩 상태 처리 및 폼 렌더링 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-gray-400">
          정보를 불러오는 중...
        </div>
      ) : (
        <EmployeeForm 
          mode={mode}
          initialData={initialData || undefined} 
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default function EmployeeFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeFormContent />
    </Suspense>
  );
}