'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { usePermissions } from '@/presentation/hooks';
import { AccessDeniedView } from '@/presentation/components/ui/access-denied-view';
import { useAuthStore } from '@application/store';
import { useTheme } from '@/presentation/providers';

interface MainLayoutProps {
  children: React.ReactNode;
}

function GuardedContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    user,
    isAdmin,
    canAccessContracts,
    canAccessPowerContracts,
    canAccessLegalDocuments,
    canAccessLegalCases,
  } = usePermissions();
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // Check division access permissions for the current route
  let accessDeniedConfig: {
    requiredDivisionName: string;
    moduleName: string;
  } | null = null;

  if (isInitialized && user) {
    if (pathname.startsWith('/contracts') && !canAccessContracts) {
      accessDeniedConfig = {
        moduleName: 'ພະແນກສັນຍາທົ່ວໄປ (General Contracts)',
        requiredDivisionName: 'ພະແນກສັນຍາທົ່ວໄປ, ຫົວໜ້າຝ່າຍ ຫຼື Admin',
      };
    } else if (
      pathname.startsWith('/power-contracts') &&
      !canAccessPowerContracts
    ) {
      accessDeniedConfig = {
        moduleName: 'ພະແນກສັນຍາຊື້-ຂາຍໄຟຟ້າ (Power Contracts)',
        requiredDivisionName: 'ພະແນກສັນຍາຊື້-ຂາຍໄຟຟ້າ, ຫົວໜ້າຝ່າຍ ຫຼື Admin',
      };
    } else if (
      pathname.startsWith('/legal-documents') &&
      !canAccessLegalDocuments
    ) {
      accessDeniedConfig = {
        moduleName: 'ຄຸ້ມຄອງນິຕິກຳ ແລະ ລະບຽບການ (Legal Documents)',
        requiredDivisionName: 'ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ, ຫົວໜ້າຝ່າຍ ຫຼື Admin',
      };
    } else if (
      pathname.startsWith('/legal-cases') &&
      !canAccessLegalCases
    ) {
      accessDeniedConfig = {
        moduleName: 'ສຳນວນຄະດີ ແລະ ຂໍ້ຂັດແຍ່ງ (Legal Cases)',
        requiredDivisionName: 'ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ, ຫົວໜ້າຝ່າຍ ຫຼື Admin',
      };
    } else if (
      (pathname.startsWith('/roles') ||
        pathname.startsWith('/users') ||
        pathname.startsWith('/departments') ||
        pathname.startsWith('/audit-logs')) &&
      !isAdmin
    ) {
      accessDeniedConfig = {
        moduleName: 'ການຕັ້ງຄ່າ ແລະ ຈັດການລະບົບ (Administration)',
        requiredDivisionName: 'ຜູ້ດູແລລະບົບ (ADMIN) ເທົ່ານັ້ນ',
      };
    }
  }

  if (accessDeniedConfig) {
    return (
      <AccessDeniedView
        requiredDivisionName={accessDeniedConfig.requiredDivisionName}
        moduleName={accessDeniedConfig.moduleName}
      />
    );
  }

  return <>{children}</>;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Initialize sidebar state: restore user preference from localStorage on desktop, or default responsive
  useEffect(() => {
    try {
      const isDesktop = window.innerWidth >= 1024;
      const saved = localStorage.getItem('edl_sidebar_open');
      if (saved !== null && isDesktop) {
        setIsSidebarOpen(saved === 'true');
      } else {
        setIsSidebarOpen(isDesktop);
      }
    } catch {
      setIsSidebarOpen(false);
    }
  }, []);

  // Keyboard shortcut: Ctrl + B or Cmd + B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

        e.preventDefault();
        setIsSidebarOpen((prev) => {
          const next = !prev;
          try {
            if (window.innerWidth >= 1024) {
              localStorage.setItem('edl_sidebar_open', String(next));
            }
          } catch { }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      try {
        if (window.innerWidth >= 1024) {
          localStorage.setItem('edl_sidebar_open', String(next));
        }
      } catch { }
      return next;
    });
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    try {
      if (window.innerWidth >= 1024) {
        localStorage.setItem('edl_sidebar_open', 'false');
      }
    } catch { }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-base relative">
      {/* Sidebar Navigation */}
      <Suspense fallback={null}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          onToggle={handleToggleSidebar}
        />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <Suspense
          fallback={
            <div className="h-16 bg-surface border-b border-border-line" />
          }
        >
          <Header
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
          />
        </Suspense>

        {/* Centered Faded EDL Logo Watermark across the workspace */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <div
            className={`relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[520px] lg:h-[520px] transition-all duration-300 ${isDark
              ? 'opacity-[0.12] brightness-110 contrast-105'
              : 'opacity-[0.04]'
              }`}
          >
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
            <Suspense
              fallback={
                <div className="p-8 text-center text-xs text-text-muted">
                  ກຳລັງໂຫຼດ...
                </div>
              }
            >
              <GuardedContent>{children}</GuardedContent>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
