"use client";

import React from 'react';
import Image from "next/image";
import styles from './LoginPage.module.css';
// 백엔드 개발자분이 주신 훅 import
import useKakaoSdk from "@/features/auth/hooks/useKakaoSdk"; 

export default function LoginPage() {
  // 1. SDK 로드 상태 확인
  const kakaoReady = useKakaoSdk();

  // 2. 로그인 함수 (백엔드 로직 적용)
  const handleLogin = () => {
    // 윈도우 객체 확인
    if (typeof window === "undefined") return;
    
    // SDK 로드 대기
    if (!kakaoReady) {
      alert("카카오 로그인을 준비 중입니다. 잠시만 기다려주세요.");
      return;
    }

    // Kakao 객체 확인
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).Kakao) {
      console.error("Kakao SDK가 로드되었지만 window.Kakao가 없습니다.");
      return;
    }

    try {
      // [핵심] 백엔드 서버의 인증 주소로 리다이렉트
      // 로컬 테스트용인지 실제 배포용인지 확인 필요. 백엔드 개발자분 코드에 있던 주소 사용.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).Kakao.Auth.authorize({ 
        redirectUri: `http://3.39.193.214:8080/api/auth/kakao` 
      });
    } catch (e) {
      console.error("kakaoLogin error", e);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        
        {/* 로고 섹션 (작성자님 디자인) */}
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
          {/* 작성자님의 버튼 스타일 유지하되 onClick만 교체 */}
          <button 
            type="button"
            className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-medium text-[0.95rem] py-4 rounded-xl shadow-sm flex items-center justify-center transition-transform active:scale-95"
            onClick={handleLogin}
          >
            {/* 아이콘이나 텍스트 등 기존 내용 유지 */}
             <Image 
               src="/icons/kakao_symbol.svg" // 카카오 심볼 아이콘이 있다면 사용, 없으면 텍스트만
               width={20} 
               height={20} 
               alt="Kakao"
               className="mr-2"
               style={{ display: 'inline-block' }} // 아이콘이 있다면
             />
            카카오 로그인
          </button>
        </div>

      </div>
    </div>
  );
}