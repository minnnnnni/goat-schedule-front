

import React, { useState } from "react";
import styles from "./ScheduleResultPicker.module.css";

// 타입 정의: 실제 API 결과 구조에 맞게 수정 필요
type ScheduleResult = {
  id: number;
  title: string;
  description: string;
  days?: Array<{
    date: string;
    shifts: Array<{ name: string; employee: string }>;
  }>;
};

// 출력 컴포넌트
function ScheduleResultCard({ result, selected, onClick, idx }: {
  result: ScheduleResult;
  selected: boolean;
  onClick: () => void;
  idx: number;
}) {
  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ""} ${styles[`bg${(idx % 3) + 1}`]}`}
      onClick={onClick}
    >
      <div className={styles.radio}>
        {selected && (
          <svg width="16" height="16" className={styles.radioIcon}>
            <circle cx="8" cy="8" r="6" fill="#fff" />
          </svg>
        )}
      </div>
      <div className={styles.cardTitle}>{result.title}</div>
      <div className={styles.cardDesc}>{result.description}</div>
      <div className={styles.cardContent}>
        {result.days && result.days.length > 0 ? (
          result.days.slice(0, 3).map((day) => (
            <React.Fragment key={day.date}>
              <div className="date">{day.date}</div>
              {day.shifts.map((shift, j) => (
                <div className="row" key={j}>
                  <span>{shift.name}</span>
                  <span>{shift.employee}</span>
                </div>
              ))}
            </React.Fragment>
          ))
        ) : (
          <div className="row">근무표 데이터 없음</div>
        )}
        {result.days && result.days.length > 3 && (
          <div className="more">... 외 {result.days.length - 3}일</div>
        )}
      </div>
    </div>
  );
}

// 기능 컴포넌트

type ScheduleResultPickerProps = {
  onSelect?: (id: number) => void;
  onBack?: () => void;
  resultList?: ScheduleResult[];
};

export default function ScheduleResultPicker(props: ScheduleResultPickerProps) {
  const { onSelect, onBack, resultList } = props;
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };
  const handleConfirm = () => {
    if (selectedId && onSelect) {
      onSelect(selectedId);
    } else {
      alert(`선택된 근무표: ${selectedId}`);
    }
    // 실제로는 API 호출, 상태 저장, 라우팅 등 추가 작업 가능
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* 상단 헤더 */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>&lt;</button>
          <div>
            <div className={styles.title}>생성된 근무표 선택</div>
            <div className={styles.subtitle}>AI가 생성한 근무표 중 하나를 선택하세요</div>
          </div>
        </div>
        {/* 결과 카드 리스트 (스크롤) */}
        <div className={styles.cardList}>
          {(Array.isArray(resultList) ? resultList : []).map((result: ScheduleResult, idx: number) => (
            <ScheduleResultCard
              key={result.id}
              result={result}
              selected={selectedId === result.id}
              onClick={() => setSelectedId(result.id)}
              idx={idx}
            />
          ))}
        </div>
        {/* 하단 확정 버튼 */}
        <div style={{ padding: "0 24px 24px 24px" }}>
          <button
            className={styles.confirmBtn}
            disabled={!selectedId}
            onClick={handleConfirm}
          >
            선택한 근무표 확정
          </button>
        </div>
      </div>
    </div>
  );
}
