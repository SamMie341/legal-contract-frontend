'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Scale,
  Building2,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  Paperclip,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useCaseDetail } from '../../hooks/use-cases';
import { CaseStatusBadge } from './case-status-badge';
import { CaseTypeBadge } from './case-type-badge';
import { CaseAttachmentsCard } from './case-attachments-card';
import { DeleteCaseDialog } from './delete-case-dialog';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Currency } from '@core/entities';
import { usePermissions } from '@/presentation/hooks/use-permissions';

interface CaseDetailViewProps {
  id: string;
}

export function CaseDetailView({ id }: CaseDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { data: legalCase, isLoading, isFetching, refetch } = useCaseDetail(id);
  const { canEdit, canDelete } = usePermissions();

  const [activeTab, setActiveTab] = useState<'info' | 'attachments'>('info');

  useEffect(() => {
    if (tabParam === 'attachments') {
      setActiveTab('attachments');
    }
  }, [tabParam]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
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

  if (!legalCase) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface rounded-2xl border border-border-line text-center space-y-4">
        <Scale className="w-12 h-12 text-slate-300 mx-auto" />
        <div>
          <h2 className="text-base font-bold text-text-primary">ບໍ່ພົບຂໍ້ມູນສຳນວນຄະດີ</h2>
          <p className="text-xs text-text-secondary mt-1">
            ສຳນວນຄະດີອາດຖືກລົບ ຫຼື ລະຫັດບໍ່ຖືກຕ້ອງ
          </p>
        </div>
        <Link
          href="/legal-cases"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນໜ້າລາຍການຄະດີ</span>
        </Link>
      </div>
    );
  }

  const attachmentCount = legalCase.attachments?.length || legalCase._count?.attachments || 0;
  const caseId = legalCase.internalId || legalCase.id || legalCase.caseCode;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <Link
            href="/legal-cases"
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ກັບໄປລາຍການສຳນວນຄະດີທັງໝົດ</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-xl border border-primary/20 text-sm">
              {legalCase.caseCode}
            </span>
            <CaseTypeBadge type={legalCase.caseType} />
            <CaseStatusBadge status={legalCase.disputeStatus} />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight mt-2">
            {legalCase.defendant}
          </h1>
          {legalCase.allegation && (
            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
              ຂໍ້ກ່າວຫາ: {legalCase.allegation}
            </p>
          )}
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
              href={`/legal-cases/${caseId}/edit`}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-primary text-xs font-semibold shadow-xs transition-all"
            >
              <Edit className="w-4 h-4" />
              <span>ແກ້ໄຂຄະດີ</span>
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2.5 rounded-xl border border-border-line bg-surface hover:bg-red-50 text-red-600 transition-all shadow-xs"
              title="ລົບສຳນວນຄະດີ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Due */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ຍອດລວມທີ່ຕ້ອງຊຳລະ</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-sm font-bold text-text-primary space-y-0.5">
            <p>{formatCurrency(legalCase.totalDueLak, Currency.LAK)}</p>
            {legalCase.totalDueUsd > 0 && (
              <p className="text-xs text-emerald-700">
                {formatCurrency(legalCase.totalDueUsd, Currency.USD)}
              </p>
            )}
          </div>
        </div>

        {/* Card 2: Recovered */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ຍອດເກັບກູ້ຄືນໄດ້</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-mono text-sm font-bold text-emerald-600 space-y-0.5">
            <p>{formatCurrency(legalCase.recoveredLak, Currency.LAK)}</p>
            {legalCase.recoveredUsd > 0 && (
              <p className="text-xs">{formatCurrency(legalCase.recoveredUsd, Currency.USD)}</p>
            )}
          </div>
        </div>

        {/* Card 3: Department */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ຫ້ອງການ / ຝ່າຍກ່ຽວຂ້ອງ</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xs font-bold text-text-primary truncate" title={legalCase.department?.name || '-'}>
            {legalCase.department?.name || '-'}
          </p>
          <p className="text-[10px] text-text-muted">ລະຫັດ: {legalCase.department?.code || '-'}</p>
        </div>

        {/* Card 4: Date */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ວັນທີເລີ່ມຕົ້ນຄະດີ</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xs font-mono font-bold text-text-primary">
            {formatDate(legalCase.date)}
          </p>
          {legalCase.createdBy?.fullName && (
            <p className="text-[10px] text-text-muted truncate">
              ບັນທຶກໂດຍ: {legalCase.createdBy.fullName}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
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
          <Scale className="w-4 h-4" />
          <span>ລາຍລະອຽດສຳນວນຄະດີ</span>
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
      </div>

      {/* Tab Content: Info */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* Section A: Case & Court Details */}
          <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-text-primary pb-3 border-b border-border-line flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>ຂໍ້ມູນຄະດີ ແລະ ຂັ້ນຕອນການດຳເນີນຄະດີ</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-xs">
              <div>
                <span className="text-text-muted">ລະຫັດຄະດີ:</span>
                <p className="font-mono font-bold text-primary mt-0.5">{legalCase.caseCode}</p>
              </div>

              <div>
                <span className="text-text-muted">ຊື່ຈຳເລີຍ / ຄູ່ກໍລະນີ:</span>
                <p className="font-bold text-text-primary mt-0.5">{legalCase.defendant}</p>
              </div>

              <div>
                <span className="text-text-muted">ປະເພດຄະດີ:</span>
                <div className="mt-1">
                  <CaseTypeBadge type={legalCase.caseType} />
                </div>
              </div>

              <div>
                <span className="text-text-muted">ຂັ້ນສານ / ສະຖານະ:</span>
                <div className="mt-1">
                  <CaseStatusBadge status={legalCase.disputeStatus} />
                </div>
              </div>

              <div>
                <span className="text-text-muted">ວັນທີເລີ່ມຕົ້ນຄະດີ:</span>
                <p className="font-mono font-bold text-text-primary mt-0.5">
                  {formatDate(legalCase.date)}
                </p>
              </div>

              <div>
                <span className="text-text-muted">ຫ້ອງການ / ຝ່າຍທີ່ກ່ຽວຂ້ອງ:</span>
                <p className="font-bold text-text-primary mt-0.5">
                  {legalCase.department?.name || '-'}
                </p>
              </div>

              {legalCase.externalUrl && (
                <div className="lg:col-span-3">
                  <span className="text-text-muted">ລິ້ງພາຍນອກ (Cloud / SharePoint):</span>
                  <p className="mt-0.5">
                    <a
                      href={legalCase.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-primary hover:underline inline-flex items-center gap-1 truncate max-w-full"
                    >
                      <span>{legalCase.externalUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Allegation & Department Action */}
            {legalCase.allegation && (
              <div className="pt-3 border-t border-border-line">
                <span className="text-xs font-bold text-text-primary">
                  ຂໍ້ກ່າວຫາ / ເນື້ອໃນຫຍໍ້:
                </span>
                <p className="text-xs text-text-secondary mt-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {legalCase.allegation}
                </p>
              </div>
            )}

            {legalCase.disputeProgress && (
              <div className="pt-3 border-t border-border-line">
                <span className="text-xs font-bold text-text-primary">
                  ຄວາມຄືບໜ້າຄະດີ / ຂັ້ນຕອນການໄຕ່ສວນ:
                </span>
                <p className="text-xs text-text-secondary mt-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {legalCase.disputeProgress}
                </p>
              </div>
            )}
          </div>

          {/* Section B: Financial Breakdown Table */}
          <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-text-primary pb-3 border-b border-border-line flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>ຕາຕະລາງແຍກມູນຄ່າຄວາມເສຍຫາຍ & ການເງິນ</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-100/70 border-b border-border-line font-bold text-text-secondary">
                  <tr>
                    <th className="py-2.5 px-4 text-left">ລາຍການ</th>
                    <th className="py-2.5 px-4 text-right">ສະກຸນເງິນກີບ (LAK)</th>
                    <th className="py-2.5 px-4 text-right">ສະກຸນເງິນໂດລາ (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-line font-mono">
                  <tr>
                    <td className="py-3 px-4 font-sans font-medium text-text-primary">
                      1. ມູນຄ່າຄວາມເສຍຫາຍ (Damage)
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-text-primary">
                      {formatCurrency(legalCase.damageLak, Currency.LAK)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-text-primary">
                      {formatCurrency(legalCase.damageUsd, Currency.USD)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-sans font-medium text-text-primary">
                      2. ຄ່າປັບໃໝ (Fine)
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-700">
                      {formatCurrency(legalCase.fineLak, Currency.LAK)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-700">
                      {formatCurrency(legalCase.fineUsd, Currency.USD)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-3 px-4 font-sans text-primary">
                      ລວມຍອດທີ່ຕ້ອງຊຳລະ (Total Due)
                    </td>
                    <td className="py-3 px-4 text-right text-primary text-sm">
                      {formatCurrency(legalCase.totalDueLak, Currency.LAK)}
                    </td>
                    <td className="py-3 px-4 text-right text-primary text-sm">
                      {formatCurrency(legalCase.totalDueUsd, Currency.USD)}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/50 text-emerald-700 font-bold">
                    <td className="py-3 px-4 font-sans">
                      ຍອດເກັບກູ້ຄືນໄດ້ຕົວຈິງ (Recovered)
                    </td>
                    <td className="py-3 px-4 text-right text-sm">
                      {formatCurrency(legalCase.recoveredLak, Currency.LAK)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm">
                      {formatCurrency(legalCase.recoveredUsd, Currency.USD)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Creator & Timestamps */}
            <div className="pt-4 border-t border-border-line flex flex-wrap items-center justify-between gap-3 text-[11px] text-text-muted">
              <div>
                ສ້າງໂດຍ: <strong className="text-text-primary">{legalCase.createdBy?.fullName || '-'}</strong>
              </div>
              <div className="font-mono">
                ວັນທີສ້າງ: {formatDate(legalCase.createdAt)} • ອັບເດດລ່າສຸດ: {formatDate(legalCase.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Attachments */}
      {activeTab === 'attachments' && (
        <CaseAttachmentsCard
          caseId={caseId}
          attachments={legalCase.attachments}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteCaseDialog
        legalCase={legalCase}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          router.push('/legal-cases');
        }}
      />
    </div>
  );
}
