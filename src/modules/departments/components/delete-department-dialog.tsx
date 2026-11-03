'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Department } from '@core/entities';
import { useDeleteDepartment } from '../hooks/use-departments';

interface DeleteDepartmentDialogProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteDepartmentDialog({
  department,
  isOpen,
  onClose,
}: DeleteDepartmentDialogProps) {
  const deleteMutation = useDeleteDepartment();

  if (!isOpen || !department) return null;

  const docCount = department._count?.legalDocuments ?? 0;
  const caseCount = department._count?.legalCases ?? 0;
  const hasUsage = docCount > 0 || caseCount > 0;

  const handleDelete = async () => {
    if (hasUsage) return;
    await deleteMutation.mutateAsync(department.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-surface rounded-2xl border border-border-line shadow-2xl p-6 overflow-hidden animate-fadeIn">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-text-primary">
              ຢືນຢັນການລົບຫ້ອງການ / ຝ່າຍ
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບຝ່າຍ{' '}
              <strong className="text-text-primary">&quot;{department.name}&quot;</strong>{' '}
              ອອກຈາກລະບົບ?
            </p>

            {hasUsage && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                <p className="font-bold">⚠️ ບໍ່ສາມາດລົບຝ່າຍນີ້ໄດ້</p>
                <p className="mt-0.5">
                  ມີນິຕິກຳ ({docCount} ສະບັບ) ຫຼື ສຳນວນຄະດີ ({caseCount} ເລື່ອງ) ຜູກມັດຢູ່ກັບຝ່າຍນີ້.
                  ກະລຸນາປ່ຽນສະຖານະເປັນ &quot;ປິດນຳໃຊ້&quot; ແທນການລົບ.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
          >
            ຍົກເລີກ
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || hasUsage}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ກຳລັງລົບ...</span>
              </>
            ) : (
              <span>ຢືນຢັນລົບ</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
