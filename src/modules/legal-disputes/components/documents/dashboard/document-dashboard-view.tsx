'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { usePermissions } from '@/presentation/hooks';
import { useDocumentDashboard } from '../../../hooks/use-document-dashboard';
import { DocumentStatsCards } from './document-stats-cards';
import { DocumentTypeChart } from './document-type-chart';
import { DocumentDepartmentChart } from './document-department-chart';

export function DocumentDashboardView() {
  const { data, isLoading, isError, error, refetch, isFetching } = useDocumentDashboard();
  const { canUpload } = usePermissions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ (Legal Affairs & Disputes)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            ສະຖິຕິ Dashboard ຂອງນິຕິກຳ
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ພາບລວມສະຖານະ, ໝວດໝູ່ນິຕິກຳ 7 ປະເພດ ແລະ ຫ້ອງການ/ຝ່າຍທີ່ຮັບຜິດຊອບ
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
            title="ໂຫຼດຂໍ້ມູນໃໝ່ (Refresh)"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/legal-documents"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border-line bg-white hover:bg-slate-50 text-xs font-semibold text-text-primary shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-text-secondary" />
            <span>ລາຍການນິຕິກຳ</span>
          </Link>

          {canUpload && (
            <Link
              href="/legal-documents/create"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>ເພີ່ມນິຕິກຳໃໝ່</span>
            </Link>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-200/60 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-slate-200/60 rounded-2xl" />
            <div className="h-80 bg-slate-200/60 rounded-2xl" />
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-6 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-900">
                ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນສະຖິຕິນິຕິກຳ
              </h3>
              <p className="text-xs text-red-700 mt-0.5">
                {(error as Error)?.message || 'ກະລຸນາກວດສອບການເຊື່ອມຕໍ່ ຫຼື ສິດທິການເຂົ້າເຖິງ'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-white border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 shadow-xs"
          >
            ລອງໃໝ່ອີກຄັ້ງ
          </button>
        </div>
      )}

      {/* Data Loaded */}
      {data && (
        <>
          {/* KPI Summary Cards */}
          <DocumentStatsCards data={data} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DocumentTypeChart data={data.donutChart} />
            <DocumentDepartmentChart data={data.departmentBarChart} />
          </div>

          {/* Quick Access Links */}
          <div className="p-5 bg-surface rounded-2xl border border-border-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-text-primary">
                ການເຂົ້າເຖິງດ່ວນ (Quick Navigation)
              </h4>
              <p className="text-[11px] text-text-secondary mt-0.5">
                ຄົ້ນຫາ ແລະ ກັ່ນຕອງເອກະສານຕາມປະເພດ ຫຼື ສະຖານະ
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/legal-documents?docType=REGULATION"
                className="px-3 py-1.5 rounded-lg border border-border-line hover:bg-slate-100 text-xs font-medium text-text-secondary transition-colors"
              >
                ກົດລະບຽບ
              </Link>
              <Link
                href="/legal-documents?docType=PROVISION"
                className="px-3 py-1.5 rounded-lg border border-border-line hover:bg-slate-100 text-xs font-medium text-text-secondary transition-colors"
              >
                ຂໍ້ກຳນົດ
              </Link>
              <Link
                href="/legal-documents?docType=NOTICE"
                className="px-3 py-1.5 rounded-lg border border-border-line hover:bg-slate-100 text-xs font-medium text-text-secondary transition-colors"
              >
                ແຈ້ງການ
              </Link>
              <Link
                href="/legal-documents"
                className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-xs font-semibold text-primary transition-colors flex items-center gap-1"
              >
                <span>ເບິ່ງທັງໝົດ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
