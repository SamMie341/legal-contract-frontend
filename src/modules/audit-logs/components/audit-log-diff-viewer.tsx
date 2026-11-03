'use client';

import React, { useState } from 'react';
import {
  Check,
  X,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Code2,
  Copy,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditLogDiffViewerProps {
  action: string;
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
}

const FIELD_LABELS: Record<string, string> = {
  title: 'ຫົວຂໍ້ສັນຍາ',
  projectName: 'ຊື່ໂຄງການ',
  contractNumber: 'ເລກທີສັນຍາ',
  status: 'ສະຖານະ',
  role: 'ບົດບາດ (Role)',
  roleId: 'ລະຫັດບົດບາດ (Role ID)',
  division: 'ສັງກັດພະແນກ (Division)',
  department: 'ຫ້ອງການ/ຝ່າຍ (Department)',
  isActive: 'ເປີດນຳໃຊ້ບັນຊີ',
  canView: 'ສິດເບິ່ງ (canView)',
  canUpload: 'ສິດສ້າງ/ອັບໂຫຼດ (canUpload)',
  canEdit: 'ສິດແກ້ໄຂ (canEdit)',
  canDelete: 'ສິດລົບ (canDelete)',
  canDownload: 'ສິດດາວໂຫຼດ (canDownload)',
  modulePermissions: 'ສິດທິລາຍໂມດູນ (Module Permissions)',
  partyA: 'ຄູ່ສັນຍາ ຝ່າຍ ກ',
  partyB: 'ຄູ່ສັນຍາ ຝ່າຍ ຂ',
  amount: 'ມູນຄ່າສັນຍາ',
  currency: 'ສະກຸນເງິນ',
  signedDate: 'ວັນທີເຊັນສັນຍາ',
  effectiveDate: 'ວັນທີມີຜົນສັກສິດ',
  expirationDate: 'ວັນທີໝົດອາຍຸ',
  docTitle: 'ຫົວຂໍ້ນິຕິກຳ',
  docType: 'ປະເພດນິຕິກຳ',
  issueYear: 'ປີອອກນິຕິກຳ',
  caseNumber: 'ເລກທີຄະດີ',
  caseTitle: 'ຫົວຂໍ້ຄະດີ',
};

const MODULE_LABELS: Record<string, string> = {
  CONTRACTS: '1. ສັນຍາທົ່ວໄປ',
  POWER_CONTRACTS: '2. ສັນຍາຊື້-ຂາຍໄຟຟ້າ',
  LEGAL_DOCUMENTS: '3. ນິຕິກຳ ແລະ ລະບຽບການ',
  LEGAL_CASES: '3. ສຳນວນຄະດີ & ຂໍ້ຂັດແຍ່ງ',
  LEGAL_AND_DISPUTE: '3. ນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ',
};

function formatValue(val: any): string {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'boolean') return val ? 'ແມ່ນ (True)' : 'ບໍ່ (False)';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

export function AuditLogDiffViewer({
  action,
  oldValues,
  newValues,
}: AuditLogDiffViewerProps) {
  const [showUnchanged, setShowUnchanged] = useState(false);
  const [viewMode, setViewMode] = useState<'diff' | 'json'>('diff');
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    const data = { action, oldValues, newValues };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    toast.success('ຄັດລອກຂໍ້ມູນ JSON ສຳເລັດແລ້ວ');
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Check for Security: Path Tampering
  if (newValues?.alertType === 'PATH_TAMPERING_DETECTED') {
    return (
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-3">
        <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>ກວດພົບການພະຍາຍາມເຂົ້າເຖິງໂມດູນທີ່ບໍ່ມີສິດ (Path Tampering Alert)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white/80 border border-red-200">
            <span className="text-text-muted block text-[11px]">Path ທີ່ຮ້ອງຂໍ:</span>
            <span className="font-mono font-bold text-red-700">{newValues.attemptedPath || '-'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 border border-red-200">
            <span className="text-text-muted block text-[11px]">Action / Method:</span>
            <span className="font-bold">{newValues.httpMethod} ({newValues.requiredAction})</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 border border-red-200">
            <span className="text-text-muted block text-[11px]">ໂມດູນເປົ້າໝາຍ:</span>
            <span className="font-bold">{newValues.targetModule || '-'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 border border-red-200">
            <span className="text-text-muted block text-[11px]">ພະແນກທີ່ອະນຸຍາດ:</span>
            <span className="font-bold">{newValues.requiredDivision || '-'}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Check for Password Reset by Admin
  if (newValues?.action === 'RESET_BY_ADMIN') {
    return (
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-2">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
          <KeyRound className="w-4 h-4 text-amber-600" />
          <span>ຜູ້ດູແລລະບົບ (Admin) ໄດ້ທຳການຣີເຊັດລະຫັດຜ່ານຊົ່ວຄາວໃຫ້ບັນຊີນີ້</span>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          ລະຫັດຜ່ານຂອງຜູ້ໃຊ້ໄດ້ຖືກປ່ຽນເປັນລະຫັດຊົ່ວຄາວໃໝ່ ແລະ Token Version ຖືກຍົກເລີກ ເພື່ອບັງຄັບໃຫ້ຜູ້ໃຊ້ເຂົ້າສູ່ລະບົບໃໝ່.
        </p>
      </div>
    );
  }

  // 3. Check for Password Change by Self
  if (newValues?.action === 'CHANGED_BY_SELF') {
    return (
      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 space-y-2">
        <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>ຜູ້ໃຊ້ງານໄດ້ປ່ຽນລະຫັດຜ່ານຂອງຕົນເອງສຳເລັດ (Changed Password)</span>
        </div>
        <p className="text-xs text-blue-700 leading-relaxed">
          ລະບົບໄດ້ປັບປຸງລະຫັດຜ່ານໃໝ່ ແລະ ບັນທຶກຄວາມປອດໄພຮຽບຮ້ອຍແລ້ວ.
        </p>
      </div>
    );
  }

  // Fallback if no values at all
  if (!oldValues && !newValues) {
    return (
      <div className="p-6 text-center text-xs text-text-muted bg-slate-50 rounded-xl border border-dashed border-border-line">
        ບໍ່ມີລາຍລະອຽດການປ່ຽນແປງຄ່າໃນຖານຂໍ້ມູນ (No Snapshot Recorded)
      </div>
    );
  }

  // Collect all unique keys
  const allKeys = Array.from(
    new Set([...Object.keys(oldValues || {}), ...Object.keys(newValues || {})])
  ).filter((k) => !['createdAt', 'updatedAt', 'deletedAt'].includes(k));

  return (
    <div className="space-y-3">
      {/* View Mode Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-border-line">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('diff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'diff'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ລາຍການປ່ຽນແປງ (Visual Diff)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'json'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON Raw Data</span>
          </button>
        </div>

        {viewMode === 'diff' ? (
          <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showUnchanged}
              onChange={(e) => setShowUnchanged(e.target.checked)}
              className="rounded border-slate-300 text-primary focus:ring-primary w-3.5 h-3.5"
            />
            <span>ສະແດງທຸກຟິວ</span>
          </label>
        ) : (
          <button
            type="button"
            onClick={handleCopyJson}
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'ຄັດລອກແລ້ວ' : 'Copy JSON'}</span>
          </button>
        )}
      </div>

      {/* JSON Mode */}
      {viewMode === 'json' ? (
        <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-80 leading-relaxed">
          {JSON.stringify({ oldValues, newValues }, null, 2)}
        </pre>
      ) : (
        /* Diff Mode */
        <div className="space-y-2">
          {allKeys.map((key) => {
            const oldVal = oldValues?.[key];
            const newVal = newValues?.[key];

            const isOldPresent = oldValues !== null && oldValues !== undefined && key in oldValues;
            const isNewPresent = newValues !== null && newValues !== undefined && key in newValues;

            const isAdded = !isOldPresent && isNewPresent;
            const isRemoved = isOldPresent && !isNewPresent;
            const isModified =
              isOldPresent &&
              isNewPresent &&
              JSON.stringify(oldVal) !== JSON.stringify(newVal);
            const isUnchanged =
              isOldPresent &&
              isNewPresent &&
              JSON.stringify(oldVal) === JSON.stringify(newVal);

            if (isUnchanged && !showUnchanged) return null;

            const label = FIELD_LABELS[key] || key;

            // Special renderer for modulePermissions
            if (key === 'modulePermissions' && (Array.isArray(oldVal) || Array.isArray(newVal))) {
              const permsList = (newVal || oldVal || []) as any[];

              return (
                <div
                  key={key}
                  className="p-3 rounded-xl border border-border-line bg-slate-50/70 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">
                      {label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                      Matrix Permissions
                    </span>
                  </div>

                  <div className="divide-y divide-border-line border border-border-line rounded-lg bg-white overflow-hidden text-xs">
                    {permsList.map((p, pIdx) => {
                      const modName = MODULE_LABELS[p.module] || p.module;
                      return (
                        <div
                          key={pIdx}
                          className="px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                        >
                          <span className="font-semibold text-text-primary">
                            {modName}
                          </span>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className={p.canView ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              ເບິ່ງ {p.canView ? '✓' : '✗'}
                            </span>
                            <span className={p.canUpload ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              ສ້າງ {p.canUpload ? '✓' : '✗'}
                            </span>
                            <span className={p.canEdit ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              ແກ້ໄຂ {p.canEdit ? '✓' : '✗'}
                            </span>
                            <span className={p.canDelete ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              ລົບ {p.canDelete ? '✓' : '✗'}
                            </span>
                            <span className={p.canDownload ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                              ດາວໂຫຼດ {p.canDownload ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={key}
                className={`p-2.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isModified
                    ? 'border-amber-200 bg-amber-50/40'
                    : isAdded
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : isRemoved
                    ? 'border-red-200 bg-red-50/40'
                    : 'border-border-line bg-surface'
                }`}
              >
                <div className="min-w-[140px] shrink-0">
                  <span className="font-bold text-text-primary block">{label}</span>
                  <span className="text-[10px] text-text-muted font-mono">{key}</span>
                </div>

                <div className="flex-1 flex items-center gap-2 flex-wrap sm:justify-end">
                  {isModified && (
                    <>
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 line-through text-[11px]">
                        {formatValue(oldVal)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        {formatValue(newVal)}
                      </span>
                    </>
                  )}

                  {isAdded && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      + {formatValue(newVal)}
                    </span>
                  )}

                  {isRemoved && (
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 line-through text-[11px]">
                      - {formatValue(oldVal)}
                    </span>
                  )}

                  {isUnchanged && (
                    <span className="text-text-secondary text-[11px]">
                      {formatValue(newVal)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
