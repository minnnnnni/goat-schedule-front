"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthCheck() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 토큰 확인
    const token = typeof window !== 'undefined' ? (localStorage.getItem("access_token") || localStorage.getItem("accessToken")) : null;
    
    // 인증 불필요 페이지
    const publicPaths = ['/login', '/signup', '/login/callback', '/email-login'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));

    if (!token && !isPublicPath) {
      // 로그인 안 된 상태로 보호된 페이지 접근 시
      router.replace('/login');
    } else if (token && pathname === '/login') {
      // 로그인 된 상태로 로그인 페이지 접근 시
      router.replace('/home');
    }
  }, [pathname, router]);

  return null; // 화면에 아무것도 렌더링하지 않음 (로직만 수행)
}