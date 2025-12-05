"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // URL에서 토큰 추출 (camelCase / snake_case 허용)
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken") || urlParams.get("access_token");
    const refreshToken = urlParams.get("refreshToken") || urlParams.get("refresh_token");

    if (accessToken || refreshToken) {
      try {
        // 기존 코드/새 코드 호환을 위해 여러 키에 저장
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("access_token", accessToken);
        }
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("refresh_token", refreshToken);
        }
        const existing = JSON.parse(localStorage.getItem("authTokens") || "null") || {};
        if (accessToken) existing.accessToken = accessToken;
        if (refreshToken) existing.refreshToken = refreshToken;
        localStorage.setItem("authTokens", JSON.stringify(existing));
      } catch (e) {
        console.error("Failed to save tokens", e);
      }

      // URL 정리
      try {
        const cleanUrl = window.location.origin + '/';
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {
        /* ignore */
      }

      // SPA 라우팅으로 홈으로 이동
      router.push('/');
    }
  }, [router]);

  return (
    <div style={{ padding: 20 }}>
      <h1>로그인 처리 중...</h1>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
}
