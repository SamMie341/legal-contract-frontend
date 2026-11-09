'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  AlertTriangle,
  Loader2,
  Send,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { TicketPriority, TICKET_PRIORITY_MAP } from '@core/entities';
import { useCreateTicket } from '../hooks/use-support';
import { toast } from 'sonner';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTicketModal({
  isOpen,
  onClose,
}: CreateTicketModalProps) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createTicket, isPending } = useCreateTicket();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size <= 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error('ຂະໜາດໄຟລ໌ຕ້ອງບໍ່ເກີນ 10 MB');
      return;
    }

    setSelectedFile(file);

    // Create preview if it's an image
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error('ກະລຸນາປ້ອນຫົວຂໍ້ ແລະ ລາຍລະອຽດບັນຫາໃຫ້ຄົບຖ້ວນ');
      return;
    }

    createTicket(
      {
        subject: subject.trim(),
        description: description.trim(),
        priority,
        file: selectedFile || undefined,
      },
      {
        onSuccess: () => {
          setSubject('');
          setDescription('');
          setPriority('MEDIUM');
          handleRemoveFile();
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
      <div className="relative w-full max-w-lg bg-surface rounded-2xl border border-border-line shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-line flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                ແຈ້ງບັນຫາ ຫຼື ຂໍປັບປຸງລະບົບ (New Support Ticket)
              </h2>
              <p className="text-[11px] text-text-muted">
                ກະລຸນາລະບຸລາຍລະອຽດບັນຫາເພື່ອໃຫ້ທີມງານໄອທີຊ່ວຍເຫຼືອ
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              ຫົວຂໍ້ບັນຫາ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ເຊັ່ນ: ບໍ່ສາມາດອັບໂຫຼດໄຟລ໌ສັນຍາໄດ້, ເກີດຂໍ້ຜິດພາດໃນໜ້າ..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-line focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all bg-white"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              ລະດັບຄວາມສຳຄັນ (Priority)
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-line focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all bg-white cursor-pointer"
            >
              <option value="LOW">ຕ່ຳ (Low - ຂໍ້ສະເໜີແນະທົ່ວໄປ)</option>
              <option value="MEDIUM">ປານກາງ (Medium - ບັນຫາທົ່ວໄປ)</option>
              <option value="HIGH">ສູງ (High - ລະບົບເຮັດວຽກຜິດພາດ)</option>
              <option value="URGENT">ດ່ວນທີ່ສຸດ (Urgent - ລະບົບໃຊ້ງານບໍ່ໄດ້)</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              ລາຍລະອຽດບັນຫາ <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="ອະທິບາຍຂັ້ນຕອນທີ່ເກີດບັນຫາ ຫຼື ຂໍ້ຄວາມ Error ທີ່ພົບເຫັນ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-line focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all bg-white resize-none"
            />
          </div>

          {/* File Upload / Screenshot */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              ຮູບພາບໜ້າຈໍ ຫຼື ເອກະສານປະກອບ (Screenshot / PDF)
            </label>

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-primary/50 bg-slate-50/60 hover:bg-slate-50 rounded-xl p-4 text-center cursor-pointer transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-500 mx-auto flex items-center justify-center mb-1.5">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-text-primary">
                  ຄລິກເພື່ອອັບໂຫຼດຮູບ Screenshot
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  PNG, JPG, WEBP ຫຼື PDF (ສູງສຸດ 10 MB)
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-border-line bg-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-primary truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-text-muted font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="ຍົກເລີກໄຟລ໌"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Footer buttons */}
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
              disabled={isPending || !subject.trim() || !description.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>ສົ່ງເລື່ອງແຈ້ງບັນຫາ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
