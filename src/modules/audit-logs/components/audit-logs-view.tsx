'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Activity,
  Calendar,
} from 'lucide-react';
import { AuditLog, AuditLogCategory } from '@core/entities';
import { useAuditLogs, useAuditLogStats } from '../hooks/use-audit-logs';
import { AuditLogStatsCards } from './audit-log-stats-cards';
import { AuditLogFilters } from './audit-log-filters';
import { AuditLogTable } from './audit-log-table';
import { AuditLogDetailModal } from './audit-log-detail-modal';
import { resolveResourceInfo } from '../utils/audit-log.util';
import { toast } from 'sonner';
import { usePermissions } from '@/presentation/hooks';
import { AccessDeniedView } from '@/presentation/components/ui/access-denied-view';

export function AuditLogsView() {
  const { isMounted, isAdmin } = usePermissions();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<AuditLogCategory>('ALL');
  const [action, setAction] = useState<string>('');
  const [datePreset, setDatePreset] = useState<'ALL' | 'TODAY' | '7DAYS' | '30DAYS'>('ALL');

  // Modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Compute startDate & endDate from datePreset
  const { startDate, endDate } = useMemo(() => {
    if (datePreset === 'ALL') return { startDate: undefined, endDate: undefined };

    const now = new Date();
    if (datePreset === 'TODAY') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      return { startDate: today, endDate: undefined };
    }

    if (datePreset === '7DAYS') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return { startDate: d.toISOString(), endDate: undefined };
    }

    if (datePreset === '30DAYS') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return { startDate: d.toISOString(), endDate: undefined };
    }

    return { startDate: undefined, endDate: undefined };
  }, [datePreset]);

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useAuditLogStats();

  const { data, isLoading, isFetching, refetch } = useAuditLogs({
    page,
    limit,
    search: search.trim() || undefined,
    category: category !== 'ALL' ? category : undefined,
    action: action || undefined,
    startDate,
    endDate,
  });

  const logs = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit, totalPages: 1 };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('ALL');
    setAction('');
    setDatePreset('ALL');
    setPage(1);
  };

  const handleExportCsv = () => {
    if (!logs.length) {
      toast.error('ບໍ່ມີຂໍ້ມູນສຳລັບ Export');
      return;
    }

    const headers = ['ID', 'Date Time', 'Actor', 'Employee Code', 'Action', 'Target Resource', 'IP Address'];
    const rows = logs.map((l) => {
      const res = resolveResourceInfo(l);
      const target = res.codeOrNumber ? `${res.title} (${res.codeOrNumber})` : res.title;
      return [
        l.id,
        new Date(l.createdAt).toLocaleString('lo-LA'),
        l.user?.fullName || 'N/A',
        l.user?.employeeCode || 'N/A',
        l.action,
        target || '-',
        l.ipAddress || '127.0.0.1',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edl-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('ດາວໂຫຼດ CSV ສຳເລັດແລ້ວ');
  };

  if (isMounted && !isAdmin) {
    return (
      <AccessDeniedView
        requiredDivisionName="ຜູ້ດູແລລະບົບ (ADMIN) ເທົ່ານັ້ນ"
        moduleName="ປະຫວັດການດຳເນີນງານ (Audit Logs)"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <span>ລະບົບຕິດຕາມຄວາມປອດໄພ & ຄວາມໂປ່ງໃສ (Security Audit & Compliance)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            ປະຫວັດການດຳເນີນງານລະບົບ (Audit Logs)
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ບັນທຶກປະຫວັດການສ້າງ, ແກ້ໄຂ, ລົບ, ອັບໂຫຼດ, ດາວໂຫຼດ, ແລະ ການປ່ຽນແປງສິດທິທັງໝົດໃນລະບົບ ຟຟລ
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-xs font-bold text-text-primary flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Export to CSV"
          >
            <Download className="w-3.5 h-3.5 text-text-secondary" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
            title="ໂຫຼດຂໍ້ມູນຄືນໃໝ່"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? 'animate-spin text-primary' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <AuditLogStatsCards stats={stats} isLoading={isStatsLoading} />

      {/* Filters Bar */}
      <AuditLogFilters
        search={search}
        onSearchChange={(s) => {
          setSearch(s);
          setPage(1);
        }}
        selectedCategory={category}
        onCategoryChange={(c) => {
          setCategory(c);
          setPage(1);
        }}
        selectedAction={action}
        onActionChange={(a) => {
          setAction(a);
          setPage(1);
        }}
        datePreset={datePreset}
        onDatePresetChange={(p) => {
          setDatePreset(p);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Audit Log Table */}
      <AuditLogTable
        logs={logs}
        isLoading={isLoading}
        onViewDetail={(log) => setSelectedLog(log)}
      />

      {/* Pagination Controls */}
      {meta.total > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 text-xs text-text-secondary">
          <p>
            ລວມທັງໝົດ: <span className="font-bold text-text-primary">{meta.total}</span> ລາຍການ
            (ໜ້າ {meta.page} / {meta.totalPages || 1})
          </p>

          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-text-muted">ສະແດງ:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="py-1 px-2 rounded-lg bg-surface border border-border-line font-bold text-xs"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Prev / Next */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-border-line bg-surface hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="ໜ້າກ່ອນໜ້າ"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 rounded-lg bg-surface border border-border-line font-bold text-text-primary">
                {meta.page}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                disabled={page >= meta.totalPages}
                className="p-1.5 rounded-lg border border-border-line bg-surface hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="ໜ້າຖັດໄປ"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AuditLogDetailModal
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
