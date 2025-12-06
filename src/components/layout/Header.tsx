"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStore } from '@/services/storeApi'; // 실제 API 함수 임포트
import styles from './Header.module.css';

// 뒤로가기 아이콘
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

export default function Header({ hasBack }: { hasBack?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [storeName, setStoreName] = useState('로딩 중...');

  // 경로에 따른 페이지 제목
  const getTitleByPath = (path: string): string => {
    switch (path) {
      case '/home':
        return storeName; // API로 가져온 동적 매장 이름 표시
      case '/calendar':
        return '캘린더';
      case '/employees':
        return '알바생 관리';
      case '/settings':
        return '설정';
      default:
        return '가면감 스케줄';
    }
  };

  const pageTitle = getTitleByPath(pathname);

  useEffect(() => {
    if (pathname === '/home') {
      const fetchStoreName = async () => {
        try {
          // TODO: 실제 storeId를 가져오는 로직이 필요합니다. (예: context, URL 등)
          const storeId = 1; // 임시 storeId
          const storeData = await getStore(storeId); // 실제 API 호출
          setStoreName(storeData.name);
        } catch (error) {
          console.error('매장 이름을 불러오는 데 실패했습니다:', error);
          setStoreName('매장 정보 없음');
        }
      };
      fetchStoreName();
    }
  }, [pathname]);

  return (
    <header className={`${styles.header} sticky top-0 z-30`}>
      <div className="mx-auto flex h-full max-w-md items-center justify-between px-4">
        {hasBack ? (
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <BackIcon />
          </button>
        ) : (
          <span className={styles.spacer} aria-hidden="true" />
        )}
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{pageTitle}</h1>
        </div>
        <span className={styles.spacer} aria-hidden="true" />
      </div>
    </header>
  );
}
