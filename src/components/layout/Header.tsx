"use client";

import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();

  // 경로에 따른 페이지 제목
  const getTitleByPath = (path: string): string => {
    switch (path) {
      case '/home':
        return '가면감 매장'; // 매장 이름
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

  return (
    <header
      className="flex-shrink-0 sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto w-full max-w-md px-4 py-2">
        {/* 페이지 제목 영역 (좌측 공백 + 텍스트) */}
        <div className={styles.titleRow}>
          <span className={styles.spacer} aria-hidden="true" />
          <h1 className={`font-bold text-gray-900 tracking-tight ${styles.title90}`}>
            {pageTitle}
          </h1>
        </div>
      </div>
    </header>
  );
}

