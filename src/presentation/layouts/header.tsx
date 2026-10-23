'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Building,
  KeyRound,
} from 'lucide-react';
import { usePermissions } from '@/presentation/hooks';
import { useAuthStore } from '@application/store';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const pathname = usePathname();
  const { user, isAdmin } = usePermissions();
  const logout = useAuthStore((s) => s.logout);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Helper for title based on current path
  const getPageTitle = (path: string) => {
    if (path.startsWith('/contracts')) return 'ພະແນກສັນຍາທົ່ວໄປ (General Contracts)';
    if (path.startsWith('/legal-documents')) return 'ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ (Legal Documents)';
    if (path.startsWith('/legal-cases')) return 'ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ (Disputes & Litigation)';
    if (path.startsWith('/users')) return 'ຈັດການຜູ້ໃຊ້ງານ (Users)';
    if (path.startsWith('/departments')) return 'ຈັດການຫ້ອງການ/ຝ່າຍ (Departments)';
    if (path.startsWith('/audit-logs')) return 'ປະຫວັດການດຳເນີນງານ (Audit Logs)';
    return 'ໜ້າຫຼັກລະບົບ (Dashboard Overview)';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-surface border-b border-border-line shadow-xs">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">
            {getPageTitle(pathname)}
          </h2>
          <p className="text-[11px] text-text-secondary hidden sm:block">
            ລະບົບຄຸ້ມຄອງສັນຍາ, ນິຕິກຳ ແລະ ຄະດີຄວາມ ໄຟຟ້າລາວ
          </p>
        </div>
      </div>

      {/* Right: Notification & User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Icon */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors"
          title="ການແຈ້ງເຕືອນ"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-border-line bg-white hover:bg-slate-50 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block min-w-0">
              <p className="text-xs font-semibold text-text-primary leading-tight truncate">
                {user?.fullName || 'ຜູ້ໃຊ້ງານ'}
              </p>
              <p className="text-[10px] text-text-secondary truncate">
                {user?.department || (isAdmin ? 'ຜູ້ດູແລລະບົບ' : 'ພະນັກງານ ຟຟລ')}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted hidden md:block" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-border-line shadow-xl py-2 z-40 animate-fadeIn">
                <div className="px-4 py-2 border-b border-border-line">
                  <p className="text-xs font-bold text-text-primary">
                    {user?.fullName}
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    ລະຫັດພະນັກງານ: {user?.employeeCode || '-'}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-[10px] text-blue-700 font-semibold border border-blue-200">
                    <KeyRound className="w-3 h-3" />
                    <span>ບົດບາດ: {user?.role || 'VIEWER'}</span>
                  </div>
                </div>

                {user?.department && (
                  <div className="px-4 py-2 text-xs text-text-secondary border-b border-border-line flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="truncate">{user.department}</span>
                  </div>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ອອກຈາກລະບົບ (Logout)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
