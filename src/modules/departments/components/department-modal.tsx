'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, Loader2, CheckCircle2 } from 'lucide-react';
import { Department } from '@core/entities';
import {
  useCreateDepartment,
  useUpdateDepartment,
} from '../hooks/use-departments';

interface DepartmentModalProps {
  isOpen: boolean;
  department: Department | null; // null = create mode, Department = edit mode
  onClose: () => void;
}

export function DepartmentModal({
  isOpen,
  department,
  onClose,
}: DepartmentModalProps) {
  const isEdit = Boolean(department);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isActive, setIsActive] = useState(true);

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (department && isOpen) {
      setName(department.name);
      setCode(department.code || '');
      setIsActive(department.isActive !== false);
    } else {
      setName('');
      setCode('');
      setIsActive(true);
    }
  }, [department, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEdit && department) {
      await updateMutation.mutateAsync({
        id: department.id,
        payload: {
          name: name.trim(),
          code: code.trim() || undefined,
          isActive,
        },
      });
    } else {
      await createMutation.mutateAsync({
        name: name.trim(),
        code: code.trim() || undefined,
        isActive,
      });
    }

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
      <div className="relative w-full max-w-lg bg-surface rounded-2xl border border-border-line shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-line bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                {isEdit ? 'ແກ້ໄຂຫ້ອງການ / ຝ່າຍ' : 'ເພີ່ມຫ້ອງການ / ຝ່າຍໃໝ່'}
              </h2>
              <p className="text-xs text-text-secondary">
                {isEdit
                  ? `ແກ້ໄຂຂໍ້ມູນ: ${department?.name}`
                  : 'ເພີ່ມລາຍການຝ່າຍເຂົ້າສູ່ລະບົບດ້ວຍຕົນເອງ'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              ຊື່ຫ້ອງການ / ຝ່າຍ / ສະຖາບັນ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ຕົວຢ່າງ: ຝ່າຍກົດໝາຍ ແລະ ນິຕິກຳ"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">
              ລະຫັດຫ້ອງການ / ຝ່າຍ (Department Code)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9_-]/g, '')
                )
              }
              placeholder="ຕົວຢ່າງ: LEGAL-DIV"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono font-bold text-text-primary uppercase placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-[10px] text-text-muted mt-1">
              ລະຫັດພາສາອັງກິດສຳລັບອ້າງອີງ ເຊັ່ນ: LEGAL-DIV, CONTRACT-DIV
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-semibold text-text-primary">
                  ເປີດນຳໃຊ້ງານໃນລະບົບ (Active)
                </span>
                <p className="text-[11px] text-text-muted">
                  ຫາກປິດ, ຝ່າຍນີ້ຈະບໍ່ສະແດງໃນ Dropdown ເວລາເລືອກສ້າງສັນຍາ ຫຼື ນິຕິກຳໃໝ່
                </p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border-line">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ກຳລັງບັນທຶກ...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEdit ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມຝ່າຍໃໝ່'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
