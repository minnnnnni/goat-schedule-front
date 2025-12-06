"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './BottomNavigation.module.css';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // 네비게이션 아이템 설정 (아이콘 경로 포함)
  const navItems = [
    {
      label: '홈',
      path: '/home',
      iconDefault: '/icons/home_icon.svg',
      iconActive: '/icons/home_icon_orange.svg',
    },
    {
      label: '캘린더',
      path: '/calendar',
      iconDefault: '/icons/calendar_icon.svg',
      iconActive: '/icons/calendar_icon_orange.svg',
    },
    {
      label: '알바생관리',
      path: '/employees', 
      iconDefault: '/icons/employees_icon.svg',
      iconActive: '/icons/employees_icon_orange.svg',
    },
    {
      label: '설정',
      path: '/settings',
      iconDefault: '/icons/setting_icon.svg', // 파일명 확인 필요 (setting_icon.svg가 맞는지)
      iconActive: '/icons/setting_icon_orange.svg',
    },
  ];

  // 현재 경로가 해당 탭의 경로를 포함하는지 확인 (active 상태 결정)
  const isActive = (path: string) => {
    if (path === '/home' && pathname === '/home') return true;
    if (path !== '/home' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={styles.container}>
      {navItems.map((item) => {
        const active = isActive(item.path);
        
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`${styles.navItem} ${active ? styles.active : styles.inactive}`}
          >
            <Image 
              src={active ? item.iconActive : item.iconDefault} 
              alt={item.label} 
              width={24} 
              height={24} 
              className={styles.icon}
            />
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}