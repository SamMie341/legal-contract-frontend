import React from 'react';
import { CaseType } from '@core/entities';

const TYPE_CONFIG: Record<
  CaseType,
  { label: string; labelEn: string; className: string }
> = {
  [CaseType.COMMERCIAL]: {
    label: 'ຄະດີທຸລະກິດ',
    labelEn: 'Commercial',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  [CaseType.CIVIL]: {
    label: 'ຄະດີແພ່ງ',
    labelEn: 'Civil',
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  [CaseType.CRIMINAL]: {
    label: 'ຄະດີອາຍາ',
    labelEn: 'Criminal',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  [CaseType.ADMINISTRATIVE]: {
    label: 'ຄະດີປົກຄອງ',
    labelEn: 'Administrative',
    className: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  [CaseType.OTHER]: {
    label: 'ອື່ນໆ',
    labelEn: 'Other',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

interface CaseTypeBadgeProps {
  type: CaseType;
}

export function CaseTypeBadge({ type }: CaseTypeBadgeProps) {
  const config = TYPE_CONFIG[type] || {
    label: type,
    labelEn: type,
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
