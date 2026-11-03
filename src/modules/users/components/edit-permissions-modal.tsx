'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import {
  User,
  UserRole,
  SystemModuleKey,
  ModulePermission,
  RoleItem,
} from '@core/entities';
import { DIVISION_OPTIONS } from '@core/constants';
import { useUpdateUser } from '../hooks/use-users';
import { useRolesList } from '@/modules/roles';
import { ModulePermissionsMatrix } from './module-permissions-matrix';

interface EditPermissionsModalProps {
  user: User | null;
  roles?: RoleItem[];
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_MODULE_PERMISSIONS: Record<SystemModuleKey, ModulePermission> = {
  CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
};

function normalizeModKey(moduleInput: any): SystemModuleKey | 'LEGAL_AND_DISPUTE' | null {
  if (!moduleInput) return null;
  const s = String(moduleInput).toUpperCase().replace(/-/g, '_').trim();
  if (s === 'CONTRACTS' || s === 'CONTRACT_TYPES') return 'CONTRACTS';
  if (s === 'POWER_CONTRACTS') return 'POWER_CONTRACTS';
  if (s === 'LEGAL_DOCUMENTS') return 'LEGAL_DOCUMENTS';
  if (s === 'LEGAL_CASES') return 'LEGAL_CASES';
  if (s === 'LEGAL_AND_DISPUTE') return 'LEGAL_AND_DISPUTE';
  return null;
}

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

      const normalized = normalizeModKey(p.module);
      if (normalized === 'LEGAL_AND_DISPUTE') {
        result.LEGAL_DOCUMENTS = { ...perm };
        result.LEGAL_CASES = { ...perm };
      } else if (normalized && result[normalized]) {
        result[normalized] = { ...perm };
      }
    });
  }

  return result;
}

function resolveInitialMatrix(
  user: User,
  roles?: RoleItem[]
): { matrix: Record<SystemModuleKey, ModulePermission>; isOverride: boolean; selectedRoleId: string } {
  const result: Record<SystemModuleKey, ModulePermission> = {
    CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  };

  // Find matched role from roles array or user.roleRef
  const matchedRole =
    roles?.find((r) => r.id === user.roleId || r.name === user.role) ||
    user.roleRef;

  const roleId = user.roleId || matchedRole?.id || '';
  const roleName = String(user.role || matchedRole?.name || 'VIEWER');
  const isAdmin = roleName === 'ADMIN';
  const isDeptHead = roleName === 'DEPARTMENT_HEAD';

  // 1. If ADMIN: full access across all modules
  if (isAdmin) {
    (Object.keys(result) as SystemModuleKey[]).forEach((m) => {
      result[m] = { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true };
    });
    return { matrix: result, isOverride: false, selectedRoleId: roleId };
  }

  // 2. If DEPARTMENT_HEAD: view & download across all modules
  if (isDeptHead) {
    (Object.keys(result) as SystemModuleKey[]).forEach((m) => {
      result[m] = { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true };
    });
    return { matrix: result, isOverride: false, selectedRoleId: roleId };
  }

  // 3. Pre-fill base permissions from the Role Template
  if (matchedRole?.permissions && Array.isArray(matchedRole.permissions)) {
    matchedRole.permissions.forEach((p: any) => {
      const perm: ModulePermission = {
        canView: Boolean(p.canView),
        canUpload: Boolean(p.canUpload),
        canEdit: Boolean(p.canEdit),
        canDelete: Boolean(p.canDelete),
        canDownload: Boolean(p.canDownload),
      };

      const normalized = normalizeModKey(p.module);
      if (normalized === 'LEGAL_AND_DISPUTE') {
        result.LEGAL_DOCUMENTS = { ...perm };
        result.LEGAL_CASES = { ...perm };
      } else if (normalized && result[normalized]) {
        result[normalized] = { ...perm };
      }
    });
  }

  // 4. Check for User-Specific Overrides (modulePermissions or permissionsByModule)
  let hasOverride = false;

  if (user.modulePermissions && Array.isArray(user.modulePermissions) && user.modulePermissions.length > 0) {
    hasOverride = true;
    user.modulePermissions.forEach((p) => {
      const perm: ModulePermission = {
        canView: Boolean(p.canView),
        canUpload: Boolean(p.canUpload),
        canEdit: Boolean(p.canEdit),
        canDelete: Boolean(p.canDelete),
        canDownload: Boolean(p.canDownload),
      };

      const normalized = normalizeModKey(p.module);
      if (normalized === 'LEGAL_AND_DISPUTE') {
        result.LEGAL_DOCUMENTS = { ...perm };
        result.LEGAL_CASES = { ...perm };
      } else if (normalized && result[normalized]) {
        result[normalized] = { ...perm };
      }
    });
  } else if (user.permissionsByModule && Object.keys(user.permissionsByModule).length > 0) {
    hasOverride = true;
    Object.entries(user.permissionsByModule).forEach(([mod, p]) => {
      const perm: ModulePermission = {
        canView: Boolean(p.canView),
        canUpload: Boolean(p.canUpload),
        canEdit: Boolean(p.canEdit),
        canDelete: Boolean(p.canDelete),
        canDownload: Boolean(p.canDownload),
      };

      const normalized = normalizeModKey(mod);
      if (normalized === 'LEGAL_AND_DISPUTE') {
        result.LEGAL_DOCUMENTS = { ...perm };
        result.LEGAL_CASES = { ...perm };
      } else if (normalized && result[normalized]) {
        result[normalized] = { ...perm };
      }
    });
  } else if (!matchedRole?.permissions || matchedRole.permissions.length === 0) {
    // 5. Fallback for legacy users with global permission flags
    const hasAnyGlobal = Boolean(user.canView || user.canUpload || user.canEdit || user.canDelete || user.canDownload);
    if (hasAnyGlobal) {
      const perm: ModulePermission = {
        canView: Boolean(user.canView),
        canUpload: Boolean(user.canUpload),
        canEdit: Boolean(user.canEdit),
        canDelete: Boolean(user.canDelete),
        canDownload: Boolean(user.canDownload),
      };

      if (user.division?.includes('ສັນຍາທົ່ວໄປ')) {
        result.CONTRACTS = { ...perm };
      } else if (user.division?.includes('ຊື້-ຂາຍໄຟຟ້າ')) {
        result.POWER_CONTRACTS = { ...perm };
      } else if (user.division?.includes('ນິຕິກຳ')) {
        result.LEGAL_DOCUMENTS = { ...perm };
        result.LEGAL_CASES = { ...perm };
      } else {
        (Object.keys(result) as SystemModuleKey[]).forEach((m) => {
          result[m] = { ...perm };
        });
      }
    }
  }

  return { matrix: result, isOverride: hasOverride, selectedRoleId: roleId };
}

export function EditPermissionsModal({
  user,
  roles: initialRoles,
  isOpen,
  onClose,
}: EditPermissionsModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [role, setRole] = useState<string>('VIEWER');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [division, setDivision] = useState<string>('');
  const [isOverride, setIsOverride] = useState<boolean>(false);
  const [matrix, setMatrix] = useState<Record<SystemModuleKey, ModulePermission>>(DEFAULT_MODULE_PERMISSIONS);

  const { data: fetchedRoles = [], isLoading: isLoadingRoles } = useRolesList();
  const roles = initialRoles && initialRoles.length > 0 ? initialRoles : fetchedRoles;
  const updateUserMutation = useUpdateUser();

  // Ensure user's role is in the options list
  const roleOptions = useMemo(() => {
    const list = [...roles];
    if (user?.roleRef && !list.some((r) => r.id === user.roleRef?.id || r.name === user.roleRef?.name)) {
      list.unshift(user.roleRef as RoleItem);
    }
    return list;
  }, [roles, user]);

  const initializedKeyRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      const currentKey = `${user.id}_${user.updatedAt || ''}_${roles.length}`;
      if (initializedKeyRef.current !== currentKey) {
        initializedKeyRef.current = currentKey;
        setRole(String(user.role || 'VIEWER'));
        setIsActive(user.isActive !== false);
        setDivision(user.division || '');

        const initial = resolveInitialMatrix(user, roles);
        setMatrix(initial.matrix);
        setIsOverride(initial.isOverride);
        if (initial.selectedRoleId) {
          setSelectedRoleId(initial.selectedRoleId);
        }
      }
    } else if (!isOpen) {
      initializedKeyRef.current = null;
    }
  }, [user, isOpen, roles]);

  if (!isOpen || !user) return null;

  const currentRoleItem = roleOptions.find((r) => r.id === selectedRoleId || r.name === role);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    const matched = roleOptions.find((r) => r.id === roleId);
    if (matched) {
      setRole(matched.name);
      setMatrix(buildMatrixForRole(matched));
      setIsOverride(false);
    }
  };

  const handleToggleOverride = (override: boolean) => {
    setIsOverride(override);
    if (!override) {
      const currentRole = roleOptions.find((r) => r.id === selectedRoleId || r.name === role) || user?.roleRef;
      if (currentRole) {
        setMatrix(buildMatrixForRole(currentRole as RoleItem));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const modulePermissionsPayload = isOverride
      ? (Object.keys(matrix) as SystemModuleKey[]).map((mod) => ({
          module: mod,
          ...matrix[mod],
        }))
      : [];

    const hasAnyView = Object.values(matrix).some((m) => m.canView);
    const hasAnyUpload = Object.values(matrix).some((m) => m.canUpload);
    const hasAnyEdit = Object.values(matrix).some((m) => m.canEdit);
    const hasAnyDelete = Object.values(matrix).some((m) => m.canDelete);
    const hasAnyDownload = Object.values(matrix).some((m) => m.canDownload);

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        payload: {
          role: role as UserRole,
          roleId: selectedRoleId || undefined,
          isActive,
          division,
          canView: role === 'ADMIN' ? true : hasAnyView,
          canUpload: role === 'ADMIN' ? true : hasAnyUpload,
          canEdit: role === 'ADMIN' ? true : hasAnyEdit,
          canDelete: role === 'ADMIN' ? true : hasAnyDelete,
          canDownload: role === 'ADMIN' ? true : hasAnyDownload,
          modulePermissions: modulePermissionsPayload,
        },
      });

      onClose();
    } catch {
      // Error is caught and displayed by updateUserMutation
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-surface rounded-2xl border border-border-line shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border-line flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                ແກ້ໄຂບົດບາດ & ສິດທິຜູ້ໃຊ້
              </h2>
              <p className="text-xs text-text-secondary">
                {user.fullName} ({user.employeeCode})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* User Summary Info */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-text-primary">{user.fullName}</p>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {user.department || 'ບໍ່ລະບຸຝ່າຍ'} • {user.email || 'ບໍ່ມີອີເມວ'}
              </p>
            </div>

            {/* Active Toggle Switch */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-[11px] font-semibold text-text-secondary">
                {isActive ? 'ເປີດນຳໃຊ້' : 'ລະງັບການນຳໃຊ້'}
              </span>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </label>
          </div>

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

          {/* Dynamic Role Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-text-primary">
                ປ່ຽນບົດບາດຫຼັກ (Change Role & Permissions Template)
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
              {roleOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title || r.name} ({r.name}) {r.isSystem ? '• [Role ລະບົບ]' : '• [Custom Role]'}
                </option>
              ))}
            </select>
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

          {/* Actions */}
          <div className="pt-4 border-t border-border-line flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={updateUserMutation.isPending}
              className="px-4 py-2.5 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              {updateUserMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ກຳລັງອັບເດດ...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ບັນທຶກການປ່ຽນແປງ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
