'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import {
  Zap,
  ArrowLeft,
  RefreshCw,
  FilePlus,
} from 'lucide-react';
import {
  usePowerDashboard,
  PowerContractDashboardView,
} from '@/modules/power-contracts';
import { usePermissions } from '@/presentation/hooks';

function PowerContractsDashboardContent() {
  const { data, isLoading, isFetching, refetch } = usePowerDashboard();
  const { canUpload } = usePermissions();

  return (
    <div className="space-y-6">
      {/* Page Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/power-contracts"
            className="p-2 rounded-xl border border-border-line bg-white hover:bg-slate-100 text-text-secondary transition-colors"
            title="ກັບຄືນ"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
              ສະຖິຕິສັນຍາຊື້-ຂາຍໄຟຟ້າ (Dashboard)
            </h1>
            <p className="text-xs text-text-secondary">
              ພາບລວມສັນຍາຊື້ໄຟ (PPA), ສັນຍາຂາຍໄຟ (PSA) ແລະ ກຳລັງຕິດຕັ້ງລວມ (MW)
            </p>
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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 bg-surface rounded-2xl border border-border-line animate-pulse"
            />
          ))}
        </div>
      ) : data ? (
        <PowerContractDashboardView data={data} />
      ) : (
        <div className="p-12 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border-line">
          ບໍ່ສາມາດດຶງຂໍ້ມູນສະຖິຕິໄດ້
        </div>
      )}
    </div>
  );
}

export default function PowerContractsDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted">
          ກຳລັງໂຫຼດ Dashboard...
        </div>
      }
    >
      <PowerContractsDashboardContent />
    </Suspense>
  );
}
