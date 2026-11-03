'use client';

import React from 'react';
import {
  Shield,
  Eye,
  Upload,
  Edit3,
  Trash2,
  Download,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  SystemModuleKey,
  PermissionActionKey,
  ModulePermission,
} from '@core/entities';

interface ModulePermissionsMatrixProps {
  matrix: Record<SystemModuleKey, ModulePermission>;
  onChange: (matrix: Record<SystemModuleKey, ModulePermission>) => void;
  disabled?: boolean;
  isOverride?: boolean;
  onToggleOverride?: (override: boolean) => void;
  roleTitle?: string;
}

export type PillarModuleKey = 'CONTRACTS' | 'POWER_CONTRACTS' | 'LEGAL_AND_DISPUTE';

interface PillarRowConfig {
  key: PillarModuleKey;
  label: string;
  divisionLabel: string;
  backendKeys: SystemModuleKey[];
}

export const PILLAR_MODULES: PillarRowConfig[] = [
  {
    key: 'CONTRACTS',
    label: '1. ສັນຍາທົ່ວໄປ (General Contracts)',
    divisionLabel: 'ພະແນກສັນຍາທົ່ວໄປ',
    backendKeys: ['CONTRACTS'],
  },
  {
    key: 'POWER_CONTRACTS',
    label: '2. ສັນຍາຊື້-ຂາຍໄຟຟ້າ (Power Contracts)',
    divisionLabel: 'ພະແນກສັນຍາຊື້-ຂາຍໄຟຟ້າ',
    backendKeys: ['POWER_CONTRACTS'],
  },
  {
    key: 'LEGAL_AND_DISPUTE',
    label: '3. ນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ (Legal Affairs & Disputes)',
    divisionLabel: 'ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ (ນິຕິກຳ + ຄະດີຄວາມ)',
    backendKeys: ['LEGAL_DOCUMENTS', 'LEGAL_CASES'],
  },
];

const ACTIONS: { key: PermissionActionKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'canView', label: 'ເບິ່ງ', icon: Eye },
  { key: 'canUpload', label: 'ສ້າງ/ອັບໂຫຼດ', icon: Upload },
  { key: 'canEdit', label: 'ແກ້ໄຂ', icon: Edit3 },
  { key: 'canDelete', label: 'ລົບ', icon: Trash2 },
  { key: 'canDownload', label: 'ດາວໂຫຼດ', icon: Download },
];

export function ModulePermissionsMatrix({
  matrix,
  onChange,
  disabled = false,
  isOverride = false,
  onToggleOverride,
  roleTitle,
}: ModulePermissionsMatrixProps) {
  // Get values for a pillar row (for LEGAL_AND_DISPUTE, takes from LEGAL_DOCUMENTS)
  const getPillarRow = (pillar: PillarRowConfig): ModulePermission => {
    const primaryKey = pillar.backendKeys[0];
    return matrix[primaryKey] || {
      canView: false,
      canUpload: false,
      canEdit: false,
      canDelete: false,
      canDownload: false,
    };
  };

  const handleActionToggle = (pillar: PillarRowConfig, act: PermissionActionKey) => {
    if (disabled) return;

    const current = getPillarRow(pillar);
    const nextValue = !current[act];

    let updatedRow: ModulePermission;
    if (act === 'canView' && !nextValue) {
      updatedRow = { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false };
    } else if (act !== 'canView' && nextValue) {
      updatedRow = { ...current, [act]: true, canView: true };
    } else {
      updatedRow = { ...current, [act]: nextValue };
    }

    const nextMatrix = { ...matrix };
    // Synchronize to all underlying backend keys (e.g. both LEGAL_DOCUMENTS and LEGAL_CASES)
    pillar.backendKeys.forEach((key) => {
      nextMatrix[key] = { ...updatedRow };
    });

    onChange(nextMatrix);
  };

  const handleToggleRow = (pillar: PillarRowConfig) => {
    if (disabled) return;

    const row = getPillarRow(pillar);
    const allActive = row.canView && row.canUpload && row.canEdit && row.canDelete && row.canDownload;
    const target = !allActive;

    const updatedRow: ModulePermission = {
      canView: target,
      canUpload: target,
      canEdit: target,
      canDelete: target,
      canDownload: target,
    };

    const nextMatrix = { ...matrix };
    pillar.backendKeys.forEach((key) => {
      nextMatrix[key] = { ...updatedRow };
    });

    onChange(nextMatrix);
  };

  return (
    <div className="space-y-3">
      {/* Header & Override Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>ສິດທິ 3 ໂມດູນຫຼັກ (3 Core Modules Permissions Matrix)</span>
          </label>
          <p className="text-[11px] text-text-muted mt-0.5">
            {isOverride
              ? 'ກຳລັງຕັ້ງຄ່າສິດພິເສດສະເພາະຄົນ (Custom Override)'
              : `ກຳລັງໃຊ້ສິດຕາມ Template ຂອງ Role: ${roleTitle || 'ປົກກະຕິ'}`}
          </p>
        </div>

        {onToggleOverride && !disabled && (
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isOverride}
              onChange={(e) => onToggleOverride(e.target.checked)}
              className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary/20 cursor-pointer"
            />
            <span className="text-xs font-semibold text-text-secondary">
              ກຳນົດສິດພິເສດສະເພາະຄົນ (Override)
            </span>
          </label>
        )}
      </div>

      {/* 3 Modules x 5 Actions Matrix Table */}
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
                {!disabled && isOverride && (
                  <th className="py-2.5 px-2 text-center">ເລືອກແຖວ</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-line bg-white">
              {PILLAR_MODULES.map((pillar) => {
                const row = getPillarRow(pillar);
                const allRow =
                  row.canView &&
                  row.canUpload &&
                  row.canEdit &&
                  row.canDelete &&
                  row.canDownload;

                return (
                  <tr
                    key={pillar.key}
                    className={`transition-colors ${
                      row.canView ? 'bg-blue-50/25' : ''
                    } ${disabled || !isOverride ? 'opacity-90' : 'hover:bg-slate-50/60'}`}
                  >
                    <td className="py-3 px-3">
                      <p className="font-bold text-text-primary text-xs">
                        {pillar.label}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {pillar.divisionLabel}
                      </p>
                    </td>

                    {ACTIONS.map((act) => {
                      const isChecked = Boolean(row[act.key]);

                      return (
                        <td key={act.key} className="py-3 px-2 text-center">
                          <label
                            className={`inline-flex items-center justify-center p-1 rounded ${
                              disabled || !isOverride
                                ? 'cursor-default'
                                : 'cursor-pointer hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={disabled || !isOverride}
                              onChange={() => handleActionToggle(pillar, act.key)}
                              className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary/20 cursor-pointer disabled:cursor-not-allowed"
                            />
                          </label>
                        </td>
                      );
                    })}

                    {!disabled && isOverride && (
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleRow(pillar)}
                          className="text-[10px] px-2 py-0.5 rounded border border-border-line hover:bg-slate-100 font-semibold text-text-secondary transition-colors"
                        >
                          {allRow ? 'ຍົກເລີກ' : 'ທັງໝົດ'}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isOverride ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200/60 text-[11px] text-amber-800">
          <Info className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>
            ກຳລັງເປີດໃຊ້ <strong>ສິດພິເສດສະເພາະຄົນ (Custom Override)</strong>: ລະບົບຈະບັນທຶກສິດຕາມຕາຕະລາງ 3 ໂມດູນຂ້າງເທິງແທນ Role Template.
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-text-muted">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span>
            ສິດທິຖືກກຳນົດອັດຕະໂນມັດຕາມ <strong>Role Template</strong>. ຫາກຕ້ອງການປັບສິດສະເພາະຄົນ ໃຫ້ກົດເລືອກ &quot;ກຳນົດສິດພິເສດສະເພາະຄົນ&quot;
          </span>
        </div>
      )}
    </div>
  );
}
