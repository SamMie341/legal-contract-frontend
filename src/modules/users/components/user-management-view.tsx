'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { User, UserRole } from '@core/entities';
import { useUsersList } from '../hooks/use-users';
import { UserTable } from './user-table';
import { CreateUserModal } from './create-user-modal';
import { EditPermissionsModal } from './edit-permissions-modal';
import { DeleteUserDialog } from './delete-user-dialog';

export function UserManagementView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const { data, isLoading, isFetching, refetch } = useUsersList({
    page,
    limit: 10,
    search: search.trim() || undefined,
    role: selectedRole,
    isActive: activeFilter,
  });

  const users = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Users className="w-4 h-4" />
            <span>ການຕັ້ງຄ່າລະບົບ (System Administration)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            ຈັດການຜູ້ໃຊ້ງານ & ສິດທິລະບົບ
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ເພີ່ມຜູ້ໃຊ້, ຊິ້ງຂໍ້ມູນຈາກ HRM ແລະ ກຳນົດສິດທິການນຳໃຊ້ລະອຽດ (canView, canUpload, canEdit, canDelete, canDownload)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
            title="ໂຫຼດຂໍ້ມູນໃໝ່"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>ເພີ່ມຜູ້ໃຊ້ໃໝ່</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-surface rounded-2xl border border-border-line shadow-xs">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="ຄົ້ນຫາຊື່, ລະຫັດພະນັກງານ, ຫຼື ຝ່າຍ..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-border-line rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Role & Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            ບົດບາດ:
          </span>

          {[
            { label: 'ທັງໝົດ', val: undefined },
            { label: 'ADMIN', val: UserRole.ADMIN },
            { label: 'MAIN USER', val: UserRole.MAIN_USER },
            { label: 'EDITOR', val: UserRole.EDITOR },
            { label: 'VIEWER', val: UserRole.VIEWER },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setSelectedRole(item.val);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === item.val
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white text-text-secondary border border-border-line hover:border-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <UserTable
        users={users}
        isLoading={isLoading}
        onEditPermissions={(u) => setEditingUser(u)}
        onDeleteUser={(u) => setDeletingUser(u)}
      />

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs text-text-secondary">
          <p>
            ລວມທັງໝົດ: <span className="font-bold text-text-primary">{meta.total}</span> ຄົນ
            (ໜ້າ {meta.page} / {meta.totalPages})
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

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditPermissionsModal
        user={editingUser}
        isOpen={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
      />

      <DeleteUserDialog
        user={deletingUser}
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
      />
    </div>
  );
}
