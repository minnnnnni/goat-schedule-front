"use client";

import React, { useState } from "react";
import useKakaoSdk from "@/features/auth/hooks/useKakaoSdk";

export default function Page() {
  const [contents, setContents] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  // Kakao SDK 로드/초기화 훅
  const kakaoReady = useKakaoSdk();

  type Tokens = {
    accessToken: string;
    refreshToken: string;
  };

  // 로컬(사용자 기기)에 토큰을 저장하는 헬퍼
  function saveTokens(tokens: Tokens) {
    try {
      // 간단한 저장: 필요하면 더 안전한 저장소(쿠키, httpOnly 쿠키 등)로 변경하세요.
      localStorage.setItem("authTokens", JSON.stringify(tokens));
      // 편의상 개별 토큰도 함께 저장 (선택사항)
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
    } catch (e) {
      console.error("Failed to save tokens to localStorage", e);
    }
  }

  // URL 파라미터 메시지는 클라이언트에서 간단히 읽도록 유지합니다.
  if (typeof window !== "undefined") {
    try {
      const urlParams = new URLSearchParams(window.location.search);

      // 백엔드가 리다이렉트 시 쿼리 파라미터로 토큰을 전달하는 경우 처리
      const accessToken = urlParams.get("accessToken") || urlParams.get("access_token");
      const refreshToken = urlParams.get("refreshToken") || urlParams.get("refresh_token");

      if (accessToken && refreshToken) {
        saveTokens({ accessToken, refreshToken });
        // URL에 민감한 정보가 남아있지 않도록 정리
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        setMessage("로그인 성공");
      } else {
        if (urlParams.get("login") === "success") setMessage("로그인 성공");
      }
    } catch (e) {
      /* ignore */
    }
  }

  function kakaoLogin() {
    if (typeof window === "undefined") return;
    if (!kakaoReady) {
      // SDK가 아직 로드되지 않았을 때 사용자 안내
      alert("카카오 SDK를 아직 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    if (!(window as any).Kakao) {
      console.error("Kakao SDK가 로드되었지만 window.Kakao가 없습니다.");
      return;
    }
    try {
      const domain = window.location.origin;
      // ! 로컬로 테스트시
      // (window as any).Kakao.Auth.authorize({ redirectUri: `http://localhost:8080/api/auth/kakao` });
      // ! 실제 서버 배포용
      (window as any).Kakao.Auth.authorize({ redirectUri: `http://3.39.193.214:8080/api/auth/kakao` });
    } catch (e) {
      console.error("kakaoLogin error", e);
    }
  }

  // ==============
  // ===== UI =====
  // ==============
  return (
    <div style={{ padding: 20 }}>
      <h1>카카오 로그인 및 API 예제</h1>

      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }} className="login-buttons">
            <img src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg" alt="카카오 로그인" onClick={kakaoLogin}/>
          
        </div>
      </div>
    </div>
  );
}

