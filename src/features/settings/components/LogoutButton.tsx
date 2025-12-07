"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import authApi from '@/services/authApi'; // authApi 불러오기

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. 로컬 스토리지에서 토큰 삭제 (authApi.logout 사용)
    // 만약 authApi에 logout이 없다면 localStorage.removeItem('accessToken') 등을 직접 하셔도 됩니다.
    if (authApi.logout) {
      authApi.logout(); 
    } else {
      // 혹시 authApi에 logout을 아직 추가 안 하셨다면 임시로 이렇게라도 지워야 합니다.
      localStorage.removeItem('accessToken');
      localStorage.removeItem('access_token');
      localStorage.removeItem('authTokens');
    }
    
    // 2. 로그인 페이지로 이동
    // replace를 써야 뒤로가기를 눌렀을 때 다시 로그인된 화면으로 안 옵니다.
    router.replace('/login');
    
    // (선택사항) 확실하게 새로고침을 하고 싶다면 아래 주석을 해제하세요.
    // window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}