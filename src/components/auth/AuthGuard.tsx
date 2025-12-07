"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // localStorage에 있는 토큰을 매 렌더마다 바로 읽어서 상태로 두지 않습니다.
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || localStorage.getItem("access_token")
      : null;

  // 1. 공용 페이지인지 판단 (렌더링 단계에서 즉시 계산)
  const publicPaths = ["/login", "/login/callback", "/onboarding"];
  const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path));

  useEffect(() => {
    // 공용 페이지에서 로그인 상태로 /login에 접근하면 홈으로 리다이렉트
    if (isPublicPath && token && pathname === "/login") {
      router.replace("/home");
      return;
    }

    // 비공개 페이지에서 토큰이 없으면 로그인 페이지로 이동
    if (!isPublicPath && !token) {
      router.replace("/login");
    }
  }, [isPublicPath, pathname, router, token]);

  // --- 화면 렌더링 로직 ---

  // 1. 공용 페이지면: State(isAuthorized) 검사 없이 무조건 즉시 렌더링
  // -> 이렇게 하면 useEffect에서 setState를 부를 필요가 없어서 에러가 사라집니다.
  if (isPublicPath) {
    return <>{children}</>;
  }

  // 2. 인증 필요한 페이지: 아직 검사 중이면(false) 빈 화면
  if (!token) {
    return null;
  }

  // 3. 인증 완료되면: 렌더링
  return <>{children}</>;
}