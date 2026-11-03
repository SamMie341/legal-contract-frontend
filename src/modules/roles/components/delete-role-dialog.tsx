'use client';

import React from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { RoleItem } from '@core/entities';
import { useDeleteRole } from '../hooks/use-roles';

interface DeleteRoleDialogProps {
  role: RoleItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteRoleDialog({ role, isOpen, onClose }: DeleteRoleDialogProps) {
  const deleteMutation = useDeleteRole();

  if (!isOpen || !role) return null;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(role.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface w-full max-w-md rounded-2xl border border-border-line shadow-2xl p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1.5">
          <h3 className="text-base font-bold text-text-primary">
            ຢືນຢັນການລົບບົດບາດ?
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບບົດບາດ{' '}
            <span className="font-bold text-text-primary">
              &quot;{role.title || role.name}&quot;
            </span>{' '}
            ({role.name})? ການດຳເນີນການນີ້ບໍ່ສາມາດກູ້ຄືນໄດ້.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="flex-1 py-2.5 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
          >
            ຍົກເລີກ
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>ຢືນຢັນການລົບ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
