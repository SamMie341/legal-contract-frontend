'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LogOut, Shield } from 'lucide-react';
import { usePermissions } from '@/presentation/hooks';
import { useAuthStore } from '@application/store';
import { NAVIGATION_CONFIG } from './nav-config';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, isAdmin, hasPermission } = usePermissions();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-primary text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-lg text-yellow-400 shadow-inner">
              ⚡
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                ລັດວິສາຫະກິດໄຟຟ້າລາວ
              </h1>
              <p className="text-[10px] text-blue-200 tracking-wider font-medium">
                LEGAL & CONTRACT SYSTEM
              </p>
            </div>
          </Link>

          {/* Close button for Mobile */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
          {NAVIGATION_CONFIG.map((group, groupIdx) => {
            // Check admin group restriction
            if (group.adminOnly && !isAdmin) return null;

            // Filter items by permission
            const visibleItems = group.items.filter((item) => {
              if (item.adminOnly && !isAdmin) return false;
              if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
                return false;
              }
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-1.5">
                <h3 className="px-3 text-[11px] font-semibold tracking-wider text-blue-300/80 uppercase">
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
                        onClick={onClose}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-white/15 text-white font-semibold shadow-inner border border-white/10'
                            : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-blue-300'}`} />
                          <span>{item.title}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                              item.badgeColor || 'bg-blue-500 text-white'
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
          })}
        </nav>

        {/* User Profile & Logout Bottom Bar */}
        <div className="p-4 border-t border-white/10 bg-black/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xs font-bold text-yellow-300 shrink-0">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.fullName || 'ຜູ້ໃຊ້ງານລະບົບ'}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-blue-200">
                  <Shield className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="truncate">{user?.role || 'USER'}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="ອອກຈາກລະບົບ (Logout)"
              className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-red-500/20 hover:border-red-400/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
