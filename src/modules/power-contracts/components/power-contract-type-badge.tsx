import React from 'react';
import { PowerContractType } from '@core/entities';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface PowerContractTypeBadgeProps {
  type: PowerContractType;
  showIcon?: boolean;
}

export function PowerContractTypeBadge({
  type,
  showIcon = true,
}: PowerContractTypeBadgeProps) {
  if (type === PowerContractType.PURCHASE) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        {showIcon && <ArrowDownLeft className="w-3.5 h-3.5 text-blue-600" />}
        <span>ຊື້ໄຟ (PPA)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      {showIcon && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />}
      <span>ຂາຍໄຟ (PSA)</span>
    </span>
  );
}
