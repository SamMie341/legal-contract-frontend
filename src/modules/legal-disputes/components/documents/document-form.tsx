'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Building2,
  Calendar,
  User,
  Link as LinkIcon,
  Paperclip,
  Save,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Eye,
  Download,
  Trash2,
} from 'lucide-react';
import { DocumentType, LegalDocumentStatus, Department, LegalDocument } from '@core/entities';
import {
  CreateLegalDocumentPayload,
  UpdateLegalDocumentPayload,
} from '../../types/document.types';
import {
  useCreateDocument,
  useUpdateDocument,
  useUploadDocumentAttachment,
  useDeleteDocumentAttachment,
} from '../../hooks/use-documents';
import { documentApi } from '../../api/document.api';
import { ContractFileDropzone } from '@/modules/contracts/components/create/contract-file-dropzone';
import { useFilePreview } from '@/presentation/hooks';
import { FilePreviewModal } from '@/presentation/components/ui/file-preview-modal';
import { toast } from 'sonner';

interface DocumentFormProps {
  mode: 'create' | 'edit';
  initialData?: LegalDocument | null;
  departments: Department[];
}

export function DocumentForm({
  mode,
  initialData,
  departments,
}: DocumentFormProps) {
  const router = useRouter();

  const [docTitle, setDocTitle] = useState(initialData?.docTitle || '');
  const [docType, setDocType] = useState<DocumentType>(
    initialData?.docType || DocumentType.REGULATION
  );
  const [issueYear, setIssueYear] = useState<number>(
    initialData?.issueYear || new Date().getFullYear()
  );
  const [docNumberDate, setDocNumberDate] = useState(
    initialData?.docNumberDate || ''
  );
  const [departmentId, setDepartmentId] = useState(
    initialData?.departmentId || ''
  );
  const [responsiblePerson, setResponsiblePerson] = useState(
    initialData?.responsiblePerson || ''
  );
  const [purpose, setPurpose] = useState(initialData?.purpose || '');
  const [externalUrl, setExternalUrl] = useState(initialData?.externalUrl || '');
  const [status, setStatus] = useState<LegalDocumentStatus>(
    initialData?.status || LegalDocumentStatus.ACTIVE
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument(initialData?.id || '');
  const uploadMutation = useUploadDocumentAttachment(initialData?.id || '');
  const deleteMutation = useDeleteDocumentAttachment(initialData?.id || '');

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!docTitle.trim()) {
      errors.docTitle = 'ກະລຸນາປ້ອນຫົວຂໍ້ / ຊື່ນິຕິກຳ';
    }
    if (!docNumberDate.trim()) {
      errors.docNumberDate = 'ກະລຸນາປ້ອນເລກທີ ແລະ ວັນທີອອກນິຕິກຳ';
    }
    if (!departmentId) {
      errors.departmentId = 'ກະລຸນາເລືອກຫ້ອງການ/ຝ່າຍທີ່ຮັບຜິດຊອບ';
    }
    if (!issueYear || issueYear < 1950 || issueYear > 2100) {
      errors.issueYear = 'ກະລຸນາປ້ອນປີອອກນິຕິກຳທີ່ຖືກຕ້ອງ';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('ກະລຸນາກວດສອບຂໍ້ມູນທີ່ຈຳເປັນໃຫ້ຄົບຖ້ວນ');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const payload: CreateLegalDocumentPayload = {
          docTitle: docTitle.trim(),
          docType,
          issueYear: Number(issueYear),
          docNumberDate: docNumberDate.trim(),
          departmentId,
          responsiblePerson: responsiblePerson.trim() || undefined,
          purpose: purpose.trim() || undefined,
          externalUrl: externalUrl.trim() || undefined,
          status,
        };

        const newDoc = await createMutation.mutateAsync(payload);

        // Upload attached files sequentially
        if (selectedFiles.length > 0) {
          toast.info(`ກຳລັງອັບໂຫຼດເອກະສານ ${selectedFiles.length} ໄຟລ໌...`);
          for (const file of selectedFiles) {
            try {
              await documentApi.uploadAttachment(newDoc.id, file);
            } catch {
              toast.error(`ອັບໂຫຼດໄຟລ໌ ${file.name} ບໍ່ສຳເລັດ`);
            }
          }
        }

        router.push(`/legal-documents/${newDoc.id}`);
      } else {
        if (!initialData) return;

        const payload: UpdateLegalDocumentPayload = {
          docTitle: docTitle.trim(),
          docType,
          issueYear: Number(issueYear),
          docNumberDate: docNumberDate.trim(),
          departmentId,
          responsiblePerson: responsiblePerson.trim() || undefined,
          purpose: purpose.trim() || undefined,
          externalUrl: externalUrl.trim() || undefined,
          status,
        };

        await updateMutation.mutateAsync(payload);

        // Upload any newly selected files in edit mode
        if (selectedFiles.length > 0) {
          toast.info(`ກຳລັງອັບໂຫຼດເອກະສານໃໝ່ ${selectedFiles.length} ໄຟລ໌...`);
          for (const file of selectedFiles) {
            try {
              await uploadMutation.mutateAsync(file);
            } catch {
              // Toast already fired
            }
          }
          setSelectedFiles([]);
        }

        router.push(`/legal-documents/${initialData.id}`);
      }
    } catch {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleDownloadExisting = async (attachmentId: string, fileName: string) => {
    try {
      toast.info(`ກຳລັງດາວໂຫຼດ ${fileName}...`);
      await documentApi.downloadAttachment(attachmentId, fileName);
    } catch {
      toast.error('ບໍ່ສາມາດດາວໂຫຼດໄຟລ໌ໄດ້');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Main Info */}
      <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line text-sm font-bold text-text-primary">
          <FileText className="w-4 h-4 text-primary" />
          <span>ຂໍ້ມູນຫຼັກຂອງນິຕິກຳ (Legal Document Information)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document Title */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຫົວຂໍ້ / ຊື່ນິຕິກຳ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => {
                setDocTitle(e.target.value);
                if (validationErrors.docTitle) {
                  setValidationErrors((prev) => ({ ...prev, docTitle: '' }));
                }
              }}
              placeholder="ຕົວຢ່າງ: ກົດລະບຽບວ່າດ້ວຍການຄຸ້ມຄອງພະນັກງານ ແລະ ແຮງງານ ຟຟລ"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.docTitle
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            {validationErrors.docTitle && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.docTitle}
              </p>
            )}
          </div>

          {/* Document Type */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ປະເພດນິຕິກຳ <span className="text-red-500">*</span>
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value={DocumentType.REGULATION}>ກົດລະບຽບ (Regulation)</option>
              <option value={DocumentType.PROVISION}>ຂໍ້ກຳນົດ (Provision)</option>
              <option value={DocumentType.AGREEMENT}>ຂໍ້ຕົກລົງ (Agreement)</option>
              <option value={DocumentType.NOTICE}>ແຈ້ງການ (Notice)</option>
              <option value={DocumentType.MANUAL}>ຄູ່ມື (Manual)</option>
              <option value={DocumentType.CONTRACT}>ສັນຍາ (Contract)</option>
              <option value={DocumentType.OTHER}>ອື່ນໆ (Other)</option>
            </select>
          </div>

          {/* Issue Year */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ປີອອກນິຕິກຳ <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1950"
              max="2100"
              value={issueYear}
              onChange={(e) => {
                setIssueYear(Number(e.target.value) || new Date().getFullYear());
                if (validationErrors.issueYear) {
                  setValidationErrors((prev) => ({ ...prev, issueYear: '' }));
                }
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.issueYear
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            {validationErrors.issueYear && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.issueYear}
              </p>
            )}
          </div>

          {/* Doc Number & Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ເລກທີ ແລະ ວັນທີອອກນິຕິກຳ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={docNumberDate}
              onChange={(e) => {
                setDocNumberDate(e.target.value);
                if (validationErrors.docNumberDate) {
                  setValidationErrors((prev) => ({ ...prev, docNumberDate: '' }));
                }
              }}
              placeholder="ຕົວຢ່າງ: ເລກທີ 012/ຟຟລ, ລົງວັນທີ 15/01/2026"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.docNumberDate
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            {validationErrors.docNumberDate && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.docNumberDate}
              </p>
            )}
          </div>

          {/* Responsible Department */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຫ້ອງການ / ຝ່າຍທີ່ຮັບຜິດຊອບ <span className="text-red-500">*</span>
            </label>
            <select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                if (validationErrors.departmentId) {
                  setValidationErrors((prev) => ({ ...prev, departmentId: '' }));
                }
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.departmentId
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            >
              <option value="">-- ເລືອກຫ້ອງການ / ຝ່າຍ --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {validationErrors.departmentId && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.departmentId}
              </p>
            )}
          </div>

          {/* Responsible Person */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຜູ້ຮັບຜິດຊອບ / ຜູ້ປະສານງານ
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                placeholder="ຕົວຢ່າງ: ທ່ານ ສົມສັກ ວົງສາ"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Status (In edit mode) */}
          {mode === 'edit' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary">
                ສະຖານະນິຕິກຳ
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LegalDocumentStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value={LegalDocumentStatus.ACTIVE}>ຍັງນຳໃຊ້ (ACTIVE)</option>
                <option value={LegalDocumentStatus.INACTIVE}>ຖືກຍົກເລີກ (INACTIVE)</option>
              </select>
            </div>
          )}

          {/* External URL */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ລິ້ງພາຍນອກ (SharePoint / Google Drive / Cloud Link)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://sharepoint.edl.com.la/documents/..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Purpose / Summary */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຈຸດປະສົງ ຫຼື ເນື້ອໃນຫຍໍ້ຂອງນິຕິກຳ
            </label>
            <textarea
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="ບັນທຶກເນື້ອໃນຫຍໍ້, ເປົ້າໝາຍການນຳໃຊ້ ຫຼື ຂໍ້ກຳນົດສຳຄັນ..."
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Attachments */}
      <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line text-sm font-bold text-text-primary">
          <Paperclip className="w-4 h-4 text-blue-600" />
          <span>ເອກະສານນິຕິກຳຕິດຄັດ (Document Attachments)</span>
        </div>

        {/* Existing files in edit mode */}
        {mode === 'edit' && initialData?.attachments && initialData.attachments.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-bold text-text-primary">
              ເອກະສານທີ່ແນບໄວ້ແລ້ວ ({initialData.attachments.length} ໄຟລ໌):
            </p>
            <div className="divide-y divide-border-line rounded-xl border border-border-line overflow-hidden bg-white">
              {initialData.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-3 text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-semibold text-text-primary truncate" title={att.fileName}>
                      {att.fileName}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono shrink-0">
                      ({(att.fileSize / 1024).toFixed(0)} KB)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openPreview(att)}
                      disabled={previewingId === att.id}
                      className="p-1.5 rounded-lg border border-border-line hover:bg-slate-100 text-text-secondary disabled:opacity-50"
                      title="ເປີດເບິ່ງ"
                    >
                      {previewingId === att.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadExisting(att.id, att.fileName)}
                      className="p-1.5 rounded-lg border border-border-line hover:bg-slate-100 text-primary"
                      title="ດາວໂຫຼດ"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(att.id)}
                      className="p-1.5 rounded-lg border border-border-line hover:bg-red-50 text-red-600"
                      title="ລົບໄຟລ໌"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-bold text-text-primary mb-2">
            {mode === 'edit' ? 'ອັບໂຫຼດເອກະສານເພີ່ມເຕີມ:' : 'ແນບເອກະສານນິຕິກຳ (PDF ຫຼື ຮູບພາບ):'}
          </p>
          <ContractFileDropzone
            files={selectedFiles}
            onFilesChange={setSelectedFiles}
            maxFiles={5}
            maxSizeInMb={25}
          />
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border-line">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-line bg-surface hover:bg-slate-100 text-text-secondary hover:text-text-primary text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ຍົກເລີກ / ກັບຄືນ</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{mode === 'create' ? 'ບັນທຶກນິຕິກຳໃໝ່' : 'ບັນທຶກການແກ້ໄຂ'}</span>
        </button>
      </div>

      {/* File Preview Modal */}
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
        canDownload={true}
      />
    </form>
  );
}
