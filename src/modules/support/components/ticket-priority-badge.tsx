'use client';

import React from 'react';
import { TicketPriority, TICKET_PRIORITY_MAP } from '@core/entities';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

interface TicketPriorityBadgeProps {
  priority: TicketPriority | string;
  size?: 'sm' | 'md';
}

export function TicketPriorityBadge({
  priority,
  size = 'md',
}: TicketPriorityBadgeProps) {
  const info =
    TICKET_PRIORITY_MAP[priority as TicketPriority] || {
      label: priority,
      bgClass: 'bg-slate-100',
      textClass: 'text-slate-600',
      borderClass: 'border-slate-200',
    };

  const renderIcon = () => {
    switch (priority) {
      case 'URGENT':
        return <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />;
      case 'HIGH':
        return <ArrowUp className="w-3 h-3 text-amber-600 shrink-0" />;
      case 'MEDIUM':
        return <AlertCircle className="w-3 h-3 text-blue-600 shrink-0" />;
      case 'LOW':
        return <ArrowDown className="w-3 h-3 text-slate-500 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold border ${
        info.bgClass
      } ${info.textClass} ${info.borderClass} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      {renderIcon()}
      <span>{info.label}</span>
    </span>
  );
}
