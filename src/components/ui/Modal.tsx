import React from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black bg-opacity-40 pointer-events-auto"
      style={{ position: 'fixed', inset: 0 }}
    >
      {/* children이 전체 화면을 자유롭게 쓸 수 있도록 */}
      <div className="relative z-[10000] w-full h-full flex flex-col">{children}</div>
    </div>
  );
}

