
// 타입 정의
interface Shift {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  employeeName: string;
}

interface DailyShiftListPresenterProps {
  shifts: Shift[];
  onEdit: (shift: Shift) => void;
}

function DailyShiftListPresenter({ shifts, onEdit }: DailyShiftListPresenterProps) {
  if (shifts.length === 0) {
    return <div style={{ padding: 24, color: '#888', textAlign: 'center' }}>등록된 근무가 없습니다</div>;
  }
  return (
    <div style={{ padding: 12 }}>
      {shifts.map((shift) => {
        const color =
          shift.type === '오전' ? '#e3edff'
          : shift.type === '미들' ? '#d6f5d6'
          : '#ede3ff';
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
  shifts: Shift[];
  onEdit: (shift: Shift) => void;
}

export default function DailyShiftList({ shifts, onEdit }: DailyShiftListProps) {
  return <DailyShiftListPresenter shifts={shifts} onEdit={onEdit} />;
}

