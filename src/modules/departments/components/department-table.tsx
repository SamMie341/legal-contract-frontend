'use client';

import React from 'react';
import { Department } from '@core/entities';
import {
  Building2,
  FileText,
  Scale,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Lock,
} from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface DepartmentTableProps {
  departments: Department[];
  isLoading: boolean;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}

export function DepartmentTable({
  departments,
  isLoading,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  if (isLoading) {
    return (
      <div className="p-6 bg-surface rounded-2xl border border-border-line space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-slate-200/60 rounded-xl" />
        ))}
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="p-12 bg-surface rounded-2xl border border-border-line text-center text-xs text-text-muted">
        <p className="text-sm font-semibold text-text-primary mb-1">
          ບໍ່ພົບລາຍການຫ້ອງການ / ຝ່າຍ
        </p>
        <p>ກະລຸນາກວດສອບຄຳຄົ້ນຫາ, ກົດປຸ່ມເພີ່ມຝ່າຍໃໝ່ ຫຼື Sync ຂໍ້ມູນຈາກ HRM</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 border-b border-border-line text-text-secondary uppercase tracking-wider text-[11px] font-bold">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">ຊື່ຫ້ອງການ / ຝ່າຍ (Department)</th>
              <th className="py-3.5 px-4">ລະຫັດຝ່າຍ (Code)</th>
              <th className="py-3.5 px-4 text-center">ເອກະສານ & ຄະດີຜູກມັດ</th>
              <th className="py-3.5 px-4 text-center">ສະຖານະ</th>
              <th className="py-3.5 px-4">ວັນທີສ້າງ</th>
              <th className="py-3.5 px-4 text-right">ຈັດການ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-line">
            {departments.map((dept) => {
              const docCount = dept._count?.legalDocuments ?? 0;
              const caseCount = dept._count?.legalCases ?? 0;
              const hasUsage = docCount > 0 || caseCount > 0;
              const isActive = dept.isActive !== false;

              return (
                <tr key={dept.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Column 1: Name */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary text-sm">
                          {dept.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Code */}
                  <td className="py-3.5 px-4">
                    {dept.code ? (
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        {dept.code}
                      </span>
                    ) : (
                      <span className="text-[11px] text-text-muted italic">-</span>
                    )}
                  </td>

                  {/* Column 3: Usage Count */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          docCount > 0
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-50 text-slate-400'
                        }`}
                        title={`ນິຕິກຳທີ່ກ່ຽວຂ້ອງ: ${docCount} ສະບັບ`}
                      >
                        <FileText className="w-3 h-3" />
                        <span>{docCount}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          caseCount > 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-50 text-slate-400'
                        }`}
                        title={`ຄະດີ/ຂໍ້ຂັດແຍ່ງທີ່ກ່ຽວຂ້ອງ: ${caseCount} ເລື່ອງ`}
                      >
                        <Scale className="w-3 h-3" />
                        <span>{caseCount}</span>
                      </span>
                    </div>
                  </td>

                  {/* Column 4: Status */}
                  <td className="py-3.5 px-4 text-center">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>ເປີດນຳໃຊ້</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <XCircle className="w-3 h-3 text-slate-400" />
                        <span>ປິດນຳໃຊ້</span>
                      </span>
                    )}
                  </td>

                  {/* Column 5: Created Date */}
                  <td className="py-3.5 px-4 text-text-secondary text-[11px]">
                    {dept.createdAt ? formatDate(dept.createdAt) : '-'}
                  </td>

                  {/* Column 6: Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(dept)}
                        className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-text-secondary hover:text-primary transition-all"
                        title="ແກ້ໄຂຂໍ້ມູນຝ່າຍ"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(dept)}
                        disabled={hasUsage}
                        className={`p-1.5 rounded-lg border transition-all ${
                          hasUsage
                            ? 'border-border-line text-slate-300 bg-slate-50 cursor-not-allowed opacity-50'
                            : 'border-border-line bg-white hover:bg-red-50 text-red-600'
                        }`}
                        title={
                          hasUsage
                            ? `ບໍ່ສາມາດລົບໄດ້ ເນື່ອງຈາກມີນິຕິກຳ (${docCount}) ຫຼື ຄະດີ (${caseCount}) ຜູກມັດຢູ່`
                            : 'ລົບຫ້ອງການ/ຝ່າຍ'
                        }
                      >
                        {hasUsage ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
