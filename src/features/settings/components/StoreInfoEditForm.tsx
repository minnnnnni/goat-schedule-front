"use client";

import { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
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

interface StoreInfoEditFormProps {
  onSaveSuccess: () => void;
}

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export default function StoreInfoEditForm({ onSaveSuccess }: StoreInfoEditFormProps) {
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

  // 타임 추가
  const handleAddTimeBlock = () => {
    setForm(prev => prev ? {
      ...prev,
      timeBlocks: [
        ...prev.timeBlocks,
        {
          id: Date.now(), // 임시 ID
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

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => prev ? { ...prev, name: e.target.value } : prev);
  const handleChangeOpen = (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => prev ? { ...prev, openTime: e.target.value } : prev);
  const handleChangeClose = (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => prev ? { ...prev, closeTime: e.target.value } : prev);

  const handleToggleOpenDay = (idx: number) => {
  setForm((prev) => {
    if (!prev) return prev;
    const day = DAY_LABELS[idx];
    let nextArr = prev.openDaysArr ? [...prev.openDaysArr] : [...DAY_LABELS];
    if (nextArr.includes(day)) {
      nextArr = nextArr.filter(d => d !== day);
    } else {
      nextArr.push(day);
      nextArr = DAY_LABELS.filter(d => nextArr.includes(d)); // 순서 보장
    }
    return { ...prev, openDaysArr: nextArr };
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
      // 1. 매장 정보 업데이트
      await storeApi.updateStore(STORE_ID, {
        name: form.name,
        address: form.address,
        contact: form.contact,
        openTime: form.openTime,
        closeTime: form.closeTime,
        openDaysArr: form.openDaysArr, // openDaysArr를 그대로 전달
      });

      // 2. 기존 타임(shift definition)을 모두 삭제
      const existingShiftDefinitions = await storeApi.getShiftDefinitions(STORE_ID);
      for (const def of existingShiftDefinitions) {
        await storeApi.deleteShiftDefinition(STORE_ID, def.id);
      }

      // 3. 현재 폼에 있는 타임을 새로 생성
      for (const tb of form.timeBlocks) {
        await storeApi.createShiftDefinition(STORE_ID, {
          name: tb.name,
          startTime: tb.startTime,
          endTime: tb.endTime,
        });
      }
      onSaveSuccess();
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
    <form className={styles.editFormCard} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
          {DAY_LABELS.map((day, idx) => {
            const isOpen = form.openDaysArr?.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleToggleOpenDay(idx)}
                className={`
                  ${styles.dayButton} ${isOpen ? styles.dayButtonActive : styles.dayButtonInactive}
                `}
                aria-pressed={isOpen}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles.field}>
        <div className={styles.fieldHeader}>
          <p className={styles.fieldLabel}>타임 설정</p>
          <button type="button" onClick={handleAddTimeBlock} className={styles.addTimeButton}>
            <PlusIcon className={styles.addTimeIcon} /> 타임 추가
          </button>
        </div>
        <div className={styles.timeEditList}>
          {form.timeBlocks.map((tb: TimeBlock, idx: number) => {
            const colorClass = colorClasses[idx % colorClasses.length];
            return (
              <div
                key={tb.id}
                className={`${styles.timeEditCard} ${colorClass}`}
              >
                <div className={styles.timeEditHeader}>
                  <span className={styles.timeEditTitle}>{`타임 ${idx + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeBlock(tb.id)}
                    className={styles.removeTimeButton}
                    aria-label="타임 삭제"
                  >
                    <TrashIcon />
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
          type="submit"
          disabled={!!saving}
          className={`w-full ${styles.saveBtnLarge} ${styles.saveBtnAccent}`}
          size="lg"
          variant="secondary"
        >
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
