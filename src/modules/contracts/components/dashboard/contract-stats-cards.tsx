import React from 'react';
import Link from 'next/link';
import { Briefcase, CheckCircle2, ClockAlert, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import { ContractDashboardData } from '../../types/contract.types';
import { ContractStatus } from '@core/entities';

interface ContractStatsCardsProps {
  data: ContractDashboardData;
}

export function ContractStatsCards({ data }: ContractStatsCardsProps) {
  const { summary, statusChart } = data;

  // Find active count from statusChart
  const activeCount =
    statusChart.find((s) => s.status === ContractStatus.ACTIVE)?.count || 0;

  const cards = [
    {
      title: 'ສັນຍາທັງໝົດ',
      titleEn: 'Total Contracts',
      value: summary.totalContracts,
      icon: Briefcase,
      color: 'text-primary',
      bgLight: 'bg-primary-light/40 border-primary/20',
      href: '/contracts',
    },
    {
      title: 'ສັນຍາມີຜົນບັງຄັບໃຊ້',
      titleEn: 'Active Contracts',
      value: activeCount,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-50 border-emerald-200',
      href: '/contracts?status=ACTIVE',
    },
    {
      title: 'ສັນຍາໃກ້ໝົດອາຍຸ (≤ 60 ວັນ)',
      titleEn: 'Expiring Soon',
      value: summary.expiringSoonCount,
      icon: ClockAlert,
      color: 'text-amber-600',
      bgLight: 'bg-amber-50 border-amber-200',
      href: '/contracts?status=EXPIRING_SOON',
      pulse: summary.expiringSoonCount > 0,
    },
    {
      title: 'ສັນຍາໝົດອາຍຸແລ້ວ',
      titleEn: 'Expired Contracts',
      value: summary.expiredCount,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgLight: 'bg-red-50 border-red-200',
      href: '/contracts?status=EXPIRED',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className={`p-2.5 rounded-xl border ${card.bgLight} ${card.color}`}>
                <Icon className={`w-5 h-5 ${card.pulse ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {formatNumber(card.value)}
              </span>
              <div className="flex items-center text-xs font-semibold text-text-muted group-hover:text-primary transition-colors">
                <span>ເບິ່ງລາຍການ</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
