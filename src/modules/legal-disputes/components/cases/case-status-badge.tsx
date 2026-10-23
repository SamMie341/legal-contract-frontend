import React from 'react';
import { DisputeStatus } from '@core/entities';

const STATUS_CONFIG: Record<
  DisputeStatus,
  { label: string; labelEn: string; className: string; dotColor: string }
> = {
  [DisputeStatus.FIRST_INSTANCE]: {
    label: 'ສານຂັ້ນຕົ້ນ',
    labelEn: 'First Instance',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500',
  },
  [DisputeStatus.APPEAL]: {
    label: 'ສານອຸທອນ',
    labelEn: 'Court of Appeal',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  [DisputeStatus.SUPREME]: {
    label: 'ສານຂັ້ນລົບລ້າງ',
    labelEn: 'Supreme Court',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
    dotColor: 'bg-purple-500',
  },
  [DisputeStatus.RESOLVED]: {
    label: 'ແກ້ໄຂສຳເລັດ',
    labelEn: 'Resolved',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  [DisputeStatus.CLOSED]: {
    label: 'ປິດສຳນວນ',
    labelEn: 'Closed',
    className: 'bg-slate-100 text-slate-600 border-slate-300',
    dotColor: 'bg-slate-400',
  },
};

interface CaseStatusBadgeProps {
  status: DisputeStatus;
  showDot?: boolean;
}

export function CaseStatusBadge({
  status,
  showDot = true,
}: CaseStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    labelEn: status,
    className: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {showDot && (
        <span className={`w-2 h-2 rounded-full shrink-0 ${config.dotColor}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
}
