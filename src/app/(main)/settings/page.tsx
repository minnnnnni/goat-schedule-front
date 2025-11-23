"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SettingsPage.module.css";
import { BuildingStorefrontIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import storeApi from "@/services/storeApi";
// UI moved into components
import StoreInfoView from "@/features/settings/components/StoreInfoView";
import StoreInfoEditForm from "@/features/settings/components/StoreInfoEditForm";
type TimeBlock = {
  id: number;
  title: string;
  sub: string;
  start: string;
  end: string;
  color: 'blue' | 'green' | 'purple' | string;
};

type EditableStore = {
  name: string;
  openTime: string;
  closeTime: string;
  businessDays: boolean[];
  timeBlocks: TimeBlock[];
};

export default function SettingsPage() {
  const router = useRouter();
  const STORE_ID = 1; // TODO: auth/route에서 가져오도록 교체
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<EditableStore | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<EditableStore | null>(null);
  const [saving, setSaving] = useState(false);

  // View/Edit day labels & mapping handled inside components

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const s = await storeApi.getStore(STORE_ID);
        const defs = await storeApi.getShiftDefinitions(STORE_ID);
        const timeBlocks: TimeBlock[] = (defs || []).map(d => ({
          id: d.id,
          title: d.title || `타임 ${d.id}`,
          sub: d.sub || "",
          start: d.start,
          end: d.end,
          color: (typeof d.color === 'string' && d.color) ? d.color : 'blue',
        }));
        const editable: EditableStore = {
          name: s.name,
          openTime: s.openTime,
          closeTime: s.closeTime,
          businessDays: s.businessDays,
          timeBlocks,
        };
        setStore(editable);
        setForm(editable);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    router.replace("/login");
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Cancel -> reset form from latest store
      if (store) setForm({ ...store });
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
      const updated = await storeApi.updateStore(STORE_ID, {
        name: form.name,
        openTime: form.openTime,
        closeTime: form.closeTime,
        businessDays: form.businessDays,
      });
      // Shift definitions 저장은 별도 엔드포인트이므로 여기선 스킵
      const refreshed: EditableStore = {
        name: updated.name,
        openTime: updated.openTime,
        closeTime: updated.closeTime,
        businessDays: updated.businessDays,
        timeBlocks: form.timeBlocks,
      };
      setStore(refreshed);
      setForm(refreshed);
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
            <StoreInfoView
              name={form.name}
              openTime={form.openTime}
              closeTime={form.closeTime}
              businessDays={form.businessDays}
              timeBlocks={form.timeBlocks}
            />
          ) : (
            <StoreInfoEditForm
              form={form}
              onChangeName={handleChangeName}
              onChangeOpen={handleChangeOpen}
              onChangeClose={handleChangeClose}
              onToggleBusinessDay={handleToggleBusinessDay}
              onTimeBlockChange={handleTimeBlockChange}
              onSave={handleSave}
              saving={saving}
            />
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

