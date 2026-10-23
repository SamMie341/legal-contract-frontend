'use client';

import React from 'react';
import Link from 'next/link';
import {
  Scale,
  Building2,
  Calendar,
  Paperclip,
  Eye,
  Trash2,
} from 'lucide-react';
import { LegalCase, Currency } from '@core/entities';
import { CaseStatusBadge } from './case-status-badge';
import { CaseTypeBadge } from './case-type-badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { usePermissions } from '@/presentation/hooks/use-permissions';

interface CaseTableProps {
  cases: LegalCase[];
  isLoading: boolean;
  onDeleteCase: (c: LegalCase) => void;
}

export function CaseTable({
  cases,
  isLoading,
  onDeleteCase,
}: CaseTableProps) {
  const { canDelete } = usePermissions();

  if (isLoading) {
    return (
      <div className="p-6 bg-surface rounded-2xl border border-border-line space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-slate-200/60 rounded-xl" />
        ))}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="p-16 bg-surface rounded-2xl border border-border-line text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-text-muted">
          <Scale className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-text-primary mb-1">
          ບໍ່ພົບຂໍ້ມູນສຳນວນຄະດີ
        </p>
        <p className="text-xs text-text-secondary max-w-sm mx-auto">
          ບໍ່ພົບລາຍການຄະດີທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ ຫຼື ຕົວກັ່ນຕອງ. ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ລ້າງຕົວກັ່ນຕອງ.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 border-b border-border-line text-text-secondary uppercase tracking-wider text-[11px] font-bold">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">ລະຫັດ & ຈຳເລີຍ</th>
              <th className="py-3.5 px-4">ປະເພດຄະດີ</th>
              <th className="py-3.5 px-4">ຫ້ອງການ / ຝ່າຍ</th>
              <th className="py-3.5 px-4 text-right">ຍອດຕ້ອງຊຳລະ</th>
              <th className="py-3.5 px-4 text-right">ເກັບກູ້ຄືນໄດ້</th>
              <th className="py-3.5 px-4 text-center">ວັນທີເລີ່ມ</th>
              <th className="py-3.5 px-4 text-center">ເອກະສານ</th>
              <th className="py-3.5 px-4 text-center">ຂັ້ນສານ / ສະຖານະ</th>
              <th className="py-3.5 px-4 text-right">ຈັດການ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-line">
            {cases.map((c, index) => {
              const caseId = c.internalId || c.id || c.caseCode;
              const attachmentCount =
                c._count?.attachments ?? c.attachments?.length ?? 0;

              return (
                <tr
                  key={caseId || `case-${index}`}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Column 1: Code & Defendant */}
                  <td className="py-3.5 px-4 sm:px-6 max-w-xs">
                    <div className="space-y-1">
                      <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 text-xs">
                        {c.caseCode}
                      </span>
                      <Link
                        href={`/legal-cases/${caseId}`}
                        className="font-bold text-text-primary hover:text-primary transition-colors line-clamp-1 block mt-1"
                        title={c.defendant}
                      >
                        {c.defendant}
                      </Link>
                      {c.allegation && (
                        <p className="text-[10px] text-text-muted line-clamp-1">
                          {c.allegation}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Column 2: Case Type */}
                  <td className="py-3.5 px-4">
                    <CaseTypeBadge type={c.caseType} />
                  </td>

                  {/* Column 3: Department */}
                  <td className="py-3.5 px-4 max-w-[160px]">
                    <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                      <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="truncate" title={c.department?.name || '-'}>
                        {c.department?.name || '-'}
                      </span>
                    </div>
                  </td>

                  {/* Column 4: Total Due */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="space-y-0.5 font-mono text-[11px]">
                      {c.totalDueLak > 0 && (
                        <p className="font-bold text-text-primary">
                          {formatCurrency(c.totalDueLak, Currency.LAK)}
                        </p>
                      )}
                      {c.totalDueUsd > 0 && (
                        <p className="font-bold text-emerald-700">
                          {formatCurrency(c.totalDueUsd, Currency.USD)}
                        </p>
                      )}
                      {!c.totalDueLak && !c.totalDueUsd && (
                        <span className="text-text-muted">-</span>
                      )}
                    </div>
                  </td>

                  {/* Column 5: Recovered */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="space-y-0.5 font-mono text-[11px]">
                      {c.recoveredLak > 0 && (
                        <p className="font-bold text-emerald-600">
                          {formatCurrency(c.recoveredLak, Currency.LAK)}
                        </p>
                      )}
                      {c.recoveredUsd > 0 && (
                        <p className="font-bold text-emerald-600">
                          {formatCurrency(c.recoveredUsd, Currency.USD)}
                        </p>
                      )}
                      {!c.recoveredLak && !c.recoveredUsd && (
                        <span className="text-text-muted">-</span>
                      )}
                    </div>
                  </td>

                  {/* Column 6: Date */}
                  <td className="py-3.5 px-4 text-center font-mono text-text-secondary text-[11px]">
                    {formatDate(c.date)}
                  </td>

                  {/* Column 7: Attachments */}
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/legal-cases/${caseId}?tab=attachments`}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium transition-all ${
                        attachmentCount > 0
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default'
                      }`}
                      title={attachmentCount > 0 ? `ກົດເພື່ອເບິ່ງ ${attachmentCount} ໄຟລ໌ແນບ` : 'ບໍ່ມີໄຟລ໌ແນບ'}
                    >
                      <Paperclip className="w-3 h-3" />
                      <span>{attachmentCount}</span>
                    </Link>
                  </td>

                  {/* Column 8: Status */}
                  <td className="py-3.5 px-4 text-center">
                    <CaseStatusBadge status={c.disputeStatus} />
                  </td>

                  {/* Column 9: Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/legal-cases/${caseId}`}
                        className="px-2.5 py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-primary font-semibold text-[11px] flex items-center gap-1 transition-all"
                        title="ເບິ່ງລາຍລະອຽດ"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ເບິ່ງ</span>
                      </Link>

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => onDeleteCase(c)}
                          className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-red-50 text-red-600 transition-all"
                          title="ລົບສຳນວນຄະດີ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
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
