'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { User } from '@core/entities';
import { useDeleteUser } from '../hooks/use-users';

interface DeleteUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteUserDialog({
  user,
  isOpen,
  onClose,
}: DeleteUserDialogProps) {
  const deleteMutation = useDeleteUser();

  if (!isOpen || !user) return null;

  const handleConfirmDelete = async () => {
    await deleteMutation.mutateAsync(user.id);
    onClose();
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
              ຢືນຢັນການລົບບັນຊີຜູ້ໃຊ້
            </h3>
            <p className="text-xs text-text-secondary">
              ການລົບຈະເປັນການປິດການນຳໃຊ້ບັນຊີ (Soft Delete)
            </p>
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          ທ່ານຕ້ອງການລົບບັນຊີຂອງ <span className="font-bold text-text-primary">{user.fullName}</span> (ລະຫັດ: <span className="font-mono">{user.employeeCode}</span>) ອອກຈາກລະບົບແທ້ຫຼືບໍ່?
        </p>

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
