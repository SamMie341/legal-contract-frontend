'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Scale,
  Building2,
  Calendar,
  DollarSign,
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
import { CaseType, DisputeStatus, Department, LegalCase } from '@core/entities';
import {
  CreateLegalCasePayload,
  UpdateLegalCasePayload,
} from '../../types/case.types';
import {
  useCreateCase,
  useUpdateCase,
  useUploadCaseAttachment,
  useDeleteCaseAttachment,
} from '../../hooks/use-cases';
import { caseApi } from '../../api/case.api';
import { ContractFileDropzone } from '@/modules/contracts/components/create/contract-file-dropzone';
import { useFilePreview } from '@/presentation/hooks';
import { FilePreviewModal } from '@/presentation/components/ui/file-preview-modal';
import { toast } from 'sonner';

interface CaseFormProps {
  mode: 'create' | 'edit';
  initialData?: LegalCase | null;
  departments: Department[];
}

export function CaseForm({ mode, initialData, departments }: CaseFormProps) {
  const router = useRouter();

  const [caseCode, setCaseCode] = useState(initialData?.caseCode || '');
  const [defendant, setDefendant] = useState(initialData?.defendant || '');
  const [caseType, setCaseType] = useState<CaseType>(
    initialData?.caseType || CaseType.COMMERCIAL
  );
  const [disputeStatus, setDisputeStatus] = useState<DisputeStatus>(
    initialData?.disputeStatus || DisputeStatus.FIRST_INSTANCE
  );
  const [date, setDate] = useState<string>(
    initialData?.date ? initialData.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [departmentId, setDepartmentId] = useState(
    initialData?.departmentId || ''
  );
  const [allegation, setAllegation] = useState(initialData?.allegation || '');
  const [departmentAction, setDepartmentAction] = useState(
    initialData?.departmentAction || ''
  );
  const [disputeProgress, setDisputeProgress] = useState(
    initialData?.disputeProgress || ''
  );
  const [externalUrl, setExternalUrl] = useState(initialData?.externalUrl || '');

  // Financial fields
  const [damageLak, setDamageLak] = useState<string>(
    initialData?.damageLak !== undefined ? String(initialData.damageLak) : '0'
  );
  const [damageUsd, setDamageUsd] = useState<string>(
    initialData?.damageUsd !== undefined ? String(initialData.damageUsd) : '0'
  );
  const [fineLak, setFineLak] = useState<string>(
    initialData?.fineLak !== undefined ? String(initialData.fineLak) : '0'
  );
  const [fineUsd, setFineUsd] = useState<string>(
    initialData?.fineUsd !== undefined ? String(initialData.fineUsd) : '0'
  );
  const [totalDueLak, setTotalDueLak] = useState<string>(
    initialData?.totalDueLak !== undefined ? String(initialData.totalDueLak) : '0'
  );
  const [totalDueUsd, setTotalDueUsd] = useState<string>(
    initialData?.totalDueUsd !== undefined ? String(initialData.totalDueUsd) : '0'
  );
  const [recoveredLak, setRecoveredLak] = useState<string>(
    initialData?.recoveredLak !== undefined ? String(initialData.recoveredLak) : '0'
  );
  const [recoveredUsd, setRecoveredUsd] = useState<string>(
    initialData?.recoveredUsd !== undefined ? String(initialData.recoveredUsd) : '0'
  );

  // Auto calculate totalDue when damage or fine changes
  useEffect(() => {
    const dLak = Number(damageLak) || 0;
    const fLak = Number(fineLak) || 0;
    setTotalDueLak(String(dLak + fLak));
  }, [damageLak, fineLak]);

  useEffect(() => {
    const dUsd = Number(damageUsd) || 0;
    const fUsd = Number(fineUsd) || 0;
    setTotalDueUsd(String(dUsd + fUsd));
  }, [damageUsd, fineUsd]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const currentCaseId = initialData?.internalId || initialData?.id || initialData?.caseCode || '';

  const createMutation = useCreateCase();
  const updateMutation = useUpdateCase(currentCaseId);
  const uploadMutation = useUploadCaseAttachment(currentCaseId);
  const deleteMutation = useDeleteCaseAttachment(currentCaseId);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!caseCode.trim()) {
      errors.caseCode = 'ກະລຸນາປ້ອນລະຫັດຄະດີ';
    }
    if (!defendant.trim()) {
      errors.defendant = 'ກະລຸນາປ້ອນຊື່ຈຳເລີຍ ຫຼື ຫົວຂໍ້ຄະດີ';
    }
    if (!date) {
      errors.date = 'ກະລຸນາເລືອກວັນທີເລີ່ມຕົ້ນຄະດີ';
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
        const payload: CreateLegalCasePayload = {
          caseCode: caseCode.trim(),
          defendant: defendant.trim(),
          caseType,
          disputeStatus,
          date,
          departmentId: departmentId || undefined,
          allegation: allegation.trim() || undefined,
          departmentAction: departmentAction.trim() || undefined,
          disputeProgress: disputeProgress.trim() || undefined,
          externalUrl: externalUrl.trim() || undefined,
          damageLak: Number(damageLak) || 0,
          damageUsd: Number(damageUsd) || 0,
          fineLak: Number(fineLak) || 0,
          fineUsd: Number(fineUsd) || 0,
          totalDueLak: Number(totalDueLak) || 0,
          totalDueUsd: Number(totalDueUsd) || 0,
          recoveredLak: Number(recoveredLak) || 0,
          recoveredUsd: Number(recoveredUsd) || 0,
        };

        const newCase = await createMutation.mutateAsync(payload);
        const newCaseId = newCase.internalId || newCase.id || newCase.caseCode;

        // Upload attached files sequentially
        if (selectedFiles.length > 0) {
          toast.info(`ກຳລັງອັບໂຫຼດເອກະສານ ${selectedFiles.length} ໄຟລ໌...`);
          for (const file of selectedFiles) {
            try {
              await caseApi.uploadAttachment(newCaseId, file);
            } catch {
              toast.error(`ອັບໂຫຼດໄຟລ໌ ${file.name} ບໍ່ສຳເລັດ`);
            }
          }
        }

        router.push(`/legal-cases/${newCaseId}`);
      } else {
        if (!initialData) return;

        const payload: UpdateLegalCasePayload = {
          caseCode: caseCode.trim(),
          defendant: defendant.trim(),
          caseType,
          disputeStatus,
          date,
          departmentId: departmentId || undefined,
          allegation: allegation.trim() || undefined,
          departmentAction: departmentAction.trim() || undefined,
          disputeProgress: disputeProgress.trim() || undefined,
          externalUrl: externalUrl.trim() || undefined,
          damageLak: Number(damageLak) || 0,
          damageUsd: Number(damageUsd) || 0,
          fineLak: Number(fineLak) || 0,
          fineUsd: Number(fineUsd) || 0,
          totalDueLak: Number(totalDueLak) || 0,
          totalDueUsd: Number(totalDueUsd) || 0,
          recoveredLak: Number(recoveredLak) || 0,
          recoveredUsd: Number(recoveredUsd) || 0,
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

        router.push(`/legal-cases/${currentCaseId}`);
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
    (id) => caseApi.getAttachmentPreviewUrl(id),
    (id, name) => caseApi.downloadAttachment(id, name)
  );

  const handleDownloadExisting = async (attachmentId: string, fileName: string) => {
    try {
      toast.info(`ກຳລັງດາວໂຫຼດ ${fileName}...`);
      await caseApi.downloadAttachment(attachmentId, fileName);
    } catch {
      toast.error('ບໍ່ສາມາດດາວໂຫຼດໄຟລ໌ໄດ້');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Case Details */}
      <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line text-sm font-bold text-text-primary">
          <Scale className="w-4 h-4 text-primary" />
          <span>ຂໍ້ມູນສຳນວນຄະດີ & ຂໍ້ຂັດແຍ່ງ (Case Details)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Case Code */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ລະຫັດຄະດີ (Case Code) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={caseCode}
              onChange={(e) => {
                setCaseCode(e.target.value);
                if (validationErrors.caseCode) {
                  setValidationErrors((prev) => ({ ...prev, caseCode: '' }));
                }
              }}
              placeholder="ຕົວຢ່າງ: EDL-2026-005"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.caseCode
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            {validationErrors.caseCode && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.caseCode}
              </p>
            )}
          </div>

          {/* Defendant */}
          <div className="space-y-1 lg:col-span-2">
            <label className="text-xs font-bold text-text-primary">
              ຊື່ຈຳເລີຍ / ຫົວຂໍ້ຄະດີ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={defendant}
              onChange={(e) => {
                setDefendant(e.target.value);
                if (validationErrors.defendant) {
                  setValidationErrors((prev) => ({ ...prev, defendant: '' }));
                }
              }}
              placeholder="ຕົວຢ່າງ: ບໍລິສັດ ບົວລະພາ ກໍ່ສ້າງ ຈຳກັດ"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.defendant
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            {validationErrors.defendant && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.defendant}
              </p>
            )}
          </div>

          {/* Case Type */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ປະເພດຄະດີ <span className="text-red-500">*</span>
            </label>
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value as CaseType)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value={CaseType.COMMERCIAL}>ຄະດີທຸລະກິດ (Commercial)</option>
              <option value={CaseType.CIVIL}>ຄະດີແພ່ງ (Civil)</option>
              <option value={CaseType.CRIMINAL}>ຄະດີອາຍາ (Criminal)</option>
              <option value={CaseType.ADMINISTRATIVE}>ຄະດີປົກຄອງ (Administrative)</option>
              <option value={CaseType.OTHER}>ອື່ນໆ (Other)</option>
            </select>
          </div>

          {/* Dispute Status / Court Stage */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຂັ້ນສານ / ສະຖານະຂໍ້ຂັດແຍ່ງ
            </label>
            <select
              value={disputeStatus}
              onChange={(e) => setDisputeStatus(e.target.value as DisputeStatus)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value={DisputeStatus.FIRST_INSTANCE}>ສານຂັ້ນຕົ້ນ (FIRST_INSTANCE)</option>
              <option value={DisputeStatus.APPEAL}>ສານອຸທອນ (APPEAL)</option>
              <option value={DisputeStatus.SUPREME}>ສານຂັ້ນລົບລ້າງ (SUPREME)</option>
              <option value={DisputeStatus.RESOLVED}>ແກ້ໄຂສຳເລັດ (RESOLVED)</option>
              <option value={DisputeStatus.CLOSED}>ປິດສຳນວນ (CLOSED)</option>
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ວັນທີເລີ່ມຕົ້ນຄະດີ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (validationErrors.date) {
                  setValidationErrors((prev) => ({ ...prev, date: '' }));
                }
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.date
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            {validationErrors.date && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.date}
              </p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-1 lg:col-span-2">
            <label className="text-xs font-bold text-text-primary">
              ຫ້ອງການ / ຝ່າຍທີ່ກ່ຽວຂ້ອງ
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">-- ເລືອກຫ້ອງການ / ຝ່າຍ --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* External URL */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ລິ້ງພາຍນອກ (Cloud / SharePoint)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://sharepoint.edl.com.la/..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Allegation */}
          <div className="md:col-span-2 lg:col-span-3 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຂໍ້ກ່າວຫາ / ເນື້ອໃນຫຍໍ້ຂອງຂໍ້ຂັດແຍ່ງ
            </label>
            <textarea
              rows={2}
              value={allegation}
              onChange={(e) => setAllegation(e.target.value)}
              placeholder="ບັນທຶກຂໍ້ກ່າວຫາ, ການລະເມີດສັນຍາ ຫຼື ມູນເຫດຂໍ້ຂັດແຍ່ງ..."
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Dispute Progress */}
          <div className="md:col-span-2 lg:col-span-3 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຄວາມຄືບໜ້າຄະດີ / ຂັ້ນຕອນການດຳເນີນງານ
            </label>
            <textarea
              rows={2}
              value={disputeProgress}
              onChange={(e) => setDisputeProgress(e.target.value)}
              placeholder="ຕົວຢ່າງ: ສານຂັ້ນຕົ້ນກຳລັງໄຕ່ສວນພະຍານ, ນັດຟັງຄຳຕັດສິນວັນທີ..."
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Financial Claims (LAK & USD) */}
      <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line text-sm font-bold text-text-primary">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>ມູນຄ່າຄວາມເສຍຫາຍ & ການເງິນ (Financial Figures)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Damage LAK */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຄວາມເສຍຫາຍ (LAK - ₭)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={damageLak}
              onChange={(e) => setDamageLak(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Damage USD */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຄວາມເສຍຫາຍ (USD - $)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={damageUsd}
              onChange={(e) => setDamageUsd(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Fine LAK */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຄ່າປັບໃໝ (LAK - ₭)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={fineLak}
              onChange={(e) => setFineLak(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Fine USD */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຄ່າປັບໃໝ (USD - $)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={fineUsd}
              onChange={(e) => setFineUsd(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Total Due LAK (Auto calculated) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ລວມຍອດຕ້ອງຊຳລະ (LAK - ₭)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={totalDueLak}
              onChange={(e) => setTotalDueLak(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Total Due USD (Auto calculated) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ລວມຍອດຕ້ອງຊຳລະ (USD - $)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={totalDueUsd}
              onChange={(e) => setTotalDueUsd(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Recovered LAK */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຍອດເກັບກູ້ຄືນໄດ້ (LAK - ₭)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={recoveredLak}
              onChange={(e) => setRecoveredLak(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-mono text-emerald-700 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Recovered USD */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຍອດເກັບກູ້ຄືນໄດ້ (USD - $)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={recoveredUsd}
              onChange={(e) => setRecoveredUsd(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-mono text-emerald-700 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Attachments */}
      <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line text-sm font-bold text-text-primary">
          <Paperclip className="w-4 h-4 text-blue-600" />
          <span>ເອກະສານສຳນວນຄະດີຕິດຄັດ (Case Attachments)</span>
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
                    <Scale className="w-4 h-4 text-primary shrink-0" />
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
            {mode === 'edit' ? 'ອັບໂຫຼດເອກະສານເພີ່ມເຕີມ:' : 'ແນບເອກະສານສຳນວນຄະດີ (PDF ຫຼື ຮູບພາບ):'}
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
          <span>{mode === 'create' ? 'ບັນທຶກສຳນວນຄະດີໃໝ່' : 'ບັນທຶກການແກ້ໄຂ'}</span>
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
