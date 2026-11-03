'use client';

import React, { useState } from 'react';
import {
  X,
  Clock,
  User,
  Building,
  FileText,
  Network,
  Copy,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { AuditLog } from '@core/entities';
import { formatDate } from '@/utils/formatters';
import { AuditActionBadge } from './audit-action-badge';
import { AuditLogDiffViewer } from './audit-log-diff-viewer';
import { toast } from 'sonner';

interface AuditLogDetailModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogDetailModal({
  log,
  isOpen,
  onClose,
}: AuditLogDetailModalProps) {
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !log) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(log.id);
    setCopiedId(true);
    toast.success('ຄັດລອກ Audit Log ID ສຳເລັດ');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const resourceTitle =
    log.contract?.title ||
    log.powerContract?.projectName ||
    (log.contractId ? `ສັນຍາ ID: ${log.contractId}` : null) ||
    (log.powerContractId ? `ສັນຍາໄຟຟ້າ ID: ${log.powerContractId}` : null);

  const resourceNumber =
    log.contract?.contractNumber || log.powerContract?.contractNumber;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-surface rounded-2xl border border-border-line shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-line flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="flex items-center gap-3">
            <AuditActionBadge action={log.action} size="md" />
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                ລາຍລະອຽດການດຳເນີນງານ (Audit Log Detail)
              </h2>
              <p className="text-[11px] text-text-muted mt-0.5 font-mono flex items-center gap-1.5">
                <span>ID: {log.id}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-primary hover:underline inline-flex items-center gap-0.5"
                  title="Copy ID"
                >
                  {copiedId ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Overview Cards (Actor, Resource, Network) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Actor Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                <User className="w-3 h-3 text-primary" />
                <span>ຜູ້ດຳເນີນງານ (Actor)</span>
              </span>
              <p className="font-bold text-xs text-text-primary truncate">
                {log.user?.fullName || 'ບໍ່ລະບຸຊື່'}
              </p>
              <p className="text-[11px] text-text-muted font-mono truncate">
                ລະຫັດ: {log.user?.employeeCode || '-'}
              </p>
              {log.user?.department && (
                <p className="text-[10px] text-text-secondary truncate mt-0.5 flex items-center gap-1">
                  <Building className="w-2.5 h-2.5 text-text-muted shrink-0" />
                  <span>{log.user.department}</span>
                </p>
              )}
            </div>

            {/* Target Resource Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-600" />
                <span>ເປົ້າໝາຍ (Target Resource)</span>
              </span>
              <p className="font-bold text-xs text-text-primary truncate" title={resourceTitle || 'ບໍ່ມີສັນຍາຜູກພັນ'}>
                {resourceTitle || 'ລະບົບບັນຊີ / ສິດທິ / ທົ່ວໄປ'}
              </p>
              {resourceNumber ? (
                <p className="text-[11px] text-emerald-700 font-mono font-semibold truncate">
                  ເລກທີ: {resourceNumber}
                </p>
              ) : (
                <p className="text-[11px] text-text-muted font-mono">-</p>
              )}
            </div>

            {/* Network & Time Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" />
                <span>ເວລາ & ເຄືອຂ່າຍ (Context)</span>
              </span>
              <p className="font-semibold text-xs text-text-primary truncate">
                {formatDate(log.createdAt)}
              </p>
              <p className="text-[11px] text-text-muted font-mono flex items-center gap-1">
                <Network className="w-3 h-3 text-slate-400 shrink-0" />
                <span>IP: {log.ipAddress || '127.0.0.1 (Local)'}</span>
              </p>
            </div>
          </div>

          {/* Section 2: Changes / Diff Viewer */}
          <div>
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>ລາຍລະອຽດການປ່ຽນແປງຂໍ້ມູນ (Changes & Snapshots)</span>
            </h3>

            <div className="rounded-xl border border-border-line p-4 bg-white shadow-2xs">
              <AuditLogDiffViewer
                action={String(log.action)}
                oldValues={log.oldValues}
                newValues={log.newValues}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border-line flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="text-[11px] text-text-muted font-mono">
            {formatDate(log.createdAt)}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ປິດ
          </button>
        </div>
      </div>
    </div>
  );
}
