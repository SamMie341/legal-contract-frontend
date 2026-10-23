'use client';

import React from 'react';
import { User } from '@core/entities';
import { UserRoleBadge } from './user-role-badge';
import { PermissionPills } from './permission-pills';
import { formatDate } from '@/utils/formatters';
import { Shield, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEditPermissions: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserTable({
  users,
  isLoading,
  onEditPermissions,
  onDeleteUser,
}: UserTableProps) {
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
                      <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {u.fullName?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary truncate">
                          {u.fullName}
                        </p>
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
                    <UserRoleBadge role={u.role} />
                  </td>

                  {/* Column 4: Permissions */}
                  <td className="py-3.5 px-4">
                    <PermissionPills user={u} />
                  </td>

                  {/* Column 5: Status */}
                  <td className="py-3.5 px-4 text-center">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>ເປີດນຳໃຊ້</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span>ຖືກລະງັບ</span>
                      </span>
                    )}
                  </td>

                  {/* Column 6: Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditPermissions(u)}
                        className="px-2.5 py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-primary font-semibold text-[11px] flex items-center gap-1 transition-all"
                        title="ແກ້ໄຂສິດທິ"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>ແກ້ໄຂສິດທິ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteUser(u)}
                        className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-red-50 text-red-600 transition-all"
                        title="ລົບຜູ້ໃຊ້"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
