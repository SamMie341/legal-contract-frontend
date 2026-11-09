'use client';

import React, { useState } from 'react';
import {
  Check,
  X,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  UserPlus,
  UserMinus,
  ArrowRight,
  Code2,
  Copy,
  CheckCircle2,
  Layers,
  FileText,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/utils/formatters';
import {
  AUDIT_FIELD_LABELS,
  MODULE_LABELS,
  formatFileSize,
} from '../utils/audit-log.util';

interface AuditLogDiffViewerProps {
  action: string;
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
}

function isIsoDateString(val: any): boolean {
  return typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val);
}

function formatPrimitiveValue(key: string, val: any): string {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'boolean') return val ? 'ແມ່ນ (True)' : 'ບໍ່ (False)';

  if (key === 'fileSize' && (typeof val === 'number' || !isNaN(Number(val)))) {
    return formatFileSize(val);
  }

  if (isIsoDateString(val)) {
    try {
      const d = new Date(val);
      return `${formatDate(val)} ${d.toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return String(val);
    }
  }

  if ((key === 'amount' || key === 'contractValue') && !isNaN(Number(val))) {
    return Number(val).toLocaleString();
  }

  if (key === 'sharePercentage' && !isNaN(Number(val))) {
    return `${val}%`;
  }

  if (key === 'notifyDaysBefore' && !isNaN(Number(val))) {
    return `${val} ວັນ`;
  }

  if (key === 'durationMonths' && !isNaN(Number(val))) {
    return `${val} ເດືອນ`;
  }

  if (typeof val === 'object') {
    return JSON.stringify(val);
  }

  return String(val);
}

function renderValueBadge(key: string, val: any) {
  if (val === null || val === undefined) {
    return <span className="text-slate-400 italic text-[11px]">-</span>;
  }

  // 1. Target User Object
  if (key === 'targetUser' && typeof val === 'object') {
    return (
      <div className="inline-flex items-center gap-1.5 flex-wrap px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
        <span className="font-bold text-text-primary">
          {val.fullName || val.username || 'ຜູ້ໃຊ້'}
        </span>
        {val.employeeCode && (
          <span className="font-mono text-slate-500 text-[11px]">
            ({val.employeeCode})
          </span>
        )}
        {val.role && (
          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[10px] font-bold border border-purple-200">
            {val.role}
          </span>
        )}
        {val.division && (
          <span className="text-slate-500 text-[10px]">
            • {val.division}
          </span>
        )}
      </div>
    );
  }

  // 2. Permissions Object (canView, canUpload, canEdit, canDelete, canDownload)
  if (
    key === 'permissions' &&
    typeof val === 'object' &&
    !Array.isArray(val) &&
    ('canView' in val || 'canUpload' in val || 'canEdit' in val || 'canDelete' in val || 'canDownload' in val)
  ) {
    return (
      <div className="inline-flex items-center gap-1.5 flex-wrap text-[11px]">
        {val.canView !== undefined && (
          <span className={`px-1.5 py-0.5 rounded font-semibold border ${val.canView ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            ເບິ່ງ {val.canView ? '✓' : '✗'}
          </span>
        )}
        {val.canUpload !== undefined && (
          <span className={`px-1.5 py-0.5 rounded font-semibold border ${val.canUpload ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            ສ້າງ {val.canUpload ? '✓' : '✗'}
          </span>
        )}
        {val.canEdit !== undefined && (
          <span className={`px-1.5 py-0.5 rounded font-semibold border ${val.canEdit ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            ແກ້ໄຂ {val.canEdit ? '✓' : '✗'}
          </span>
        )}
        {val.canDelete !== undefined && (
          <span className={`px-1.5 py-0.5 rounded font-semibold border ${val.canDelete ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            ລົບ {val.canDelete ? '✓' : '✗'}
          </span>
        )}
        {val.canDownload !== undefined && (
          <span className={`px-1.5 py-0.5 rounded font-semibold border ${val.canDownload ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            ດາວໂຫຼດ {val.canDownload ? '✓' : '✗'}
          </span>
        )}
      </div>
    );
  }

  // 3. Fallback string formatting
  return <span>{formatPrimitiveValue(key, val)}</span>;
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
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>ກວດພົບການພະຍາຍາມເຂົ້າເຖິງໂມດູນທີ່ບໍ່ມີສິດ (Path Tampering Alert)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white/80 border border-rose-200">
            <span className="text-text-muted block text-[11px]">Path ທີ່ຮ້ອງຂໍ:</span>
            <span className="font-mono font-bold text-rose-700">{newValues.attemptedPath || '-'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 border border-rose-200">
            <span className="text-text-muted block text-[11px]">Action / Method:</span>
            <span className="font-bold">{newValues.httpMethod} ({newValues.requiredAction})</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 border border-rose-200">
            <span className="text-text-muted block text-[11px]">ໂມດູນເປົ້າໝາຍ:</span>
            <span className="font-bold">{newValues.targetModule || '-'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 border border-rose-200">
            <span className="text-text-muted block text-[11px]">ພະແນກທີ່ອະນຸຍາດ:</span>
            <span className="font-bold">{newValues.requiredDivision || '-'}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Check for Password Reset by Admin
  if (newValues?.action === 'RESET_BY_ADMIN') {
    const target = newValues?.targetUser || oldValues?.targetUser;
    return (
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-2">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
          <KeyRound className="w-4 h-4 text-amber-600" />
          <span>ຜູ້ດູແລລະບົບ (Admin) ໄດ້ທຳການຣີເຊັດລະຫັດຜ່ານຊົ່ວຄາວໃຫ້ບັນຊີນີ້</span>
        </div>
        {target && (
          <div className="text-xs text-amber-800 bg-white/70 p-2.5 rounded-lg border border-amber-200/80 flex items-center gap-2">
            <span className="font-bold">{target.fullName || target.username}</span>
            {target.employeeCode && (
              <span className="font-mono text-amber-700">({target.employeeCode})</span>
            )}
            {target.role && (
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                {target.role}
              </span>
            )}
          </div>
        )}
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

  // 4. Check for User Creation
  if (newValues?.action === 'CREATE_USER') {
    const target = newValues?.targetUser;
    return (
      <div className="space-y-3">
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-emerald-900">
                ສ້າງບັນຊີຜູ້ໃຊ້ງານໃໝ່ໃນລະບົບ (User Account Created)
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                ບັນຊີຖືກບັນທຶກພ້ອມກຳນົດສິດເລີ່ມຕົ້ນຮຽບຮ້ອຍ
              </p>
            </div>
          </div>
          {target?.role && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 shrink-0">
              {target.role}
            </span>
          )}
        </div>

        {/* Diff breakdown */}
        {renderGenericDiff()}
      </div>
    );
  }

  // 5. Check for User Deletion
  if (oldValues?.action === 'DELETE_USER') {
    const target = oldValues?.targetUser;
    return (
      <div className="space-y-3">
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <UserMinus className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-rose-900">
                ລົບບັນຊີຜູ້ໃຊ້ງານອອກຈາກລະບົບ (User Account Deleted)
              </p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                ບັນຊີຖືກປິດການນຳໃຊ້ ແລະ ລົບອອກຈາກລະບົບ (Soft Delete)
              </p>
            </div>
          </div>
          {target?.employeeCode && (
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-mono font-bold border border-rose-300 shrink-0">
              ລະຫັດ: {target.employeeCode}
            </span>
          )}
        </div>

        {/* Diff breakdown */}
        {renderGenericDiff()}
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

  return renderGenericDiff();

  function renderGenericDiff() {
    // Collect all unique keys excluding audit metadata
    const allKeys = Array.from(
      new Set([...Object.keys(oldValues || {}), ...Object.keys(newValues || {})])
    ).filter((k) => !['createdAt', 'updatedAt'].includes(k));

    return (
      <div className="space-y-3">
        {/* View Mode Controls */}
        <div className="flex items-center justify-between pb-2 border-b border-border-line">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('diff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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
              className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline cursor-pointer"
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

              const isOldPresent =
                oldValues !== null && oldValues !== undefined && key in oldValues;
              const isNewPresent =
                newValues !== null && newValues !== undefined && key in newValues;

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

              const label = AUDIT_FIELD_LABELS[key] || key;

              // Special renderer for modulePermissions
              if (
                key === 'modulePermissions' &&
                (Array.isArray(oldVal) || Array.isArray(newVal))
              ) {
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
                              <span
                                className={
                                  p.canView
                                    ? 'text-emerald-700 font-bold'
                                    : 'text-slate-400'
                                }
                              >
                                ເບິ່ງ {p.canView ? '✓' : '✗'}
                              </span>
                              <span
                                className={
                                  p.canUpload
                                    ? 'text-emerald-700 font-bold'
                                    : 'text-slate-400'
                                }
                              >
                                ສ້າງ {p.canUpload ? '✓' : '✗'}
                              </span>
                              <span
                                className={
                                  p.canEdit
                                    ? 'text-emerald-700 font-bold'
                                    : 'text-slate-400'
                                }
                              >
                                ແກ້ໄຂ {p.canEdit ? '✓' : '✗'}
                              </span>
                              <span
                                className={
                                  p.canDelete
                                    ? 'text-emerald-700 font-bold'
                                    : 'text-slate-400'
                                }
                              >
                                ລົບ {p.canDelete ? '✓' : '✗'}
                              </span>
                              <span
                                className={
                                  p.canDownload
                                    ? 'text-emerald-700 font-bold'
                                    : 'text-slate-400'
                                }
                              >
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
                      ? 'border-rose-200 bg-rose-50/40'
                      : 'border-border-line bg-surface'
                  }`}
                >
                  <div className="min-w-[140px] shrink-0">
                    <span className="font-bold text-text-primary block">
                      {label}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      {key}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center gap-2 flex-wrap sm:justify-end">
                    {isModified && (
                      <>
                        <div className="px-2 py-1 rounded bg-rose-100 text-rose-800 line-through text-[11px]">
                          {renderValueBadge(key, oldVal)}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <div className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          {renderValueBadge(key, newVal)}
                        </div>
                      </>
                    )}

                    {isAdded && (
                      <div className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                        <span>+</span>
                        {renderValueBadge(key, newVal)}
                      </div>
                    )}

                    {isRemoved && (
                      <div className="px-2 py-1 rounded bg-rose-100 text-rose-800 line-through text-[11px] flex items-center gap-1">
                        <span>-</span>
                        {renderValueBadge(key, oldVal)}
                      </div>
                    )}

                    {isUnchanged && (
                      <div className="text-text-secondary text-[11px]">
                        {renderValueBadge(key, newVal)}
                      </div>
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
}
