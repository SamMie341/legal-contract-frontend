'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Calendar,
  Paperclip,
  Eye,
  Trash2,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { Contract } from '@core/entities';
import { ContractStatusBadge } from './contract-status-badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { usePermissions } from '@/presentation/hooks/use-permissions';

interface ContractTableProps {
  contracts: Contract[];
  isLoading: boolean;
  onDeleteContract: (contract: Contract) => void;
}

export function ContractTable({
  contracts,
  isLoading,
  onDeleteContract,
}: ContractTableProps) {
  const { canDelete, canView } = usePermissions();

  if (isLoading) {
    return (
      <div className="p-6 bg-surface rounded-2xl border border-border-line space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-slate-200/60 rounded-xl" />
        ))}
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="p-16 bg-surface rounded-2xl border border-border-line text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-text-muted">
          <FileText className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-text-primary mb-1">
          ບໍ່ພົບຂໍ້ມູນສັນຍາ
        </p>
        <p className="text-xs text-text-secondary max-w-sm mx-auto">
          ບໍ່ພົບລາຍການສັນຍາທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ ຫຼື ຕົວກັ່ນຕອງ. ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ລ້າງຕົວກັ່ນຕອງ.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-slate-100/70 border-b border-border-line text-text-secondary uppercase tracking-wider text-[11px] font-bold">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">ເລກທີ & ຊື່ສັນຍາ</th>
              <th className="py-3.5 px-4">ປະເພດສັນຍາ</th>
              <th className="py-3.5 px-4">ຜູ້ຈັດຕັ້ງປະຕິບັດ</th>
              <th className="py-3.5 px-4 text-right">ມູນຄ່າສັນຍາ</th>
              <th className="py-3.5 px-4">ໄລຍະເວລາສັນຍາ</th>
              <th className="py-3.5 px-4 text-center">ເອກະສານ</th>
              <th className="py-3.5 px-4 text-center">ສະຖານະ</th>
              <th className="py-3.5 px-4 text-right">ຈັດການ</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border-line">
            {contracts.map((contract) => {
              const attachmentCount =
                contract._count?.attachments ?? contract.attachments?.length ?? 0;
              const typeName =
                contract.contractType?.nameLo ||
                contract.contractType?.name ||
                `ປະເພດ ${contract.contractTypeId}`;
              const implementerName =
                contract.implementer ||
                contract.department?.name ||
                '-';

              return (
                <tr
                  key={contract.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Column 1: Number & Title */}
                  <td className="py-3.5 px-4 sm:px-6 max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20 text-xs">
                          {contract.contractNumber}
                        </span>
                        {contract.durationText && (
                          <span className="text-[10px] text-text-muted font-medium">
                            ({contract.durationText})
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/contracts/${contract.id}`}
                        className="font-bold text-text-primary hover:text-primary transition-colors line-clamp-2 leading-snug block"
                        title={contract.title}
                      >
                        {contract.title}
                      </Link>
                      {contract.createdBy?.fullName && (
                        <p className="text-[10px] text-text-muted">
                          ສ້າງໂດຍ: {contract.createdBy.fullName}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Column 2: Contract Type */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <span
                      className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-text-secondary text-[11px] font-medium truncate max-w-full"
                      title={typeName}
                    >
                      {typeName}
                    </span>
                  </td>

                  {/* Column 3: Implementer / Department */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                      <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="truncate max-w-[160px]" title={implementerName}>
                        {implementerName}
                      </span>
                    </div>
                  </td>

                  {/* Column 4: Contract Value */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono font-bold text-xs text-text-primary">
                      {formatCurrency(contract.contractValue, contract.currency)}
                    </span>
                  </td>

                  {/* Column 5: Duration / Dates */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                      <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <div>
                        <p className="font-mono">
                          {formatDate(contract.effectiveDate)}
                        </p>
                        <p className="font-mono text-text-muted text-[10px]">
                          ເຖິງ {formatDate(contract.expirationDate)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 6: Attachments */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                        attachmentCount > 0
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      <Paperclip className="w-3 h-3" />
                      <span>{attachmentCount}</span>
                    </span>
                  </td>

                  {/* Column 7: Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <ContractStatusBadge status={contract.status} />
                  </td>

                  {/* Column 8: Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/contracts/${contract.id}`}
                        className="px-2.5 py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-primary font-semibold text-[11px] flex items-center gap-1 transition-all"
                        title="ເບິ່ງລາຍລະອຽດສັນຍາ"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ເບິ່ງ</span>
                      </Link>

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => onDeleteContract(contract)}
                          className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-red-50 text-red-600 transition-all"
                          title="ລົບສັນຍາ"
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
