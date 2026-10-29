'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PowerContract, PowerContractType } from '@core/entities';
import { PowerContractStatusBadge } from '../power-contract-status-badge';
import { PowerContractTypeBadge } from '../power-contract-type-badge';
import { formatDate } from '@/utils/formatters';
import { usePermissions } from '@/presentation/hooks';
import {
  Eye,
  Edit2,
  Trash2,
  Zap,
  Calendar,
  MapPin,
  Clock,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';

interface PowerContractTableProps {
  contracts: PowerContract[];
  isLoading: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onDelete?: (contract: PowerContract) => void;
  isDeleting?: boolean;
}

export function PowerContractTable({
  contracts,
  isLoading,
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onDelete,
  isDeleting = false,
}: PowerContractTableProps) {
  const { canEdit, canDelete, canUpload } = usePermissions();
  const [contractToDelete, setContractToDelete] = useState<PowerContract | null>(
    null
  );

  const totalPages = Math.ceil(total / limit) || 1;

  if (isLoading) {
    return (
      <div className="bg-surface rounded-2xl border border-border-line p-8 space-y-4 shadow-xs">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-border-line p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-4">
          <Zap className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-text-primary">
          ບໍ່ພົບລາຍການສັນຍາຊື້-ຂາຍໄຟຟ້າ
        </h3>
        <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
          ຍັງບໍ່ມີຂໍ້ມູນສັນຍາ ຫຼື ບໍ່ພົບຜົນການຄົ້ນຫາທີ່ກົງກັບເງື່ອນໄຂ
        </p>
        {canUpload && (
          <Link
            href="/power-contracts/create"
            className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>+ ສ້າງສັນຍາຊື້-ຂາຍໄຟໃໝ່</span>
          </Link>
        )}
      </div>
    );
  }

  const handleDeleteConfirm = () => {
    if (contractToDelete && onDelete) {
      onDelete(contractToDelete);
      setContractToDelete(null);
    }
  };

  return (
    <>
      <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border-line text-text-secondary uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3.5 px-4">ປະເພດສັນຍາ</th>
                <th className="py-3.5 px-4">ເລກທີ & ຊື່ໂຄງການ</th>
                <th className="py-3.5 px-4">ປະເພດໂຄງການ / ລູກຄ້າ</th>
                <th className="py-3.5 px-4 text-center">ກຳລັງຕິດຕັ້ງ</th>
                <th className="py-3.5 px-4">ລາຄາໄຟຟ້າ</th>
                <th className="py-3.5 px-4">ມື້ສິ້ນສຸດ</th>
                <th className="py-3.5 px-4 text-center">ສະຖານະ</th>
                <th className="py-3.5 px-4 text-right">ຈັດການ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-line">
              {contracts.map((c) => {
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Contract Type Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PowerContractTypeBadge type={c.contractType} />
                    </td>

                    {/* Project Name & Contract Number */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/power-contracts/${c.id}`}
                        className="font-bold text-text-primary hover:text-primary transition-colors block leading-snug"
                      >
                        {c.projectName}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                        <span className="font-mono">
                          {c.contractNumber || 'ບໍ່ມີເລກທີ'}
                        </span>
                        {c.projectLocation && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" />
                              {c.projectLocation}
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Project Type or Customer */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-text-primary">
                        {c.projectTypeOrCustomer}
                      </span>
                      {c.durationText && (
                        <p className="text-[11px] text-text-muted mt-0.5">
                          ອາຍຸ {c.durationText}
                        </p>
                      )}
                    </td>

                    {/* Capacity (MW) */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {c.installedCapacity ||
                      (c.capacityValue !== null && c.capacityValue !== undefined) ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold text-amber-700 bg-amber-50 border border-amber-200">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>
                            {c.installedCapacity ||
                              `${c.capacityValue} ${c.capacityUnit || 'MW'}`}
                          </span>
                        </span>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>

                    {/* Tariff */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-text-primary">
                        {c.tariff ||
                          (c.tariffValue
                            ? `${c.tariffValue} ${c.tariffCurrency || 'USD'}/kWh`
                            : '-')}
                      </span>
                    </td>

                    {/* Expiration Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {c.expirationDate ? (
                        <div className="flex items-center gap-1 text-text-primary font-medium">
                          <Calendar className="w-3.5 h-3.5 text-text-muted" />
                          <span>{formatDate(c.expirationDate)}</span>
                        </div>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <PowerContractStatusBadge status={c.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/power-contracts/${c.id}`}
                          title="ເບິ່ງລາຍລະອຽດ"
                          className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {canEdit && (
                          <Link
                            href={`/power-contracts/${c.id}/edit`}
                            title="ແກ້ໄຂຂໍ້ມູນ"
                            className="p-1.5 rounded-lg text-text-secondary hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => setContractToDelete(c)}
                            title="ລົບສັນຍາ"
                            className="p-1.5 rounded-lg text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Pagination Bar */}
        {totalPages > 1 && onPageChange && (
          <div className="p-4 border-t border-border-line bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
            <div>
              ສະແດງ {(page - 1) * limit + 1} -{' '}
              {Math.min(page * limit, total)} ຈາກທັງໝົດ {total} ລາຍການ
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-semibold text-text-primary">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {contractToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface rounded-2xl border border-border-line p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                ຢືນຢັນການລົບສັນຍາ?
              </h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                ທ່ານຕ້ອງການລົບສັນຍາ{' '}
                <span className="font-bold text-text-primary">
                  {contractToDelete.projectName}
                </span>{' '}
                ແທ້ຫຼືບໍ່? ຂໍ້ມູນຈະຖືກຍ້າຍໄປຖັງຂີ້ເຫຍື້ອ (Soft Delete).
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-line">
              <button
                type="button"
                onClick={() => setContractToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
              >
                ຍົກເລີກ
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>ຢືນຢັນລົບ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
