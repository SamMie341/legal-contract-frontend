'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { LegalDocument } from '@core/entities';
import { useDeleteDocument } from '../../hooks/use-documents';

interface DeleteDocumentDialogProps {
  document: LegalDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteDocumentDialog({
  document,
  isOpen,
  onClose,
}: DeleteDocumentDialogProps) {
  const deleteMutation = useDeleteDocument();

  if (!isOpen || !document) return null;

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(document.id);
      onClose();
    } catch {
      // Error handled in hook toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-border-line shadow-2xl p-6 z-10 animate-fadeIn">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              ຢືນຢັນການລົບບັນທຶກນິຕິກຳ
            </h3>
            <p className="text-xs text-text-secondary">
              ການລົບຈະເປັນການປິດການນຳໃຊ້ (Soft Delete)
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-text-secondary bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <p>ທ່ານຕ້ອງການລົບນິຕິກຳສະບັບນີ້ແທ້ຫຼືບໍ່?</p>
          <div className="pt-2 border-t border-slate-200/80 space-y-1">
            <p className="font-semibold text-text-primary">
              <span className="text-text-muted font-normal">ຫົວຂໍ້:</span> {document.docTitle}
            </p>
            <p className="font-semibold text-text-primary">
              <span className="text-text-muted font-normal">ເລກທີ/ວັນທີ:</span>{' '}
              <span className="font-mono">{document.docNumberDate}</span>
            </p>
            {document.department?.name && (
              <p className="font-semibold text-text-primary">
                <span className="text-text-muted font-normal">ຫ້ອງການ/ຝ່າຍ:</span>{' '}
                {document.department.name}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="px-4 py-2.5 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
          >
            ຍົກເລີກ
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {deleteMutation.isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            <span>ຢືນຢັນການລົບ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
