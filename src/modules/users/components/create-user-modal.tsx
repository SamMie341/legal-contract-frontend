'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import {
  UserRole,
  SystemModuleKey,
  ModulePermission,
  RoleItem,
} from '@core/entities';
import { DIVISION_OPTIONS } from '@core/constants';
import { usersApi } from '../api/users.api';
import { HrmEmployeeLookup } from '../types/user-management.types';
import { useCreateUser } from '../hooks/use-users';
import { useRolesList } from '@/modules/roles';
import { ModulePermissionsMatrix } from './module-permissions-matrix';
import { getErrorMessage } from '@core/errors';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_MODULE_PERMISSIONS: Record<SystemModuleKey, ModulePermission> = {
  CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
};

function buildMatrixForRole(roleItem?: RoleItem): Record<SystemModuleKey, ModulePermission> {
  const result: Record<SystemModuleKey, ModulePermission> = {
    CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  };

  if (!roleItem) return result;

  if (roleItem.name === 'ADMIN') {
    (Object.keys(result) as SystemModuleKey[]).forEach((m) => {
      result[m] = { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true };
    });
    return result;
  }

  if (roleItem.name === 'DEPARTMENT_HEAD') {
    (Object.keys(result) as SystemModuleKey[]).forEach((m) => {
      result[m] = { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true };
    });
    return result;
  }

  if (roleItem.permissions && Array.isArray(roleItem.permissions)) {
    roleItem.permissions.forEach((p) => {
      const perm: ModulePermission = {
        canView: Boolean(p.canView),
        canUpload: Boolean(p.canUpload),
        canEdit: Boolean(p.canEdit),
        canDelete: Boolean(p.canDelete),
        canDownload: Boolean(p.canDownload),
      };

      if (p.module === 'LEGAL_AND_DISPUTE') {
        result.LEGAL_DOCUMENTS = { ...perm };
        result.LEGAL_CASES = { ...perm };
      } else if (result[p.module as SystemModuleKey]) {
        result[p.module as SystemModuleKey] = { ...perm };
      }
    });
  }

  return result;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [empCode, setEmpCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [division, setDivision] = useState('');
  const [isSearchingHrm, setIsSearchingHrm] = useState(false);
  const [hrmResult, setHrmResult] = useState<HrmEmployeeLookup | null>(null);
  const [hrmError, setHrmError] = useState<string | null>(null);

  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [role, setRole] = useState<string>('VIEWER');
  const [isOverride, setIsOverride] = useState<boolean>(false);
  const [matrix, setMatrix] = useState<Record<SystemModuleKey, ModulePermission>>(DEFAULT_MODULE_PERMISSIONS);

  const { data: roles = [], isLoading: isLoadingRoles } = useRolesList();
  const createUserMutation = useCreateUser();

  // Initialize selected role when roles load or modal opens
  useEffect(() => {
    if (isOpen && roles.length > 0) {
      const defaultRole = roles.find((r) => r.name === 'VIEWER') || roles[0];
      setSelectedRoleId(defaultRole.id);
      setRole(defaultRole.name);
      setMatrix(buildMatrixForRole(defaultRole));
      setIsOverride(false);
    }
  }, [isOpen, roles]);

  if (!isOpen) return null;

  const currentRoleItem = roles.find((r) => r.id === selectedRoleId || r.name === role);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    const matched = roles.find((r) => r.id === roleId);
    if (matched) {
      setRole(matched.name);
      setMatrix(buildMatrixForRole(matched));
      setIsOverride(false);
    }
  };

  const handleToggleOverride = (override: boolean) => {
    setIsOverride(override);
    if (!override && currentRoleItem) {
      setMatrix(buildMatrixForRole(currentRoleItem));
    }
  };

  const handleLookupHrm = async () => {
    if (!empCode.trim()) return;

    setIsSearchingHrm(true);
    setHrmError(null);
    setHrmResult(null);

    try {
      const data = await usersApi.lookupHrmEmployee(empCode.trim());
      setHrmResult(data);
      if (data.division) setDivision(data.division);
      if (data.fullName) setFullName(data.fullName);
    } catch (err) {
      setHrmError(getErrorMessage(err));
    } finally {
      setIsSearchingHrm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empCode.trim()) return;

    const modulePermissionsPayload = isOverride
      ? (Object.keys(matrix) as SystemModuleKey[]).map((mod) => ({
          module: mod,
          ...matrix[mod],
        }))
      : undefined;

    // For backwards compatibility, compute top-level flags from matrix
    const hasAnyView = Object.values(matrix).some((m) => m.canView);
    const hasAnyUpload = Object.values(matrix).some((m) => m.canUpload);
    const hasAnyEdit = Object.values(matrix).some((m) => m.canEdit);
    const hasAnyDelete = Object.values(matrix).some((m) => m.canDelete);
    const hasAnyDownload = Object.values(matrix).some((m) => m.canDownload);

    try {
      await createUserMutation.mutateAsync({
        employeeCode: empCode.trim(),
        fullName: fullName.trim() || undefined,
        division: division || undefined,
        role: role as UserRole,
        roleId: selectedRoleId || undefined,
        canView: role === 'ADMIN' ? true : hasAnyView,
        canUpload: role === 'ADMIN' ? true : hasAnyUpload,
        canEdit: role === 'ADMIN' ? true : hasAnyEdit,
        canDelete: role === 'ADMIN' ? true : hasAnyDelete,
        canDownload: role === 'ADMIN' ? true : hasAnyDownload,
        modulePermissions: modulePermissionsPayload,
      });

      handleClose();
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleClose = () => {
    setEmpCode('');
    setFullName('');
    setDivision('');
    setHrmResult(null);
    setHrmError(null);
    setIsOverride(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-surface rounded-2xl border border-border-line shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border-line flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                ເພີ່ມຜູ້ໃຊ້ງານໃໝ່
              </h2>
              <p className="text-xs text-text-secondary">
                ຊິ້ງຂໍ້ມູນຈາກ HRM ພ້ອມກຳນົດບົດບາດ & ສິດທິລະດັບໂມດູນ (RBAC V2)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: HRM Employee Code Search */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-text-primary">
              ລະຫັດພະນັກງານ (HRM Employee Code) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={empCode}
                onChange={(e) => setEmpCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLookupHrm();
                  }
                }}
                placeholder="ຕົວຢ່າງ: EDL-001 ຫຼື 44652"
                className="flex-1 px-3.5 py-2 bg-white border border-border-line rounded-xl text-xs font-mono font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase"
              />
              <button
                type="button"
                onClick={handleLookupHrm}
                disabled={isSearchingHrm || !empCode.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
              >
                {isSearchingHrm ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>ຊິ້ງຈາກ HRM</span>
              </button>
            </div>

            {/* HRM Search Result / Alert */}
            {hrmResult && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ພົບຂໍ້ມູນໃນ HRM: {hrmResult.fullName}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-emerald-700 pl-5.5">
                  <p>ຝ່າຍ: {hrmResult.department || '-'}</p>
                  <p>ພະແນກ: {hrmResult.division || '-'}</p>
                  <p>ຕຳແໜ່ງ: {hrmResult.position || '-'}</p>
                  <p>ອີເມວ: {hrmResult.email || '-'}</p>
                </div>
                {hrmResult.alreadyInSystem && (
                  <p className="text-[11px] font-bold text-amber-700 mt-1 pl-5.5">
                    ⚠️ ພະນັກງານທ່ານນີ້ມີບັນຊີໃນລະບົບແລ້ວ!
                  </p>
                )}
              </div>
            )}

            {hrmError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">ບໍ່ສາມາດດຶງຂໍ້ມູນຈາກ HRM ໄດ້</p>
                  <p className="text-[11px] text-red-600/90">{hrmError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Fallback Full Name if HRM sync not used or failed */}
          {!hrmResult && (
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                ຊື່ ແລະ ນາມສະກຸນ (Full Name)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ປ້ອນຊື່ ແລະ ນາມສະກຸນພະນັກງານ"
                className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          )}

          {/* Division Selection (3 Core Pillars) */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ສັງກັດພະແນກ (Division)
            </label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">-- ດຶງຕາມ HRM ຫຼື ບໍ່ລະບຸ --</option>
              {DIVISION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Section 2: Dynamic Role Selection (GET /api/roles) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-text-primary">
                ບົດບາດໃນລະບົບ (Role & Template) <span className="text-red-500">*</span>
              </label>
              {isLoadingRoles && (
                <span className="text-[10px] text-text-muted flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> ກຳລັງໂຫຼດ Roles...
                </span>
              )}
            </div>

            <select
              value={selectedRoleId}
              onChange={(e) => handleRoleSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title || r.name} ({r.name}) {r.isSystem ? '• [Role ລະບົບ]' : '• [Custom Role]'}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-text-muted mt-1">
              ດຶງລາຍຊື່ບົດບາດຈາກລະບົບ RBAC ອັດຕະໂນມັດ ພ້ອມກຳນົດ Template ສິດທິ
            </p>
          </div>

          {/* Section 3: 3 Core Modules x 5 Actions Matrix */}
          <ModulePermissionsMatrix
            matrix={matrix}
            onChange={setMatrix}
            disabled={role === 'ADMIN'}
            isOverride={isOverride}
            onToggleOverride={handleToggleOverride}
            roleTitle={currentRoleItem?.title || currentRoleItem?.name || role}
          />

          {/* Modal Actions */}
          <div className="pt-4 border-t border-border-line flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={createUserMutation.isPending}
              className="px-4 py-2.5 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={createUserMutation.isPending || !empCode.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              {createUserMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ກຳລັງບັນທຶກ...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ບັນທຶກຜູ້ໃຊ້ງານ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
