"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SettingsPage.module.css";
import { BuildingStorefrontIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useDummyStore } from "@/app/dummy/useDummyData";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { TimeBlock, Store } from "@/app/dummy/db";
import { updateStore as updateStoreApi } from "@/app/dummy/db";

type EditableStore = Pick<Store, "name" | "openTime" | "closeTime" | "businessDays" | "timeBlocks">;

export default function SettingsPage() {
  const router = useRouter();
  const { store, loading, refresh } = useDummyStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditableStore | null>(null);
  const [saving, setSaving] = useState(false);

  const dayIndexMap: Record<string, number> = { "일": 0, "월": 1, "화": 2, "수": 3, "목": 4, "금": 5, "토": 6 };
  const orderedDays = ["월", "화", "수", "목", "금", "토", "일"]; // Monday-first for display

  useEffect(() => {
    if (store) {
      // Initialize/refresh form from store when not actively editing
      setForm({
        name: store.name,
        openTime: store.openTime,
        closeTime: store.closeTime,
        businessDays: [...(store.businessDays || [])],
        timeBlocks: [...(store.timeBlocks || [])],
      });
    }
  }, [store]);

  const handleLogout = () => {
    router.replace("/login");
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Cancel -> reset form from latest store
      if (store) {
        setForm({
          name: store.name,
          openTime: store.openTime,
          closeTime: store.closeTime,
          businessDays: [...(store.businessDays || [])],
          timeBlocks: [...(store.timeBlocks || [])],
        });
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const updateForm = (patch: Partial<EditableStore>) => {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => updateForm({ name: e.target.value });
  const handleChangeOpen = (e: React.ChangeEvent<HTMLInputElement>) => updateForm({ openTime: e.target.value });
  const handleChangeClose = (e: React.ChangeEvent<HTMLInputElement>) => updateForm({ closeTime: e.target.value });
  const handleToggleBusinessDay = (idx: number) => {
    if (!form) return;
    const next = [...form.businessDays];
    next[idx] = !next[idx];
    updateForm({ businessDays: next });
  };
  const handleTimeBlockChange = (id: number, key: keyof Pick<TimeBlock, "sub" | "start" | "end">, value: string) => {
    if (!form) return;
    const nextBlocks = form.timeBlocks.map((tb) => (tb.id === id ? { ...tb, [key]: value } : tb));
    updateForm({ timeBlocks: nextBlocks });
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await updateStoreApi({
        name: form.name,
        openTime: form.openTime,
        closeTime: form.closeTime,
        businessDays: form.businessDays,
        timeBlocks: form.timeBlocks,
      });
      await refresh();
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrap} />

      <section>
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <BuildingStorefrontIcon className={styles.storeIcon} aria-hidden="true" />
            <span>매장 정보</span>
          </div>
          <button onClick={handleToggleEdit} className={styles.editBtn}>
            {isEditing ? "취소" : "수정"}
          </button>
        </div>

        <div className={styles.innerPanel}>
          {loading || !store || !form ? (
            <div className={styles.field}>
              <p className={styles.fieldValue}>불러오는 중...</p>
            </div>
          ) : !isEditing ? (
            <div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>매장명</p>
                <p className={styles.fieldValue}>{form.name}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>영업 요일</p>
                <div className={styles.days}>
                  {orderedDays.map((day) => {
                    const idx = dayIndexMap[day];
                    const active = !!form.businessDays?.[idx];
                    return (
                      <span key={day} className={`${styles.dayChip} ${active ? styles.dayActive : styles.dayInactive}`}>
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>운영 시간</p>
                <p className={styles.fieldValue}>
                  {form.openTime} - {form.closeTime}
                </p>
              </div>

              {/* 타임 설정 */}
              <div className={styles.field}>
                <p className={styles.fieldLabel}>타임 설정</p>
                <div className={styles.timeList}>
                  {(form.timeBlocks || []).map((tb: TimeBlock) => {
                    const colorClass = tb.color === 'blue' ? styles.timeBlue : tb.color === 'green' ? styles.timeGreen : styles.timePurple;
                    return (
                      <div key={tb.id} className={`${styles.timeCard} ${colorClass}`}>
                        <p className={styles.timeTitle}>{tb.title}</p>
                        <p className={styles.timeSub}>{tb.sub}</p>
                        <p className={styles.timeRange}>{tb.start} - {tb.end}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.editForm}>
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
                  {orderedDays.map((day) => {
                    const idx = dayIndexMap[day];
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleBusinessDay(idx)}
                        className={`${styles.dayButton} ${form.businessDays[idx] ? styles.dayButtonActive : ''}`}
                        aria-pressed={form.businessDays[idx]}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>타임 설정</p>
                <div className={styles.timeEditList}>
                  {form.timeBlocks.map((tb) => (
                    <div
                      key={tb.id}
                      className={`${styles.timeEditCard} ${
                        tb.color === 'blue'
                          ? styles.timeEditBlue
                          : tb.color === 'green'
                          ? styles.timeEditGreen
                          : styles.timeEditPurple
                      }`}
                    >
                      <div className={styles.timeEditHeader}>
                        <span className={styles.timeEditTitle}>{tb.title}</span>
                      </div>
                      <div className={styles.timeEditRow}>
                        <Input
                          label="이름"
                          value={tb.sub}
                          onChange={(e) => handleTimeBlockChange(tb.id, 'sub', e.target.value)}
                          wrapperClassName={styles.inputWrapper}
                          variant="soft"
                          size="md"
                        />
                        <Input
                          label="시작"
                          type="time"
                          value={tb.start}
                          onChange={(e) => handleTimeBlockChange(tb.id, 'start', e.target.value)}
                          wrapperClassName={styles.inputWrapper}
                          variant="soft"
                          size="md"
                        />
                        <Input
                          label="종료"
                          type="time"
                          value={tb.end}
                          onChange={(e) => handleTimeBlockChange(tb.id, 'end', e.target.value)}
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
                <Button onClick={handleSave} disabled={saving} className={`w-full ${styles.saveBtnLarge} ${styles.saveBtnAccent}`} size="lg" variant="secondary">
                  {saving ? '저장 중...' : '저장'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <button onClick={handleLogout} className={styles.logoutBtn}>
        <ArrowRightStartOnRectangleIcon className="w-4 h-4" aria-hidden="true" />
        로그아웃
      </button>
    </div>
  );
}

