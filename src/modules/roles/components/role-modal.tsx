'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Loader2,
  CheckCircle2,
  Info,
  CheckSquare,
  Square,
  Sparkles,
  Eye,
} from 'lucide-react';
import {
  RoleItem,
  SystemModuleKey,
  PermissionActionKey,
  ModulePermission,
} from '@core/entities';
import { useCreateRole, useUpdateRole } from '../hooks/use-roles';

interface RoleModalProps {
  isOpen: boolean;
  role: RoleItem | null; // null = create mode, RoleItem = edit mode
  onClose: () => void;
}

export type PillarModuleKey = 'CONTRACTS' | 'POWER_CONTRACTS' | 'LEGAL_AND_DISPUTE';

interface PillarRowConfig {
  key: PillarModuleKey;
  label: string;
  divisionLabel: string;
  backendKeys: SystemModuleKey[];
}

const PILLAR_MODULES: PillarRowConfig[] = [
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

const ACTIONS: { key: PermissionActionKey; label: string; desc: string }[] = [
  { key: 'canView', label: 'ເບິ່ງ', desc: 'ເຂົ້າເບິ່ງລາຍການ ແລະ ລາຍລະອຽດ' },
  { key: 'canUpload', label: 'ສ້າງ / ອັບໂຫຼດ', desc: 'ສ້າງຂໍ້ມູນໃໝ່ ຫຼື ອັບໂຫຼດໄຟລ໌' },
  { key: 'canEdit', label: 'ແກ້ໄຂ', desc: 'ແກ້ໄຂຂໍ້ມູນໃນລະບົບ' },
  { key: 'canDelete', label: 'ລົບ', desc: 'ລົບຂໍ້ມູນ ຫຼື ໄຟລ໌' },
  { key: 'canDownload', label: 'ດາວໂຫຼດ', desc: 'ດາວໂຫຼດໄຟລ໌ເອກະສານແນບ' },
];

const DEFAULT_PERMISSIONS: Record<SystemModuleKey, ModulePermission> = {
  CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
};

export function RoleModal({ isOpen, role, onClose }: RoleModalProps) {
  const isEdit = Boolean(role);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [matrix, setMatrix] = useState<Record<SystemModuleKey, ModulePermission>>({
    ...DEFAULT_PERMISSIONS,
  });

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (role) {
      setName(role.name);
      setTitle(role.title);
      setDescription(role.description || '');

      // Populate existing permissions into matrix
      const initial: Record<SystemModuleKey, ModulePermission> = {
        CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
        POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
        LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
        LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
      };

      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach((p) => {
          const mod = p.module as SystemModuleKey;
          if (initial[mod]) {
            initial[mod] = {
              canView: Boolean(p.canView),
              canUpload: Boolean(p.canUpload),
              canEdit: Boolean(p.canEdit),
              canDelete: Boolean(p.canDelete),
              canDownload: Boolean(p.canDownload),
            };
          }
        });
      }
      setMatrix(initial);
    } else {
      setName('');
      setTitle('');
      setDescription('');
      setMatrix({
        CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
        POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
        LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
        LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
      });
    }
  }, [role, isOpen]);

  if (!isOpen) return null;

  const handleActionToggle = (pillar: PillarRowConfig, act: PermissionActionKey) => {
    setMatrix((prev) => {
      const primaryKey = pillar.backendKeys[0];
      const current = prev[primaryKey];
      const nextValue = !current[act];

      let updatedRow: ModulePermission;
      if (act === 'canView' && !nextValue) {
        updatedRow = { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false };
      } else if (act !== 'canView' && nextValue) {
        updatedRow = { ...current, [act]: true, canView: true };
      } else {
        updatedRow = { ...current, [act]: nextValue };
      }

      const nextMatrix = { ...prev };
      pillar.backendKeys.forEach((key) => {
        nextMatrix[key] = { ...updatedRow };
      });
      return nextMatrix;
    });
  };

  const handleToggleRow = (pillar: PillarRowConfig) => {
    setMatrix((prev) => {
      const primaryKey = pillar.backendKeys[0];
      const row = prev[primaryKey];
      const allActive = row.canView && row.canUpload && row.canEdit && row.canDelete && row.canDownload;
      const target = !allActive;
      const nextMatrix = { ...prev };
      pillar.backendKeys.forEach((key) => {
        nextMatrix[key] = {
          canView: target,
          canUpload: target,
          canEdit: target,
          canDelete: target,
          canDownload: target,
        };
      });
      return nextMatrix;
    });
  };

  const handlePresetReadOnly = () => {
    setMatrix({
      CONTRACTS: { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true },
      POWER_CONTRACTS: { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true },
      LEGAL_DOCUMENTS: { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true },
      LEGAL_CASES: { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true },
    });
  };

  const handlePresetFull = () => {
    setMatrix({
      CONTRACTS: { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true },
      POWER_CONTRACTS: { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true },
      LEGAL_DOCUMENTS: { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true },
      LEGAL_CASES: { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true },
    });
  };

  const handleClearAll = () => {
    setMatrix({
      CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
      POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
      LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
      LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const backendKeys: SystemModuleKey[] = ['CONTRACTS', 'POWER_CONTRACTS', 'LEGAL_DOCUMENTS', 'LEGAL_CASES'];
    const permissionsPayload = backendKeys.map((key) => ({
      module: key,
      ...matrix[key],
    }));

    if (isEdit && role) {
      await updateMutation.mutateAsync({
        id: role.id,
        payload: {
          title: title.trim(),
          description: description.trim(),
          permissions: permissionsPayload,
        },
      });
    } else {
      await createMutation.mutateAsync({
        name: name.toUpperCase().trim(),
        title: title.trim(),
        description: description.trim(),
        permissions: permissionsPayload,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-surface w-full max-w-3xl rounded-2xl border border-border-line shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-line bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                {isEdit ? 'ແກ້ໄຂບົດບາດ & ສິດ (Edit Role)' : 'ສ້າງບົດບາດໃໝ່ (Create Custom Role)'}
              </h2>
              <p className="text-xs text-text-secondary">
                ກຳນົດສິດທິລະອຽດລະດັບໂມດູນ (Module-Scoped Permissions Matrix)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                ລະຫັດ Role (Role Code) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isEdit && role?.isSystem}
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9_]/g, '_')
                  )
                }
                placeholder="ຕົວຢ່າງ: CONTRACT_AUDITOR"
                className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono font-bold text-text-primary uppercase placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-slate-100 disabled:opacity-60"
              />
              <p className="text-[10px] text-text-muted mt-1">
                ໃຊ້ຕົວພິມໃຫຍ່ ແລະ ຂີດກ້ອງ ເຊັ່ນ: AUDITOR, POWER_LEAD
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                ຊື່ບົດບາດສະແດງ (Display Title) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ຕົວຢ່າງ: ຜູ້ກວດສອບສັນຍາທົ່ວໄປ"
                className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-[10px] text-text-muted mt-1">
                ຊື່ພາສາລາວສຳລັບສະແດງເທິງ Header ແລະ ໜ້າ Profile
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-text-primary mb-1">
                ຄຳອະທິບາຍໜ້າທີ່ (Description)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ຕົວຢ່າງ: ຮັບຜິດຊອບກວດກາ ແລະ ດາວໂຫຼດເອກະສານສັນຍາ..."
                className="w-full px-3.5 py-2 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Section 2: Permission Matrix */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span>ຕາຕະລາງກຳນົດສິດ (Permissions Matrix)</span>
                </h3>
                <p className="text-[11px] text-text-muted">
                  ກຳນົດສິດການກະທຳແຕ່ລະໂມດູນສຳລັບ Role ນີ້
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePresetReadOnly}
                  className="px-2.5 py-1 rounded-lg border border-border-line bg-slate-50 hover:bg-slate-100 text-[10px] font-semibold text-text-secondary transition-colors"
                >
                  <Eye className="w-3 h-3 inline mr-1 text-blue-600" />
                  Audit / ເບິ່ງ & ດາວໂຫຼດ
                </button>
                <button
                  type="button"
                  onClick={handlePresetFull}
                  className="px-2.5 py-1 rounded-lg border border-border-line bg-slate-50 hover:bg-slate-100 text-[10px] font-semibold text-text-secondary transition-colors"
                >
                  <Sparkles className="w-3 h-3 inline mr-1 text-amber-500" />
                  ເຕັມຮູບແບບ
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2.5 py-1 rounded-lg border border-border-line hover:bg-red-50 text-[10px] font-semibold text-red-600 transition-colors"
                >
                  ລ້າງທັງໝົດ
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="border border-border-line rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100/80 border-b border-border-line text-text-secondary font-bold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 text-left w-2/5">ໂມດູນຫຼັກ</th>
                      {ACTIONS.map((a) => (
                        <th key={a.key} className="py-2.5 px-2 text-center" title={a.desc}>
                          <span>{a.label}</span>
                        </th>
                      ))}
                      <th className="py-2.5 px-2 text-center">ເລືອກແຖວ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-line bg-white">
                    {PILLAR_MODULES.map((pillar) => {
                      const primaryKey = pillar.backendKeys[0];
                      const row = matrix[primaryKey];
                      const allRow =
                        row.canView &&
                        row.canUpload &&
                        row.canEdit &&
                        row.canDelete &&
                        row.canDownload;

                      return (
                        <tr
                          key={pillar.key}
                          className={`hover:bg-slate-50/60 transition-colors ${
                            row.canView ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          <td className="py-3 px-3">
                            <p className="font-bold text-text-primary text-xs">
                              {pillar.label}
                            </p>
                            <p className="text-[10px] text-text-muted mt-0.5">
                              {pillar.divisionLabel}
                            </p>
                          </td>

                          {ACTIONS.map((act) => {
                            const isChecked = Boolean(row[act.key]);

                            return (
                              <td key={act.key} className="py-3 px-2 text-center">
                                <label className="inline-flex items-center justify-center cursor-pointer p-1 rounded hover:bg-slate-100">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleActionToggle(pillar, act.key)}
                                    className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary/20 cursor-pointer"
                                  />
                                </label>
                              </td>
                            );
                          })}

                          <td className="py-3 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleRow(pillar)}
                              className="text-[10px] px-2 py-0.5 rounded border border-border-line hover:bg-slate-100 font-semibold text-text-secondary transition-colors"
                              title="ເລືອກ ຫຼື ຍົກເລີກທັງໝົດໃນໂມດູນນີ້"
                            >
                              {allRow ? 'ຍົກເລີກ' : 'ທັງໝົດ'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-blue-50/60 border border-blue-200/50 text-[11px] text-blue-700">
              <Info className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              <span>
                <strong>ຄຳແນະນຳ:</strong> ຫາກເລືອກສິດໃດໜຶ່ງ (ສ້າງ, ແກ້ໄຂ, ລົບ, ດາວໂຫຼດ) ລະບົບຈະເປີດສິດ <strong>&quot;ເບິ່ງ (canView)&quot;</strong> ໃຫ້ອັດຕະໂນມັດ
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border-line">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !title.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ກຳລັງບັນທຶກ...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEdit ? 'ບັນທຶກການແກ້ໄຂ' : 'ສ້າງບົດບາດໃໝ່'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
