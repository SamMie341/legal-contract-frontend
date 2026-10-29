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
import { PowerContractAttachment } from '@core/entities';
import { powerContractApi } from '../../api/power-contract.api';
import {
  useUploadPowerAttachment,
  useDeletePowerAttachment,
} from '../../hooks/use-power-contracts';
import { usePermissions, useFilePreview } from '@/presentation/hooks';
import { FilePreviewModal } from '@/presentation/components/ui/file-preview-modal';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';

interface PowerContractAttachmentsProps {
  powerContractId: string;
  attachments?: PowerContractAttachment[];
}

export function PowerContractAttachments({
  powerContractId,
  attachments = [],
}: PowerContractAttachmentsProps) {
  const { canDownload, canUpload, canDelete } = usePermissions();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const uploadMutation = useUploadPowerAttachment(powerContractId);
  const deleteMutation = useDeletePowerAttachment(powerContractId);

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
    (id) => powerContractApi.getAttachmentPreviewUrl(id),
    (id, name) => powerContractApi.downloadAttachment(id, name)
  );

  const handleDownload = async (attachment: PowerContractAttachment) => {
    try {
      setDownloadingId(attachment.id);
      await powerContractApi.downloadAttachment(
        attachment.id,
        attachment.fileName
      );
    } catch {
      toast.error('ບໍ່ສາມາດດາວໂຫຼດໄຟລ໌ໄດ້');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (confirm('ທ່ານຕ້ອງການລົບໄຟລ໌ແນບນີ້ແທ້ຫຼືບໍ່?')) {
      await deleteMutation.mutateAsync(attachmentId);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error('ຂະໜາດໄຟລ໌ເກີນກຳນົດ', {
        description: 'ກະລຸນາອັບໂຫຼດໄຟລ໌ບໍ່ເກີນ 25MB',
      });
      return;
    }

    try {
      await uploadMutation.mutateAsync(file);
      e.target.value = '';
    } catch {
      // Error handled in hook toast
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <>
      <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
        {/* Header with Upload action */}
        <div className="p-6 border-b border-border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-primary">
              <Paperclip className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary tracking-tight">
                ໄຟລ໌ແນບສັນຍາ (Attachments)
              </h3>
              <p className="text-xs text-text-secondary">
                ລວມທັງໝົດ {attachments.length} ໄຟລ໌ (PDF, ຮູບພາບ)
              </p>
            </div>
          </div>

          {canUpload && (
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs font-semibold shadow-xs transition-all cursor-pointer">
              {uploadMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <span>ອັບໂຫຼດໄຟລ໌ແນບ</span>
              <input
                type="file"
                className="hidden"
                disabled={uploadMutation.isPending}
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileUpload}
              />
            </label>
          )}
        </div>

        {/* Attachments List */}
        {attachments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Paperclip className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-text-primary">
              ຍັງບໍ່ມີໄຟລ໌ແນບສັນຍາ
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              ທ່ານສາມາດອັບໂຫຼດໄຟລ໌ສັນຍາສະແກນ ຫຼື ເອກະສານທີ່ກ່ຽວຂ້ອງໄດ້
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-line">
            {attachments.map((att) => {
              const isPdf =
                att.mimeType?.includes('pdf') ||
                att.fileName.toLowerCase().endsWith('.pdf');

              return (
                <div
                  key={att.id}
                  className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isPdf
                          ? 'bg-red-50 text-red-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {isPdf ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <ImageIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {att.fileName}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {formatFileSize(att.fileSize)} •{' '}
                        {formatDate(att.createdAt)}{' '}
                        {att.uploadedBy ? `• ໂດຍ ${att.uploadedBy.fullName}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() =>
                        openPreview({
                          id: att.id,
                          fileName: att.fileName,
                          fileSize: att.fileSize,
                          mimeType: att.mimeType,
                        })
                      }
                      title="ເບິ່ງໄຟລ໌ (Preview)"
                      className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-blue-50 transition-colors"
                    >
                      {previewingId === att.id && isPreviewLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    {/* Download Button */}
                    {canDownload && (
                      <button
                        type="button"
                        onClick={() => handleDownload(att)}
                        disabled={downloadingId === att.id}
                        title="ດາວໂຫຼດໄຟລ໌"
                        className="p-2 rounded-xl text-text-secondary hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                      >
                        {downloadingId === att.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    {/* Delete Button */}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(att.id)}
                        disabled={deleteMutation.isPending}
                        title="ລົບໄຟລ໌ແນບ"
                        className="p-2 rounded-xl text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        fileName={previewFile?.fileName || ''}
        fileUrl={previewUrl}
        fileSize={previewFile?.fileSize}
        mimeType={previewFile?.mimeType}
        isLoading={isPreviewLoading}
        error={previewError}
        onDownload={handleDownloadCurrent}
        canDownload={canDownload}
      />
    </>
  );
}
