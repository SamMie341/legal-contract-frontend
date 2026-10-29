'use client';

import React from 'react';
import Link from 'next/link';
import { PowerContract, PowerContractType } from '@core/entities';
import { PowerContractStatusBadge } from '../power-contract-status-badge';
import { PowerContractTypeBadge } from '../power-contract-type-badge';
import { formatDate } from '@/utils/formatters';
import { usePermissions } from '@/presentation/hooks';
import {
  Zap,
  Edit2,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  User,
  ShieldCheck,
  Building,
  Paperclip,
  ExternalLink,
} from 'lucide-react';

interface PowerContractInfoProps {
  contract: PowerContract;
  onNavigateToAttachments?: () => void;
}

export function PowerContractInfo({ contract, onNavigateToAttachments }: PowerContractInfoProps) {
  const { canEdit } = usePermissions();

  return (
    <div className="space-y-6">
      {/* Header Banner Card */}
      <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <PowerContractTypeBadge type={contract.contractType} />
              <PowerContractStatusBadge status={contract.status} />
              {contract.contractNumber && (
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  {contract.contractNumber}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              {contract.projectName}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">
                {contract.projectTypeOrCustomer}
              </span>
              {contract.projectLocation && (
                <span className="flex items-center gap-1 text-text-muted">
                  <MapPin className="w-3.5 h-3.5" />
                  {contract.projectLocation}
                </span>
              )}
            </div>
          </div>

          {canEdit && (
            <Link
              href={`/power-contracts/${contract.id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <Edit2 className="w-4 h-4" />
              <span>ແກ້ໄຂສັນຍາ</span>
            </Link>
          )}
        </div>
      </div>

      {/* Grid: 2 Columns for Detailed Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Power Capacity & Commercial Terms */}
        <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border-line/70">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-text-primary">
              ກຳລັງການຕິດຕັ້ງ ແລະ ລາຄາໄຟຟ້າ (Commercial Terms)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-text-muted font-medium">ກຳລັງຕິດຕັ້ງ</p>
              <p className="text-sm font-bold text-text-primary mt-1">
                {contract.installedCapacity ||
                  (contract.capacityValue
                    ? `${contract.capacityValue} ${contract.capacityUnit || 'MW'}`
                    : '-')}
              </p>
            </div>

            <div>
              <p className="text-text-muted font-medium">ຄ່າກຳລັງຕົວເລກ (MW)</p>
              <p className="text-sm font-bold text-amber-600 mt-1">
                {contract.capacityValue !== null && contract.capacityValue !== undefined
                  ? `${contract.capacityValue} MW`
                  : '-'}
              </p>
            </div>

            <div>
              <p className="text-text-muted font-medium">ລາຄາໄຟຟ້າ (Tariff)</p>
              <p className="text-sm font-bold text-text-primary mt-1">
                {contract.tariff ||
                  (contract.tariffValue
                    ? `${contract.tariffValue} ${contract.tariffCurrency || 'USD'}/kWh`
                    : '-')}
              </p>
            </div>

            <div>
              <p className="text-text-muted font-medium">ສະກຸນເງິນລາຄາໄຟ</p>
              <p className="text-sm font-bold text-text-primary mt-1">
                {contract.tariffCurrency || 'USD'}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-text-muted font-medium">
                {contract.contractType === PowerContractType.PURCHASE
                  ? 'ປະເພດໂຄງການຜະລິດ'
                  : 'ລູກຄ້າ / ຜູ້ຊື້ໄຟ'}
              </p>
              <p className="text-sm font-semibold text-text-primary mt-1">
                {contract.projectTypeOrCustomer}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Dates */}
        <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border-line/70">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-text-primary">
              ໄລຍະເວລາ ແລະ ກຳນົດສັນຍາ
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-text-muted font-medium">ອາຍຸສັນຍາ</p>
              <p className="text-sm font-bold text-text-primary mt-1">
                {contract.durationText ||
                  (contract.durationMonths
                    ? `${contract.durationMonths} ເດືອນ`
                    : '-')}
              </p>
            </div>

            <div>
              <p className="text-text-muted font-medium">ແຈ້ງເຕືອນລ່ວງໜ້າ</p>
              <p className="text-sm font-bold text-amber-700 mt-1">
                {contract.notifyDaysBefore || 60} ວັນ
              </p>
            </div>

            <div>
              <p className="text-text-muted font-medium">ມື້ລົງລາຍເຊັນ</p>
              <p className="text-sm font-semibold text-text-primary mt-1">
                {formatDate(contract.signedDate)}
              </p>
            </div>

            <div>
              <p className="text-text-muted font-medium">ມື້ມີຜົນບັງຄັບໃຊ້</p>
              <p className="text-sm font-semibold text-text-primary mt-1">
                {formatDate(contract.effectiveDate)}
              </p>
            </div>

            <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-border-line flex items-center justify-between">
              <div>
                <p className="text-text-muted text-[11px] font-medium">
                  ມື້ສິ້ນສຸດສັນຍາ (Expiration Date)
                </p>
                <p className="text-base font-black text-text-primary mt-0.5">
                  {formatDate(contract.expirationDate)}
                </p>
              </div>
              <PowerContractStatusBadge status={contract.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      {contract.additionalDetails && (
        <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-text-primary">
            ລາຍລະອຽດເພີ່ມເຕີມ / ໝາຍເຫດ
          </h3>
          <p className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
            {contract.additionalDetails}
          </p>
        </div>
      )}

      {/* Attachments Section Summary */}
      <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-line/70">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-text-primary">
              ເອກະສານຕິດຄັດ / ໄຟລ໌ແນບສັນຍາ ({contract.attachments?.length || 0})
            </h3>
          </div>
          {onNavigateToAttachments && (
            <button
              type="button"
              onClick={onNavigateToAttachments}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-line hover:bg-slate-50 text-xs font-semibold text-primary transition-colors"
            >
              <span>ຈັດການໄຟລ໌ແນບທັງໝົດ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {contract.attachments && contract.attachments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contract.attachments.slice(0, 4).map((att) => (
              <div
                key={att.id}
                onClick={onNavigateToAttachments}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-border-line hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-white border border-border-line text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                      {att.fileName}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {att.fileSize ? `${(att.fileSize / 1024).toFixed(1)} KB` : 'ໄຟລ໌ແນບ'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-border-line text-center space-y-2">
            <p className="text-xs text-text-secondary">
              ຍັງບໍ່ທັນມີເອກະສານຕິດຄັດສຳລັບສັນຍານີ້
            </p>
            {onNavigateToAttachments && (
              <button
                type="button"
                onClick={onNavigateToAttachments}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>+ ຄລິກເພື່ອອັບໂຫຼດໄຟລ໌ແນບ</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Audit Meta Footer */}
      <div className="p-4 rounded-xl bg-slate-50/70 border border-border-line text-[11px] text-text-muted flex flex-wrap items-center justify-between gap-2">
        <span>
          ສ້າງເມື່ອ: {formatDate(contract.createdAt)} ໂດຍ{' '}
          {contract.createdBy?.fullName || 'ຜູ້ໃຊ້ງານລະບົບ'} (
          {contract.createdBy?.employeeCode || '-'})
        </span>
        <span>ອັບເດດລ່າສຸດ: {formatDate(contract.updatedAt)}</span>
      </div>
    </div>
  );
}
