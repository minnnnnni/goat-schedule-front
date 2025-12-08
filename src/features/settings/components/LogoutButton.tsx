"use client";

import React from 'react';
import authApi from '@/services/authApi';

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      // 1. 카카오 SDK가 로드되어 있는지 확인
      if (window.Kakao && window.Kakao.Auth && window.Kakao.Auth.getAccessToken()) {
        // 2. 카카오 로그아웃 요청 (카카오 세션 끊기)
        await new Promise<void>((resolve) => {
          window.Kakao.Auth.logout(() => {
            resolve();
          });
        });
      }
    } catch (e) {
      console.error("카카오 로그아웃 실패", e);
      // 카카오 로그아웃 실패해도 내 앱 로그아웃은 진행해야 함
    } finally {
      // 3. 내 앱의 토큰 삭제 (LocalStorage 클리어)
      // authApi.logout() 안에 removeItem 로직이 다 들어있으므로 이것만 호출하면 됨
      if (authApi && typeof authApi.logout === 'function') {
        authApi.logout();
      } else {
        // 혹시 authApi에 logout이 없다면 직접 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('authTokens');
      }

      // 4. 로그인 페이지로 이동 (새로고침하여 상태 초기화)
      window.location.href = '/login';
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}