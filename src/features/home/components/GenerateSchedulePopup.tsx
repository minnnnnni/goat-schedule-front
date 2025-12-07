import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import storeApi from "@/services/storeApi";
import ScheduleResultPicker from "@/features/schedule/components/ScheduleResultPicker";
import styles from "./GenerateSchedulePopup.module.css";

// 타입 정의
type Employee = { id: number; name: string; };
type ShiftType = string;
type Item = { id: number; employeeId: number | null; date: string; shift?: ShiftType | null; };

export default function GenerateSchedulePopup({ onClose, onGenerate }: { onClose?: () => void; onGenerate?: () => void }) {
  const router = useRouter();
  // 상태 관리
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasChange, setHasChange] = useState(false);
  const [excludeList, setExcludeList] = useState<Item[]>([{ id: 1, employeeId: null, date: "" }]);
  const [addList, setAddList] = useState<Item[]>([{ id: 1, employeeId: null, date: "", shift: null }]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  // 결과 모달 상태 및 데이터
  const [showResultModal, setShowResultModal] = useState(false);
  type ScheduleResult = { id: number; title: string; description: string };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [resultList, setResultList] = useState<ScheduleResult[]>([]);

  // 초기 데이터 로드
  useEffect(() => {
    storeApi.getStoreEmployees(1)
      .then(data => {
        console.log('[GenerateSchedulePopup] 직원 목록:', data);
        setEmployees(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('[GenerateSchedulePopup] 직원 목록 에러:', err);
        setEmployees([]);
      });
    storeApi.getShiftDefinitions(1)
      .then(defs => {
        console.log('[GenerateSchedulePopup] 시프트 목록 전체 응답:', defs);
        if (Array.isArray(defs)) {
          defs.forEach((d, i) => {
            console.log(`[시프트 ${i}] id:`, d.id, 'name:', d.name, 'startTime:', d.startTime, 'endTime:', d.endTime);
          });
          setShiftTypes(defs.map(d => d.name ?? ''));
        } else {
          setShiftTypes([]);
        }
      })
      .catch(err => {
        console.error('[GenerateSchedulePopup] 시프트 목록 에러:', err);
        setShiftTypes([]);
      });
  }, []);

  // 핸들러 함수들
  const handleAddList = (setList: React.Dispatch<React.SetStateAction<Item[]>>) => {
    setList(prev => [...prev, { id: Date.now(), employeeId: null, date: "" }]);
  };
  const handleRemoveList = (id: number, setList: React.Dispatch<React.SetStateAction<Item[]>>) => {
    setList(prev => prev.filter(item => item.id !== id));
  };
  const handleChange = (
    id: number,
    field: keyof Item,
    value: number | string | ShiftType | null,
    setList: React.Dispatch<React.SetStateAction<Item[]>>
  ) => {
    setList(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // 근무표 생성 버튼 클릭 시 AI 시간표 3개 생성 (모킹)
  const handleGenerate = async () => {
    // 실제로는 백엔드에 정보 전달 후 결과 3개 받아옴
    // 여기선 모킹
    const mockResults = [
      { id: 1, title: "근무표 1", description: `${startDate} ~ ${endDate}` },
      { id: 2, title: "근무표 2", description: `${startDate} ~ ${endDate}` },
      { id: 3, title: "근무표 3", description: `${startDate} ~ ${endDate}` },
    ];
    setResultList(mockResults);
    setShowResultModal(true);
    if (onGenerate) onGenerate();
  };

  // 근무표 확정 시 (API 연동 후 홈으로 이동)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleConfirmResult = async (selectedId: number) => {
    // 실제로는 확정된 시간표를 백엔드에 저장
    // await api.confirmSchedule(selectedId);
    setShowResultModal(false);
    router.push("/"); // 홈으로 이동
  };

  // 뒤로가기 (결과 모달 닫기)
  const handleResultBack = () => {
    setShowResultModal(false);
  };

  return (
    <>
      <Modal>
        <div className={styles.popupWrap}>
          {/* 1. 헤더 */}
          <div className={styles.header}>
            <button onClick={onClose} className={styles.backBtn}>‹</button>
            <div className={styles.headerTitle}>근무표 생성하기</div>
          </div>

          {/* 2. 본문 */}
          <div className={styles.body}>
            <div className={styles.cardWrap}>
              {/* 기간 설정 */}
              <div className={styles.section}>
                <label className={styles.cardLabel}>기간</label>
                <div className={styles.dateRangeRow}>
                  <input 
                    type="date" 
                    className={styles.inputBase} 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                  />
                  <span className={styles.tilde}>~</span>
                  <input 
                    type="date" 
                    className={styles.inputBase} 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                  />
                </div>
              </div>

              <hr className={styles.divider} />

              {/* 변경사항 체크박스 */}
              <label className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={hasChange} 
                  onChange={(e) => setHasChange(e.target.checked)} 
                />
                <span className={styles.checkboxLabel}>변경사항이 있습니까?</span>
              </label>

              {/* 변경사항이 있을 때만 표시 */}
              {hasChange && (
                <div className={styles.fadeEnter}>
                  {/* 근무 제외 섹션 */}
                  <div style={{ marginBottom: "32px" }}>
                    <label className={styles.cardLabel}>이날 근무 제외</label>
                    {excludeList.map((item) => (
                      <div key={item.id} className={styles.dynamicItem}>
                        <div className={styles.inputRow}>
                          <select 
                            className={styles.select}
                            value={item.employeeId ?? ""}
                            onChange={(e) => handleChange(item.id, "employeeId", Number(e.target.value), setExcludeList)}
                          >
                            <option value="">이름 선택</option>
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                          </select>
                          <input 
                            type="date" 
                            className={styles.inputDateSmall} 
                            value={item.date} 
                            onChange={(e) => handleChange(item.id, "date", e.target.value, setExcludeList)} 
                          />
                          <button onClick={() => handleRemoveList(item.id, setExcludeList)} className={styles.removeBtn}>✕</button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => handleAddList(setExcludeList)} className={styles.addBtn}>
                      + 추가
                    </button>
                  </div>

                  {/* 근무 추가 섹션 */}
                  <div>
                    <label className={styles.cardLabel}>이날 근무 추가</label>
                    {addList.map((item) => (
                      <div key={item.id} className={styles.dynamicItem}>
                        <div className={styles.inputRow}>
                          <select 
                            className={styles.select}
                            value={item.employeeId ?? ""}
                            onChange={(e) => handleChange(item.id, "employeeId", Number(e.target.value), setAddList)}
                          >
                            <option value="">알바생 선택</option>
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                          </select>
                          <input 
                            type="date" 
                            className={styles.inputDateSmall} 
                            value={item.date} 
                            onChange={(e) => handleChange(item.id, "date", e.target.value, setAddList)} 
                          />
                          <button onClick={() => handleRemoveList(item.id, setAddList)} className={styles.removeBtn}>✕</button>
                        </div>
                        {/* 시프트 선택 버튼 */}
                        <div className={styles.shiftRow}>
                          {(shiftTypes.length > 0 ? shiftTypes : ["오전", "미들", "오후"]).map((shift) => (
                            <button
                              key={shift}
                              className={`${styles.shiftBtn} ${item.shift === shift ? styles.selected : ""}`}
                              onClick={() => handleChange(item.id, "shift", shift, setAddList)}
                            >
                              {shift}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button onClick={() => handleAddList(setAddList)} className={styles.addBtn}>
                      + 추가
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* 근무표 생성 버튼은 항상 카드 아래에 고정 */}
            <button className={styles.generateBtn} onClick={handleGenerate}>
              자동 근무표 생성
            </button>
          </div>
        </div>
      </Modal>
      {/* 결과 모달 */}
      {showResultModal && (
        <Modal>
          <ScheduleResultPicker
            onSelect={handleConfirmResult}
            onBack={handleResultBack}
            // 필요시 resultList를 ScheduleResultPicker에 전달
          />
        </Modal>
      )}
    </>);
}