'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background-base relative">
      {/* Sidebar Navigation */}
      <Suspense fallback={<div className="w-64 bg-surface" />}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <Suspense fallback={<div className="h-16 bg-surface border-b border-border-line" />}>
          <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        </Suspense>

        {/* Centered Faded EDL Logo Watermark across the workspace */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <div className="w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] lg:w-[640px] lg:h-[640px] opacity-[0.045]">
            <Image
              src="/edl-logo.png"
              alt="EDL Watermark"
              fill
              className="object-contain"
              priority={false}
            />
          </div>
        </div>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<div className="p-8 text-center text-xs text-text-muted">ກຳລັງໂຫຼດ...</div>}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
