'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { usePermissions } from '@/presentation/hooks';
import { useContractDashboard } from '../../hooks/use-contract-dashboard';
import { ContractStatsCards } from './contract-stats-cards';
import { ContractCurrencyCards } from './contract-currency-cards';
import { ContractStatusChart } from './contract-status-chart';
import { ContractTypeChart } from './contract-type-chart';

export function ContractDashboardView() {
  const { data, isLoading, isError, error, refetch, isFetching } = useContractDashboard();
  const { canUpload } = usePermissions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Briefcase className="w-4 h-4" />
            <span>ພະແນກສັນຍາທົ່ວໄປ (General Contracts Division)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            ສະຖິຕິ Dashboard ຂອງສັນຍາ
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ພາບລວມສະຖານະ, ມູນຄ່າການເງິນ 3 ສະກຸນ ແລະ ການຈັດແບ່ງຕາມ 14 ປະເພດສັນຍາ
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
            href="/contracts"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border-line bg-white hover:bg-slate-50 text-xs font-semibold text-text-primary shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-text-secondary" />
            <span>ລາຍການສັນຍາ</span>
          </Link>

          {canUpload && (
            <Link
              href="/contracts/create"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>ສ້າງສັນຍາໃໝ່</span>
            </Link>
          )}
        </div>
      </div>

      {/* Loading State Skeleton */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-200/60 rounded-2xl" />
            ))}
          </div>
          <div className="h-36 bg-slate-200/60 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="h-72 bg-slate-200/60 rounded-2xl" />
            <div className="h-72 bg-slate-200/60 rounded-2xl" />
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-red-800">
            ບໍ່ສາມາດໂຫຼດຂໍ້ມູນ Dashboard ສັນຍາໄດ້
          </h3>
          <p className="text-xs text-red-600 mt-1 max-w-md mx-auto">
            {error instanceof Error ? error.message : 'ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ກັບເຊີບເວີ'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ລອງໃໝ່ອີກຄັ້ງ</span>
          </button>
        </div>
      )}

      {/* Main Dashboard Content */}
      {data && !isLoading && (
        <div className="space-y-6">
          {/* Summary Status Cards */}
          <ContractStatsCards data={data} />

          {/* 3 Currencies Financial Values */}
          <ContractCurrencyCards data={data} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Status Distribution Donut Chart */}
            <ContractStatusChart data={data.statusChart} />

            {/* 14 Contract Types Bar Chart */}
            <ContractTypeChart data={data.typeChart} />
          </div>
        </div>
      )}
    </div>
  );
}
