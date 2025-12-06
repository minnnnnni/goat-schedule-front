import { useShiftsForDate, ShiftItem } from '@/features/schedule/hooks/useShifts';

interface DailyShiftListPresenterProps {
  shifts: ShiftItem[];
  onEdit: (shift: ShiftItem) => void;
  isLoading: boolean;
  error: Error | null;
}

function DailyShiftListPresenter({ shifts, onEdit, isLoading, error }: DailyShiftListPresenterProps) {
  if (isLoading) {
    return (
      <div style={{ padding: 12 }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ background: '#f3f4f6', borderRadius: 12, height: 73, marginBottom: 16, animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }`}</style>
      </div>
    );
  }
  if (error) {
    return <div style={{ padding: 24, color: '#ef4444', textAlign: 'center' }}>근무 정보를 불러오는 데 실패했습니다.</div>;
  }
  if (!shifts || shifts.length === 0) {
    return <div style={{ padding: 24, color: '#888', textAlign: 'center' }}>등록된 근무가 없습니다</div>;
  }
  return (
    <div style={{ padding: 12 }}>
      {shifts.map((shift, index) => {
        // 근무 유형 이름에 의존하지 않고, 순서에 따라 동적으로 색상을 할당합니다.
        const colors = ['#e3edff', '#d6f5d6', '#ede3ff'];
        const color = colors[index % colors.length];
        return (
          <div key={shift.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 16, padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ background: color, borderRadius: 32, padding: '6px 18px', fontWeight: 700, fontSize: 15 }}>{shift.type}</span>
              <span style={{ fontSize: 14, color: '#555' }}>{shift.startTime} - {shift.endTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{shift.employeeName}</span>
              <button style={{ background: '#f5f6ff', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#2563eb', fontWeight: 700, cursor: 'pointer', fontSize: 14 }} onClick={() => onEdit(shift)}>수정</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 프리젠터: props 기반 렌더링
interface DailyShiftListProps {
  selectedDate: Date | null;
  onEdit: (shift: ShiftItem) => void;
}

export default function DailyShiftList({ selectedDate, onEdit }: DailyShiftListProps) {
  // useShiftsForDate 훅을 사용하여 선택된 날짜의 근무 데이터를 가져옵니다.
  // TODO: 로딩 및 에러 상태에 대한 UI 처리 추가 필요
  const { shifts, isLoading, error } = useShiftsForDate(selectedDate);
  return <DailyShiftListPresenter shifts={shifts} onEdit={onEdit} isLoading={isLoading} error={error} />;
}
