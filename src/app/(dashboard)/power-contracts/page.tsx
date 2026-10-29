'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Zap,
  FilePlus,
  LayoutDashboard,
  RefreshCw,
} from 'lucide-react';
import { PowerContract, PowerContractType, ContractStatus } from '@core/entities';
import {
  usePowerContracts,
  useDeletePowerContract,
} from '@/modules/power-contracts';
import { PowerContractFilterBar } from '@/modules/power-contracts/components/list/power-contract-filter-bar';
import { PowerContractTable } from '@/modules/power-contracts/components/list/power-contract-table';
import { usePermissions } from '@/presentation/hooks';

function PowerContractsListContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') as ContractStatus | null;
  const initialType = searchParams.get('contractType') as PowerContractType | null;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [contractType, setContractType] = useState<PowerContractType | undefined>(
    initialType || undefined
  );
  const [status, setStatus] = useState<ContractStatus | undefined>(
    initialStatus || undefined
  );

  useEffect(() => {
    const urlStatus = searchParams.get('status') as ContractStatus | null;
    if (urlStatus && Object.values(ContractStatus).includes(urlStatus)) {
      setStatus(urlStatus);
      setPage(1);
    }
  }, [searchParams]);

  const { canUpload } = usePermissions();

  const { data, isLoading, isFetching, refetch } = usePowerContracts({
    page,
    limit: 10,
    search: search.trim() || undefined,
    contractType,
    status,
  });

  const deleteMutation = useDeletePowerContract();

  const contracts = data?.data || [];
  const total = data?.pagination?.total || 0;

  const handleReset = () => {
    setSearch('');
    setContractType(undefined);
    setStatus(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
                ພະແນກສັນຍາຊື້-ຂາຍໄຟຟ້າ
              </h1>
              <p className="text-xs text-text-secondary">
                ຄຸ້ມຄອງສັນຍາຊື້ໄຟຟ້າ (PPA) ແລະ ສັນຍາຂາຍໄຟຟ້າ (PSA) ຂອງ
                ລັດວິສາຫະກິດໄຟຟ້າລາວ
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-border-line bg-white hover:bg-slate-50 text-text-secondary transition-colors"
            title="ໂຫຼດຂໍ້ມູນໃໝ່"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? 'animate-spin text-primary' : ''}`}
            />
          </button>

          <Link
            href="/power-contracts/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-line bg-white hover:bg-slate-50 text-xs font-semibold text-text-primary transition-colors shadow-2xs"
          >
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <span>ສະຖິຕິ Dashboard</span>
          </Link>

          {canUpload && (
            <Link
              href="/power-contracts/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <FilePlus className="w-4 h-4" />
              <span>+ ສ້າງສັນຍາໃໝ່</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <PowerContractFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        contractType={contractType}
        onContractTypeChange={(val) => {
          setContractType(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onReset={handleReset}
      />

      {/* Contracts Table */}
      <PowerContractTable
        contracts={contracts}
        isLoading={isLoading}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        onDelete={(contract) => deleteMutation.mutate(contract.id)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default function PowerContractsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted">
          ກຳລັງໂຫຼດຂໍ້ມູນສັນຍາຊື້-ຂາຍໄຟຟ້າ...
        </div>
      }
    >
      <PowerContractsListContent />
    </Suspense>
  );
}
