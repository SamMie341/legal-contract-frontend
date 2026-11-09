'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Plus,
  Trash2,
  Clock,
  Headphones,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { SystemContactChannel } from '@core/entities';
import { useContactChannels, useDeleteContactChannel } from '../hooks/use-support';
import { CreateChannelModal } from './create-channel-modal';

interface ContactChannelsCardProps {
  isAdmin?: boolean;
}

export function ContactChannelsCard({ isAdmin }: ContactChannelsCardProps) {
  const { data, isLoading } = useContactChannels();
  const { mutate: deleteChannel, isPending: isDeleting } = useDeleteContactChannel();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const channels: SystemContactChannel[] = data?.data || [];

  const getChannelIcon = (name: string, info: string) => {
    const lower = `${name} ${info}`.toLowerCase();
    if (lower.includes('mail') || lower.includes('@')) {
      return <Mail className="w-4 h-4 text-blue-600" />;
    }
    if (lower.includes('whatsapp') || lower.includes('chat') || lower.includes('line')) {
      return <MessageCircle className="w-4 h-4 text-emerald-600" />;
    }
    return <Phone className="w-4 h-4 text-amber-600" />;
  };

  const getActionLink = (info: string) => {
    const trimmed = info.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (trimmed.includes('@')) {
      return `mailto:${trimmed}`;
    }
    // Assume phone number if it has numbers
    if (/^[+0-9\s-]+$/.test(trimmed)) {
      return `tel:${trimmed.replace(/\s+/g, '')}`;
    }
    return null;
  };

  return (
    <div className="bg-surface rounded-2xl border border-border-line p-5 space-y-4 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              ຊ່ອງທາງຕິດຕໍ່ສາຍດ່ວນ & ທີມງານຊ່ວຍເຫຼືອ (IT Support Channels)
            </h3>
            <p className="text-[11px] text-text-muted">
              ທ່ານສາມາດຕິດຕໍ່ສອບຖາມ ຫຼື ແຈ້ງບັນຫາການນຳໃຊ້ລະບົບໄດ້ຕາມຊ່ອງທາງລຸ່ມນີ້
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-border-line bg-white hover:bg-slate-50 text-primary text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ເພີ່ມຊ່ອງທາງ</span>
          </button>
        )}
      </div>

      {/* Channels Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : channels.length === 0 ? (
        <div className="p-6 text-center text-xs text-text-muted bg-slate-50 rounded-xl border border-dashed border-border-line">
          ຍັງບໍ່ທັນມີຂໍ້ມູນຊ່ອງທາງຕິດຕໍ່ໃນລະບົບ
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {channels.map((channel) => {
            const link = getActionLink(channel.contactInfo);

            return (
              <div
                key={channel.id}
                className="p-3.5 rounded-xl border border-border-line bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-start justify-between gap-2.5 group relative"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                    {getChannelIcon(channel.channelName, channel.contactInfo)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-text-primary truncate">
                      {channel.channelName}
                    </p>
                    {link ? (
                      <a
                        href={link}
                        target={link.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="text-xs font-semibold text-primary hover:underline font-mono truncate block mt-0.5"
                      >
                        {channel.contactInfo}
                      </a>
                    ) : (
                      <p className="text-xs font-semibold text-text-secondary font-mono truncate mt-0.5">
                        {channel.contactInfo}
                      </p>
                    )}
                    {channel.description && (
                      <p className="text-[10px] text-text-muted truncate mt-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span>{channel.description}</span>
                      </p>
                    )}
                  </div>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`ທ່ານຕ້ອງການລົບຊ່ອງທາງ "${channel.channelName}" ແທ້ບໍ່?`)) {
                        deleteChannel(channel.id);
                      }
                    }}
                    disabled={isDeleting}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="ລົບຊ່ອງທາງນີ້"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Add Modal */}
      {isAdmin && (
        <CreateChannelModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  );
}
