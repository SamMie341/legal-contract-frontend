'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  DollarSign,
  Calendar,
  Building2,
  Paperclip,
  Save,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Eye,
  Download,
  Trash2,
} from 'lucide-react';
import { ContractStatus, Currency } from '@core/entities';
import {
  ContractDetail,
  ContractTypeDropdownItem,
  CreateContractPayload,
  UpdateContractPayload,
} from '../../types/contract.types';
import {
  useCreateContract,
  useUpdateContract,
  useUploadAttachment,
  useDeleteAttachment,
} from '../../hooks/use-contracts';
import { contractApi } from '../../api/contract.api';
import { ContractFileDropzone } from './contract-file-dropzone';
import { useFilePreview } from '@/presentation/hooks';
import { FilePreviewModal } from '@/presentation/components/ui/file-preview-modal';
import { toast } from 'sonner';

interface ContractFormProps {
  mode: 'create' | 'edit';
  initialData?: ContractDetail | null;
  contractTypes: ContractTypeDropdownItem[];
}

export function ContractForm({
  mode,
  initialData,
  contractTypes,
}: ContractFormProps) {
  const router = useRouter();

  // Form Fields State
  const [contractNumber, setContractNumber] = useState(
    initialData?.contractNumber || ''
  );
  const [title, setTitle] = useState(initialData?.title || '');
  const [contractTypeId, setContractTypeId] = useState<number | ''>(
    initialData?.contractTypeId || ''
  );
  const [contractValue, setContractValue] = useState<string>(
    initialData?.contractValue !== undefined && initialData?.contractValue !== null
      ? String(initialData.contractValue)
      : ''
  );
  const [currency, setCurrency] = useState<Currency>(
    initialData?.currency || Currency.LAK
  );
  const [effectiveDate, setEffectiveDate] = useState<string>(
    initialData?.effectiveDate ? initialData.effectiveDate.slice(0, 10) : ''
  );
  const [expirationDate, setExpirationDate] = useState<string>(
    initialData?.expirationDate ? initialData.expirationDate.slice(0, 10) : ''
  );
  const [signedDate, setSignedDate] = useState<string>(
    initialData?.signedDate ? initialData.signedDate.slice(0, 10) : ''
  );
  const [durationText, setDurationText] = useState(
    initialData?.durationText || ''
  );
  const [notifyDaysBefore, setNotifyDaysBefore] = useState<number>(
    initialData?.notifyDaysBefore || 60
  );
  const [implementer, setImplementer] = useState(
    initialData?.implementer || ''
  );
  const [equityOrCapitalContribution, setEquityOrCapitalContribution] = useState(
    initialData?.equityOrCapitalContribution || ''
  );
  const [sharePercentage, setSharePercentage] = useState<string>(
    initialData?.sharePercentage !== undefined && initialData?.sharePercentage !== null
      ? String(initialData.sharePercentage)
      : ''
  );
  const [additionalDetails, setAdditionalDetails] = useState(
    initialData?.additionalDetails || ''
  );
  const [status, setStatus] = useState<ContractStatus>(
    initialData?.status || ContractStatus.ACTIVE
  );

  // Files to upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Mutations
  const createMutation = useCreateContract();
  const updateMutation = useUpdateContract(initialData?.id || '');
  const uploadMutation = useUploadAttachment(initialData?.id || '');
  const deleteAttachmentMutation = useDeleteAttachment(initialData?.id || '');

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!contractNumber.trim()) {
      errors.contractNumber = 'ກະລຸນາປ້ອນເລກທີສັນຍາ';
    }
    if (!title.trim()) {
      errors.title = 'ກະລຸນາປ້ອນຊື່ສັນຍາ';
    }
    if (!contractTypeId) {
      errors.contractTypeId = 'ກະລຸນາເລືອກປະເພດສັນຍາ';
    }
    if (!effectiveDate) {
      errors.effectiveDate = 'ກະລຸນາເລືອກມື້ເລີ່ມມີຜົນບັງຄັບໃຊ້';
    }
    if (!expirationDate) {
      errors.expirationDate = 'ກະລຸນາເລືອກມື້ສິ້ນສຸດສັນຍາ';
    }
    if (effectiveDate && expirationDate && new Date(expirationDate) <= new Date(effectiveDate)) {
      errors.expirationDate = 'ມື້ສິ້ນສຸດສັນຍາ ຕ້ອງຫຼັງຈາກມື້ເລີ່ມມີຜົນບັງຄັບໃຊ້';
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
        const payload: CreateContractPayload = {
          contractNumber: contractNumber.trim(),
          title: title.trim(),
          contractTypeId: Number(contractTypeId),
          contractValue: contractValue ? Number(contractValue) : undefined,
          currency,
          effectiveDate: new Date(effectiveDate).toISOString(),
          expirationDate: new Date(expirationDate).toISOString(),
          signedDate: signedDate ? new Date(signedDate).toISOString() : undefined,
          durationText: durationText.trim() || undefined,
          notifyDaysBefore: Number(notifyDaysBefore) || 60,
          implementer: implementer.trim() || undefined,
          equityOrCapitalContribution: equityOrCapitalContribution.trim() || undefined,
          sharePercentage: sharePercentage ? Number(sharePercentage) : undefined,
          additionalDetails: additionalDetails.trim() || undefined,
        };

        const newContract = await createMutation.mutateAsync(payload);

        // Upload any attached files sequentially
        if (selectedFiles.length > 0) {
          toast.info(`ກຳລັງອັບໂຫຼດເອກະສານ ${selectedFiles.length} ໄຟລ໌...`);
          for (const file of selectedFiles) {
            try {
              await contractApi.uploadAttachment(newContract.id, file);
            } catch {
              toast.error(`ອັບໂຫຼດໄຟລ໌ ${file.name} ບໍ່ສຳເລັດ`);
            }
          }
        }

        router.push(`/contracts/${newContract.id}`);
      } else {
        // Edit Mode
        if (!initialData) return;

        const payload: UpdateContractPayload = {
          contractNumber: contractNumber.trim(),
          title: title.trim(),
          contractTypeId: Number(contractTypeId),
          contractValue: contractValue ? Number(contractValue) : undefined,
          currency,
          effectiveDate: new Date(effectiveDate).toISOString(),
          expirationDate: new Date(expirationDate).toISOString(),
          signedDate: signedDate ? new Date(signedDate).toISOString() : undefined,
          durationText: durationText.trim() || undefined,
          notifyDaysBefore: Number(notifyDaysBefore) || 60,
          implementer: implementer.trim() || undefined,
          equityOrCapitalContribution: equityOrCapitalContribution.trim() || undefined,
          sharePercentage: sharePercentage ? Number(sharePercentage) : undefined,
          additionalDetails: additionalDetails.trim() || undefined,
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

        router.push(`/contracts/${initialData.id}`);
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
    (id) => contractApi.getAttachmentPreviewUrl(id),
    (id, name) => contractApi.downloadAttachment(id, name)
  );

  const handleDownloadExisting = async (attachmentId: string, fileName: string) => {
    try {
      toast.info(`ກຳລັງດາວໂຫຼດ ${fileName}...`);
      await contractApi.downloadAttachment(attachmentId, fileName);
    } catch {
      toast.error('ບໍ່ສາມາດດາວໂຫຼດໄຟລ໌ໄດ້');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Basic Contract Info */}
      <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line text-sm font-bold text-text-primary">
          <FileText className="w-4 h-4 text-primary" />
          <span>ສ່ວນທີ 1: ຂໍ້ມູນພື້ນຖານສັນຍາ (Contract Information)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contract Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ເລກທີສັນຍາ (Contract Number) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contractNumber}
              onChange={(e) => {
                setContractNumber(e.target.value);
                if (validationErrors.contractNumber) {
                  setValidationErrors((prev) => ({ ...prev, contractNumber: '' }));
                }
              }}
              placeholder="ຕົວຢ່າງ: EDL-2026/001 ຫຼື 123/ຟຟລ"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.contractNumber
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            {validationErrors.contractNumber && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.contractNumber}
              </p>
            )}
          </div>

          {/* Contract Type (14 Master Types) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ປະເພດສັນຍາ (Contract Type) <span className="text-red-500">*</span>
            </label>
            <select
              value={contractTypeId}
              onChange={(e) => {
                setContractTypeId(e.target.value ? Number(e.target.value) : '');
                if (validationErrors.contractTypeId) {
                  setValidationErrors((prev) => ({ ...prev, contractTypeId: '' }));
                }
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.contractTypeId
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            >
              <option value="">-- ເລືອກປະເພດສັນຍາ (14 ປະເພດ) --</option>
              {contractTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nameLo} {t.nameEn ? `(${t.nameEn})` : ''}
                </option>
              ))}
            </select>
            {validationErrors.contractTypeId && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.contractTypeId}
              </p>
            )}
          </div>

          {/* Contract Title */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຊື່ສັນຍາ (Contract Title) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationErrors.title) {
                  setValidationErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
              placeholder="ຕົວຢ່າງ: ສັນຍາ ວ່າຈ້າງທີ່ປຶກສາ ໂຄງການສາຍສົ່ງ 500kV ພາກກາງ"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.title
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            {validationErrors.title && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* Implementer */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ຜູ້ຈັດຕັ້ງປະຕິບັດ / ພະແນກທີ່ຮັບຜິດຊອບ
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={implementer}
                onChange={(e) => setImplementer(e.target.value)}
                placeholder="ຕົວຢ່າງ: ພະແນກສັນຍາທົ່ວໄປ, ຝ່າຍກົດໝາຍ..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Status (Only in Edit mode) */}
          {mode === 'edit' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary">
                ສະຖານະສັນຍາ (Contract Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContractStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value={ContractStatus.ACTIVE}>ມີຜົນບັງຄັບໃຊ້ (ACTIVE)</option>
                <option value={ContractStatus.EXPIRING_SOON}>ໃກ້ໝົດອາຍຸ (EXPIRING_SOON)</option>
                <option value={ContractStatus.EXPIRED}>ໝົດອາຍຸແລ້ວ (EXPIRED)</option>
                <option value={ContractStatus.DRAFT}>ຮ່າງສັນຍາ (DRAFT)</option>
                <option value={ContractStatus.TERMINATED}>ຍົກເລີກສັນຍາ (TERMINATED)</option>
              </select>
            </div>
          )}

          {/* Additional Details */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ລາຍລະອຽດ ຫຼື ຈຸດປະສົງສັນຍາຫຍໍ້
            </label>
            <textarea
              rows={3}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="ບັນທຶກລາຍລະອຽດເນື້ອໃນສຳຄັນຂອງສັນຍາ ຫຼື ຂໍ້ກຳນົດພິເສດ..."
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Financial Terms */}
      <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line text-sm font-bold text-text-primary">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>ສ່ວນທີ 2: ມູນຄ່າ ແລະ ການເງິນ (Financial Terms)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Contract Value */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ມູນຄ່າສັນຍາ (Contract Value)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={contractValue}
              onChange={(e) => setContractValue(e.target.value)}
              placeholder="ຕົວຢ່າງ: 150000000"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Currency */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ສະກຸນເງິນ (Currency)
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value={Currency.LAK}>ກີບ (LAK - ₭)</option>
              <option value={Currency.USD}>ໂດລາສະຫະລັດ (USD - $)</option>
              <option value={Currency.CNY}>ຢວນຈີນ (CNY - ¥)</option>
            </select>
          </div>

          {/* Equity / Capital Contribution */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ສັດສ່ວນຫຸ້ນ ຫຼື ຈຳນວນເງິນປະກອບທຶນ
            </label>
            <input
              type="text"
              value={equityOrCapitalContribution}
              onChange={(e) => setEquityOrCapitalContribution(e.target.value)}
              placeholder="ຕົວຢ່າງ: 100%, 51:49, ຫຼື ຈຳນວນເງິນປະກອບທຶນ"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Share Percentage */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ເປີເຊັນຫຸ້ນ (%)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              max="100"
              value={sharePercentage}
              onChange={(e) => setSharePercentage(e.target.value)}
              placeholder="ຕົວຢ່າງ: 51.5"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Timeline & Notifications */}
      <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line text-sm font-bold text-text-primary">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>ສ່ວນທີ 3: ໄລຍະເວລາ ແລະ ການແຈ້ງເຕືອນ (Timeline & Notifications)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Effective Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ມື້ເລີ່ມມີຜົນບັງຄັບໃຊ້ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => {
                setEffectiveDate(e.target.value);
                if (validationErrors.effectiveDate) {
                  setValidationErrors((prev) => ({ ...prev, effectiveDate: '' }));
                }
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.effectiveDate
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            {validationErrors.effectiveDate && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.effectiveDate}
              </p>
            )}
          </div>

          {/* Expiration Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ມື້ສິ້ນສຸດ / ໝົດອາຍຸສັນຍາ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => {
                setExpirationDate(e.target.value);
                if (validationErrors.expirationDate) {
                  setValidationErrors((prev) => ({ ...prev, expirationDate: '' }));
                }
              }}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                validationErrors.expirationDate
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            {validationErrors.expirationDate && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.expirationDate}
              </p>
            )}
          </div>

          {/* Signed Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ມື້ລົງລາຍເຊັນສັນຍາ (ຖ້າມີ)
            </label>
            <input
              type="date"
              value={signedDate}
              onChange={(e) => setSignedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Duration Text */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ອາຍຸສັນຍາ (ຕົວຢ່າງ: 2 ປີ, 24 ເດືອນ)
            </label>
            <input
              type="text"
              value={durationText}
              onChange={(e) => setDurationText(e.target.value)}
              placeholder="ຕົວຢ່າງ: 24 ເດືອນ, 5 ປີ"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Notify Days Before */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary">
              ແຈ້ງເຕືອນລ່ວງໜ້າກ່ອນໝົດອາຍຸ (ວັນ)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={notifyDaysBefore}
              onChange={(e) => setNotifyDaysBefore(Number(e.target.value) || 60)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Attachments */}
      <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line text-sm font-bold text-text-primary">
          <Paperclip className="w-4 h-4 text-blue-600" />
          <span>ສ່ວນທີ 4: ເອກະສານສັນຍາຕິດຄັດ (Contract Attachments)</span>
        </div>

        {/* Existing Attachments in Edit Mode */}
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
                      onClick={() => deleteAttachmentMutation.mutate(att.id)}
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

        {/* Dropzone for new files */}
        <div>
          <p className="text-xs font-bold text-text-primary mb-2">
            {mode === 'edit' ? 'ອັບໂຫຼດເອກະສານເພີ່ມເຕີມ:' : 'ແນບເອກະສານສັນຍາ (PDF ຫຼື ຮູບພາບ):'}
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
          <span>{mode === 'create' ? 'ບັນທຶກສັນຍາໃໝ່' : 'ບັນທຶກການແກ້ໄຂ'}</span>
        </button>
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
        canDownload={true}
      />
    </form>
  );
}
