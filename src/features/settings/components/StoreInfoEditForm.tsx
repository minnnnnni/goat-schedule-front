"use client";


import { useEffect, useState } from "react";
import styles from "./StoreInfoEditForm.module.css";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import storeApi from "@/services/storeApi";
import type { StoreView } from "@/services/storeApi";

export type TimeBlock = {
  id: number;
  title: string;
  sub: string;
  start: string;
  end: string;
  color: "blue" | "green" | "purple" | string;
};

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export default function StoreInfoEditForm() {
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
            title: d.title ?? `타임 ${d.id ?? ''}`,
            sub: d.sub ?? "",
            start: d.start ?? '',
            end: d.end ?? '',
            color: (typeof d.color === 'string' && d.color) ? d.color : 'blue',
          })),
        });
        setError(null);
      } catch (err) {
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
  const handleTimeBlockChange = (id: number, key: keyof Pick<TimeBlock, "sub" | "start" | "end">, value: string) => {
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
        openTime: form.openTime,
        closeTime: form.closeTime,
        businessDays: form.businessDays,
      });
      // TODO: Shift definitions 저장은 별도 엔드포인트 필요
      alert('저장되었습니다.');
    } catch (err) {
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
              className={`${styles.dayButton} ${form.businessDays[idx] ? styles.dayButtonActive : ""}`}
              aria-pressed={form.businessDays[idx]}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.field}>
        <p className={styles.fieldLabel}>타임 설정</p>
        <div className={styles.timeEditList}>
          {form.timeBlocks.map((tb: TimeBlock) => (
            <div
              key={tb.id}
              className={`${styles.timeEditCard} ${
                tb.color === "blue"
                  ? styles.timeEditBlue
                  : tb.color === "green"
                  ? styles.timeEditGreen
                  : styles.timeEditPurple
              }`}
            >
              <div className={styles.timeEditHeader}>
                <span className={styles.timeEditTitle}>{tb.title}</span>
              </div>
              <div className={styles.timeEditRow}>
                <Input
                  label="타임 이름"
                  value={tb.sub}
                  onChange={(e) => handleTimeBlockChange(tb.id, "sub", e.target.value)}
                  wrapperClassName={styles.inputWrapper}
                  variant="soft"
                  size="md"
                />
                <Input
                  label="시작"
                  type="time"
                  value={tb.start}
                  onChange={(e) => handleTimeBlockChange(tb.id, "start", e.target.value)}
                  wrapperClassName={styles.inputWrapper}
                  variant="soft"
                  size="md"
                />
                <Input
                  label="종료"
                  type="time"
                  value={tb.end}
                  onChange={(e) => handleTimeBlockChange(tb.id, "end", e.target.value)}
                  wrapperClassName={styles.inputWrapper}
                  variant="soft"
                  size="md"
                />
              </div>
            </div>
          ))}
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
