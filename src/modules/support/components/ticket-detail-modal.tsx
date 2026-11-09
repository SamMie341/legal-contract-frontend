'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Save,
  MessageSquare,
} from 'lucide-react';
import { SupportTicket, TicketStatus, TicketPriority } from '@core/entities';
import { TicketStatusBadge } from './ticket-status-badge';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { formatDate } from '@/utils/formatters';
import { useUpdateTicket } from '../hooks/use-support';
import { supportApi } from '../api/support.api';
import { toast } from 'sonner';

interface TicketDetailModalProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
  isAdmin,
}: TicketDetailModalProps) {
  const [status, setStatus] = useState<TicketStatus>('OPEN');
  const [adminNote, setAdminNote] = useState('');
  const [attachmentBlobUrl, setAttachmentBlobUrl] = useState<string | null>(null);
  const [isLoadingAttachment, setIsLoadingAttachment] = useState(false);

  const { mutate: updateTicket, isPending: isUpdating } = useUpdateTicket();

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setAdminNote(ticket.adminNote || '');

      // If ticket has attachment, load blob
      if (ticket.attachmentUrl) {
        setIsLoadingAttachment(true);
        supportApi
          .getTicketAttachmentBlob(ticket.id)
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setAttachmentBlobUrl(url);
          })
          .catch((err) => {
            console.error('Error fetching ticket attachment:', err);
          })
          .finally(() => {
            setIsLoadingAttachment(false);
          });
      } else {
        setAttachmentBlobUrl(null);
      }
    }

    return () => {
      if (attachmentBlobUrl) {
        URL.revokeObjectURL(attachmentBlobUrl);
      }
    };
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleAdminSave = () => {
    updateTicket(
      {
        id: ticket.id,
        dto: {
          status,
          adminNote: adminNote.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

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
        <div className="px-6 py-4 border-b border-border-line flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <TicketStatusBadge status={ticket.status} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  {ticket.ticketNumber}
                </span>
                <TicketPriorityBadge priority={ticket.priority} size="sm" />
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                ສ້າງເມື່ອ: {formatDate(ticket.createdAt)} ({new Date(ticket.createdAt).toLocaleTimeString('lo-LA')})
              </p>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Subject & Description */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-border-line space-y-2">
            <h3 className="text-sm font-bold text-text-primary">
              {ticket.subject}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Section 2: Reporter & Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Reporter Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1 mb-1">
                <User className="w-3 h-3 text-primary" />
                <span>ຜູ້ແຈ້ງບັນຫາ (Reporter)</span>
              </span>
              <p className="font-bold text-xs text-text-primary truncate">
                {ticket.reportedBy?.fullName || 'ບໍ່ລະບຸຊື່'}
              </p>
              {ticket.reportedBy?.employeeCode && (
                <p className="text-[11px] text-text-muted font-mono truncate">
                  ລະຫັດ: {ticket.reportedBy.employeeCode}
                </p>
              )}
              {ticket.reportedBy?.department && (
                <p className="text-[10px] text-text-secondary truncate flex items-center gap-1 pt-1 border-t border-slate-200/50">
                  <Building className="w-2.5 h-2.5 text-text-muted shrink-0" />
                  <span>{ticket.reportedBy.department}</span>
                </p>
              )}
            </div>

            {/* Contact / Assignee Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>ຜູ້ຮັບຜິດຊອບ (Assignee)</span>
              </span>
              <p className="font-bold text-xs text-text-primary truncate">
                {ticket.assignedTo?.fullName || 'ທີມງານໄອທີສ່ວນກາງ (IT Team)'}
              </p>
              {ticket.resolvedAt && (
                <p className="text-[11px] text-emerald-700 font-semibold truncate pt-1 border-t border-slate-200/50 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ແກ້ໄຂສຳເລັດເມື່ອ: {formatDate(ticket.resolvedAt)}</span>
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Attachment (Screenshot / PDF) */}
          {ticket.attachmentUrl && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span>ໄຟລ໌ຮູບພາບໜ້າຈໍ ຫຼື ເອກະສານປະກອບ</span>
              </h4>

              {isLoadingAttachment ? (
                <div className="h-36 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-text-muted gap-2 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>ກຳລັງໂຫຼດໄຟລ໌ປະກອບ...</span>
                </div>
              ) : attachmentBlobUrl ? (
                <div className="rounded-xl border border-border-line overflow-hidden bg-slate-900 text-center relative group">
                  <img
                    src={attachmentBlobUrl}
                    alt="Ticket Screenshot"
                    className="max-h-72 w-full object-contain mx-auto"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a
                      href={attachmentBlobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-800 text-xs font-semibold hover:bg-white flex items-center gap-1 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>ເປີດເບິ່ງຂະໜາດເຕັມ</span>
                    </a>
                    <a
                      href={attachmentBlobUrl}
                      download={`ticket-${ticket.ticketNumber}-attachment`}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover flex items-center gap-1 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ດາວໂຫຼດ</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-dashed text-xs text-text-muted text-center">
                  ບໍ່ສາມາດສະແດງຕົວຢ່າງໄຟລ໌ໄດ້
                </div>
              )}
            </div>
          )}

          {/* Section 4: Admin Note & Controls */}
          {isAdmin ? (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>ສ່ວນຈັດການສຳລັບຜູ້ດູແລລະບົບ (Admin Controls)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    ປັບປ່ຽນສະຖານະ Ticket
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TicketStatus)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border-line bg-white focus:ring-2 focus:ring-primary/20 outline-hidden font-semibold cursor-pointer"
                  >
                    <option value="OPEN">ລໍຖ້າກວດສອບ (OPEN)</option>
                    <option value="IN_PROGRESS">ກຳລັງແກ້ໄຂ (IN_PROGRESS)</option>
                    <option value="RESOLVED">ແກ້ໄຂສຳເລັດ (RESOLVED)</option>
                    <option value="CLOSED">ປິດເລື່ອງ (CLOSED)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  ບັນທຶກຈາກ Admin (Admin Note / ວິທີແກ້ໄຂບັນຫາ)
                </label>
                <textarea
                  rows={3}
                  placeholder="ລະບຸລາຍລະອຽດການແກ້ໄຂ ຫຼື ຂໍ້ຄວາມຕອບກັບຜູ້ແຈ້ງ..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-line bg-white focus:ring-2 focus:ring-primary/20 outline-hidden resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAdminSave}
                  disabled={isUpdating}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>ບັນທຶກການອັບເດດ</span>
                </button>
              </div>
            </div>
          ) : ticket.adminNote ? (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>ຂໍ້ຄວາມຕອບກັບຈາກຜູ້ດູແລລະບົບ (Admin Note)</span>
              </div>
              <p className="text-xs leading-relaxed whitespace-pre-wrap text-emerald-950">
                {ticket.adminNote}
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border-line flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="text-[11px] text-text-muted font-mono">
            ອັບເດດຫຼ້າສຸດ: {formatDate(ticket.updatedAt)}
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
