

"use client";
import { useEffect, useState } from 'react';
import DailyScheduleView from '@/features/home/components/DailyScheduleView';
import { PlusIcon } from "@heroicons/react/20/solid";
import styles from './HomePage.module.css';
import GenerateSchedulePopup from '@/features/home/components/GenerateSchedulePopup';
import Modal from '@/components/ui/Modal';
import ScheduleResultPicker from '@/features/schedule/components/ScheduleResultPicker';

export default function HomePage() {
  // 로그인 체크 및 임시 토큰 삽입 (개발용)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('access_token')) {
        localStorage.setItem('access_token', 'test-access-token');
      }
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
      }
    }
  }, []);

  // 'none' | 'generate' | 'results'
  const [popupState, setPopupState] = useState<'none' | 'generate' | 'results'>('none');
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("popup") === "1") {
        setTimeout(() => setPopupState('generate'), 0);
      }
    }
  }, []);
  const handleGenerate = () => {
    setPopupState('generate');
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
      {popupState === 'generate' && (
        <Modal>
          <GenerateSchedulePopup 
            onClose={() => setPopupState('none')}
            onGenerate={() => setPopupState('results')}
          />
        </Modal>
      )}
      {popupState === 'results' && (
        <Modal>
          <ScheduleResultPicker 
            onSelect={() => setPopupState('none')}
            onBack={() => setPopupState('generate')}
          />
        </Modal>
      )}
    </div>
  );
}
