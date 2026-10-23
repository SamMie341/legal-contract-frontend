import React from 'react';
import { LegalDocumentStatus } from '@core/entities';

interface DocumentStatusBadgeProps {
  status: LegalDocumentStatus;
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  if (status === LegalDocumentStatus.ACTIVE) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <span>ຍັງນຳໃຊ້ (ACTIVE)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
      <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
      <span>ຖືກຍົກເລີກ (INACTIVE)</span>
    </span>
  );
}
