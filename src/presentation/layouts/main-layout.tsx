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

        {/* Faded Background Logo Watermark across the workspace */}
        <div className="fixed right-8 bottom-8 w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] opacity-[0.035] pointer-events-none select-none z-0">
          <Image
            src="/edl-logo.png"
            alt="EDL Watermark"
            fill
            className="object-contain"
            priority={false}
          />
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
