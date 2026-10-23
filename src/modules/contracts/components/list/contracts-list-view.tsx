'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Briefcase,
  FilePlus,
  RefreshCw,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Contract, ContractStatus, Currency } from '@core/entities';
import { useContractsList, useContractTypesDropdown } from '../../hooks/use-contracts';
import { ContractFiltersBar } from './contract-filters-bar';
import { ContractTable } from './contract-table';
import { DeleteContractDialog } from './delete-contract-dialog';
import { usePermissions } from '@/presentation/hooks/use-permissions';

export function ContractsListView() {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get('status') as ContractStatus | null;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContractStatus | undefined>(
    initialStatusParam || undefined
  );
  const [contractTypeId, setContractTypeId] = useState<number | undefined>(undefined);
  const [currency, setCurrency] = useState<Currency | undefined>(undefined);

  // Sync if URL search params change (e.g. clicking sidebar "Expiring Soon")
  useEffect(() => {
    const urlStatus = searchParams.get('status') as ContractStatus | null;
    if (urlStatus && Object.values(ContractStatus).includes(urlStatus)) {
      setStatus(urlStatus);
      setPage(1);
    }
  }, [searchParams]);

  // Dialog state
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);

  const { canUpload } = usePermissions();
  const { data: contractTypes = [] } = useContractTypesDropdown();

  const { data, isLoading, isFetching, refetch } = useContractsList({
    page,
    limit: 10,
    search: search.trim() || undefined,
    status,
    contractTypeId,
    currency,
  });

  const contracts = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleResetFilters = () => {
    setSearch('');
    setStatus(undefined);
    setContractTypeId(undefined);
    setCurrency(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Briefcase className="w-4 h-4" />
            <span>1. ພະແນກສັນຍາທົ່ວໄປ</span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            ລາຍການສັນຍາທັງໝົດ
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ຄົ້ນຫາ, ຕິດຕາມສະຖານະ, ແລະ ຄຸ້ມຄອງສັນຍາທັງໝົດ 14 ປະເພດຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/contracts/dashboard"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-text-primary text-xs font-semibold shadow-xs transition-all"
            title="ເບິ່ງໜ້າສະຖິຕິສັນຍາ"
          >
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <span>ສະຖິຕິສັນຍາ</span>
          </Link>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
            title="ໂຫຼດຂໍ້ມູນໃໝ່"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>

          {canUpload && (
            <Link
              href="/contracts/create"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
            >
              <FilePlus className="w-4 h-4" />
              <span>ສ້າງສັນຍາໃໝ່</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <ContractFiltersBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(newStatus) => {
          setStatus(newStatus);
          setPage(1);
        }}
        contractTypeId={contractTypeId}
        onContractTypeChange={(id) => {
          setContractTypeId(id);
          setPage(1);
        }}
        currency={currency}
        onCurrencyChange={(curr) => {
          setCurrency(curr);
          setPage(1);
        }}
        contractTypes={contractTypes}
        onReset={handleResetFilters}
      />

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-text-muted px-1">
        <span>
          ພົບສັນຍາທັງໝົດ: <strong className="text-text-primary">{meta.total}</strong> ສະບັບ
        </span>
        {isFetching && !isLoading && (
          <span className="text-[11px] text-primary flex items-center gap-1.5 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> ກຳລັງອັບເດດຂໍ້ມູນ...
          </span>
        )}
      </div>

      {/* Contracts Data Table */}
      <ContractTable
        contracts={contracts}
        isLoading={isLoading}
        onDeleteContract={(c) => setContractToDelete(c)}
      />

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs text-text-secondary">
          <p>
            ສະແດງໜ້າ <span className="font-bold text-text-primary">{meta.page}</span> ຈາກທັງໝົດ{' '}
            <span className="font-bold text-text-primary">{meta.totalPages}</span> ໜ້າ
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-border-line bg-surface hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-surface border border-border-line font-bold">
              {meta.page}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
              disabled={page >= meta.totalPages}
              className="p-2 rounded-xl border border-border-line bg-surface hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Soft Delete Dialog */}
      <DeleteContractDialog
        contract={contractToDelete}
        isOpen={Boolean(contractToDelete)}
        onClose={() => setContractToDelete(null)}
      />
    </div>
  );
}
