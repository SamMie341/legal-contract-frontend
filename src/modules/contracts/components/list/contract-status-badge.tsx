import React from 'react';
import { ContractStatus } from '@core/entities';
import { CONTRACT_STATUS_MAP } from '@/utils/status-badge';

interface ContractStatusBadgeProps {
  status: ContractStatus;
  showDot?: boolean;
}

export function ContractStatusBadge({
  status,
  showDot = true,
}: ContractStatusBadgeProps) {
  const config = CONTRACT_STATUS_MAP[status] || {
    label: status,
    labelEn: status,
    className: 'bg-slate-100 text-slate-700 border-slate-300',
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
