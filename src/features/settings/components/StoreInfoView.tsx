
import { useEffect, useState } from "react";
import styles from "./StoreInfoView.module.css";
import storeApi from "@/services/storeApi";
import type { StoreView, EmployeeView, ShiftDefinitionView } from "@/services/storeApi";

// ShiftDefinitionView 타입을 그대로 사용

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export default function StoreInfoView() {
  const STORE_ID = 1; // TODO: auth/route에서 가져오도록 교체
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiErrors, setApiErrors] = useState<{store?: string; shift?: string; employees?: string}>({});
  const [store, setStore] = useState<StoreView | null>(null);
  const [timeBlocks, setTimeBlocks] = useState<ShiftDefinitionView[]>([]);
  const [employees, setEmployees] = useState<EmployeeView[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null); // 에러 상태 초기화
      try {
        const [storeData, shiftDefs, employeesData] = await Promise.all([
          storeApi.getStore(STORE_ID),
          storeApi.getShiftDefinitions(STORE_ID),
          storeApi.getStoreEmployees(STORE_ID),
        ]);

        setStore(storeData);
        setTimeBlocks(shiftDefs || []);
        setEmployees(employeesData || []);
      } catch (err) {
        console.error('Failed to fetch store info:', err);
        setError('매장 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [STORE_ID]);

  if (loading) {
    return <div className={styles.field}><p className={styles.fieldValue}>불러오는 중...</p></div>;
  }
  if (error || !store) {
    return (
      <div className={styles.field}>
        <p className={styles.fieldValue}>{error || '매장 정보를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  return (
    <div className={styles.storeInfoCard}>
      <div className={styles.field}>
        <p className={styles.fieldLabel}>매장명</p>
        <p className={styles.fieldValue}>{store.name}</p>
      </div>

      {store.address && (
        <div className={styles.field}>
          <p className={styles.fieldLabel}>주소</p>
          <p className={styles.fieldValue}>{store.address}</p>
        </div>
      )}

      {store.contact && (
        <div className={styles.field}>
          <p className={styles.fieldLabel}>연락처</p>
          <p className={styles.fieldValue}>{store.contact}</p>
        </div>
      )}

      <div className={styles.field}>
        <p className={styles.fieldLabel}>영업 요일</p>
        <div className={styles.days}>
                    {DAY_LABELS.map((day) => {
                      const isOpen = store.openDaysArr?.includes(day);
                      return (
                        <span
                          key={day}
                          className={`${styles.dayChip} ${isOpen ? styles.dayActive : styles.dayInactive}`}
                        >
                          {day}
                        </span>
                      );
                    })}
        </div>
      </div>

      <div className={styles.field}>
        <p className={styles.fieldLabel}>타임 설정</p>
        <div className={styles.timeList}>
          {timeBlocks.length === 0 ? (
            <div className={styles.timeCard}>
              <p className={styles.timeTitle}>등록된 타임이 없습니다</p>
            </div>
          ) : (
            timeBlocks.map((tb, idx) => {
              // 색상 순환: blue, green, purple
              const colorOrder = [styles.timeBlue, styles.timeGreen, styles.timePurple];
              const colorClass = colorOrder[idx % colorOrder.length];
              return (
                <div key={tb.id} className={`${styles.timeCard} ${colorClass}`}>
                  <p className={styles.timeTitle}>타임 {idx+1}</p>
                  {tb.name && <p className={styles.timeSub}>{tb.name}</p>}
                  <p className={styles.timeRange}>{tb.startTime} ~ {tb.endTime}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
