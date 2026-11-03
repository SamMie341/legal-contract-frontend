'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, LogOut, Shield, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { usePermissions } from '@/presentation/hooks';
import { useAuthStore } from '@application/store';
import { useTheme } from '@/presentation/providers';
import { NAVIGATION_CONFIG } from './nav-config';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onClose, onToggle }: SidebarProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, hasPermission, canAccessDivision, can } = usePermissions();
  const { resolvedTheme } = useTheme();
  const isDark = isMounted ? resolvedTheme === 'dark' : false;
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Guaranteed dynamic styling based on isDark */}
      <aside
        suppressHydrationWarning
        style={{
          backgroundColor: isDark ? '#0b1120' : '#ffffff',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 border-r flex flex-col shadow-xl transition-all duration-300 ease-in-out lg:static lg:z-auto lg:shadow-none min-w-0 ${isDark ? 'text-white' : 'text-slate-800'
          } ${isOpen
            ? 'w-72 translate-x-0'
            : '-translate-x-full w-72 lg:translate-x-0 lg:w-20'
          }`}
      >
        {/* Brand Header */}
        {isOpen ? (
          <div
            style={{
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
            }}
            className="flex items-center justify-between px-5 py-4 border-b relative z-10 shrink-0"
          >
            <Link
              href="/dashboard"
              onClick={handleNavClick}
              className="flex items-center gap-3 min-w-0"
            >
              {/* EDL Emblem on crisp, pure white badge */}
              <div
                style={{ backgroundColor: '#ffffff' }}
                className="w-10 h-10 rounded-xl p-1 shadow-xs flex items-center justify-center shrink-0 border border-slate-200 ring-2 ring-blue-500/20"
              >
                <Image
                  src="/edl-logo.png"
                  alt="EDL Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h1
                  className={`text-sm font-bold tracking-tight leading-tight truncate ${isDark ? 'text-white' : 'text-slate-900'
                    }`}
                >
                  ລັດວິສາຫະກິດໄຟຟ້າລາວ
                </h1>
                <p
                  className={`text-[10px] tracking-wider font-semibold truncate ${isDark ? 'text-blue-300' : 'text-slate-500'
                    }`}
                >
                  LEGAL & CONTRACT SYSTEM
                </p>
              </div>
            </Link>

            {/* Collapse button */}
            <button
              type="button"
              onClick={onToggle}
              title="ຫຍໍ້ Sidebar ເປັນແທັບນ້ອຍ (Ctrl+B)"
              className={`p-1.5 rounded-lg transition-colors shrink-0 ml-1 cursor-pointer ${isDark
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              <PanelLeftClose className="w-5 h-5 hidden lg:block" />
              <X className="w-5 h-5 lg:hidden" />
            </button>
          </div>
        ) : (
          <div
            style={{
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
            }}
            className="flex flex-col items-center justify-center py-4 px-2 border-b relative z-10 shrink-0 gap-2"
          >
            <Link
              href="/dashboard"
              onClick={handleNavClick}
              title="ລັດວິສາຫະກິດໄຟຟ້າລາວ (Dashboard)"
              style={{ backgroundColor: '#ffffff' }}
              className="w-10 h-10 rounded-xl p-1 shadow-xs flex items-center justify-center shrink-0 border border-slate-200 hover:scale-105 transition-transform ring-2 ring-blue-500/20"
            >
              <Image
                src="/edl-logo.png"
                alt="EDL Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </Link>
            <button
              type="button"
              onClick={onToggle}
              title="ຂະຫຍາຍ Sidebar (Ctrl+B)"
              className={`p-1.5 rounded-lg transition-colors hidden lg:flex items-center justify-center cursor-pointer ${isDark
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Faded Background Logo Watermark in Sidebar (only when expanded) */}
        {isOpen && (
          <div
            className={`absolute -right-14 bottom-24 w-60 h-60 pointer-events-none select-none z-0 transition-opacity duration-300 ${isDark ? 'opacity-15 brightness-125' : 'opacity-[0.04]'
              }`}
          >
            <Image
              src="/edl-logo.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Navigation Items (Scrollable) */}
        <nav
          suppressHydrationWarning
          className={`flex-1 overflow-y-auto custom-scrollbar relative z-10 ${isOpen ? 'px-4 py-4 space-y-6' : 'px-2 py-4 space-y-4'
            }`}
        >
          {!isMounted ? (
            <div className="space-y-4 px-1 py-2 animate-pulse">
              <div className="h-3 bg-slate-200/50 rounded w-20 mx-2 mb-2" />
              <div className="space-y-1.5">
                <div className="h-9 bg-slate-200/40 rounded-xl" />
                <div className="h-9 bg-slate-200/40 rounded-xl" />
                <div className="h-9 bg-slate-200/40 rounded-xl" />
              </div>
              <div className="h-3 bg-slate-200/50 rounded w-24 mx-2 mt-4 mb-2" />
              <div className="space-y-1.5">
                <div className="h-9 bg-slate-200/40 rounded-xl" />
                <div className="h-9 bg-slate-200/40 rounded-xl" />
              </div>
            </div>
          ) : (
            NAVIGATION_CONFIG.map((group, groupIdx) => {
            if (group.adminOnly && !isAdmin) return null;
            if (group.divisionKey && !canAccessDivision(group.divisionKey)) return null;

            const visibleItems = group.items.filter((item) => {
              if (item.adminOnly && !isAdmin) return false;
              if (item.requiredPermission) {
                if (group.systemModule) {
                  return can(group.systemModule, item.requiredPermission as any);
                }
                if (!hasPermission(item.requiredPermission)) {
                  return false;
                }
              }
              return true;
            });

            if (visibleItems.length === 0) return null;

            // Expanded Mode
            if (isOpen) {
              return (
                <div key={groupIdx} className="space-y-1.5">
                  <h3
                    className={`px-3 text-[11px] font-bold tracking-wider uppercase ${isDark ? 'text-blue-300/80' : 'text-slate-400'
                      }`}
                  >
                    {group.groupName}
                  </h3>

                  <div className="space-y-1">
                    {visibleItems.map((item, itemIdx) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/dashboard' &&
                          pathname.startsWith(item.href) &&
                          !pathname.includes('create'));

                      const Icon = item.icon;

                      return (
                        <Link
                          key={itemIdx}
                          href={item.href}
                          onClick={handleNavClick}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive
                              ? isDark
                                ? 'bg-white/15 text-white font-bold border border-white/20 shadow-inner'
                                : 'bg-blue-50 text-blue-900 font-bold border border-blue-200 shadow-2xs'
                              : isDark
                                ? 'text-slate-300 hover:bg-white/10 hover:text-white'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`w-4 h-4 ${isActive
                                  ? isDark
                                    ? 'text-yellow-400'
                                    : 'text-blue-700'
                                  : isDark
                                    ? 'text-blue-300'
                                    : 'text-slate-400'
                                }`}
                            />
                            <span>{item.title}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-blue-600 text-white'
                                }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Collapsed (Mini Tab) Mode on Desktop
            return (
              <div key={groupIdx} className="space-y-2">
                {groupIdx > 0 && (
                  <div
                    style={{
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
                    }}
                    className="border-t my-2 mx-1"
                  />
                )}

                <div className="space-y-1.5">
                  {visibleItems.map((item, itemIdx) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/dashboard' &&
                        pathname.startsWith(item.href) &&
                        !pathname.includes('create'));

                    const Icon = item.icon;
                    const tooltipText = item.badge
                      ? `${item.title} (${item.badge})`
                      : item.title;

                    return (
                      <div key={itemIdx} className="flex justify-center">
                        <Link
                          href={item.href}
                          onClick={handleNavClick}
                          title={tooltipText}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative ${isActive
                              ? isDark
                                ? 'bg-white/20 text-yellow-300 font-bold border border-white/25 shadow-inner'
                                : 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-2xs'
                              : isDark
                                ? 'text-blue-200 hover:bg-white/10 hover:text-white'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${isActive
                                ? isDark
                                  ? 'text-yellow-400'
                                  : 'text-blue-700'
                                : isDark
                                  ? 'text-blue-200'
                                  : 'text-slate-400'
                              }`}
                          />
                          {item.badge && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0b1120]" />
                          )}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
        </nav>

        {/* User Profile & Logout Bottom Bar */}
        {isOpen ? (
          <div
            suppressHydrationWarning
            style={{
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : '#f8fafc',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
            }}
            className="p-4 border-t relative z-10 shrink-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 ${isDark
                      ? 'bg-blue-500/20 text-yellow-300 border-blue-400/30'
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}
                >
                  {isMounted ? (user?.fullName?.charAt(0) || 'U') : 'U'}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'
                      }`}
                  >
                    {isMounted ? (user?.fullName || 'ຜູ້ໃຊ້ງານລະບົບ') : 'ຜູ້ໃຊ້ງານລະບົບ'}
                  </p>
                  <div
                    className={`flex items-center gap-1.5 text-[10px] ${isDark ? 'text-blue-200' : 'text-slate-500'
                      }`}
                  >
                    <Shield className="w-2.5 h-2.5 text-emerald-500" />
                    <span className="truncate">{isMounted ? (user?.roleTitle || user?.role || 'USER') : 'USER'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="ອອກຈາກລະບົບ (Logout)"
                className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark
                    ? 'text-blue-200 hover:text-white hover:bg-red-500/20'
                    : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                  }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            suppressHydrationWarning
            style={{
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : '#f8fafc',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
            }}
            className="p-3 border-t flex flex-col items-center gap-2 relative z-10 shrink-0"
          >
            <div
              title={`${(isMounted && user?.fullName) || 'ຜູ້ໃຊ້ງານ'} (${(isMounted && user?.role) || 'USER'})`}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 cursor-default ${isDark
                  ? 'bg-blue-500/20 text-yellow-300 border-blue-400/30'
                  : 'bg-blue-100 text-blue-700 border-blue-200'
                }`}
            >
              {isMounted ? (user?.fullName?.charAt(0) || 'U') : 'U'}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="ອອກຈາກລະບົບ (Logout)"
              className={`p-2 rounded-xl transition-colors cursor-pointer ${isDark
                  ? 'text-blue-200 hover:text-white hover:bg-red-500/20'
                  : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
