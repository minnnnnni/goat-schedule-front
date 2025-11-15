"use client";

import DailyScheduleView from '@/features/home/components/DailyScheduleView';
import { PlusIcon } from "@heroicons/react/20/solid";
import styles from './HomePage.module.css';
import { useRouter } from 'next/navigation';


export default function HomePage() {
  const router = useRouter();
  const handleGenerate = () => {
    alert('자동 근무표 생성 기능은 아직 구현되지 않았습니다.');
    //router.push('/generate/results');
  };
  return( 
   <div className={styles.homeWrap}>
      <button onClick={handleGenerate} className={`flex items-center justify-center gap-2 ${styles.generateButton}`} aria-label="자동 근무표 생성" type="button">
        <span className={styles.sparkle}>
          <PlusIcon className={styles.buttonIcon} aria-hidden="true" />
        </span>
        <span className={styles.buttonText}>자동 근무표 생성</span>
      </button>
      <DailyScheduleView />
    </div>
  );
}
