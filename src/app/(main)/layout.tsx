import React from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md px-4 pb-28">
          {children}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

