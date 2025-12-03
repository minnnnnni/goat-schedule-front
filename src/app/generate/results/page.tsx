"use client";
import ScheduleResultPicker from "@/features/schedule/components/ScheduleResultPicker";

export default function Page() {
  // 선택 결과를 처리하는 함수 (예시)
  const handleSelect = (id: number) => {
    alert(`선택된 결과 ID: ${id}`);
    // 실제로는 라우팅, 상태 저장 등 추가 작업 가능
  };
  return <ScheduleResultPicker onSelect={handleSelect} />;
}


