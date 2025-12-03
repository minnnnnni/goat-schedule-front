
"use client";

import { useState } from "react";
import styles from "./SettingsPage.module.css";
import { BuildingStorefrontIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import StoreInfoView from "@/features/settings/components/StoreInfoView";
import StoreInfoEditForm from "@/features/settings/components/StoreInfoEditForm";

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
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
        
        {!isEditing ? <StoreInfoView /> : <StoreInfoEditForm />}
      </section>

      <button onClick={handleLogout} className={styles.logoutBtn}>
        <ArrowRightStartOnRectangleIcon className="w-4 h-4" aria-hidden="true" />
        로그아웃
      </button>
    </div>
  );
}

