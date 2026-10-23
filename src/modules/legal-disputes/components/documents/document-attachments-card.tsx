'use client';

import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  Trash2,
  Paperclip,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import { DocumentAttachmentItem } from '../../types/document.types';
import { documentApi } from '../../api/document.api';
import {
  useUploadDocumentAttachment,
  useDeleteDocumentAttachment,
} from '../../hooks/use-documents';
import { usePermissions, useFilePreview } from '@/presentation/hooks';
import { FilePreviewModal } from '@/presentation/components/ui/file-preview-modal';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';

interface DocumentAttachmentsCardProps {
  documentId: string;
  attachments?: DocumentAttachmentItem[];
}

export function DocumentAttachmentsCard({
  documentId,
  attachments = [],
}: DocumentAttachmentsCardProps) {
  const { canDownload, canUpload, canDelete } = usePermissions();
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const uploadMutation = useUploadDocumentAttachment(documentId);
  const deleteMutation = useDeleteDocumentAttachment(documentId);

  const {
    isOpen: isPreviewOpen,
    currentFile: previewFile,
    fileUrl: previewUrl,
    isLoading: isPreviewLoading,
    error: previewError,
    previewingId,
    openPreview,
    closePreview,
    handleDownloadCurrent,
  } = useFilePreview(
    (id) => documentApi.getAttachmentPreviewUrl(id),
    (id, name) => documentApi.downloadAttachment(id, name)
  );

  const handleDownload = async (attachment: DocumentAttachmentItem) => {
    try {
      setDownloadingId(attachment.id);
      await documentApi.downloadAttachment(attachment.id, attachment.fileName);
    } catch {
      toast.error('ບໍ່ສາມາດດາວໂຫຼດໄຟລ໌ໄດ້');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error('ຂະໜາດໄຟລ໌ເກີນກຳນົດ 25MB');
      return;
    }

    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync(file);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border-line flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Paperclip className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              ເອກະສານນິຕິກຳຕິດຄັດ ({attachments.length} ໄຟລ໌)
            </h3>
            <p className="text-[11px] text-text-secondary">
              ໄຟລ໌ສະແກນນິຕິກຳຕົ້ນສະບັບ, ລະບຽບການ, ແລະ ເອກະສານປະກອບ
            </p>
          </div>
        </div>

        {/* Upload Button */}
        {canUpload && (
          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold cursor-pointer shadow-xs transition-all">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
            <span>{isUploading ? 'ກຳລັງອັບໂຫຼດ...' : 'ອັບໂຫຼດໄຟລ໌ໃໝ່'}</span>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Attachments List */}
      {attachments.length === 0 ? (
        <div className="p-10 text-center text-xs text-text-muted">
          <p className="font-semibold text-text-primary mb-1">
            ບໍ່ມີເອກະສານຕິດຄັດ
          </p>
          <p>ນິຕິກຳສະບັບນີ້ຍັງບໍ່ທັນມີການອັບໂຫຼດໄຟລ໌ແນບໃດໆ</p>
        </div>
      ) : (
        <div className="divide-y divide-border-line">
          {attachments.map((att) => {
            const isPdf =
              att.fileType === 'application/pdf' ||
              att.mimeType === 'application/pdf' ||
              att.fileName.toLowerCase().endsWith('.pdf');

            return (
              <div
                key={att.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPdf
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    {isPdf ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-bold text-text-primary truncate"
                      title={att.fileName}
                    >
                      {att.fileName}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      ຂະໜາດ: <span className="font-mono">{formatFileSize(att.fileSize)}</span>
                      {att.uploadedBy?.fullName && (
                        <span> • ອັບໂຫຼດໂດຍ: {att.uploadedBy.fullName}</span>
                      )}
                      <span> • {formatDate(att.createdAt)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={() => openPreview(att)}
                    disabled={previewingId === att.id}
                    className="px-3 py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-text-secondary text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    title="ເປີດເບິ່ງໄຟລ໌"
                  >
                    {previewingId === att.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                    <span>ເບິ່ງ</span>
                  </button>

                  {canDownload ? (
                    <button
                      type="button"
                      onClick={() => handleDownload(att)}
                      disabled={downloadingId === att.id}
                      className="px-3 py-1.5 rounded-lg border border-border-line bg-white hover:bg-primary hover:text-white text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      title="ດາວໂຫຼດໄຟລ໌"
                    >
                      {downloadingId === att.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>ດາວໂຫຼດ</span>
                    </button>
                  ) : (
                    <span
                      className="px-2.5 py-1 text-[11px] text-text-muted bg-slate-100 rounded-lg cursor-not-allowed"
                      title="ທ່ານບໍ່ມີສິດດາວໂຫຼດໄຟລ໌ (canDownload)"
                    >
                      ດາວໂຫຼດບໍ່ໄດ້
                    </span>
                  )}

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`ທ່ານຕ້ອງການລົບໄຟລ໌ "${att.fileName}" ແທ້ຫຼືບໍ່?`)) {
                          deleteMutation.mutate(att.id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-red-50 text-red-600 transition-colors"
                      title="ລົບໄຟລ໌"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-app File Preview Modal */}
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        fileName={previewFile?.fileName || ''}
        fileUrl={previewUrl}
        fileSize={previewFile?.fileSize}
        mimeType={previewFile?.mimeType || (previewFile as any)?.fileType}
        fileType={(previewFile as any)?.fileType}
        isLoading={isPreviewLoading}
        error={previewError}
        onDownload={handleDownloadCurrent}
        canDownload={canDownload}
      />
    </div>
  );
}
