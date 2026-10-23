'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Building2,
  User,
  Paperclip,
  Eye,
  Trash2,
  Calendar,
} from 'lucide-react';
import { LegalDocument } from '@core/entities';
import { DocumentStatusBadge } from './document-status-badge';
import { DocumentTypeBadge } from './document-type-badge';
import { usePermissions } from '@/presentation/hooks/use-permissions';

interface DocumentTableProps {
  documents: LegalDocument[];
  isLoading: boolean;
  onDeleteDocument: (doc: LegalDocument) => void;
}

export function DocumentTable({
  documents,
  isLoading,
  onDeleteDocument,
}: DocumentTableProps) {
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

  if (documents.length === 0) {
    return (
      <div className="p-16 bg-surface rounded-2xl border border-border-line text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-text-muted">
          <FileText className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-text-primary mb-1">
          ບໍ່ພົບຂໍ້ມູນນິຕິກຳ
        </p>
        <p className="text-xs text-text-secondary max-w-sm mx-auto">
          ບໍ່ພົບລາຍການນິຕິກຳທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ ຫຼື ຕົວກັ່ນຕອງ. ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ລ້າງຕົວກັ່ນຕອງ.
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
              <th className="py-3.5 px-4 sm:px-6">ຫົວຂໍ້ & ເລກທີນິຕິກຳ</th>
              <th className="py-3.5 px-4">ປະເພດ</th>
              <th className="py-3.5 px-4">ຫ້ອງການ / ຝ່າຍ</th>
              <th className="py-3.5 px-4">ຜູ້ຮັບຜິດຊອບ</th>
              <th className="py-3.5 px-4 text-center">ປີອອກ</th>
              <th className="py-3.5 px-4 text-center">ເອກະສານ</th>
              <th className="py-3.5 px-4 text-center">ສະຖານະ</th>
              <th className="py-3.5 px-4 text-right">ຈັດການ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-line">
            {documents.map((doc, index) => {
              const attachmentCount =
                doc._count?.attachments ?? doc.attachments?.length ?? 0;

              return (
                <tr
                  key={doc.id || `doc-${index}`}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Column 1: Title & Number */}
                  <td className="py-3.5 px-4 sm:px-6 max-w-xs sm:max-w-sm">
                    <div className="space-y-1">
                      <Link
                        href={`/legal-documents/${doc.id}`}
                        className="font-bold text-text-primary hover:text-primary transition-colors line-clamp-2 leading-snug"
                        title={doc.docTitle}
                      >
                        {doc.docTitle}
                      </Link>
                      <p className="text-[11px] text-text-muted font-mono">
                        {doc.docNumberDate}
                      </p>
                    </div>
                  </td>

                  {/* Column 2: Document Type */}
                  <td className="py-3.5 px-4">
                    <DocumentTypeBadge type={doc.docType} />
                  </td>

                  {/* Column 3: Department */}
                  <td className="py-3.5 px-4 max-w-[180px]">
                    <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                      <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="truncate" title={doc.department?.name || '-'}>
                        {doc.department?.name || '-'}
                      </span>
                    </div>
                  </td>

                  {/* Column 4: Responsible Person */}
                  <td className="py-3.5 px-4 max-w-[150px]">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <User className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="truncate" title={doc.responsiblePerson || '-'}>
                        {doc.responsiblePerson || '-'}
                      </span>
                    </div>
                  </td>

                  {/* Column 5: Issue Year */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-text-secondary">
                    {doc.issueYear}
                  </td>

                  {/* Column 6: Attachments */}
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/legal-documents/${doc.id}?tab=attachments`}
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

                  {/* Column 7: Status */}
                  <td className="py-3.5 px-4 text-center">
                    <DocumentStatusBadge status={doc.status} />
                  </td>

                  {/* Column 8: Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/legal-documents/${doc.id}`}
                        className="px-2.5 py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-primary font-semibold text-[11px] flex items-center gap-1 transition-all"
                        title="ເບິ່ງລາຍລະອຽດ"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ເບິ່ງ</span>
                      </Link>

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => onDeleteDocument(doc)}
                          className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-red-50 text-red-600 transition-all"
                          title="ລົບບັນທຶກນິຕິກຳ"
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
