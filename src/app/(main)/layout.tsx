/* import React from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md px-4 pb-28">
          {children}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
} */
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 헤더를 숨길 경로 목록
  const hideHeaderPaths = ['/employees'];

  // 현재 경로가 숨길 경로 목록에 포함되거나 시작하는지 확인
  const shouldHideHeader = hideHeaderPaths.some((path) => pathname?.startsWith(path));

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-[80px]">
      
      {/* 조건부 렌더링: 알바생 관리 페이지가 아닐 때만 헤더 표시 */}
      {!shouldHideHeader && <Header />}
      
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
      <BottomNavigation />
    </div>
  );
}

