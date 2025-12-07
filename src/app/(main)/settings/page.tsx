
"use client";

import { useState } from "react";
import styles from "./SettingsPage.module.css";
import { BuildingStorefrontIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import StoreInfoView from "@/features/settings/components/StoreInfoView";
import StoreInfoEditForm from "@/features/settings/components/StoreInfoEditForm";
import { useRouter } from "next/navigation";
import authApi from "@/services/authApi";

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // 토큰을 먼저 지우고 나서 로그인 페이지로 이동해야 홈으로 돌아오는 깜빡임을 막을 수 있습니다.
    authApi.logout?.();
    router.replace("/login");
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

