import type { Metadata, Viewport } from "next"; // 타입스크립트 사용 시 추가
import "./globals.css";
import AuthGuard from "@/components/auth/AuthGuard";

// 1. 메타 데이터 설정 (기존 head 내용 이동)
export const metadata: Metadata = {
  title: "Goat Schedule - 근무 일정 관리",
  description: "편리한 근무 일정 관리 시스템",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

// 2. 뷰포트 및 테마 설정 (Next.js 14+ 권장 방식)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // user-scalable=no 와 동일
  themeColor: "#4461F2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      {/* head 태그는 Next.js가 자동으로 생성하므로 삭제합니다 */}
      <body className="m-0 p-0 antialiased bg-gray-50 min-h-screen">
        {/* 인증 체크 컴포넌트: 페이지 이동 시마다 여기서 검사 수행 */}
        <AuthGuard>
           {children}
        </AuthGuard>
      </body>
    </html>
  );
}