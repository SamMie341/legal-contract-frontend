'use client';

import React from 'react';
import Link from 'next/link';
import {
  Scale,
  Hourglass,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import { CaseDashboardData } from '../../../types/case.types';

interface CaseStatsCardsProps {
  data: CaseDashboardData;
}

export function CaseStatsCards({ data }: CaseStatsCardsProps) {
  const { summary } = data;

  const cards = [
    {
      title: 'ສຳນວນຄະດີທັງໝົດ',
      titleEn: 'Total Cases',
      value: summary.totalCases,
      icon: Scale,
      color: 'text-primary',
      bgLight: 'bg-primary-light/40 border-primary/20',
      href: '/legal-cases',
    },
    {
      title: 'ຄະດີກຳລັງດຳເນີນການ',
      titleEn: 'In Progress Cases',
      value: summary.inProgressCases,
      icon: Hourglass,
      color: 'text-amber-600',
      bgLight: 'bg-amber-50 border-amber-200',
      href: '/legal-cases',
      pulse: summary.inProgressCases > 0,
    },
    {
      title: 'ຄະດີແກ້ໄຂສຳເລັດ / ສິ້ນສຸດ',
      titleEn: 'Resolved Cases',
      value: summary.resolvedCases,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-50 border-emerald-200',
      href: '/legal-cases?status=RESOLVED',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            href={card.href}
            className="group p-5 bg-surface rounded-2xl border border-border-line hover:border-primary/30 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.bgLight} ${card.color} group-hover:scale-110 transition-transform relative`}
              >
                <Icon className="w-4 h-4" />
                {card.pulse && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <p className="text-2xl font-black font-mono text-text-primary tracking-tight">
                  {formatNumber(card.value)}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {card.titleEn}
                </p>
              </div>
              <div className="p-1 rounded-lg text-text-muted group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
