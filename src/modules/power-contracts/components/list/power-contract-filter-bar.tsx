'use client';

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { PowerContractType, ContractStatus } from '@core/entities';
import { CONTRACT_STATUS_MAP } from '@/utils/status-badge';

interface PowerContractFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  contractType?: PowerContractType;
  onContractTypeChange: (value?: PowerContractType) => void;
  status?: ContractStatus;
  onStatusChange: (value?: ContractStatus) => void;
  onReset: () => void;
}

export function PowerContractFilterBar({
  search,
  onSearchChange,
  contractType,
  onContractTypeChange,
  status,
  onStatusChange,
  onReset,
}: PowerContractFilterBarProps) {
  const hasActiveFilters = Boolean(search || contractType || status);

  return (
    <div className="bg-surface p-4 rounded-2xl border border-border-line shadow-xs space-y-4">
      {/* Top row: Type Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Type Filter Segmented Control */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => onContractTypeChange(undefined)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !contractType
                ? 'bg-white text-text-primary shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            ທັງໝົດ
          </button>
          <button
            type="button"
            onClick={() => onContractTypeChange(PowerContractType.PURCHASE)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              contractType === PowerContractType.PURCHASE
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            ສັນຍາຊື້ໄຟ (PPA)
          </button>
          <button
            type="button"
            onClick={() => onContractTypeChange(PowerContractType.SALE)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              contractType === PowerContractType.SALE
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            ສັນຍາຂາຍໄຟ (PSA)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ຄົ້ນຫາຊື່ໂຄງການ, ເລກທີສັນຍາ, ລູກຄ້າ, ສະຖານທີ່..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Bottom row: Status selector & Clear */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-line/60">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-semibold text-text-secondary">
            ສະຖານະ:
          </span>
          <select
            value={status || ''}
            onChange={(e) =>
              onStatusChange((e.target.value as ContractStatus) || undefined)
            }
            className="px-2.5 py-1.5 bg-white border border-border-line rounded-lg text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">ທຸກສະຖານະ</option>
            {Object.entries(CONTRACT_STATUS_MAP).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-text-secondary hover:text-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>ລ້າງຕົວກອງ</span>
          </button>
        )}
      </div>
    </div>
  );
}
