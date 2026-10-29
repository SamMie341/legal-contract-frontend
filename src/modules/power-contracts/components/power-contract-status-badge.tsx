import React from 'react';
import { ContractStatus } from '@core/entities';
import { CONTRACT_STATUS_MAP } from '@/utils/status-badge';

interface PowerContractStatusBadgeProps {
  status: ContractStatus;
  showDot?: boolean;
}

export function PowerContractStatusBadge({
  status,
  showDot = true,
}: PowerContractStatusBadgeProps) {
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
