'use client';

import React from 'react';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Calendar,
  Shield,
  FileText,
  Zap,
  Scale,
  Paperclip,
  Users,
} from 'lucide-react';
import { AuditAction, AuditLogCategory, AUDIT_ACTION_MAP } from '@core/entities';

interface AuditLogFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedCategory: AuditLogCategory;
  onCategoryChange: (category: AuditLogCategory) => void;
  selectedAction: string;
  onActionChange: (action: string) => void;
  datePreset: 'ALL' | 'TODAY' | '7DAYS' | '30DAYS';
  onDatePresetChange: (preset: 'ALL' | 'TODAY' | '7DAYS' | '30DAYS') => void;
  onReset: () => void;
}

const CATEGORIES: {
  key: AuditLogCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'ALL', label: 'ທັງໝົດ', icon: Filter },
  { key: 'SECURITY', label: 'ຄວາມປອດໄພ & ສິດທິ', icon: Shield },
  { key: 'CONTRACTS', label: 'ສັນຍາທົ່ວໄປ', icon: FileText },
  { key: 'POWER_CONTRACTS', label: 'ສັນຍາຊື້-ຂາຍໄຟຟ້າ', icon: Zap },
  { key: 'LEGAL', label: 'ນິຕິກຳ & ຄະດີ', icon: Scale },
  { key: 'ATTACHMENTS', label: 'ໄຟລ໌ແນບ & ດາວໂຫຼດ', icon: Paperclip },
  { key: 'ROLES', label: 'ບົດບາດ (Roles)', icon: Users },
];

export function AuditLogFilters({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedAction,
  onActionChange,
  datePreset,
  onDatePresetChange,
  onReset,
}: AuditLogFiltersProps) {
  const hasActiveFilters =
    Boolean(search) ||
    selectedCategory !== 'ALL' ||
    Boolean(selectedAction) ||
    datePreset !== 'ALL';

  // Get actions relevant to currently selected category (or all)
  const availableActions = Object.entries(AUDIT_ACTION_MAP).filter(
    ([_, info]) => selectedCategory === 'ALL' || info.category === selectedCategory
  );

  return (
    <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
      {/* Row 1: Search & Date Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ຄົ້ນຫາຊື່ພະນັກງານ, ລະຫັດ, ຫົວຂໍ້ສັນຍາ, IP..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-border-line rounded-xl text-xs text-text-primary focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-xs">
          <span className="text-[11px] font-bold text-text-muted flex items-center gap-1 mr-1 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-text-muted" />
            <span>ຊ່ວງເວລາ:</span>
          </span>
          {[
            { key: 'ALL', label: 'ທຸກຊ່ວງເວລາ' },
            { key: 'TODAY', label: 'ມື້ນີ້' },
            { key: '7DAYS', label: '7 ວັນ' },
            { key: '30DAYS', label: '30 ວັນ' },
          ].map((item) => {
            const isSelected = datePreset === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onDatePresetChange(item.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="ml-2 px-2.5 py-1.5 rounded-lg border border-border-line text-xs font-semibold text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 shrink-0"
              title="ລ້າງຕົວກັ່ນຕອງທັງໝົດ"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ລ້າງຄ່າ</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Category Tabs & Specific Action Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-border-line">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  onCategoryChange(cat.key);
                  onActionChange(''); // reset specific action when category changes
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 text-text-secondary border border-border-line hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Specific Action Dropdown */}
        <div className="shrink-0 flex items-center gap-2">
          <select
            value={selectedAction}
            onChange={(e) => onActionChange(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 border border-border-line text-xs font-medium text-text-primary focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">-- ທຸກ Action ລະອຽດ --</option>
            {availableActions.map(([act, info]) => (
              <option key={act} value={act}>
                {info.label} ({act})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
