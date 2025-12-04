import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import styles from './EmployeeAssignModal.module.css';
import { getStoreEmployees, getShiftDefinitions, ShiftDefinitionView } from '@/services/storeApi';

// 아이콘 컴포넌트 (예시)
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

// 컴포넌트 Props 타입 정의
interface EmployeeAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string; // 예: "7월 26일 (금)"
  storeId: number; // API 호출을 위해 storeId 추가
  onAssign: (timeBlockId: number, employeeId: string) => void;
}

// API 응답에 맞춰 컴포넌트 내부에서 사용할 타입 정의
interface TimeBlock {
  id: number;
  label: string;
  time: string;
}

interface Employee {
  id: string;
  name: string;
}

// 순서에 따라 다른 스타일 클래스를 반환하는 헬퍼 함수
const getTimeBlockStyle = (index: number): string => {
  const styleKeys = ['morning', 'middle', 'afternoon'];
  return styles[styleKeys[index % styleKeys.length]] || '';
};

const EmployeeAssignModal: React.FC<EmployeeAssignModalProps> = ({
  isOpen,
  onClose,
  date,
  storeId,
  onAssign,
}) => {
  // 선택 관련 상태
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  // API 연동 관련 상태
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isTimeBlocksLoading, setIsTimeBlocksLoading] = useState(false);
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(false);
  const [timeBlocksError, setTimeBlocksError] = useState<string | null>(null);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const isLoading = isTimeBlocksLoading || isEmployeesLoading;

  const modalRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 API 호출 및 상태 초기화
  useEffect(() => {
    if (isOpen) {
      // 상태 초기화
      setSelectedTimeBlock(null);
      setSelectedEmployeeId('');
      modalRef.current?.focus();

      const fetchData = async () => {
        // 시간대 및 근무자 목록 동시 호출
        setIsTimeBlocksLoading(true);
        setIsEmployeesLoading(true);
        setTimeBlocksError(null);
        setEmployeesError(null);

        try {
          const [shiftData, employeeData] = await Promise.all([
            getShiftDefinitions(storeId),
            getStoreEmployees(storeId),
          ]);

          // 시간대 데이터 가공
          const mappedTimeBlocks = shiftData.map((shift: ShiftDefinitionView) => ({
            id: shift.id,
            label: shift.name,
            time: `${shift.startTime}-${shift.endTime}`,
          }));
          setTimeBlocks(mappedTimeBlocks);

          // 근무자 데이터 가공
          const mappedEmployees = employeeData.map(emp => ({
            id: String(emp.id),
            name: emp.name,
          }));
          setEmployees(mappedEmployees);

        } catch (err) {
          // 개별 에러 처리
          if (!timeBlocks.length) setTimeBlocksError('시간대 정보를 불러오지 못했습니다.');
          if (!employees.length) setEmployeesError('근무자 목록을 불러오지 못했습니다.');
          console.error(err);
        } finally {
          setIsTimeBlocksLoading(false);
          setIsEmployeesLoading(false);
        }
      };

      fetchData();
    }
  }, [isOpen, storeId]);

  // 키보드 이벤트 핸들러 (Escape 및 Focus Trap)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = useCallback(() => {
    if (selectedTimeBlock && selectedEmployeeId) {
      onAssign(selectedTimeBlock, selectedEmployeeId);
      onClose(); // 성공적으로 할당 후 모달 닫기
    } else {
      alert('시간대와 근무자를 모두 선택해주세요.');
    }
  }, [selectedTimeBlock, selectedEmployeeId, onAssign, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1} // 초점을 받을 수 있도록 설정
      >
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={onClose} aria-label="모달 닫기">
            <BackIcon />
          </button>
          {/* 접근성을 위해 id 추가 */}
          <h2 id="modal-title" className={styles.headerTitle}>근무자 배정</h2>
          <span className={styles.headerDate}>{date}</span>
        </header>

        <main className={styles.body}>
          <section>
            <h3 className={styles.label}>시간대 선택</h3>
            <div className={styles.timeBlockRow}>
              {isTimeBlocksLoading ? (
                // 스켈레톤 UI
                [...Array(3)].map((_, i) => <div key={i} className={`${styles.timeBlockBtn} ${styles.skeleton}`} />)
              ) : timeBlocksError ? (
                <p className={styles.errorText}>{timeBlocksError}</p>
              ) : (
                timeBlocks.map((block, index) => (
                  <button
                    key={block.id}
                    className={`${getTimeBlockStyle(index)} ${selectedTimeBlock === block.id ? styles.selected : ''}`}
                    onClick={() => setSelectedTimeBlock(block.id)}
                    aria-label={`${block.label} (${block.time})`}
                  >
                    {block.label}
                    <span className={styles.timeBlockTime}>{block.time}</span>
                  </button>
                ))
              )}
            </div>
          </section>

          <section>
            {/* 접근성을 위해 h3 -> label로 변경하고 htmlFor 추가 */}
            <label htmlFor="employee-select" className={styles.selectLabel}>근무자 선택</label>
            <select
              className={styles.select}
              id="employee-select"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              disabled={isEmployeesLoading || !!employeesError}
            >
              {isEmployeesLoading && <option>불러오는 중...</option>}
              {employeesError && <option>{employeesError}</option>}
              {!isEmployeesLoading && !employeesError && (
                <>
                  <option value="" disabled>근무자를 선택하세요</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </section>

          <button
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={!selectedTimeBlock || !selectedEmployeeId || isLoading}
          >
            배정하기
          </button>
        </main>
      </div>
    </div>
  );
};

// 컴포넌트를 memo로 감싸고 export하여 가독성을 높이고 불필요한 리렌더링을 방지합니다.
export default memo(EmployeeAssignModal);