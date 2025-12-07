import React from 'react';
import StoreSetupForm from '@/features/onboarding/components/StoreSetupForm';

export const metadata = {
  title: "매장 정보 입력 - Goat Schedule",
};

export default function StoreSetupPage() {
  return (
    <main className="w-full min-h-screen bg-gray-50 flex justify-center">
      {/* 모바일 뷰 프레임 (420px 제한) 내부에 폼 렌더링 */}
      <StoreSetupForm />
    </main>
  );
}