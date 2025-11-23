import styles from "@/app/(main)/settings/SettingsPage.module.css";

type TimeBlock = {
  id: number;
  title: string;
  sub: string;
  start: string;
  end: string;
  color: "blue" | "green" | "purple" | string;
};

type StoreInfoViewProps = {
  name: string;
  openTime: string;
  closeTime: string;
  businessDays: boolean[];
  timeBlocks: TimeBlock[];
};

export default function StoreInfoView({
  name,
  openTime,
  closeTime,
  businessDays,
  timeBlocks,
}: StoreInfoViewProps) {
  const dayIndexMap: Record<string, number> = {
    일: 0,
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
  };
  const orderedDays = ["월", "화", "수", "목", "금", "토", "일"]; // Monday-first for display

  return (
    <div>
      <div className={styles.field}>
        <p className={styles.fieldLabel}>매장명</p>
        <p className={styles.fieldValue}>{name}</p>
      </div>

      <div className={styles.field}>
        <p className={styles.fieldLabel}>영업 요일</p>
        <div className={styles.days}>
          {orderedDays.map((day) => {
            const idx = dayIndexMap[day];
            const active = !!businessDays?.[idx];
            return (
              <span
                key={day}
                className={`${styles.dayChip} ${active ? styles.dayActive : styles.dayInactive}`}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>

      <div className={styles.field}>
        <p className={styles.fieldLabel}>운영 시간</p>
        <p className={styles.fieldValue}>
          {openTime} - {closeTime}
        </p>
      </div>

      <div className={styles.field}>
        <p className={styles.fieldLabel}>타임 설정</p>
        <div className={styles.timeList}>
          {(timeBlocks || []).map((tb: TimeBlock) => {
            const colorClass =
              tb.color === "blue"
                ? styles.timeBlue
                : tb.color === "green"
                ? styles.timeGreen
                : styles.timePurple;
            return (
              <div key={tb.id} className={`${styles.timeCard} ${colorClass}`}>
                <p className={styles.timeTitle}>{tb.title}</p>
                <p className={styles.timeSub}>{tb.sub}</p>
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

