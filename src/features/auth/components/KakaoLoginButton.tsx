"use client";

import React from 'react';
import KakaoLogin from 'react-kakao-login';
import styles from './KakaoLoginButton.module.css';

// [수정] props 타입에 onClick 추가 (선택적)
interface KakaoLoginButtonProps {
  onSuccess?: (data: { response: { access_token: string } }) => void;
  onFail?: (error: unknown) => void;
  onClick?: () => void; // 이 부분을 추가해야 합니다.
}

export default function KakaoLoginButton({ onSuccess, onFail, onClick }: KakaoLoginButtonProps) {
  const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";

  // [수정] onClick이 있으면 일반 버튼으로, 없으면 라이브러리 버튼으로 렌더링하도록 분기 처리
  // 백엔드 개발자분의 로직(직접 구현한 훅 사용)을 쓸 때는 onClick만 필요하고,
  // 라이브러리를 쓸 때는 onSuccess/onFail이 필요합니다.
  
  // 1. onClick이 전달된 경우 (백엔드 로직 사용)
  if (onClick) {
    return (
      <button className={styles.kakaoButton} onClick={onClick}>
        카카오 로그인
      </button>
    );
  }

  // 2. onClick이 없는 경우 (라이브러리 로직 사용 - 기존 코드 유지)
  return (
    <KakaoLogin
      token={kakaoClientId}
      onSuccess={onSuccess!}
      onFail={onFail || console.error}
      onLogout={console.info}
      useLoginForm
      render={({ onClick: libOnClick }) => (
        <button className={styles.kakaoButton} onClick={libOnClick}>
          카카오 로그인
        </button>
      )}
    />
  );
}