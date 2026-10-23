'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  FilePlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Scale,
  LayoutDashboard,
} from 'lucide-react';
import { LegalDocument, DocumentType, LegalDocumentStatus } from '@core/entities';
import { useDocumentsList } from '../../hooks/use-documents';
import { useDepartmentsList } from '@/presentation/hooks/use-departments';
import { DocumentFiltersBar } from './document-filters-bar';
import { DocumentTable } from './document-table';
import { DeleteDocumentDialog } from './delete-document-dialog';
import { usePermissions } from '@/presentation/hooks/use-permissions';

export function DocumentsListView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [docType, setDocType] = useState<DocumentType | undefined>(undefined);
  const [status, setStatus] = useState<LegalDocumentStatus | undefined>(undefined);
  const [departmentId, setDepartmentId] = useState<string | undefined>(undefined);
  const [issueYear, setIssueYear] = useState<number | undefined>(undefined);

  const [documentToDelete, setDocumentToDelete] = useState<LegalDocument | null>(null);

  const { canUpload } = usePermissions();
  const { data: departments = [] } = useDepartmentsList();

  const { data, isLoading, isFetching, refetch } = useDocumentsList({
    page,
    limit: 10,
    search: search.trim() || undefined,
    docType,
    status,
    departmentId,
    issueYear,
  });

  const documents = data?.data || [];
  const meta = data?.pagination || data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleResetFilters = () => {
    setSearch('');
    setDocType(undefined);
    setStatus(undefined);
    setDepartmentId(undefined);
    setIssueYear(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Scale className="w-4 h-4" />
            <span>2. ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ (Legal Affairs Division)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
            ຄຸ້ມຄອງນິຕິກຳ ແລະ ລະບຽບການ
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ຕິດຕາມ, ຄົ້ນຫາ ແລະ ຄຸ້ມຄອງບັນດາກົດລະບຽບ, ຂໍ້ກຳນົດ, ຂໍ້ຕົກລົງ ແລະ ແຈ້ງການຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
            title="ໂຫຼດຂໍ້ມູນໃໝ່"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/legal-documents/dashboard"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border-line bg-white hover:bg-slate-50 text-xs font-semibold text-text-primary shadow-xs transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-600" />
            <span>ສະຖິຕິ Dashboard</span>
          </Link>

          {canUpload && (
            <Link
              href="/legal-documents/create"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all"
            >
              <FilePlus className="w-4 h-4" />
              <span>ເພີ່ມນິຕິກຳໃໝ່</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <DocumentFiltersBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        docType={docType}
        onDocTypeChange={(val) => {
          setDocType(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        departmentId={departmentId}
        onDepartmentChange={(val) => {
          setDepartmentId(val);
          setPage(1);
        }}
        issueYear={issueYear}
        onIssueYearChange={(val) => {
          setIssueYear(val);
          setPage(1);
        }}
        departments={departments}
        onReset={handleResetFilters}
      />

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-text-muted px-1">
        <span>
          ພົບນິຕິກຳທັງໝົດ: <strong className="text-text-primary">{meta.total}</strong> ສະບັບ
        </span>
        {isFetching && !isLoading && (
          <span className="text-[11px] text-primary flex items-center gap-1.5 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> ກຳລັງອັບເດດຂໍ້ມູນ...
          </span>
        )}
      </div>

      {/* Documents Data Table */}
      <DocumentTable
        documents={documents}
        isLoading={isLoading}
        onDeleteDocument={(d) => setDocumentToDelete(d)}
      />

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs text-text-secondary">
          <p>
            ສະແດງໜ້າ <span className="font-bold text-text-primary">{meta.page}</span> ຈາກທັງໝົດ{' '}
            <span className="font-bold text-text-primary">{meta.totalPages}</span> ໜ້າ
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-border-line bg-surface hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-surface border border-border-line font-bold">
              {meta.page}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
              disabled={page >= meta.totalPages}
              className="p-2 rounded-xl border border-border-line bg-surface hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Soft Delete Dialog */}
      <DeleteDocumentDialog
        document={documentToDelete}
        isOpen={Boolean(documentToDelete)}
        onClose={() => setDocumentToDelete(null)}
      />
    </div>
  );
}
