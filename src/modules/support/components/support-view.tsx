'use client';

import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  RefreshCw,
  Send,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { SupportTicket, TicketStatus } from '@core/entities';
import { usePermissions } from '@/presentation/hooks';
import { useSupportTickets } from '../hooks/use-support';
import { ContactChannelsCard } from './contact-channels-card';
import { SupportTicketsTable } from './support-tickets-table';
import { CreateTicketModal } from './create-ticket-modal';
import { TicketDetailModal } from './ticket-detail-modal';

export function SupportView() {
  const { isAdmin } = usePermissions();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const queryParams = {
    page,
    limit,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  };

  const { data, isLoading, refetch, isFetching } = useSupportTickets(queryParams);

  const tickets = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit, totalPages: 1 };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              ສູນຊ່ວຍເຫຼືອ & ແຈ້ງບັນຫາລະບົບ (Help & Support)
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              ຊ່ອງທາງຕິດຕໍ່ສາຍດ່ວນ IT ແລະ ລະບົບສົ່ງຄຳຮ້ອງຂໍປັບປຸງ/ແກ້ໄຂບັນຫາລະບົບ (ຂໍ້ 6)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-50 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="ໂຫຼດຂໍ້ມູນໃໝ່"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? 'animate-spin text-primary' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover shadow-xs text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ແຈ້ງບັນຫາໃໝ່ (New Ticket)</span>
          </button>
        </div>
      </div>

      {/* 1. Contact Channels Card */}
      <ContactChannelsCard isAdmin={isAdmin} />

      {/* 2. Tickets Section Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-primary">
              {isAdmin
                ? 'ລາຍການແຈ້ງບັນຫາທັງໝົດໃນລະບົບ (All Support Tickets)'
                : 'ປະຫວັດການແຈ້ງບັນຫາຂອງຂ້ອຍ (My Support Tickets)'}
            </h2>
            <p className="text-[11px] text-text-muted">
              {isAdmin
                ? 'ທ່ານກຳລັງເບິ່ງໃນຖານະຜູ້ດູແລລະບົບ ສາມາດປັບປ່ຽນສະຖານະ ແລະ ຕອບກັບບັນຫາໄດ້'
                : 'ຕິດຕາມສະຖານະການກວດສອບ ແລະ ການແກ້ໄຂບັນຫາຈາກທີມງານໄອທີ'}
            </p>
          </div>
        </div>

        {/* Tickets Table */}
        <SupportTicketsTable
          tickets={tickets}
          isLoading={isLoading}
          page={page}
          totalPages={meta.totalPages}
          total={meta.total}
          onPageChange={(p) => setPage(p)}
          statusFilter={statusFilter}
          onStatusFilterChange={(s) => {
            setStatusFilter(s);
            setPage(1);
          }}
          onViewTicket={(t) => setSelectedTicket(t)}
          isAdmin={isAdmin}
        />
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        isAdmin={isAdmin}
      />
    </div>
  );
}
