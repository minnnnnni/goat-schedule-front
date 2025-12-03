

import React, { useState } from "react";
import styles from "./ScheduleResultPicker.module.css";

// 예시 결과 데이터 (실제 API 연동 시 교체)
const mockResults = [
  { id: 1, title: "근무표 1", description: "2025.11.08 ~ 2025.11.14" },
  { id: 2, title: "근무표 2", description: "2025.11.08 ~ 2025.11.14" },
  { id: 3, title: "근무표 3", description: "2025.11.08 ~ 2025.11.14" },
];

// 출력 컴포넌트
function ScheduleResultCard({ result, selected, onClick, idx }: {
  result: typeof mockResults[0];
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
        <div className="date">2025-11-08 (토)</div>
        <div className="row"><span>오전</span><span>김민수</span></div>
        <div className="row"><span>미들</span><span>홍길동</span></div>
        <div className="row"><span>오후</span><span>홍길동</span></div>
        <div className="date">2025-11-09 (일)</div>
        <div className="row"><span>오전</span><span>김민수</span></div>
        <div className="row"><span>미들</span><span>홍길동</span></div>
        <div className="row"><span>오후</span><span>홍길동</span></div>
        <div className="date">2025-11-10 (월)</div>
        <div className="row"><span>오전</span><span>김민수</span></div>
        <div className="row"><span>미들</span><span>홍길동</span></div>
        <div className="row"><span>오후</span><span>홍길동</span></div>
        <div className="more">... 외 5일</div>
      </div>
    </div>
  );
}

// 기능 컴포넌트

type ScheduleResultPickerProps = {
  onSelect?: (id: number) => void;
  onBack?: () => void;
};

export default function ScheduleResultPicker({ onSelect, onBack }: ScheduleResultPickerProps) {
  const [selectedId, setSelectedId] = useState<number | null>(1);

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
            <div className={styles.subtitle}>AI가 생성한 3개의 근무표 중 하나를 선택하세요</div>
          </div>
        </div>
        {/* 결과 카드 리스트 (스크롤) */}
        <div className={styles.cardList}>
          {mockResults.map((result, idx) => (
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
