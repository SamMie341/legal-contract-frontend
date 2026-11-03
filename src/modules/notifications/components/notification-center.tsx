'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  Briefcase,
  Zap,
  Clock,
  Calendar,
  AlertCircle,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';
import { AppNotification } from '@core/entities';
import { formatDate } from '@/utils/formatters';

export function NotificationCenter() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD'>('ALL');

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAll,
  } = useNotifications();

  const filteredNotifications =
    activeTab === 'UNREAD'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const handleNotificationClick = async (item: AppNotification) => {
    if (!item.isRead) {
      try {
        await markAsRead(item.id, item.type);
      } catch (err) {
        console.error('Error marking as read:', err);
      }
    }

    setIsOpen(false);

    if (item.type === 'CONTRACT') {
      router.push(`/contracts/${item.targetId}`);
    } else {
      router.push(`/power-contracts/${item.targetId}`);
    }
  };

  const getDaysLeftBadge = (days?: number) => {
    if (days === undefined) return null;
    if (days <= 0) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
          ໝົດອາຍຸແລ້ວ
        </span>
      );
    }
    if (days <= 30) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          ເຫຼືອ {days} ວັນ
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        ເຫຼືອ {days} ວັນ
      </span>
    );
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative p-2 rounded-xl transition-all cursor-pointer ${
          isOpen
            ? 'bg-primary/10 text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-slate-100'
        }`}
        title="ການແຈ້ງເຕືອນສັນຍາໃກ້ໝົດອາຍຸ"
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Popover */}
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-[340px] sm:w-[420px] rounded-2xl bg-surface border border-border-line shadow-2xl z-40 overflow-hidden animate-fadeIn flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border-line bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary leading-tight">
                    ການແຈ້ງເຕືອນສັນຍາ
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    {unreadCount > 0
                      ? `ມີ ${unreadCount} ລາຍການທີ່ຍັງບໍ່ທັນອ່ານ`
                      : 'ອ່ານຄົບທຸກລາຍການແລ້ວ'}
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
                  disabled={isMarkingAll}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-[11px] font-semibold text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                  title="ໝາຍທັງໝົດວ່າອ່ານແລ້ວ"
                >
                  {isMarkingAll ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCheck className="w-3.5 h-3.5 text-primary" />
                  )}
                  <span>ອ່ານທັງໝົດ</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-border-line/70 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeTab === 'ALL'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-secondary hover:bg-slate-100'
                }`}
              >
                ທັງໝົດ ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('UNREAD')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeTab === 'UNREAD'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-secondary hover:bg-slate-100'
                }`}
              >
                ຍັງບໍ່ອ່ານ ({unreadCount})
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-border-line/60 custom-scrollbar">
              {isLoading && notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span>ກຳລັງໂຫຼດການແຈ້ງເຕືອນ...</span>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-text-primary">
                    ບໍ່ມີການແຈ້ງເຕືອນ
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {activeTab === 'UNREAD'
                      ? 'ທ່ານໄດ້ອ່ານການແຈ້ງເຕືອນທັງໝົດແລ້ວ'
                      : 'ຍັງບໍ່ມີສັນຍາໃກ້ໝົດອາຍຸໃນໄລຍະນີ້'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const isPower = item.type === 'POWER_CONTRACT';

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3.5 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer relative flex items-start gap-3 ${
                        !item.isRead ? 'bg-amber-50/25' : 'bg-white'
                      }`}
                    >
                      {/* Unread indicator bar */}
                      {!item.isRead && (
                        <div className="absolute left-1 top-4 bottom-4 w-1 rounded-full bg-primary" />
                      )}

                      {/* Icon */}
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isPower
                            ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                        }`}
                      >
                        {isPower ? (
                          <Zap className="w-4 h-4" />
                        ) : (
                          <Briefcase className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isPower
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isPower ? 'ສັນຍາຊື້-ຂາຍໄຟ' : 'ສັນຍາທົ່ວໄປ'}
                          </span>

                          {getDaysLeftBadge(item.daysLeft)}
                        </div>

                        {item.contractNumber && (
                          <p className="text-xs font-mono font-bold text-text-primary">
                            {item.contractNumber}
                          </p>
                        )}

                        <p className="text-xs font-semibold text-text-primary truncate">
                          {item.contractName || item.title}
                        </p>

                        <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
                          {item.message}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[10px] text-text-muted">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {formatDate(item.notifiedDate)}
                          </span>

                          <span className="text-primary hover:underline flex items-center gap-0.5 font-medium">
                            <span>ເບິ່ງສັນຍາ</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-border-line text-center text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push('/contracts?status=EXPIRING_SOON');
                }}
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>ເບິ່ງລາຍການສັນຍາໃກ້ໝົດອາຍຸທັງໝົດ</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
