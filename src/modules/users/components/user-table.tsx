'use client';

import React, { useState } from 'react';
import { User } from '@core/entities';
import { UserRoleBadge } from './user-role-badge';
import { PermissionPills } from './permission-pills';
import { Shield, Trash2, CheckCircle, XCircle, Eye, KeyRound, Loader2, Check, X } from 'lucide-react';
import { useToggleUserStatus } from '../hooks/use-users';
import { usePermissions } from '@/presentation/hooks';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onViewDetail: (user: User) => void;
  onEditPermissions: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserTable({
  users,
  isLoading,
  onViewDetail,
  onEditPermissions,
  onResetPassword,
  onDeleteUser,
}: UserTableProps) {
  const { user: currentUser, isAdmin } = usePermissions();
  const toggleStatusMutation = useToggleUserStatus();
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

  const handleToggleStatus = (targetUser: User) => {
    if (togglingUserId) return;
    const isCurrentlyActive = targetUser.isActive !== false;
    const nextStatus = !isCurrentlyActive;
    setTogglingUserId(targetUser.id);
    toggleStatusMutation.mutate(
      { id: targetUser.id, isActive: nextStatus },
      {
        onSettled: () => setTogglingUserId(null),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-surface rounded-2xl border border-border-line space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-slate-200/60 rounded-xl" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12 bg-surface rounded-2xl border border-border-line text-center text-xs text-text-muted">
        <p className="text-sm font-semibold text-text-primary mb-1">
          ບໍ່ພົບລາຍຊື່ຜູ້ໃຊ້ງານ
        </p>
        <p>ກະລຸນາກວດສອບຄຳຄົ້ນຫາ ຫຼື ເພີ່ມຜູ້ໃຊ້ໃໝ່ເຂົ້າສູ່ລະບົບ</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-slate-100/70 border-b border-border-line text-text-secondary uppercase tracking-wider text-[11px] font-bold">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">ພະນັກງານ</th>
              <th className="py-3.5 px-4">ພະແນກ / ຝ່າຍ</th>
              <th className="py-3.5 px-4 text-center">ບົດບາດ (Role)</th>
              <th className="py-3.5 px-4">ສິດທິລະອຽດ (Permissions)</th>
              <th className="py-3.5 px-4 text-center">ສະຖານະ</th>
              <th className="py-3.5 px-4 text-right">ຈັດການ</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border-line">
            {users.map((u) => {
              const isActive = u.isActive !== false;

              return (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Column 1: Employee info */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => onViewDetail(u)}
                        className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                        title="ກົດເພື່ອເບິ່ງລາຍລະອຽດ"
                      >
                        {u.fullName?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onViewDetail(u)}
                          className="font-bold text-text-primary truncate block hover:text-primary transition-colors text-left"
                          title="ກົດເພື່ອເບິ່ງລາຍລະອຽດ"
                        >
                          {u.fullName}
                        </button>
                        <p className="text-[11px] text-text-muted font-mono mt-0.5">
                          {u.employeeCode} {u.email ? `• ${u.email}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Department */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-text-primary">
                      {u.department || '-'}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {u.division || u.unit || '-'}
                    </p>
                  </td>

                  {/* Column 3: Role Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <UserRoleBadge role={u.role} roleTitle={u.roleTitle} />
                  </td>

                  {/* Column 4: Permissions */}
                  <td className="py-3.5 px-4">
                    <PermissionPills user={u} onViewDetail={() => onViewDetail(u)} />
                  </td>

                  {/* Column 5: Status (Quick Toggle) */}
                  <td className="py-3.5 px-4 text-center">
                    {(() => {
                      const isSelf = currentUser?.id === u.id || currentUser?.employeeCode === u.employeeCode;
                      const isToggling = togglingUserId === u.id;

                      return (
                        <div className="inline-flex items-center justify-center gap-2">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            disabled={isSelf || isToggling}
                            onClick={() => handleToggleStatus(u)}
                            title={
                              isSelf
                                ? 'ບໍ່ສາມາດລະງັບບັນຊີຂອງຕົນເອງໄດ້'
                                : isActive
                                ? 'ກົດເພື່ອລະງັບການນຳໃຊ້ (Deactivate)'
                                : 'ກົດເພື່ອເປີດນຳໃຊ້ (Activate)'
                            }
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                              isSelf
                                ? 'opacity-40 cursor-not-allowed bg-slate-200'
                                : isActive
                                ? 'bg-emerald-500 hover:bg-emerald-600'
                                : 'bg-slate-300 hover:bg-slate-400'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                                isActive ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            >
                              {isToggling ? (
                                <Loader2 className="w-2.5 h-2.5 text-slate-500 animate-spin" />
                              ) : isActive ? (
                                <Check className="w-2 h-2 text-emerald-600 font-bold stroke-[3]" />
                              ) : (
                                <X className="w-2 h-2 text-slate-400 stroke-[3]" />
                              )}
                            </span>
                          </button>
                          <span
                            className={`text-[11px] font-bold select-none ${
                              isActive ? 'text-emerald-700' : 'text-slate-500'
                            }`}
                          >
                            {isActive ? 'ເປີດນຳໃຊ້' : 'ຖືກລະງັບ'}
                          </span>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Column 6: Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewDetail(u)}
                        className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-all"
                        title="ເບິ່ງລາຍລະອຽດ & ສິດທິ"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => onResetPassword(u)}
                          className="p-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 transition-all"
                          title="ຣີເຊັດລະຫັດຜ່ານ (Reset Password - Admin Only)"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onEditPermissions(u)}
                        className="px-2.5 py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-primary font-semibold text-[11px] flex items-center gap-1 transition-all"
                        title="ແກ້ໄຂສິດທິ"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>ແກ້ໄຂສິດທິ</span>
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => onDeleteUser(u)}
                          className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-red-50 text-red-600 transition-all"
                          title="ລົບຜູ້ໃຊ້ (Admin Only)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
