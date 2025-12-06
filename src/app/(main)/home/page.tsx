"use client";

import DailyScheduleView from '@/features/home/components/DailyScheduleView';
import { PlusIcon } from "@heroicons/react/20/solid";
import styles from './HomePage.module.css';
import GenerateSchedulePopup from '@/features/home/components/GenerateSchedulePopup';
import Modal from '@/components/ui/Modal';
import { useState } from 'react';


export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const handleGenerate = () => {
    setShowPopup(true);
  };
  return (
    <div className={styles.homeWrap}>
      <button onClick={handleGenerate} className={`flex items-center justify-center gap-2 ${styles.generateButton}`} aria-label="자동 근무표 생성" type="button">
        <span className={styles.sparkle}>
          <PlusIcon className={styles.buttonIcon} aria-hidden="true" />
        </span>
        <span className={styles.buttonText}>자동 근무표 생성</span>
      </button>
      <DailyScheduleView />
      {showPopup && (
        <Modal>
          <GenerateSchedulePopup onClose={() => setShowPopup(false)} />
        </Modal>
      )}
    </div>
  );
}
