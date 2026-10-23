'use client';

import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { ContractStatus, Currency } from '@core/entities';
import { ContractTypeDropdownItem } from '../../types/contract.types';

interface ContractFiltersBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: ContractStatus | undefined;
  onStatusChange: (status: ContractStatus | undefined) => void;
  contractTypeId: number | undefined;
  onContractTypeChange: (id: number | undefined) => void;
  currency: Currency | undefined;
  onCurrencyChange: (curr: Currency | undefined) => void;
  contractTypes: ContractTypeDropdownItem[];
  onReset: () => void;
}

export function ContractFiltersBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  contractTypeId,
  onContractTypeChange,
  currency,
  onCurrencyChange,
  contractTypes,
  onReset,
}: ContractFiltersBarProps) {
  const statusTabs: { label: string; val: ContractStatus | undefined; color?: string }[] = [
    { label: 'ທັງໝົດ', val: undefined },
    { label: 'ມີຜົນບັງຄັບໃຊ້ (ACTIVE)', val: ContractStatus.ACTIVE },
    { label: 'ໃກ້ໝົດອາຍຸ (EXPIRING)', val: ContractStatus.EXPIRING_SOON, color: 'text-amber-700' },
    { label: 'ໝົດອາຍຸ (EXPIRED)', val: ContractStatus.EXPIRED, color: 'text-red-700' },
    { label: 'ຮ່າງສັນຍາ (DRAFT)', val: ContractStatus.DRAFT },
    { label: 'ຍົກເລີກ (TERMINATED)', val: ContractStatus.TERMINATED },
  ];

  const hasActiveFilters = Boolean(search || status || contractTypeId || currency);

  return (
    <div className="space-y-3 p-4 bg-surface rounded-2xl border border-border-line shadow-xs">
      {/* Top Row: Search & Dropdowns */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ຄົ້ນຫາເລກທີສັນຍາ, ຊື່ສັນຍາ, ຜູ້ຈັດຕັ້ງປະຕິບັດ..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* 14 Contract Types Dropdown */}
        <div className="w-full md:w-64">
          <select
            value={contractTypeId ?? ''}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              onContractTypeChange(val);
            }}
            className="w-full px-3 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary truncate cursor-pointer"
          >
            <option value="">-- ທຸກປະເພດສັນຍາ (14 ປະເພດ) --</option>
            {contractTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nameLo}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Dropdown */}
        <div className="w-full md:w-40">
          <select
            value={currency ?? ''}
            onChange={(e) => {
              const val = e.target.value ? (e.target.value as Currency) : undefined;
              onCurrencyChange(val);
            }}
            className="w-full px-3 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            <option value="">-- ທຸກສະກຸນເງິນ --</option>
            <option value={Currency.LAK}>ກີບ (LAK)</option>
            <option value={Currency.USD}>ໂດລາ (USD)</option>
            <option value={Currency.CNY}>ຢວນ (CNY)</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="p-2.5 rounded-xl border border-border-line bg-white hover:bg-slate-100 text-text-secondary hover:text-red-600 transition-colors flex items-center justify-center shrink-0"
            title="ລ້າງຕົວກັ່ນຕອງ"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom Row: Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border-line">
        <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" />
          ສະຖານະ:
        </span>

        {statusTabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => onStatusChange(tab.val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              status === tab.val
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-text-secondary border border-border-line hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
