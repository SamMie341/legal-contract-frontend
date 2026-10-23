'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  User,
  Link as LinkIcon,
  Paperclip,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useDocumentDetail } from '../../hooks/use-documents';
import { DocumentStatusBadge } from './document-status-badge';
import { DocumentTypeBadge } from './document-type-badge';
import { DocumentAttachmentsCard } from './document-attachments-card';
import { DeleteDocumentDialog } from './delete-document-dialog';
import { formatDate } from '@/utils/formatters';
import { usePermissions } from '@/presentation/hooks/use-permissions';

interface DocumentDetailViewProps {
  id: string;
}

export function DocumentDetailView({ id }: DocumentDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { data: document, isLoading, isFetching, refetch } = useDocumentDetail(id);
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

  if (!document) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface rounded-2xl border border-border-line text-center space-y-4">
        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
        <div>
          <h2 className="text-base font-bold text-text-primary">ບໍ່ພົບຂໍ້ມູນນິຕິກຳ</h2>
          <p className="text-xs text-text-secondary mt-1">
            ນິຕິກຳອາດຖືກລົບ ຫຼື ລະຫັດບໍ່ຖືກຕ້ອງ
          </p>
        </div>
        <Link
          href="/legal-documents"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນໜ້າລາຍການນິຕິກຳ</span>
        </Link>
      </div>
    );
  }

  const attachmentCount = document.attachments?.length || document._count?.attachments || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <Link
            href="/legal-documents"
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ກັບໄປລາຍການນິຕິກຳທັງໝົດ</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <DocumentTypeBadge type={document.docType} />
            <DocumentStatusBadge status={document.status} />
            <span className="text-xs text-text-muted font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              ປີ: {document.issueYear}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight mt-2">
            {document.docTitle}
          </h1>
          <p className="text-xs font-mono text-text-secondary mt-0.5">
            {document.docNumberDate}
          </p>
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
              href={`/legal-documents/${document.id}/edit`}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-primary text-xs font-semibold shadow-xs transition-all"
            >
              <Edit className="w-4 h-4" />
              <span>ແກ້ໄຂນິຕິກຳ</span>
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2.5 rounded-xl border border-border-line bg-surface hover:bg-red-50 text-red-600 transition-all shadow-xs"
              title="ລົບບັນທຶກນິຕິກຳ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Type */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ປະເພດນິຕິກຳ</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="pt-1">
            <DocumentTypeBadge type={document.docType} />
          </div>
        </div>

        {/* Card 2: Number & Date */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ເລກທີ / ວັນທີອອກ</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xs font-mono font-bold text-text-primary truncate" title={document.docNumberDate}>
            {document.docNumberDate}
          </p>
          <p className="text-[10px] text-text-muted">ປີອອກ: {document.issueYear}</p>
        </div>

        {/* Card 3: Department */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ຫ້ອງການ/ຝ່າຍຮັບຜິດຊອບ</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xs font-bold text-text-primary truncate" title={document.department?.name || '-'}>
            {document.department?.name || '-'}
          </p>
          <p className="text-[10px] text-text-muted">ລະຫັດ: {document.department?.code || '-'}</p>
        </div>

        {/* Card 4: Responsible Person */}
        <div className="p-4 bg-surface rounded-2xl border border-border-line shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ຜູ້ຮັບຜິດຊອບ</span>
            <User className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-text-primary truncate" title={document.responsiblePerson || '-'}>
            {document.responsiblePerson || '-'}
          </p>
          {document.createdBy?.fullName && (
            <p className="text-[10px] text-text-muted truncate">
              ສ້າງໂດຍ: {document.createdBy.fullName}
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
          <FileText className="w-4 h-4" />
          <span>ລາຍລະອຽດນິຕິກຳ</span>
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
        <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-text-primary pb-3 border-b border-border-line">
            ຂໍ້ມູນລະອຽດຂອງນິຕິກຳ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs">
            <div>
              <span className="text-text-muted">ຫົວຂໍ້ເຕັມ:</span>
              <p className="font-bold text-text-primary mt-0.5">{document.docTitle}</p>
            </div>

            <div>
              <span className="text-text-muted">ເລກທີ ແລະ ວັນທີອອກນິຕິກຳ:</span>
              <p className="font-mono font-bold text-primary mt-0.5">{document.docNumberDate}</p>
            </div>

            <div>
              <span className="text-text-muted">ປະເພດນິຕິກຳ:</span>
              <div className="mt-1">
                <DocumentTypeBadge type={document.docType} />
              </div>
            </div>

            <div>
              <span className="text-text-muted">ສະຖານະ:</span>
              <div className="mt-1">
                <DocumentStatusBadge status={document.status} />
              </div>
            </div>

            <div>
              <span className="text-text-muted">ຫ້ອງການ / ຝ່າຍທີ່ຮັບຜິດຊອບ:</span>
              <p className="font-bold text-text-primary mt-0.5">
                {document.department?.name || '-'} ({document.department?.code || '-'})
              </p>
            </div>

            <div>
              <span className="text-text-muted">ຜູ້ຮັບຜິດຊອບ / ຜູ້ປະສານງານ:</span>
              <p className="font-bold text-text-primary mt-0.5">
                {document.responsiblePerson || '-'}
              </p>
            </div>

            <div>
              <span className="text-text-muted">ປີອອກນິຕິກຳ:</span>
              <p className="font-mono font-bold text-text-primary mt-0.5">
                {document.issueYear}
              </p>
            </div>

            {document.externalUrl && (
              <div>
                <span className="text-text-muted">ລິ້ງພາຍນອກ (Cloud / SharePoint):</span>
                <p className="mt-0.5">
                  <a
                    href={document.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-primary hover:underline inline-flex items-center gap-1 truncate max-w-full"
                  >
                    <span>{document.externalUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Purpose / Summary */}
          {document.purpose && (
            <div className="pt-4 border-t border-border-line">
              <span className="text-xs font-bold text-text-primary">
                ຈຸດປະສົງ ຫຼື ເນື້ອໃນຫຍໍ້:
              </span>
              <p className="text-xs text-text-secondary mt-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed whitespace-pre-wrap">
                {document.purpose}
              </p>
            </div>
          )}

          {/* Timestamps & Creator */}
          <div className="pt-4 border-t border-border-line flex flex-wrap items-center justify-between gap-3 text-[11px] text-text-muted">
            <div>
              ສ້າງໂດຍ: <strong className="text-text-primary">{document.createdBy?.fullName || '-'}</strong>
            </div>
            <div className="font-mono">
              ວັນທີສ້າງ: {formatDate(document.createdAt)} • ອັບເດດລ່າສຸດ: {formatDate(document.updatedAt)}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Attachments */}
      {activeTab === 'attachments' && (
        <DocumentAttachmentsCard
          documentId={document.id}
          attachments={document.attachments}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDocumentDialog
        document={document}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          router.push('/legal-documents');
        }}
      />
    </div>
  );
}
