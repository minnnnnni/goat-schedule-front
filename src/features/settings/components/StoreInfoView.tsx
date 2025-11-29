
import { useEffect, useState } from "react";
import styles from "./StoreInfoView.module.css";
import storeApi from "@/services/storeApi";
import type { StoreView, EmployeeView } from "@/services/storeApi";

export type TimeBlock = {
  id: number;
  title: string;
  sub: string;
  start: string;
  end: string;
  color: "blue" | "green" | "purple" | string;
};

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export default function StoreInfoView() {
  const STORE_ID = 1; // TODO: auth/route에서 가져오도록 교체
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [store, setStore] = useState<StoreView | null>(null);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [employees, setEmployees] = useState<EmployeeView[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [s, defs, emps] = await Promise.all([
          storeApi.getStore(STORE_ID),
          storeApi.getShiftDefinitions(STORE_ID),
          storeApi.getStoreEmployees(STORE_ID),
        ]);
        console.debug('[StoreInfoView] storeApi.getStore result:', s);
        setStore(s);
        console.debug('[StoreInfoView] storeApi.getShiftDefinitions result:', defs);
        setTimeBlocks(
          (defs || []).map(d => ({
            id: d.id ?? 0,
            title: d.title ?? `타임 ${d.id ?? ''}`,
            sub: d.sub ?? "",
            start: d.start ?? '',
            end: d.end ?? '',
            color: (typeof d.color === 'string' && d.color) ? d.color : 'blue',
          }))
        );
        console.debug('[StoreInfoView] storeApi.getStoreEmployees result:', emps);
        setEmployees(emps || []);
        setError(null);
      } catch (err) {
        console.error('StoreInfoView useEffect error:', err);
        setError('매장 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className={styles.field}><p className={styles.fieldValue}>불러오는 중...</p></div>;
  }
  if (error || !store) {
    return <div className={styles.field}><p className={styles.fieldValue}>{error || '매장 정보를 불러올 수 없습니다.'}</p></div>;
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
          {DAY_LABELS.map((day, idx) => (
            <span
              key={day}
              className={`${styles.dayChip} ${store.businessDays?.[idx] ? styles.dayActive : styles.dayInactive}`}
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <p className={styles.fieldLabel}>운영 시간</p>
        <p className={styles.fieldValue}>
          {store.openTime} - {store.closeTime}
        </p>
      </div>

      {employees.length > 0 && (
        <div className={styles.field}>
          <p className={styles.fieldLabel}>직원 리스트</p>
          <ul className={styles.employeeList}>
            {employees.map(emp => (
              <li key={emp.id} className={styles.employeeItem}>
                <span>{emp.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.field}>
        <p className={styles.fieldLabel}>타임 설정</p>
        <div className={styles.timeList}>
          {timeBlocks.map(tb => {
            let colorClass = '';
            let style: React.CSSProperties = {};
            if (tb.color === 'blue') colorClass = styles.timeBlue;
            else if (tb.color === 'green') colorClass = styles.timeGreen;
            else if (tb.color === 'purple') colorClass = styles.timePurple;
            else if (tb.color) style = { background: tb.color };

            return (
              <div key={tb.id} className={`${styles.timeCard} ${colorClass}`} style={style}>
                <p className={styles.timeTitle}>{tb.title}</p>
                {tb.sub && <p className={styles.timeSub}>{tb.sub}</p>}
                <p className={styles.timeRange}>
                  {tb.start} - {tb.end}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

