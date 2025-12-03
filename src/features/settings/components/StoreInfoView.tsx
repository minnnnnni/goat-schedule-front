
import { useEffect, useState } from "react";
import styles from "./StoreInfoView.module.css";
import storeApi from "@/services/storeApi";
import type { StoreView, EmployeeView, ShiftDefinitionRow } from "@/services/storeApi";

// ShiftDefinitionView 타입을 그대로 사용

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export default function StoreInfoView() {
  const STORE_ID = 1; // TODO: auth/route에서 가져오도록 교체
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiErrors, setApiErrors] = useState<{store?: string; shift?: string; employees?: string}>({});
  const [store, setStore] = useState<StoreView | null>(null);
  const [timeBlocks, setTimeBlocks] = useState<ShiftDefinitionRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeView[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let s = null, defs = null, emps = null;
      const errors: {store?: string; shift?: string; employees?: string} = {};
      try {
        s = await storeApi.getStore(STORE_ID);
        setStore(s);
      } catch (err) {
        console.error('StoreInfoView getStore error:', err);
        errors.store = '매장 정보 불러오기 실패';
      }
      try {
        defs = await storeApi.getShiftDefinitions(STORE_ID);
        console.log('[StoreInfoView] getShiftDefinitions 응답:', defs);
        // shift-definitions API 응답 구조에 맞게 매핑
        setTimeBlocks(defs || []);
        if (defs && Array.isArray(defs)) {
          defs.forEach((tb, idx) => {
            console.log(`[타임 ${idx}] id:`, tb.id, 'name:', tb.name, 'startTime:', tb.startTime, 'endTime:', tb.endTime);
          });
        }
      } catch (err) {
        console.error('StoreInfoView getShiftDefinitions error:', err);
        errors.shift = '타임 정보 불러오기 실패';
      }
      try {
        emps = await storeApi.getStoreEmployees(STORE_ID);
        setEmployees(emps || []);
      } catch (err) {
        console.error('StoreInfoView getStoreEmployees error:', err);
        errors.employees = '직원 정보 불러오기 실패';
      }
      setApiErrors(errors);
      setError(Object.values(errors).filter(Boolean).join(' / ') || null);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className={styles.field}><p className={styles.fieldValue}>불러오는 중...</p></div>;
  }
  if (error || !store) {
    return (
      <div className={styles.field}>
        <p className={styles.fieldValue}>{error || '매장 정보를 불러올 수 없습니다.'}</p>
        {apiErrors.store && <p className={styles.fieldValue}>{apiErrors.store}</p>}
        {apiErrors.shift && <p className={styles.fieldValue}>{apiErrors.shift}</p>}
        {apiErrors.employees && <p className={styles.fieldValue}>{apiErrors.employees}</p>}
      </div>
    );
  }

  // closedDays가 "월,화" 또는 "일요일" 등으로 오면, 영업 요일은 제외된 요일만 표시
  // closedDays가 string 타입일 때 robust하게 배열로 파싱
  const normalizeDay = (d: string) => {
    // "일요일" -> "일", "월요일" -> "월" 등 변환
    if (!d) return d;
    return DAY_LABELS.find(label => d.startsWith(label)) || d;
  };
  let closedDaysArr: string[] = [];
  if (store.closedDays) {
    // 쉼표로 구분된 경우, 배열로 파싱
    closedDaysArr = store.closedDays
      .split(',')
      .map(s => normalizeDay(s.trim()))
      .filter(Boolean);
  } else {
    closedDaysArr = [];
  }
  const openDaysArr = DAY_LABELS.filter(day => !closedDaysArr.includes(day));
  console.log('[StoreInfoView] closedDaysArr:', closedDaysArr);
  console.log('[StoreInfoView] openDaysArr:', openDaysArr);

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
          {DAY_LABELS.map(day => (
            <span
              key={day}
              className={`${styles.dayChip} ${openDaysArr.includes(day) ? styles.dayActive : styles.dayInactive}`}
            >
              {day}
            </span>
          ))}
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

