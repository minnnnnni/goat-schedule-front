import React from "react";
import "./globals.css";
import AuthCheck from "@/components/auth/AuthCheck"; // [추가]

export const metadata = {
  title: "Goat Schedule - 근무 일정 관리",
  description: "편리한 근무 일정 관리 시스템",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#4461F2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="m-0 p-0 antialiased bg-gray-50 min-h-screen">
        <AuthCheck /> {/* [추가] 여기서 인증 상태를 감시합니다 */}
        {children}
      </body>
    </html>
  );
}