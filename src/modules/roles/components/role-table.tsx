'use client';

import React from 'react';
import { RoleItem, SystemModuleKey } from '@core/entities';
import { ShieldCheck, Shield, Users, Edit3, Trash2, Lock, Eye } from 'lucide-react';

interface RoleTableProps {
  roles: RoleItem[];
  isLoading: boolean;
  onEdit: (role: RoleItem) => void;
  onDelete: (role: RoleItem) => void;
}

interface PillarBadge {
  key: string;
  label: string;
  color: string;
  actions: string[];
}

function resolvePillarsForRole(role: RoleItem): PillarBadge[] {
  const permissions = role.permissions || [];
  const getP = (mod: string) => permissions.find((p) => p.module === mod);

  const pillars: PillarBadge[] = [];

  // 1. General Contracts
  const c = getP('CONTRACTS');
  if (c?.canView) {
    const actions: string[] = [];
    if (c.canUpload) actions.push('ສ້າງ');
    if (c.canEdit) actions.push('ແກ້ໄຂ');
    if (c.canDelete) actions.push('ລົບ');
    if (c.canDownload) actions.push('ດາວໂຫຼດ');
    pillars.push({
      key: 'CONTRACTS',
      label: 'ສັນຍາທົ່ວໄປ',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      actions,
    });
  }

  // 2. Power Contracts
  const p = getP('POWER_CONTRACTS');
  if (p?.canView) {
    const actions: string[] = [];
    if (p.canUpload) actions.push('ສ້າງ');
    if (p.canEdit) actions.push('ແກ້ໄຂ');
    if (p.canDelete) actions.push('ລົບ');
    if (p.canDownload) actions.push('ດາວໂຫຼດ');
    pillars.push({
      key: 'POWER_CONTRACTS',
      label: 'ສັນຍາໄຟຟ້າ',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      actions,
    });
  }

  // 3. Legal & Disputes (combines LEGAL_DOCUMENTS and LEGAL_CASES)
  const ld = getP('LEGAL_DOCUMENTS');
  const lc = getP('LEGAL_CASES');
  if (ld?.canView || lc?.canView) {
    const actions: string[] = [];
    if (ld?.canUpload || lc?.canUpload) actions.push('ສ້າງ');
    if (ld?.canEdit || lc?.canEdit) actions.push('ແກ້ໄຂ');
    if (ld?.canDelete || lc?.canDelete) actions.push('ລົບ');
    if (ld?.canDownload || lc?.canDownload) actions.push('ດາວໂຫຼດ');
    pillars.push({
      key: 'LEGAL_AND_DISPUTE',
      label: 'ນິຕິກຳ & ແກ້ໄຂຂໍ້ຂັດແຍ່ງ',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      actions,
    });
  }

  return pillars;
}

export function RoleTable({ roles, isLoading, onEdit, onDelete }: RoleTableProps) {
  if (isLoading) {
    return (
      <div className="p-6 bg-surface rounded-2xl border border-border-line space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-slate-200/60 rounded-xl" />
        ))}
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="p-12 bg-surface rounded-2xl border border-border-line text-center text-xs text-text-muted">
        <p className="text-sm font-semibold text-text-primary mb-1">
          ບໍ່ພົບບົດບາດໃນລະບົບ
        </p>
        <p>ກະລຸນາກວດສອບຄຳຄົ້ນຫາ ຫຼື ກົດປຸ່ມສ້າງບົດບາດໃໝ່</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 border-b border-border-line text-text-secondary uppercase tracking-wider text-[11px] font-bold">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">ຊື່ບົດບາດ (Role)</th>
              <th className="py-3.5 px-4">ປະເພດ (Type)</th>
              <th className="py-3.5 px-4">ສິດທິເຂົ້າເຖິງໂມດູນ</th>
              <th className="py-3.5 px-4 text-center">ຈຳນວນຜູ້ໃຊ້</th>
              <th className="py-3.5 px-4 text-right">ຈັດການ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-line">
            {roles.map((role) => {
              const userCount = role._count?.users ?? 0;
              const isSystem = Boolean(role.isSystem);
              const cannotDelete = isSystem || userCount > 0;
              const deleteTooltip = isSystem
                ? 'Role ຫຼັກຂອງລະບົບ ບໍ່ສາມາດລົບໄດ້'
                : userCount > 0
                ? 'ຕ້ອງຍ້າຍຜູ້ໃຊ້ອອກຈາກ Role ນີ້ກ່ອນຈຶ່ງຈະລົບໄດ້'
                : 'ລົບບົດບາດນີ້';

              // Accessible pillars (3 core modules)
              const activePillars = resolvePillarsForRole(role);

              return (
                <tr key={role.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Column 1: Role Details */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                          isSystem
                            ? 'bg-purple-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {isSystem ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-text-primary text-sm">
                            {role.title || role.name}
                          </p>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                            {role.name}
                          </span>
                        </div>
                        {role.description && (
                          <p className="text-[11px] text-text-muted mt-0.5 truncate max-w-sm">
                            {role.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Role Type */}
                  <td className="py-3.5 px-4">
                    {isSystem ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <Lock className="w-3 h-3 text-purple-600" />
                        <span>Role ລະບົບ</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <span>Custom Role</span>
                      </span>
                    )}
                  </td>

                  {/* Column 3: Module Permissions Badges */}
                  <td className="py-3.5 px-4">
                    {activePillars.length === 0 ? (
                      <span className="text-[11px] text-text-muted italic">
                        ບໍ່ມີສິດເຂົ້າເຖິງໂມດູນ
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {activePillars.map((p) => (
                          <span
                            key={p.key}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${p.color}`}
                            title={`${p.label}: ${p.actions.join(', ') || 'ເບິ່ງຢ່າງດຽວ'}`}
                          >
                            <span>{p.label}</span>
                            {p.actions.length > 0 && (
                              <span className="opacity-75 font-normal text-[9px]">
                                ({p.actions.length})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Column 4: Assigned Users Count */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800 text-xs">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{userCount} ຄົນ</span>
                    </span>
                  </td>

                  {/* Column 5: Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(role)}
                        className="p-1.5 rounded-lg border border-border-line hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-colors"
                        title="ແກ້ໄຂບົດບາດ & ສິດ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => onDelete(role)}
                          disabled={cannotDelete}
                          className="p-1.5 rounded-lg border border-border-line hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title={deleteTooltip}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
