'use client';

import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  useHrmDepartmentsPreview,
  useSyncDepartments,
} from '../hooks/use-departments';

interface HrmSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HrmSyncModal({ isOpen, onClose }: HrmSyncModalProps) {
  const [search, setSearch] = useState('');
  const { data: hrmData, isLoading: isLoadingPreview, refetch } = useHrmDepartmentsPreview(isOpen);
  const syncMutation = useSyncDepartments();

  if (!isOpen) return null;

  const departments = hrmData?.data || [];
  const total = hrmData?.total ?? departments.length;

  const filtered = departments.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.code?.toLowerCase().includes(q)
    );
  });

  const alreadyCount = departments.filter((d) => d.alreadyInSystem).length;
  const newCount = departments.length - alreadyCount;

  const handleSync = async () => {
    await syncMutation.mutateAsync();
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
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-surface rounded-2xl border border-border-line shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-line flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                ຊິ້ງຂໍ້ມູນຫ້ອງການ / ຝ່າຍ ຈາກ HRM (EDL HRM Sync)
              </h2>
              <p className="text-xs text-text-secondary">
                ດຶງລາຍຊື່ຝ່າຍ ແລະ ລະຫັດສັງກັດທັງໝົດຈາກລະບົບ HRM ຂອງ ຟຟລ
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-border-line text-center">
              <p className="text-[11px] text-text-muted">ພົບໃນ HRM</p>
              <p className="text-lg font-extrabold text-text-primary mt-0.5">
                {isLoadingPreview ? '...' : total}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
              <p className="text-[11px] text-emerald-700 font-semibold">ຝ່າຍໃໝ່ທີ່ຈະເພີ່ມ</p>
              <p className="text-lg font-extrabold text-emerald-700 mt-0.5">
                {isLoadingPreview ? '...' : newCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-center">
              <p className="text-[11px] text-blue-700 font-semibold">ມີໃນລະບົບແລ້ວ (ຈະອັບເດດ)</p>
              <p className="text-lg font-extrabold text-blue-700 mt-0.5">
                {isLoadingPreview ? '...' : alreadyCount}
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ຄົ້ນຫາຊື່ຝ່າຍ ຫຼື ລະຫັດໃນ HRM..."
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-border-line rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Preview List Table */}
          <div className="border border-border-line rounded-xl overflow-hidden max-h-72 overflow-y-auto shadow-2xs">
            {isLoadingPreview ? (
              <div className="p-8 text-center text-xs text-text-muted space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                <p>ກຳລັງເຊື່ອມຕໍ່ ແລະ ດຶງຂໍ້ມູນຈາກ EDL HRM API...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted">
                ບໍ່ພົບລາຍການທີ່ຄົ້ນຫາ
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 sticky top-0 border-b border-border-line text-text-secondary text-[11px] font-bold">
                  <tr>
                    <th className="py-2.5 px-3">ຊື່ຝ່າຍໃນ HRM</th>
                    <th className="py-2.5 px-3">ລະຫັດ</th>
                    <th className="py-2.5 px-3 text-center">ສະຖານະໃນ HRM</th>
                    <th className="py-2.5 px-3 text-right">ສະຖານະລະບົບ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-line bg-white">
                  {filtered.map((item, idx) => (
                    <tr key={item.departmentId || idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-semibold text-text-primary">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-text-muted">
                        {item.code || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                            <CheckCircle className="w-3 h-3" /> ເປີດ
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">ປິດ</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {item.alreadyInSystem ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            ມີແລ້ວ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Sparkles className="w-3 h-3" /> ໃໝ່
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border-line flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoadingPreview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPreview ? 'animate-spin' : ''}`} />
            <span>ໂຫຼດຂໍ້ມູນໃໝ່</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={syncMutation.isPending}
              className="px-4 py-2 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="button"
              onClick={handleSync}
              disabled={syncMutation.isPending || isLoadingPreview || total === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              {syncMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ກຳລັງ Sync...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>ເລີ່ມ Sync ທັງໝົດ ({total} ຝ່າຍ)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
