'use client';

import React, { useState } from 'react';
import { X, Plus, Phone, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { useCreateContactChannel } from '../hooks/use-support';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateChannelModal({
  isOpen,
  onClose,
}: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  const { mutate: createChannel, isPending } = useCreateContactChannel();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim() || !contactInfo.trim()) return;

    createChannel(
      {
        channelName: channelName.trim(),
        contactInfo: contactInfo.trim(),
        description: description.trim() || undefined,
        sortOrder: Number(sortOrder) || 0,
        isActive: true,
      },
      {
        onSuccess: () => {
          setChannelName('');
          setContactInfo('');
          setDescription('');
          setSortOrder(0);
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
      <div className="relative w-full max-w-md bg-surface rounded-2xl border border-border-line shadow-2xl overflow-hidden animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-line flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                ເພີ່ມຊ່ອງທາງຕິດຕໍ່ໃໝ່
              </h2>
              <p className="text-[11px] text-text-muted">
                ກຳນົດຊ່ອງທາງຕິດຕໍ່ສຳລັບຜູ້ໃຊ້ງານທົ່ວໄປ
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              ຊື່ຊ່ອງທາງຕິດຕໍ່ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ເຊັ່ນ: ຝ່າຍໄອທີ, ສາຍດ່ວນແຈ້ງບັນຫາ, WhatsApp"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-line focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              ຂໍ້ມູນຕິດຕໍ່ (ເບີໂທ, ອີເມວ, ຫຼື ລິ້ງ) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ເຊັ່ນ: 021-XXXXXX, it-support@edl.com.la, ຫຼື ລິ້ງ"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-line focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              ຄຳອະທິບາຍ ຫຼື ເວລາເຮັດວຽກ
            </label>
            <input
              type="text"
              placeholder="ເຊັ່ນ: ເປີດບໍລິການ ວັນຈັນ-ວັນສຸກ 08:00 - 16:30 ໂມງ"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-line focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              ລຳດັບການສະແດງຜົນ (Sort Order)
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-line focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border-line text-text-secondary hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={isPending || !channelName.trim() || !contactInfo.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>ບັນທຶກຊ່ອງທາງ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
