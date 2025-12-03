"use client";


import { useEffect, useState } from "react";
import styles from "./StoreInfoEditForm.module.css";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import storeApi from "@/services/storeApi";
import type { StoreView } from "@/services/storeApi";

export type TimeBlock = {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
};

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export default function StoreInfoEditForm() {
    // 타임 추가
    const handleAddTimeBlock = () => {
      setForm(prev => prev ? {
        ...prev,
        timeBlocks: [
          ...prev.timeBlocks,
          {
            id: Date.now(),
            name: '',
            startTime: '',
            endTime: '',
          }
        ]
      } : prev);
    };

    // 타임 삭제
    const handleRemoveTimeBlock = (id: number) => {
      setForm(prev => prev ? {
        ...prev,
        timeBlocks: prev.timeBlocks.filter(tb => tb.id !== id)
      } : prev);
    };
  const STORE_ID = 1; // TODO: auth/route에서 가져오도록 교체
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<(StoreView & { timeBlocks: TimeBlock[] }) | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [s, defs] = await Promise.all([
          storeApi.getStore(STORE_ID),
          storeApi.getShiftDefinitions(STORE_ID),
        ]);
        setForm({
          ...s,
          timeBlocks: (defs || []).map(d => ({
            id: d.id ?? 0,
            name: d.name ?? `타임 ${d.id ?? ''}`,
            startTime: d.startTime ?? '',
            endTime: d.endTime ?? '',
          })),
        });
        setError(null);
      } catch {
        setError('매장 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => prev ? { ...prev, name: e.target.value } : prev);
  const handleChangeOpen = (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => prev ? { ...prev, openTime: e.target.value } : prev);
  const handleChangeClose = (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => prev ? { ...prev, closeTime: e.target.value } : prev);
  const handleToggleBusinessDay = (idx: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      const next = [...prev.businessDays];
      next[idx] = !next[idx];
      return { ...prev, businessDays: next };
    });
  };
  const handleTimeBlockChange = (id: number, key: keyof Pick<TimeBlock, "name" | "startTime" | "endTime">, value: string) => {
    setForm((prev) => prev ? {
      ...prev,
      timeBlocks: prev.timeBlocks.map((tb: TimeBlock) => (tb.id === id ? { ...tb, [key]: value } : tb)),
    } : prev);
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await storeApi.updateStore(STORE_ID, {
        name: form.name,
        address: form.address,
        contact: form.contact,
        closedDays: form.closedDays,
        openTime: form.openTime,
        closeTime: form.closeTime,
      });

      // 타임(shift definition) 저장
      for (const tb of form.timeBlocks) {
        await storeApi.createShiftDefinition(STORE_ID, {
          title: tb.name,
          start_time: tb.startTime,
          end_time: tb.endTime,
        });
      }
      alert('저장되었습니다.');
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.field}><p className={styles.fieldValue}>불러오는 중...</p></div>;
  }
  if (error || !form) {
    return <div className={styles.field}><p className={styles.fieldValue}>{error || '매장 정보를 불러올 수 없습니다.'}</p></div>;
  }

  // 색상 클래스 배열 (StoreInfoView와 동일하게)
  const colorClasses = [styles.timeEditBlue, styles.timeEditGreen, styles.timeEditPurple];

  return (
    <div className={styles.editFormCard}>
      <Input
        label="매장명"
        value={form.name}
        onChange={handleChangeName}
        wrapperClassName={styles.inputWrapper}
        variant="soft"
        size="lg"
      />
      <Input
        label="매장 주소"
        value={form.address ?? ''}
        onChange={e => setForm(prev => prev ? { ...prev, address: e.target.value } : prev)}
        wrapperClassName={styles.inputWrapper}
        variant="soft"
        size="lg"
        style={{ marginTop: 8 }}
      />
      <Input
        label="연락처"
        value={form.contact ?? ''}
        onChange={e => setForm(prev => prev ? { ...prev, contact: e.target.value } : prev)}
        wrapperClassName={styles.inputWrapper}
        variant="soft"
        size="lg"
        style={{ marginTop: 8 }}
      />
      <div className={styles.inputRow}>
        <Input
          label="오픈시간"
          type="time"
          value={form.openTime}
          onChange={handleChangeOpen}
          wrapperClassName={styles.inputWrapper}
          variant="soft"
          size="md"
        />
        <Input
          label="종료시간"
          type="time"
          value={form.closeTime}
          onChange={handleChangeClose}
          wrapperClassName={styles.inputWrapper}
          variant="soft"
          size="md"
        />
      </div>
      <div className={styles.field}>
        <p className={styles.fieldLabel}>영업요일</p>
        <div className={styles.dayToggleWrap}>
          {DAY_LABELS.map((day, idx) => (
            <button
              key={day}
              type="button"
              onClick={() => handleToggleBusinessDay(idx)}
              className={`
                ${styles.dayButton} 
                ${form.businessDays[idx] ? styles.dayButtonActive : ''}
                dayChip
                ${form.businessDays[idx] ? 'dayActive' : 'dayInactive'}
              `}
              aria-pressed={form.businessDays[idx]}
              style={{
                padding: '6px 10px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                border: form.businessDays[idx] ? 'none' : '1px solid #e5e7eb',
                background: form.businessDays[idx] ? '#2563eb' : '#f3f4f6',
                color: form.businessDays[idx] ? '#fff' : '#9ca3af',
                marginBottom: '2px',
              }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.field}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <p className={styles.fieldLabel}>타임 설정</p>
          <button type="button" onClick={handleAddTimeBlock} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '4px 10px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
            <span style={{ fontSize: 18, fontWeight: 900 }}>+</span> 타임 추가
          </button>
        </div>
        <div className={styles.timeEditList}>
          {form.timeBlocks.map((tb: TimeBlock, idx: number) => {
            const colorClass = colorClasses[idx % colorClasses.length];
            return (
              <div
                key={tb.id}
                className={`${styles.timeEditCard} ${colorClass}`}
                style={{ position: 'relative' }}
              >
                <div className={styles.timeEditHeader}>
                  <span className={styles.timeEditTitle}>{`타임 ${idx + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeBlock(tb.id)}
                    style={{ background: 'none', border: 'none', color: '#e11d48', fontSize: 22, fontWeight: 900, cursor: 'pointer', marginLeft: 8 }}
                    aria-label="타임 삭제"
                  >
                    ×
                  </button>
                </div>
                <div className={styles.timeEditRow}>
                  <Input
                    label="타임 이름"
                    value={tb.name}
                    onChange={(e) => handleTimeBlockChange(tb.id, "name", e.target.value)}
                    wrapperClassName={styles.inputWrapper}
                    variant="soft"
                    size="md"
                  />
                  <Input
                    label="시작"
                    type="time"
                    value={tb.startTime}
                    onChange={(e) => handleTimeBlockChange(tb.id, "startTime", e.target.value)}
                    wrapperClassName={styles.inputWrapper}
                    variant="soft"
                    size="md"
                  />
                  <Input
                    label="종료"
                    type="time"
                    value={tb.endTime}
                    onChange={(e) => handleTimeBlockChange(tb.id, "endTime", e.target.value)}
                    wrapperClassName={styles.inputWrapper}
                    variant="soft"
                    size="md"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.saveRow}>
        <Button
          onClick={handleSave}
          disabled={!!saving}
          className={`w-full ${styles.saveBtnLarge} ${styles.saveBtnAccent}`}
          size="lg"
          variant="secondary"
        >
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}
