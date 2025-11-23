"use client";

import styles from "@/app/(main)/settings/SettingsPage.module.css";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type TimeBlock = {
  id: number;
  title: string;
  sub: string;
  start: string;
  end: string;
  color: "blue" | "green" | "purple" | string;
};

type EditableStore = {
  name: string;
  openTime: string;
  closeTime: string;
  businessDays: boolean[];
  timeBlocks: TimeBlock[];
};

type StoreInfoEditFormProps = {
  form: EditableStore;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeOpen: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeClose: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleBusinessDay: (idx: number) => void;
  onTimeBlockChange: (
    id: number,
    key: keyof Pick<TimeBlock, "sub" | "start" | "end">,
    value: string
  ) => void;
  onSave: () => void;
  saving?: boolean;
};

export default function StoreInfoEditForm({
  form,
  onChangeName,
  onChangeOpen,
  onChangeClose,
  onToggleBusinessDay,
  onTimeBlockChange,
  onSave,
  saving,
}: StoreInfoEditFormProps) {
  const dayIndexMap: Record<string, number> = {
    일: 0,
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
  };
  const orderedDays = ["월", "화", "수", "목", "금", "토", "일"]; // Monday-first for display

  return (
    <div className={styles.editForm}>
      <Input
        label="매장명"
        value={form.name}
        onChange={onChangeName}
        wrapperClassName={styles.inputWrapper}
        variant="soft"
        size="lg"
      />
      <div className={styles.inputRow}>
        <Input
          label="오픈시간"
          type="time"
          value={form.openTime}
          onChange={onChangeOpen}
          wrapperClassName={styles.inputWrapper}
          variant="soft"
          size="md"
        />
        <Input
          label="종료시간"
          type="time"
          value={form.closeTime}
          onChange={onChangeClose}
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
                onClick={() => onToggleBusinessDay(idx)}
                className={`${styles.dayButton} ${
                  form.businessDays[idx] ? styles.dayButtonActive : ""
                }`}
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
                  label="이름"
                  value={tb.sub}
                  onChange={(e) => onTimeBlockChange(tb.id, "sub", e.target.value)}
                  wrapperClassName={styles.inputWrapper}
                  variant="soft"
                  size="md"
                />
                <Input
                  label="시작"
                  type="time"
                  value={tb.start}
                  onChange={(e) => onTimeBlockChange(tb.id, "start", e.target.value)}
                  wrapperClassName={styles.inputWrapper}
                  variant="soft"
                  size="md"
                />
                <Input
                  label="종료"
                  type="time"
                  value={tb.end}
                  onChange={(e) => onTimeBlockChange(tb.id, "end", e.target.value)}
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
          onClick={onSave}
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
