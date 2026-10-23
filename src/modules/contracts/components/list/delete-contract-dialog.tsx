'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Contract } from '@core/entities';
import { useDeleteContract } from '../../hooks/use-contracts';
import { formatCurrency } from '@/utils/formatters';

interface DeleteContractDialogProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteContractDialog({
  contract,
  isOpen,
  onClose,
}: DeleteContractDialogProps) {
  const deleteMutation = useDeleteContract();

  if (!isOpen || !contract) return null;

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(contract.id);
      onClose();
    } catch {
      // Error is handled in useDeleteContract with toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-border-line shadow-2xl p-6 z-10 animate-fadeIn">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              ຢືນຢັນການລົບສັນຍາ
            </h3>
            <p className="text-xs text-text-secondary">
              ການລົບຈະເປັນການປິດການນຳໃຊ້ສັນຍາ (Soft Delete)
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-text-secondary bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <p>
            ທ່ານຕ້ອງການລົບສັນຍາສະບັບນີ້ອອກຈາກລະບົບແທ້ຫຼືບໍ່?
          </p>
          <div className="pt-2 border-t border-slate-200/80 space-y-1">
            <p className="font-semibold text-text-primary">
              <span className="text-text-muted font-normal">ເລກທີສັນຍາ:</span>{' '}
              <span className="font-mono text-primary font-bold">{contract.contractNumber}</span>
            </p>
            <p className="font-semibold text-text-primary">
              <span className="text-text-muted font-normal">ຊື່ສັນຍາ:</span>{' '}
              {contract.title}
            </p>
            {contract.contractValue && (
              <p className="font-semibold text-text-primary">
                <span className="text-text-muted font-normal">ມູນຄ່າສັນຍາ:</span>{' '}
                <span className="font-mono font-bold text-emerald-700">
                  {formatCurrency(contract.contractValue, contract.currency)}
                </span>
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
