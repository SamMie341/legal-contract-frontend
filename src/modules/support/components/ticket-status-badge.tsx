'use client';

import React from 'react';
import { TicketStatus, TICKET_STATUS_MAP } from '@core/entities';
import { Clock, Loader2, CheckCircle2, CheckSquare } from 'lucide-react';

interface TicketStatusBadgeProps {
  status: TicketStatus | string;
  size?: 'sm' | 'md';
}

export function TicketStatusBadge({
  status,
  size = 'md',
}: TicketStatusBadgeProps) {
  const info =
    TICKET_STATUS_MAP[status as TicketStatus] || {
      label: status,
      bgClass: 'bg-slate-100',
      textClass: 'text-slate-600',
      borderClass: 'border-slate-200',
    };

  const renderIcon = () => {
    switch (status) {
      case 'OPEN':
        return <Clock className="w-3 h-3 text-amber-600 shrink-0" />;
      case 'IN_PROGRESS':
        return <Loader2 className="w-3 h-3 text-blue-600 animate-spin shrink-0" />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />;
      case 'CLOSED':
        return <CheckSquare className="w-3 h-3 text-slate-500 shrink-0" />;
      default:
        return <Clock className="w-3 h-3 shrink-0" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${
        info.bgClass
      } ${info.textClass} ${info.borderClass} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {renderIcon()}
      <span>{info.label}</span>
    </span>
  );
}
