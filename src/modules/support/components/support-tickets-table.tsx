'use client';

import React, { useState } from 'react';
import {
  Clock,
  Eye,
  User,
  Building,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { SupportTicket, TicketStatus } from '@core/entities';
import { TicketStatusBadge } from './ticket-status-badge';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { formatDate } from '@/utils/formatters';

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (newPage: number) => void;
  statusFilter: TicketStatus | 'ALL';
  onStatusFilterChange: (status: TicketStatus | 'ALL') => void;
  onViewTicket: (ticket: SupportTicket) => void;
  isAdmin?: boolean;
}

export function SupportTicketsTable({
  tickets,
  isLoading,
  page,
  totalPages,
  total,
  onPageChange,
  statusFilter,
  onStatusFilterChange,
  onViewTicket,
  isAdmin,
}: SupportTicketsTableProps) {
  const statusTabs: Array<{ id: TicketStatus | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'ທັງໝົດ' },
    { id: 'OPEN', label: 'ລໍຖ້າກວດສອບ' },
    { id: 'IN_PROGRESS', label: 'ກຳລັງແກ້ໄຂ' },
    { id: 'RESOLVED', label: 'ແກ້ໄຂແລ້ວ' },
    { id: 'CLOSED', label: 'ປິດເລື່ອງ' },
  ];

  return (
    <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden space-y-0">
      {/* Table Subheader: Filter Tabs */}
      <div className="p-4 border-b border-border-line bg-slate-50/60 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white text-text-secondary hover:bg-slate-100 border border-border-line'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-text-muted font-medium">
          ລວມທັງໝົດ: <span className="font-bold text-text-primary">{total}</span> ລາຍການ
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="p-6 space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        /* Empty State */
        <div className="p-14 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-text-primary">
            ບໍ່ພົບລາຍການແຈ້ງບັນຫາ
          </p>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            {statusFilter === 'ALL'
              ? 'ຍັງບໍ່ມີປະຫວັດການແຈ້ງບັນຫາ ຫຼື ຂໍ້ສະເໜີປັບປຸງໃນລະບົບ'
              : 'ບໍ່ພົບລາຍການທີ່ມີສະຖານະທີ່ເລືອກ'}
          </p>
        </div>
      ) : (
        /* Table Content */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-border-line text-text-secondary uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Ticket Number</th>
                <th className="py-3 px-4">ຫົວຂໍ້ບັນຫາ</th>
                <th className="py-3 px-4">ຄວາມສຳຄັນ</th>
                <th className="py-3 px-4">ສະຖານະ</th>
                <th className="py-3 px-4">ຜູ້ແຈ້ງ</th>
                <th className="py-3 px-4">ວັນທີແຈ້ງ</th>
                <th className="py-3 px-4 text-right">ລາຍລະອຽດ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-line">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Ticket Number */}
                  <td className="py-3.5 px-4 font-mono font-bold text-primary whitespace-nowrap">
                    {ticket.ticketNumber}
                  </td>

                  {/* Subject */}
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <p
                      className="font-bold text-text-primary truncate max-w-sm"
                      title={ticket.subject}
                    >
                      {ticket.subject}
                    </p>
                    <p className="text-[11px] text-text-muted truncate max-w-sm">
                      {ticket.description}
                    </p>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <TicketPriorityBadge priority={ticket.priority} size="sm" />
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <TicketStatusBadge status={ticket.status} size="sm" />
                  </td>

                  {/* Reporter */}
                  <td className="py-3.5 px-4 min-w-[140px]">
                    <p className="font-semibold text-text-primary truncate">
                      {ticket.reportedBy?.fullName || 'ບໍ່ລະບຸຊື່'}
                    </p>
                    {ticket.reportedBy?.department && (
                      <p className="text-[10px] text-text-muted truncate">
                        {ticket.reportedBy.department}
                      </p>
                    )}
                  </td>

                  {/* Created At */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-medium text-text-primary">
                      {formatDate(ticket.createdAt)}
                    </p>
                    <p className="text-[10px] text-text-muted font-mono">
                      {new Date(ticket.createdAt).toLocaleTimeString('lo-LA')}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onViewTicket(ticket)}
                      className="px-2.5 py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-primary font-semibold text-[11px] inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>ເບິ່ງ</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3.5 border-t border-border-line bg-slate-50/60 flex items-center justify-between text-xs">
          <span className="text-text-muted">
            ໜ້າ <span className="font-bold text-text-primary">{page}</span> ຈາກທັງໝົດ{' '}
            <span className="font-bold text-text-primary">{totalPages}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
