'use client';

import React, { useState } from 'react';
import {
  X,
  Clock,
  User,
  UserCheck,
  Building,
  FileText,
  Zap,
  Scale,
  Shield,
  Paperclip,
  Network,
  Copy,
  CheckCircle2,
  Layers,
  AlertTriangle,
  FolderGit2,
} from 'lucide-react';
import { AuditLog, AUDIT_ACTION_MAP } from '@core/entities';
import { formatDate } from '@/utils/formatters';
import { AuditActionBadge } from './audit-action-badge';
import { AuditLogDiffViewer } from './audit-log-diff-viewer';
import {
  resolveTargetUser,
  resolveResourceInfo,
  formatFileSize,
} from '../utils/audit-log.util';
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

  const actionInfo = AUDIT_ACTION_MAP[log.action];
  const targetUser = resolveTargetUser(log);
  const resource = resolveResourceInfo(log);

  // Determine if we should show the dedicated target user card
  const hasTargetUserCard = Boolean(
    targetUser && (targetUser.fullName || targetUser.employeeCode || targetUser.username)
  );

  // Determine if we should show the separate resource card (avoid duplicate if resource is solely the target user)
  const hasResourceCard =
    resource.category !== 'USER' &&
    resource.category !== 'OTHER';

  // Determine grid columns
  const cardCount = 2 + (hasTargetUserCard ? 1 : 0) + (hasResourceCard ? 1 : 0);
  const gridColsClass =
    cardCount >= 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : cardCount === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  // Resource Icon helper
  const renderResourceIcon = () => {
    switch (resource.category) {
      case 'POWER_CONTRACT':
        return <Zap className="w-3.5 h-3.5 text-indigo-600" />;
      case 'LEGAL_DOCUMENT':
        return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
      case 'LEGAL_CASE':
        return <Scale className="w-3.5 h-3.5 text-emerald-600" />;
      case 'ROLE':
        return <Shield className="w-3.5 h-3.5 text-purple-600" />;
      case 'ATTACHMENT':
        return <Paperclip className="w-3.5 h-3.5 text-blue-600" />;
      case 'SECURITY':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-surface rounded-2xl border border-border-line shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-line flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <AuditActionBadge action={log.action} size="md" />
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                ລາຍລະອຽດການດຳເນີນງານ (Audit Log Detail)
              </h2>
              <div className="text-[11px] text-text-muted mt-0.5 font-mono flex items-center gap-1.5 flex-wrap">
                <span>ID: {log.id}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-primary hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  title="Copy ID"
                >
                  {copiedId ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action description banner */}
        {actionInfo?.description && (
          <div className="px-6 py-2 bg-slate-100/60 border-b border-slate-200/60 text-[11px] text-text-secondary flex items-center gap-2">
            <span className="font-semibold text-text-primary">ຄຳອະທິບາຍ:</span>
            <span>{actionInfo.description}</span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Overview Cards */}
          <div className={`grid ${gridColsClass} gap-3`}>
            {/* Card 1: Actor Card */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between space-y-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1 mb-1">
                  <User className="w-3 h-3 text-primary" />
                  <span>ຜູ້ດຳເນີນງານ (Actor)</span>
                </span>
                <p className="font-bold text-xs text-text-primary truncate" title={log.user?.fullName}>
                  {log.user?.fullName || 'ລະບົບອັດຕະໂນມັດ'}
                </p>
                <p className="text-[11px] text-text-muted font-mono truncate">
                  ລະຫັດ: {log.user?.employeeCode || '-'}
                </p>
              </div>
              {log.user?.department && (
                <p className="text-[10px] text-text-secondary truncate pt-1 border-t border-slate-200/50 flex items-center gap-1">
                  <Building className="w-2.5 h-2.5 text-text-muted shrink-0" />
                  <span className="truncate">{log.user.department}</span>
                </p>
              )}
            </div>

            {/* Card 2: Target User Card (if present) */}
            {hasTargetUserCard && (
              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/80 flex flex-col justify-between space-y-1">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase font-bold text-purple-700 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-purple-600" />
                      <span>ຜູ້ໃຊ້ເປົ້າໝາຍ</span>
                    </span>
                    {targetUser?.role && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[9px] font-bold border border-purple-200 shrink-0">
                        {targetUser.role}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-xs text-text-primary truncate" title={targetUser?.fullName || targetUser?.username}>
                    {targetUser?.fullName || `@${targetUser?.username}` || '-'}
                  </p>
                  <p className="text-[11px] text-purple-800 font-mono truncate">
                    ລະຫັດ: {targetUser?.employeeCode || '-'}
                  </p>
                </div>
                {(targetUser?.division || targetUser?.department) && (
                  <p className="text-[10px] text-text-secondary truncate pt-1 border-t border-purple-200/50 flex items-center gap-1">
                    <FolderGit2 className="w-2.5 h-2.5 text-purple-500 shrink-0" />
                    <span className="truncate">{targetUser.division || targetUser.department}</span>
                  </p>
                )}
              </div>
            )}

            {/* Card 3: Target Resource Card */}
            {hasResourceCard && (
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between space-y-1">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1">
                      {renderResourceIcon()}
                      <span>ເປົ້າໝາຍ ({resource.typeLabel})</span>
                    </span>
                  </div>
                  <p className="font-bold text-xs text-text-primary truncate" title={resource.title}>
                    {resource.title}
                  </p>
                  {resource.codeOrNumber && (
                    <p className="text-[11px] text-emerald-700 font-mono font-semibold truncate">
                      {resource.codeOrNumber}
                    </p>
                  )}
                </div>

                {/* Attachment or secondary info */}
                {resource.attachment ? (
                  <div className="text-[10px] text-blue-700 pt-1 border-t border-slate-200/50 flex items-center justify-between gap-1">
                    <span className="truncate">ໄຟລ໌ແນບ</span>
                    <span className="font-mono font-bold shrink-0">
                      {formatFileSize(resource.attachment.fileSize)}
                    </span>
                  </div>
                ) : resource.secondaryInfo ? (
                  <p className="text-[10px] text-text-muted truncate pt-1 border-t border-slate-200/50">
                    {resource.secondaryInfo}
                  </p>
                ) : null}
              </div>
            )}

            {/* Card 4: Network & Time Card */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between space-y-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span>ເວລາ & ເຄືອຂ່າຍ</span>
                </span>
                <p className="font-semibold text-xs text-text-primary truncate">
                  {formatDate(log.createdAt)}
                </p>
                <p className="text-[10px] text-text-muted font-mono">
                  {new Date(log.createdAt).toLocaleTimeString('lo-LA', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>
              <p className="text-[11px] text-text-secondary font-mono flex items-center gap-1 pt-1 border-t border-slate-200/50">
                <Network className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">IP: {log.ipAddress || '127.0.0.1'}</span>
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
        <div className="px-6 py-3.5 border-t border-border-line flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="text-[11px] text-text-muted font-mono">
            {formatDate(log.createdAt)} •{' '}
            {new Date(log.createdAt).toLocaleTimeString('lo-LA')}
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
