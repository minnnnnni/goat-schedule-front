"use client";

import DailyScheduleView from '@/features/home/components/DailyScheduleView';
import { SparklesIcon } from "@heroicons/react/20/solid";
import styles from './HomePage.module.css';
import GenerateSchedulePopup from '@/features/home/components/GenerateSchedulePopup';
import Modal from '@/components/ui/Modal';
import { useEffect, useState } from 'react';
import { getStore } from '@/services/storeApi'; // 스토어 API 호출 함수

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [storeName, setStoreName] = useState('가게 정보 로딩 중...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        // TODO: storeId를 동적으로 가져와야 합니다. (예: 로그인 정보)
        const storeData = await getStore(1);
        if (storeData && storeData.name) {
          setStoreName(storeData.name);
        } else {
          setStoreName('가게 이름을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('가게 정보를 불러오는 데 실패했습니다:', error);
        setStoreName('가게 정보 로딩 실패');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreName();
  }, []);

  const handleGenerate = () => {
    setShowPopup(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerSection}>
        {/* 가게 이름 표시 */}
        <p className={styles.title}>안녕하세요 사장님</p>
        <p className={styles.storeName}>{storeName}</p>
      </header>

      <main className={styles.homeWrap}>
        <button onClick={handleGenerate} className={`flex items-center justify-center gap-2 ${styles.generateButton}`} aria-label="자동 근무표 생성" type="button">
          <span className={styles.sparkle}>
            <SparklesIcon className={styles.buttonIcon} aria-hidden="true" />
          </span>
          <span className={styles.buttonText}>자동 근무표 생성</span>
        </button>
        <DailyScheduleView />
      </main>
      {showPopup && (
        <Modal>
          <GenerateSchedulePopup onClose={() => setShowPopup(false)} />
        </Modal>
      )}
    </div>
  );
}
