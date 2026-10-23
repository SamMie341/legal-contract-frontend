'use client';

import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { DocumentType, LegalDocumentStatus, Department } from '@core/entities';

interface DocumentFiltersBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  docType: DocumentType | undefined;
  onDocTypeChange: (val: DocumentType | undefined) => void;
  status: LegalDocumentStatus | undefined;
  onStatusChange: (val: LegalDocumentStatus | undefined) => void;
  departmentId: string | undefined;
  onDepartmentChange: (val: string | undefined) => void;
  issueYear: number | undefined;
  onIssueYearChange: (val: number | undefined) => void;
  departments: Department[];
  onReset: () => void;
}

export function DocumentFiltersBar({
  search,
  onSearchChange,
  docType,
  onDocTypeChange,
  status,
  onStatusChange,
  departmentId,
  onDepartmentChange,
  issueYear,
  onIssueYearChange,
  departments,
  onReset,
}: DocumentFiltersBarProps) {
  const statusTabs: { label: string; val: LegalDocumentStatus | undefined }[] = [
    { label: 'ທັງໝົດ', val: undefined },
    { label: 'ຍັງນຳໃຊ້ (ACTIVE)', val: LegalDocumentStatus.ACTIVE },
    { label: 'ຖືກຍົກເລີກ (INACTIVE)', val: LegalDocumentStatus.INACTIVE },
  ];

  const hasActiveFilters = Boolean(
    search || docType || status || departmentId || issueYear
  );

  return (
    <div className="space-y-3 p-4 bg-surface rounded-2xl border border-border-line shadow-xs">
      {/* Top Row: Search & Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        {/* Search Input */}
        <div className="relative lg:col-span-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ຄົ້ນຫາຫົວຂໍ້, ເລກທີ, ຜູ້ຮັບຜິດຊອບ..."
            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Document Type Dropdown */}
        <div>
          <select
            value={docType ?? ''}
            onChange={(e) => {
              const val = e.target.value ? (e.target.value as DocumentType) : undefined;
              onDocTypeChange(val);
            }}
            className="w-full px-3 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer truncate"
          >
            <option value="">-- ທຸກປະເພດນິຕິກຳ --</option>
            <option value={DocumentType.REGULATION}>ກົດລະບຽບ (Regulation)</option>
            <option value={DocumentType.PROVISION}>ຂໍ້ກຳນົດ (Provision)</option>
            <option value={DocumentType.AGREEMENT}>ຂໍ້ຕົກລົງ (Agreement)</option>
            <option value={DocumentType.NOTICE}>ແຈ້ງການ (Notice)</option>
            <option value={DocumentType.MANUAL}>ຄູ່ມື (Manual)</option>
            <option value={DocumentType.CONTRACT}>ສັນຍາ (Contract)</option>
            <option value={DocumentType.OTHER}>ອື່ນໆ (Other)</option>
          </select>
        </div>

        {/* Department Dropdown */}
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
            value={issueYear ?? ''}
            onChange={(e) =>
              onIssueYearChange(e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="ປີອອກນິຕິກຳ (2026)"
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
