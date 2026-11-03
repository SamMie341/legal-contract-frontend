'use client';

import React from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Eye,
  Upload,
  Edit3,
  Trash2,
  Download,
  Sparkles,
  KeyRound,
  Loader2,
} from 'lucide-react';
import {
  User,
  SystemModuleKey,
  PermissionActionKey,
  ModulePermission,
  RoleItem,
} from '@core/entities';
import { UserRoleBadge } from './user-role-badge';
import { formatDate } from '@/utils/formatters';
import { PILLAR_MODULES, PillarModuleKey } from './module-permissions-matrix';
import { useToggleUserStatus } from '../hooks/use-users';
import { usePermissions } from '@/presentation/hooks';

interface UserDetailModalProps {
  user: User | null;
  roles?: RoleItem[];
  isOpen: boolean;
  onClose: () => void;
  onEditPermissions?: (user: User) => void;
  onResetPassword?: (user: User) => void;
}

const ACTIONS: { key: PermissionActionKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'canView', label: 'ເບິ່ງ', icon: Eye },
  { key: 'canUpload', label: 'ສ້າງ/ອັບໂຫຼດ', icon: Upload },
  { key: 'canEdit', label: 'ແກ້ໄຂ', icon: Edit3 },
  { key: 'canDelete', label: 'ລົບ', icon: Trash2 },
  { key: 'canDownload', label: 'ດາວໂຫຼດ', icon: Download },
];

/**
 * Compute the effective permissions for a user across the 3 core modules
 */
function resolveUserEffectiveMatrix(
  user: User,
  roles?: RoleItem[]
): Record<PillarModuleKey, { permissions: ModulePermission; isOverride: boolean }> {
  const result: Record<PillarModuleKey, { permissions: ModulePermission; isOverride: boolean }> = {
    CONTRACTS: { permissions: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false }, isOverride: false },
    POWER_CONTRACTS: { permissions: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false }, isOverride: false },
    LEGAL_AND_DISPUTE: { permissions: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false }, isOverride: false },
  };

  const roleName = String(user.role || '');
  const isAdmin = roleName === 'ADMIN';
  const isDeptHead = roleName === 'DEPARTMENT_HEAD';

  // Find role from roles list or roleRef
  const matchedRole =
    roles?.find((r) => r.id === user.roleId || r.name === user.role) ||
    user.roleRef;

  PILLAR_MODULES.forEach((pillar) => {
    let p: ModulePermission = { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false };
    let isOverride = false;

    if (isAdmin) {
      p = { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true };
    } else if (isDeptHead) {
      p = { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true };
    } else {
      pillar.backendKeys.forEach((key) => {
        const override = user.modulePermissions?.find((o) => o.module === key);
        if (override) {
          isOverride = true;
          p.canView = p.canView || Boolean(override.canView);
          p.canUpload = p.canUpload || Boolean(override.canUpload);
          p.canEdit = p.canEdit || Boolean(override.canEdit);
          p.canDelete = p.canDelete || Boolean(override.canDelete);
          p.canDownload = p.canDownload || Boolean(override.canDownload);
        } else if (matchedRole?.permissions && Array.isArray(matchedRole.permissions)) {
          const found = matchedRole.permissions.find((rp: any) => rp.module === key);
          if (found) {
            p.canView = p.canView || Boolean(found.canView);
            p.canUpload = p.canUpload || Boolean(found.canUpload);
            p.canEdit = p.canEdit || Boolean(found.canEdit);
            p.canDelete = p.canDelete || Boolean(found.canDelete);
            p.canDownload = p.canDownload || Boolean(found.canDownload);
          }
        } else if (user.permissionsByModule?.[key]) {
          const modP = user.permissionsByModule[key];
          p.canView = p.canView || Boolean(modP.canView);
          p.canUpload = p.canUpload || Boolean(modP.canUpload);
          p.canEdit = p.canEdit || Boolean(modP.canEdit);
          p.canDelete = p.canDelete || Boolean(modP.canDelete);
          p.canDownload = p.canDownload || Boolean(modP.canDownload);
        } else {
          p = {
            canView: Boolean(user.canView),
            canUpload: Boolean(user.canUpload),
            canEdit: Boolean(user.canEdit),
            canDelete: Boolean(user.canDelete),
            canDownload: Boolean(user.canDownload),
          };
        }
      });
    }

    result[pillar.key] = { permissions: p, isOverride };
  });

  return result;
}

export function UserDetailModal({
  user,
  roles,
  isOpen,
  onClose,
  onEditPermissions,
  onResetPassword,
}: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  const { user: currentUser } = usePermissions();
  const toggleStatusMutation = useToggleUserStatus();
  const isSelf = currentUser?.id === user.id || currentUser?.employeeCode === user.employeeCode;
  const isToggling = toggleStatusMutation.isPending;

  const isActive = user.isActive !== false;
  const roleTitle = user.roleTitle || user.roleRef?.title || user.role;
  const effectiveMatrix = resolveUserEffectiveMatrix(user, roles);

  const matchedRole =
    roles?.find((r) => r.id === user.roleId || r.name === user.role) ||
    user.roleRef;

  const handleToggleStatus = () => {
    if (isSelf || isToggling) return;
    const nextStatus = !isActive;
    toggleStatusMutation.mutate({
      id: user.id,
      isActive: nextStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-surface rounded-2xl border border-border-line shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border-line flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                ລາຍລະອຽດຜູ້ໃຊ້ງານ & ສິດທິລະບົບ
              </h2>
              <p className="text-xs text-text-secondary">
                {user.fullName} • ລະຫັດ {user.employeeCode}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: User Profile Hero Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-base font-bold shadow-xs shrink-0">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-text-primary">
                      {user.fullName}
                    </h3>
                    <UserRoleBadge role={user.role} roleTitle={roleTitle} />
                  </div>
                  <p className="text-xs text-text-muted font-mono mt-0.5">
                    ລະຫັດ: {user.employeeCode} {user.username ? `(@${user.username})` : ''}
                  </p>
                </div>
              </div>

              {/* Status Badge (Quick Toggle) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={isSelf || isToggling}
                  onClick={handleToggleStatus}
                  title={
                    isSelf
                      ? 'ບໍ່ສາມາດລະງັບບັນຊີຂອງຕົນເອງໄດ້'
                      : isActive
                      ? 'ກົດເພື່ອລະງັບການນຳໃຊ້ (Deactivate)'
                      : 'ກົດເພື່ອເປີດນຳໃຊ້ (Activate)'
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    isSelf
                      ? 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-500 border-slate-200'
                      : isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer shadow-2xs'
                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 cursor-pointer shadow-2xs'
                  }`}
                >
                  {isToggling ? (
                    <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin" />
                  ) : isActive ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                  )}
                  <span>{isActive ? 'ເປີດນຳໃຊ້ (Active)' : 'ລະງັບການນຳໃຊ້ (Inactive)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Organizational Info Grid */}
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-text-secondary" />
              <span>ຂໍ້ມູນສັງກັດ ແລະ ຕຳແໜ່ງ (Organization & HRM)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70">
                <span className="text-[11px] text-text-muted block">ຫ້ອງການ / ຝ່າຍ (Department):</span>
                <span className="font-bold text-text-primary mt-0.5 block truncate">
                  {user.department || '-'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70">
                <span className="text-[11px] text-text-muted block">ສັງກັດພະແນກ (Division):</span>
                <span className="font-bold text-text-primary mt-0.5 block truncate">
                  {user.division || '-'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70">
                <span className="text-[11px] text-text-muted block">ໜ່ວຍງານ (Unit):</span>
                <span className="font-bold text-text-primary mt-0.5 block truncate">
                  {user.unit || '-'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70">
                <span className="text-[11px] text-text-muted block">ຕຳແໜ່ງ (Position):</span>
                <span className="font-bold text-text-primary mt-0.5 block truncate">
                  {user.position || '-'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] text-text-muted block">ອີເມວ:</span>
                  <span className="font-semibold text-text-primary truncate block">
                    {user.email || '-'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] text-text-muted block">ເບີໂທລະສັບ:</span>
                  <span className="font-semibold text-text-primary truncate block">
                    {user.phone || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 3 Core Modules Permissions Matrix */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>ສິດທິ 3 ໂມດູນຫຼັກ (3 Core Modules Permissions Matrix)</span>
              </h4>

              {matchedRole && (
                <span className="text-[11px] font-semibold text-text-muted">
                  Role: <strong className="text-text-primary">{matchedRole.title || matchedRole.name}</strong>
                  {matchedRole.isSystem ? ' (Role ລະບົບ)' : ' (Custom Role)'}
                </span>
              )}
            </div>

            <div className="border border-border-line rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100/80 border-b border-border-line text-text-secondary font-bold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 text-left w-2/5">3 ໂມດູນຫຼັກ</th>
                      {ACTIONS.map((a) => {
                        const Icon = a.icon;
                        return (
                          <th key={a.key} className="py-2.5 px-2 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <Icon className="w-3 h-3 text-text-muted" />
                              <span>{a.label}</span>
                            </div>
                          </th>
                        );
                      })}
                      <th className="py-2.5 px-3 text-right">ແຫຼ່ງທີ່ມາ</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border-line bg-white">
                    {PILLAR_MODULES.map((pillar) => {
                      const item = effectiveMatrix[pillar.key];
                      const canViewMod = item.permissions.canView;

                      return (
                        <tr
                          key={pillar.key}
                          className={`transition-colors ${
                            canViewMod ? 'bg-blue-50/20' : 'opacity-70 bg-slate-50/30'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              {canViewMod ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <div>
                                <p className="font-bold text-text-primary text-xs">
                                  {pillar.label}
                                </p>
                                <p className="text-[10px] text-text-muted">
                                  {pillar.divisionLabel}
                                </p>
                              </div>
                            </div>
                          </td>

                          {ACTIONS.map((act) => {
                            const isAllowed = Boolean(item.permissions[act.key]);

                            return (
                              <td key={act.key} className="py-3 px-2 text-center">
                                {isAllowed ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-300">
                                    <X className="w-3 h-3 text-slate-400" />
                                  </span>
                                )}
                              </td>
                            );
                          })}

                          <td className="py-3 px-3 text-right">
                            {item.isOverride ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                <span>Override</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                                <span>Role Template</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border-line flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="text-[11px] text-text-muted">
            {user.createdAt && (
              <span>ສ້າງເມື່ອ: {formatDate(user.createdAt)}</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {onResetPassword && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onResetPassword(user);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold shadow-xs transition-all"
                title="ຣີເຊັດລະຫັດຜ່ານຂອງຜູ້ໃຊ້ນີ້"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>ຣີເຊັດລະຫັດຜ່ານ</span>
              </button>
            )}

            {onEditPermissions && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditPermissions(user);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ແກ້ໄຂສິດທິຜູ້ໃຊ້</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
            >
              ປິດ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
