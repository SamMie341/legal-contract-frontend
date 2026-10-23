import React from 'react';
import { DocumentType } from '@core/entities';

const TYPE_CONFIG: Record<
  DocumentType,
  { label: string; labelEn: string; className: string }
> = {
  [DocumentType.REGULATION]: {
    label: 'ກົດລະບຽບ',
    labelEn: 'Regulation',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [DocumentType.PROVISION]: {
    label: 'ຂໍ້ກຳນົດ',
    labelEn: 'Provision',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  [DocumentType.AGREEMENT]: {
    label: 'ຂໍ້ຕົກລົງ',
    labelEn: 'Agreement',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  [DocumentType.NOTICE]: {
    label: 'ແຈ້ງການ',
    labelEn: 'Notice',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  [DocumentType.MANUAL]: {
    label: 'ຄູ່ມື',
    labelEn: 'Manual',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  [DocumentType.CONTRACT]: {
    label: 'ສັນຍາ',
    labelEn: 'Contract',
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  [DocumentType.OTHER]: {
    label: 'ອື່ນໆ',
    labelEn: 'Other',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

interface DocumentTypeBadgeProps {
  type: DocumentType;
}

export function DocumentTypeBadge({ type }: DocumentTypeBadgeProps) {
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
