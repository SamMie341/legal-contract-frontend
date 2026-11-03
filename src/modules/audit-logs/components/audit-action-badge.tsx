'use client';

import React from 'react';
import {
  FileText,
  FilePlus,
  FileEdit,
  Trash2,
  Upload,
  Download,
  Shield,
  ShieldAlert,
  Zap,
  Scale,
  Users,
  Settings,
  Sparkles,
} from 'lucide-react';
import { AuditAction, AUDIT_ACTION_MAP } from '@core/entities';

interface AuditActionBadgeProps {
  action: AuditAction | string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

function getActionIcon(action: string) {
  switch (action) {
    case AuditAction.CREATE_CONTRACT:
    case AuditAction.CREATE_POWER_CONTRACT:
    case AuditAction.CREATE_LEGAL_DOCUMENT:
    case AuditAction.CREATE_LEGAL_CASE:
    case AuditAction.CREATE_ROLE:
      return FilePlus;

    case AuditAction.UPDATE_CONTRACT:
    case AuditAction.UPDATE_POWER_CONTRACT:
    case AuditAction.UPDATE_LEGAL_DOCUMENT:
    case AuditAction.UPDATE_LEGAL_CASE:
    case AuditAction.UPDATE_ROLE:
      return FileEdit;

    case AuditAction.DELETE_CONTRACT:
    case AuditAction.DELETE_POWER_CONTRACT:
    case AuditAction.DELETE_LEGAL_DOCUMENT:
    case AuditAction.DELETE_LEGAL_CASE:
    case AuditAction.DELETE_ROLE:
    case AuditAction.DELETE_ATTACHMENT:
    case AuditAction.DELETE_POWER_ATTACHMENT:
      return Trash2;

    case AuditAction.UPLOAD_ATTACHMENT:
    case AuditAction.UPLOAD_POWER_ATTACHMENT:
      return Upload;

    case AuditAction.DOWNLOAD_ATTACHMENT:
    case AuditAction.DOWNLOAD_POWER_ATTACHMENT:
      return Download;

    case AuditAction.USER_PERMISSION_CHANGE:
      return Shield;

    default:
      return FileText;
  }
}

export function AuditActionBadge({
  action,
  showIcon = true,
  size = 'md',
}: AuditActionBadgeProps) {
  const info = AUDIT_ACTION_MAP[action] || {
    label: action,
    description: '',
    category: 'ALL',
    color: 'slate',
  };

  const IconComponent = getActionIcon(action);

  const colorStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  }[info.color || 'slate'];

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  const iconSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-lg border ${colorStyles} ${sizeStyles} shadow-2xs`}
      title={info.description || info.label}
    >
      {showIcon && <IconComponent className={iconSize} />}
      <span className="truncate">{info.label}</span>
    </span>
  );
}
