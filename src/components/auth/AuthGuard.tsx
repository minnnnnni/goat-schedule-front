"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const readToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken") || localStorage.getItem("access_token");
  };

  const hasRecentLogout = () => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("recentLogout") === "1";
  };

  // 1. 공용 페이지인지 판단 (렌더링 단계에서 즉시 계산)
  const publicPaths = ["/login", "/login/callback", "/onboarding"];
  const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path));

  useEffect(() => {
    const handleAuth = () => {
      const currentToken = readToken();
      const recentLogout = hasRecentLogout();

      if (isPublicPath) {
        // 로그인 페이지에서 로그인 상태면 홈으로 이동
        if (currentToken && pathname === "/login" && !recentLogout) {
          router.replace("/home");
        }
        // 최근 로그아웃 플래그가 있으면 한 번만 사용하고 제거
        if (recentLogout) {
          sessionStorage.removeItem("recentLogout");
        }
        setAuthorized(true);
        return;
      }

      // 보호 페이지인데 토큰이 없으면 로그인으로
      if (!currentToken) {
        setAuthorized(false);
        router.replace("/login");
        return;
      }

      setAuthorized(true);
    };

    handleAuth();

    // 다른 탭이나 동시 요청에서 토큰이 변할 때 감지
    window.addEventListener("storage", handleAuth);
    return () => window.removeEventListener("storage", handleAuth);
  }, [isPublicPath, pathname, router]);

  // --- 화면 렌더링 로직 ---

  // 1. 공용 페이지면: State(isAuthorized) 검사 없이 무조건 즉시 렌더링
  // -> 이렇게 하면 useEffect에서 setState를 부를 필요가 없어서 에러가 사라집니다.
  if (isPublicPath) {
    return <>{children}</>;
  }

  // 2. 인증 필요한 페이지: 아직 검사 중이면(false) 빈 화면
  if (!authorized) {
    return null;
  }

  // 3. 인증 완료되면: 렌더링
  return <>{children}</>;
}
