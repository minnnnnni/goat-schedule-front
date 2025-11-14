import React from "react";
import "./globals.css";

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
        {/* 각 segment((main), (auth) 등)에서 자체 레이아웃 구성 */}
        {children}
      </body>
    </html>
  );
}

