'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Shield,
  Plus,
  Search,
  RefreshCw,
  Lock,
  Users,
  Layers,
} from 'lucide-react';
import { RoleItem } from '@core/entities';
import { useRolesList } from '../hooks/use-roles';
import { RoleTable } from './role-table';
import { RoleModal } from './role-modal';
import { DeleteRoleDialog } from './delete-role-dialog';
import { usePermissions } from '@/presentation/hooks';
import { AccessDeniedView } from '@/presentation/components/ui/access-denied-view';

export function RolesManagementView() {
  const { isMounted, isAdmin } = usePermissions();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SYSTEM' | 'CUSTOM'>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);

  const { data: roles = [], isLoading, isFetching, refetch } = useRolesList();

  // Statistics
  const stats = useMemo(() => {
    const total = roles.length;
    const system = roles.filter((r) => r.isSystem).length;
    const custom = total - system;
    const totalAssignedUsers = roles.reduce(
      (acc, curr) => acc + (curr._count?.users ?? 0),
      0
    );
    return { total, system, custom, totalAssignedUsers };
  }, [roles]);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q));

      const matchType =
        typeFilter === 'ALL'
          ? true
          : typeFilter === 'SYSTEM'
          ? r.isSystem
          : !r.isSystem;

      return matchSearch && matchType;
    });
  }, [roles, search, typeFilter]);

  const handleOpenCreate = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role: RoleItem) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (role: RoleItem) => {
    setDeletingRole(role);
  };

  if (isMounted && !isAdmin) {
    return (
      <AccessDeniedView
        requiredDivisionName="ຜູ້ດູແລລະບົບ (ADMIN) ເທົ່ານັ້ນ"
        moduleName="ຈັດການບົດບາດ & ສິດທິລະບົບ (Roles Management)"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ການຕັ້ງຄ່າລະບົບ (System Administration)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            ຈັດການບົດບາດ & ສິດ (Roles & Granular Permissions)
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ກຳນົດບົດບາດ ແລະ ສິດທິລະດັບໂມດູນ (Module-Scoped RBAC: canView, canUpload, canEdit, canDelete, canDownload)
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
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ສ້າງບົດບາດໃໝ່ (Custom Role)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border-line shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-secondary">ບົດບາດທັງໝົດ</p>
            <p className="text-xl font-extrabold text-text-primary mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border-line shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-secondary">Role ລະບົບ (System)</p>
            <p className="text-xl font-extrabold text-text-primary mt-0.5">{stats.system}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border-line shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-secondary">Custom Roles</p>
            <p className="text-xl font-extrabold text-text-primary mt-0.5">{stats.custom}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border-line shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-secondary">ຜູ້ໃຊ້ງານທີ່ຜູກ Role</p>
            <p className="text-xl font-extrabold text-text-primary mt-0.5">
              {stats.totalAssignedUsers} <span className="text-xs font-normal">ຄົນ</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-surface rounded-2xl border border-border-line shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ຄົ້ນຫາຊື່ບົດບາດ ຫຼື ລະຫັດ Role..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-border-line rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === 'ALL'
                ? 'bg-primary text-white shadow-2xs'
                : 'bg-white border border-border-line text-text-secondary hover:text-text-primary'
            }`}
          >
            ທັງໝົດ ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('SYSTEM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === 'SYSTEM'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-white border border-border-line text-text-secondary hover:text-text-primary'
            }`}
          >
            Role ລະບົບ ({stats.system})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('CUSTOM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === 'CUSTOM'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white border border-border-line text-text-secondary hover:text-text-primary'
            }`}
          >
            Custom Roles ({stats.custom})
          </button>
        </div>
      </div>

      {/* Role Table */}
      <RoleTable
        roles={filteredRoles}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Create / Edit Modal */}
      <RoleModal
        isOpen={isModalOpen}
        role={selectedRole}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRole(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteRoleDialog
        isOpen={Boolean(deletingRole)}
        role={deletingRole}
        onClose={() => setDeletingRole(null)}
      />
    </div>
  );
}
