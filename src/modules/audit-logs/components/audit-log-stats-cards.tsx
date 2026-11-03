'use client';

import React from 'react';
import {
  Activity,
  ShieldAlert,
  FileCheck2,
  DownloadCloud,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AuditLogStats } from '@core/entities';

interface AuditLogStatsCardsProps {
  stats?: AuditLogStats;
  isLoading?: boolean;
}

export function AuditLogStatsCards({
  stats,
  isLoading = false,
}: AuditLogStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 bg-surface rounded-2xl border border-border-line space-y-3"
          >
            <div className="w-8 h-8 bg-slate-200 rounded-xl" />
            <div className="h-6 bg-slate-200 rounded-md w-2/3" />
            <div className="h-4 bg-slate-100 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const totalLogs = stats?.totalLogs ?? 0;
  const todayLogs = stats?.todayLogs ?? 0;
  const securityChanges = stats?.securityChanges ?? 0;
  const docsChanges = (stats?.contractChanges ?? 0) + (stats?.legalChanges ?? 0);
  const attachmentActions = stats?.attachmentActions ?? 0;

  const cards = [
    {
      title: 'ພາບລວມການດຳເນີນງານທັງໝົດ',
      value: totalLogs.toLocaleString(),
      subtitle: `${todayLogs.toLocaleString()} ລາຍການໃນມື້ນີ້`,
      icon: Activity,
      color: 'blue',
      badge: 'Real-time',
    },
    {
      title: 'ປ່ຽນແປງສິດທິ & ຄວາມປອດໄພ',
      value: securityChanges.toLocaleString(),
      subtitle: 'ປັບບົດບາດ, ສິດທິ & ຣີເຊັດລະຫັດ',
      icon: ShieldAlert,
      color: 'purple',
      badge: 'Audit & RBAC',
    },
    {
      title: 'ສັນຍາ & ເອກະສານນິຕິກຳ',
      value: docsChanges.toLocaleString(),
      subtitle: 'ສ້າງ, ແກ້ໄຂ ແລະ ລົບຂໍ້ມູນໃນ 3 ໂມດູນ',
      icon: FileCheck2,
      color: 'emerald',
      badge: 'Contracts',
    },
    {
      title: 'ອັບໂຫຼດ & ດາວໂຫຼດໄຟລ໌',
      value: attachmentActions.toLocaleString(),
      subtitle: 'ເອກະສານແນບ PDF ແລະ ໄຟລ໌ສັນຍາ',
      icon: DownloadCloud,
      color: 'indigo',
      badge: 'Files',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        const themeStyles = {
          blue: {
            bg: 'bg-blue-50/70',
            text: 'text-blue-700',
            border: 'border-blue-100',
            badgeBg: 'bg-blue-100/70 text-blue-700',
          },
          purple: {
            bg: 'bg-purple-50/70',
            text: 'text-purple-700',
            border: 'border-purple-100',
            badgeBg: 'bg-purple-100/70 text-purple-700',
          },
          emerald: {
            bg: 'bg-emerald-50/70',
            text: 'text-emerald-700',
            border: 'border-emerald-100',
            badgeBg: 'bg-emerald-100/70 text-emerald-700',
          },
          indigo: {
            bg: 'bg-indigo-50/70',
            text: 'text-indigo-700',
            border: 'border-indigo-100',
            badgeBg: 'bg-indigo-100/70 text-indigo-700',
          },
        }[card.color as 'blue' | 'purple' | 'emerald' | 'indigo'];

        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-surface border border-border-line shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl ${themeStyles.bg} ${themeStyles.text} flex items-center justify-center font-bold`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${themeStyles.badgeBg}`}
              >
                {card.badge}
              </span>
            </div>

            <div>
              <p className="text-2xl font-black text-text-primary tracking-tight">
                {card.value}
              </p>
              <h3 className="text-xs font-bold text-text-primary mt-0.5 truncate">
                {card.title}
              </h3>
              <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 text-text-muted shrink-0" />
                <span>{card.subtitle}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
