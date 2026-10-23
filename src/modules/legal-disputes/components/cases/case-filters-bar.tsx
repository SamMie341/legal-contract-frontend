'use client';

import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { CaseType, DisputeStatus, Department } from '@core/entities';

interface CaseFiltersBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  caseType: CaseType | undefined;
  onCaseTypeChange: (val: CaseType | undefined) => void;
  disputeStatus: DisputeStatus | undefined;
  onDisputeStatusChange: (val: DisputeStatus | undefined) => void;
  departmentId: string | undefined;
  onDepartmentChange: (val: string | undefined) => void;
  year: number | undefined;
  onYearChange: (val: number | undefined) => void;
  departments: Department[];
  onReset: () => void;
}

export function CaseFiltersBar({
  search,
  onSearchChange,
  caseType,
  onCaseTypeChange,
  disputeStatus,
  onDisputeStatusChange,
  departmentId,
  onDepartmentChange,
  year,
  onYearChange,
  departments,
  onReset,
}: CaseFiltersBarProps) {
  const statusTabs: { label: string; val: DisputeStatus | undefined }[] = [
    { label: 'ທັງໝົດ', val: undefined },
    { label: 'ສານຂັ້ນຕົ້ນ', val: DisputeStatus.FIRST_INSTANCE },
    { label: 'ສານອຸທອນ', val: DisputeStatus.APPEAL },
    { label: 'ສານຂັ້ນລົບລ້າງ', val: DisputeStatus.SUPREME },
    { label: 'ແກ້ໄຂສຳເລັດ', val: DisputeStatus.RESOLVED },
    { label: 'ປິດສຳນວນ', val: DisputeStatus.CLOSED },
  ];

  const hasActiveFilters = Boolean(
    search || caseType || disputeStatus || departmentId || year
  );

  return (
    <div className="space-y-3 p-4 bg-surface rounded-2xl border border-border-line shadow-xs">
      {/* Top Row: Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        {/* Search */}
        <div className="relative lg:col-span-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ຄົ້ນຫາລະຫັດຄະດີ, ຈຳເລີຍ, ຂໍ້ກ່າວຫາ..."
            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Case Type */}
        <div>
          <select
            value={caseType ?? ''}
            onChange={(e) => {
              const val = e.target.value ? (e.target.value as CaseType) : undefined;
              onCaseTypeChange(val);
            }}
            className="w-full px-3 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer truncate"
          >
            <option value="">-- ທຸກປະເພດຄະດີ --</option>
            <option value={CaseType.COMMERCIAL}>ຄະດີທຸລະກິດ (Commercial)</option>
            <option value={CaseType.CIVIL}>ຄະດີແພ່ງ (Civil)</option>
            <option value={CaseType.CRIMINAL}>ຄະດີອາຍາ (Criminal)</option>
            <option value={CaseType.ADMINISTRATIVE}>ຄະດີປົກຄອງ (Administrative)</option>
            <option value={CaseType.OTHER}>ອື່ນໆ (Other)</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <select
            value={departmentId ?? ''}
            onChange={(e) => onDepartmentChange(e.target.value || undefined)}
            className="w-full px-3 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer truncate"
          >
            <option value="">-- ທຸກຫ້ອງການ/ຝ່າຍ --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter & Reset Button */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1950"
            max="2100"
            value={year ?? ''}
            onChange={(e) =>
              onYearChange(e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="ປີເລີ່ມຕົ້ນຄະດີ (2026)"
            className="w-full px-3 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 rounded-xl border border-border-line bg-white hover:bg-slate-100 text-text-secondary hover:text-red-600 transition-colors shrink-0"
              title="ລ້າງຕົວກັ່ນຕອງ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Status Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border-line">
        <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" />
          ຂັ້ນສານ / ສະຖານະ:
        </span>

        {statusTabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => onDisputeStatusChange(tab.val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              disputeStatus === tab.val
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
