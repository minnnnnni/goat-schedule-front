"use client";

import React from 'react';
import styles from './KakaoLoginButton.module.css';

interface KakaoLoginButtonProps {
  onClick: () => void;
}

export default function KakaoLoginButton({ onClick }: KakaoLoginButtonProps) {
  return (
    <button 
      className={styles.kakaoButton} 
      onClick={onClick}
      type="button"
    >
      카카오 로그인
    </button>
  );
}