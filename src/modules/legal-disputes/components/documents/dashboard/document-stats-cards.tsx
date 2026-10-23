'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Building2,
  ArrowUpRight,
} from 'lucide-react';
import { formatNumber } from '@/utils/formatters';
import { DocumentDashboardData } from '../../../types/document.types';

interface DocumentStatsCardsProps {
  data: DocumentDashboardData;
}

export function DocumentStatsCards({ data }: DocumentStatsCardsProps) {
  const { summary } = data;

  const cards = [
    {
      title: 'ນິຕິກຳທັງໝົດ',
      titleEn: 'Total Documents',
      value: summary.totalDocuments,
      icon: FileText,
      color: 'text-primary',
      bgLight: 'bg-primary-light/40 border-primary/20',
      href: '/legal-documents',
    },
    {
      title: 'ນິຕິກຳມີຜົນບັງຄັບໃຊ້',
      titleEn: 'Active Documents',
      value: summary.activeDocuments,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-50 border-emerald-200',
      href: '/legal-documents?status=ACTIVE',
    },
    {
      title: 'ໝົດຜົນບັງຄັບໃຊ້ / ຍົກເລີກ',
      titleEn: 'Inactive Documents',
      value: summary.inactiveDocuments,
      icon: XCircle,
      color: 'text-slate-500',
      bgLight: 'bg-slate-100 border-slate-200',
      href: '/legal-documents?status=INACTIVE',
    },
    {
      title: 'ຫ້ອງການ/ຝ່າຍ ທີ່ມີນິຕິກຳ',
      titleEn: 'Departments with Docs',
      value: summary.totalDepartmentsWithDocuments,
      icon: Building2,
      color: 'text-indigo-600',
      bgLight: 'bg-indigo-50 border-indigo-200',
      href: '/legal-documents',
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
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.bgLight} ${card.color} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-4 h-4" />
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
