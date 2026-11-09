'use client';

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  Building,
} from 'lucide-react';
import { Department } from '@core/entities';
import { useDepartments } from '../hooks/use-departments';
import { DepartmentTable } from './department-table';
import { DepartmentModal } from './department-modal';
import { DeleteDepartmentDialog } from './delete-department-dialog';
import { HrmSyncModal } from './hrm-sync-modal';
import { usePermissions } from '@/presentation/hooks';
import { AccessDeniedView } from '@/presentation/components/ui/access-denied-view';

export function DepartmentsManagementView() {
  const { isMounted, isAdmin } = usePermissions();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  const { data, isLoading, isFetching } = useDepartments({
    search: search.trim() || undefined,
    isActive: activeFilter,
  });

  const departments = data?.data || [];
  const total = data?.total ?? departments.length;

  // Compute stat metrics
  const activeCount = departments.filter((d) => d.isActive !== false).length;
  const inactiveCount = departments.filter((d) => d.isActive === false).length;
  const inUseCount = departments.filter(
    (d) => (d._count?.legalDocuments ?? 0) > 0 || (d._count?.legalCases ?? 0) > 0
  ).length;

  if (isMounted && !isAdmin) {
    return (
      <AccessDeniedView
        requiredDivisionName="ຜູ້ດູແລລະບົບ (ADMIN) ເທົ່ານັ້ນ"
        moduleName="ຈັດການຫ້ອງການ / ຝ່າຍ (Departments)"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Building className="w-4 h-4" />
            <span>ການຕັ້ງຄ່າລະບົບ (Administration)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            ຈັດການຫ້ອງການ / ຝ່າຍ (Departments)
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ຄຸ້ມຄອງຫ້ອງການ, ຝ່າຍ, ສະຖາບັນ ພາຍໃຕ້ ຟຟລ ພ້ອມທັງ Sync ຂໍ້ມູນອັດຕະໂນມັດກັບລະບົບ HRM
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSyncOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-50 text-text-primary text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Sync ຈາກ HRM</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ເພີ່ມຝ່າຍໃໝ່</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border-line shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">ທັງໝົດ</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-text-primary mt-2">{total}</p>
          <p className="text-[11px] text-text-muted mt-0.5">ຫ້ອງການ, ຝ່າຍ, ສາຂາ</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border-line shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">ເປີດນຳໃຊ້</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{activeCount}</p>
          <p className="text-[11px] text-text-muted mt-0.5">ພ້ອມໃຊ້ງານໃນລະບົບ</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border-line shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">ປິດນຳໃຊ້</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-600 mt-2">{inactiveCount}</p>
          <p className="text-[11px] text-text-muted mt-0.5">ຖືກລະງັບ / ບໍ່ສະແດງໃນ Dropdown</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border-line shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">ມີເອກະສານ/ຄະດີຜູກມັດ</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{inUseCount}</p>
          <p className="text-[11px] text-text-muted mt-0.5">ມີຂໍ້ມູນຜູກມັດໃນລະບົບ</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border-line shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ຄົ້ນຫາຊື່ຫ້ອງການ/ຝ່າຍ ຫຼື ລະຫັດ..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-border-line rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveFilter(undefined)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === undefined
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-text-secondary border border-border-line hover:border-slate-300'
            }`}
          >
            ທັງໝົດ ({total})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === true
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-text-secondary border border-border-line hover:border-slate-300'
            }`}
          >
            ເປີດນຳໃຊ້ ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === false
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-white text-text-secondary border border-border-line hover:border-slate-300'
            }`}
          >
            ປິດນຳໃຊ້ ({inactiveCount})
          </button>
        </div>
      </div>

      {/* Departments Table */}
      <DepartmentTable
        departments={departments}
        isLoading={isLoading}
        onEdit={(dept) => setEditingDept(dept)}
        onDelete={(dept) => setDeletingDept(dept)}
      />

      {/* Modals */}
      <DepartmentModal
        isOpen={isCreateOpen}
        department={null}
        onClose={() => setIsCreateOpen(false)}
      />

      <DepartmentModal
        isOpen={Boolean(editingDept)}
        department={editingDept}
        onClose={() => setEditingDept(null)}
      />

      <DeleteDepartmentDialog
        isOpen={Boolean(deletingDept)}
        department={deletingDept}
        onClose={() => setDeletingDept(null)}
      />

      <HrmSyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
      />
    </div>
  );
}
