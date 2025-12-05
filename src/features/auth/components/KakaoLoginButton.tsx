"use client";

import React from 'react';
import KakaoLogin from 'react-kakao-login';
import styles from './KakaoLoginButton.module.css';

interface KakaoLoginButtonProps {
  onSuccess: (data: { response: { access_token: string } }) => void; // 최소한의 필요 데이터 구조 정의
  onFail?: (error: unknown) => void;
}

export default function KakaoLoginButton({ onSuccess, onFail }: KakaoLoginButtonProps) {
  const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";

  return (
    <KakaoLogin
      token={kakaoClientId}
      onSuccess={onSuccess}
      onFail={onFail || console.error}
      onLogout={console.info}
      useLoginForm
      render={({ onClick }) => (
        <button className={styles.kakaoButton} onClick={onClick}>
          카카오 로그인
        </button>
      )}
    />
  );
}