"use client";

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BottomNavigation.module.css';

export default function BottomNavigation() {
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
    // 홈은 정확히 일치할 때만 active
    if (path === '/home') {
      return pathname === path;
    }
    // 다른 경로는 하위 경로도 active로 처리
    return pathname.startsWith(path);
  };

  return (
    <nav className={styles.container}>
      {navItems.map((item) => {
        const active = isActive(item.path);
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`${styles.navItem} ${active ? styles.active : ''}`.trim()}
          >
            <Image 
              src={active ? item.iconActive : item.iconDefault} 
              alt={item.label} 
              width={24} 
              height={24} 
              className={styles.icon}
            />
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}