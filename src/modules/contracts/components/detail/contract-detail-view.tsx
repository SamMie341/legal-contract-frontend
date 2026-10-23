'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Building2,
  DollarSign,
  Edit,
  Trash2,
  Paperclip,
  History,
  FileText,
  ClockAlert,
  User,
  Share2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useContractDetail } from '../../hooks/use-contracts';
import { ContractStatusBadge } from '../list/contract-status-badge';
import { DeleteContractDialog } from '../list/delete-contract-dialog';
import { ContractAttachmentsCard } from './contract-attachments-card';
import { ContractHistoryCard } from './contract-history-card';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { usePermissions } from '@/presentation/hooks/use-permissions';

interface ContractDetailViewProps {
  id: string;
}

export function ContractDetailView({ id }: ContractDetailViewProps) {
  const router = useRouter();
  const { data: contract, isLoading, isFetching, refetch } = useContractDetail(id);
  const { canEdit, canDelete } = usePermissions();

  const [activeTab, setActiveTab] = useState<'info' | 'attachments' | 'history'>('info');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-10 bg-slate-200/60 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200/60 rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-200/60 rounded-2xl" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface rounded-2xl border border-border-line text-center space-y-4">
        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
        <div>
          <h2 className="text-base font-bold text-text-primary">ບໍ່ພົບຂໍ້ມູນສັນຍາ</h2>
          <p className="text-xs text-text-secondary mt-1">
            ສັນຍາອາດຖືກລົບ ຫຼື ລະຫັດສັນຍາບໍ່ຖືກຕ້ອງ
          </p>
        </div>
        <Link
          href="/contracts"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນໜ້າລາຍການສັນຍາ</span>
        </Link>
      </div>
    );
  }

  const attachmentCount = contract.attachments?.length || contract._count?.attachments || 0;
  const auditLogCount = contract.auditLogs?.length || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <Link
            href="/contracts"
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ກັບໄປລາຍການສັນຍາທັງໝົດ</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-xl border border-primary/20 text-sm">
              {contract.contractNumber}
            </span>
            <ContractStatusBadge status={contract.status} />
            {contract.durationText && (
              <span className="text-xs text-text-muted bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                ອາຍຸສັນຍາ: {contract.durationText}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight mt-2">
            {contract.title}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
            title="ໂຫຼດຂໍ້ມູນໃໝ່"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>

          {canEdit && (
            <Link
              href={`/contracts/${contract.id}/edit`}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-primary text-xs font-semibold shadow-xs transition-all"
            >
              <Edit className="w-4 h-4" />
              <span>ແກ້ໄຂສັນຍາ</span>
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2.5 rounded-xl border border-border-line bg-surface hover:bg-red-50 text-red-600 transition-all shadow-xs"
              title="ລົບສັນຍາ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Value */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ມູນຄ່າສັນຍາ</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-mono font-bold text-text-primary">
            {formatCurrency(contract.contractValue, contract.currency)}
          </p>
          {contract.equityOrCapitalContribution && (
            <p className="text-[11px] text-text-muted truncate">
              ທຶນ: {contract.equityOrCapitalContribution}
            </p>
          )}
        </div>

        {/* Card 2: Contract Type */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ປະເພດສັນຍາ</span>
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs font-bold text-text-primary line-clamp-1" title={contract.contractType?.nameLo}>
            {contract.contractType?.nameLo || `ປະເພດ ${contract.contractTypeId}`}
          </p>
          <p className="text-[10px] text-text-muted truncate">
            {contract.contractType?.nameEn || '-'}
          </p>
        </div>

        {/* Card 3: Timeline */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ໄລຍະເວລາສັນຍາ</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xs font-mono font-bold text-text-primary">
            {formatDate(contract.effectiveDate)}
          </p>
          <p className="text-[11px] font-mono text-text-muted">
            ເຖິງ {formatDate(contract.expirationDate)}
          </p>
        </div>

        {/* Card 4: Implementer */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ຜູ້ຈັດຕັ້ງປະຕິບັດ</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xs font-bold text-text-primary truncate" title={contract.implementer || '-'}>
            {contract.implementer || contract.department?.name || '-'}
          </p>
          {contract.createdBy?.fullName && (
            <p className="text-[10px] text-text-muted truncate">
              ສ້າງໂດຍ: {contract.createdBy.fullName}
            </p>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border-line">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'info'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ລາຍລະອຽດສັນຍາ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('attachments')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'attachments'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Paperclip className="w-4 h-4" />
          <span>ເອກະສານຕິດຄັດ ({attachmentCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <History className="w-4 h-4" />
          <span>ປະຫວັດການດັດແກ້ ({auditLogCount})</span>
        </button>
      </div>

      {/* Tab Content: Info */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* Detailed Info Grid */}
          <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-text-primary pb-3 border-b border-border-line flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>ຂໍ້ມູນທົ່ວໄປ ແລະ ຂໍ້ກຳນົດສັນຍາ</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-xs">
              <div>
                <span className="text-text-muted">ເລກທີສັນຍາ:</span>
                <p className="font-mono font-bold text-primary mt-0.5">{contract.contractNumber}</p>
              </div>

              <div>
                <span className="text-text-muted">ປະເພດສັນຍາ (1 ໃນ 14 ປະເພດ):</span>
                <p className="font-bold text-text-primary mt-0.5">
                  {contract.contractType?.nameLo || '-'}
                </p>
              </div>

              <div>
                <span className="text-text-muted">ສະຖານະປະຈຸບັນ:</span>
                <div className="mt-1">
                  <ContractStatusBadge status={contract.status} />
                </div>
              </div>

              <div>
                <span className="text-text-muted">ມື້ລົງລາຍເຊັນສັນຍາ:</span>
                <p className="font-mono font-bold text-text-primary mt-0.5">
                  {formatDate(contract.signedDate)}
                </p>
              </div>

              <div>
                <span className="text-text-muted">ມື້ເລີ່ມມີຜົນບັງຄັບໃຊ້:</span>
                <p className="font-mono font-bold text-text-primary mt-0.5">
                  {formatDate(contract.effectiveDate)}
                </p>
              </div>

              <div>
                <span className="text-text-muted">ມື້ໝົດອາຍຸສັນຍາ:</span>
                <p className="font-mono font-bold text-text-primary mt-0.5">
                  {formatDate(contract.expirationDate)}
                </p>
              </div>

              <div>
                <span className="text-text-muted">ອາຍຸສັນຍາ:</span>
                <p className="font-bold text-text-primary mt-0.5">
                  {contract.durationText || (contract.durationMonths ? `${contract.durationMonths} ເດືອນ` : '-')}
                </p>
              </div>

              <div>
                <span className="text-text-muted">ແຈ້ງເຕືອນລ່ວງໜ້າກ່ອນໝົດອາຍຸ:</span>
                <p className="font-mono font-bold text-amber-700 mt-0.5">
                  {contract.notifyDaysBefore || 60} ວັນ
                </p>
              </div>

              <div>
                <span className="text-text-muted">ຜູ້ຈັດຕັ້ງປະຕິບັດ:</span>
                <p className="font-bold text-text-primary mt-0.5">{contract.implementer || '-'}</p>
              </div>

              <div>
                <span className="text-text-muted">ມູນຄ່າສັນຍາ:</span>
                <p className="font-mono font-bold text-text-primary mt-0.5">
                  {formatCurrency(contract.contractValue, contract.currency)}
                </p>
              </div>

              <div>
                <span className="text-text-muted">ສັດສ່ວນການປະກອບທຶນ:</span>
                <p className="font-bold text-text-primary mt-0.5">
                  {contract.equityOrCapitalContribution || '-'}
                </p>
              </div>

              <div>
                <span className="text-text-muted">ເປີເຊັນຫຸ້ນ:</span>
                <p className="font-mono font-bold text-text-primary mt-0.5">
                  {contract.sharePercentage ? `${contract.sharePercentage}%` : '-'}
                </p>
              </div>
            </div>

            {/* Additional details note */}
            {contract.additionalDetails && (
              <div className="pt-4 border-t border-border-line">
                <span className="text-xs font-bold text-text-primary">
                  ລາຍລະອຽດ ຫຼື ຈຸດປະສົງສັນຍາຫຍໍ້:
                </span>
                <p className="text-xs text-text-secondary mt-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {contract.additionalDetails}
                </p>
              </div>
            )}

            {/* Creator & Timestamps */}
            <div className="pt-4 border-t border-border-line flex flex-wrap items-center justify-between gap-3 text-[11px] text-text-muted">
              <div>
                ສ້າງໂດຍ: <strong className="text-text-primary">{contract.createdBy?.fullName || '-'}</strong>
                {contract.createdBy?.department && ` (${contract.createdBy.department})`}
              </div>
              <div className="font-mono">
                ວັນທີສ້າງ: {formatDate(contract.createdAt)} • ອັບເດດລ່າສຸດ: {formatDate(contract.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Attachments */}
      {activeTab === 'attachments' && (
        <ContractAttachmentsCard
          contractId={contract.id}
          attachments={contract.attachments}
        />
      )}

      {/* Tab Content: History */}
      {activeTab === 'history' && (
        <ContractHistoryCard auditLogs={contract.auditLogs} />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteContractDialog
        contract={contract}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          router.push('/contracts');
        }}
      />
    </div>
  );
}
