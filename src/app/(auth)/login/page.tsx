"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import KakaoLoginButton from '@/features/auth/components/KakaoLoginButton';
import styles from './LoginPage.module.css';

// [수정] 카카오 로그인 응답 데이터 타입 정의
interface KakaoLoginData {
  response: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    // 필요한 다른 필드가 있다면 추가 가능
  };
  profile?: unknown;
}

export default function LoginPage() {
  const router = useRouter();

  // [수정] any -> KakaoLoginData 로 변경
  const handleLoginSuccess = (data: KakaoLoginData) => {
    console.log("로그인 성공 데이터:", data);
    // 예: const token = data.response.access_token;
    
    // 온보딩 페이지로 이동
    router.push('/onboarding/store-setup');
  };

  // [수정] any -> unknown 로 변경 (에러 객체는 타입을 확신할 수 없음)
  const handleLoginFail = (err: unknown) => {
    console.error("로그인 실패:", err);
    alert("로그인에 실패했습니다.");
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        
        {/* 로고 섹션 */}
        <div className={styles.logoSection}>
          <div className={styles.iconWrapper}>
             <Image 
               className={styles.icon} 
               src="/icons/calendar-icon.svg" 
               width={64} 
               height={64} 
               alt="App Logo" 
               priority
             />
          </div>
          <div className={styles.textGroup}>
            <h1 className={styles.heading}>자동근무표 앱</h1>
            <p className={styles.paragraph}>사장님을 위한 스마트한 근무표 관리</p>
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className={styles.buttonWrapper}>
          <KakaoLoginButton 
            onSuccess={handleLoginSuccess} 
            onFail={handleLoginFail}
          />
        </div>

      </div>
    </div>
  );
}