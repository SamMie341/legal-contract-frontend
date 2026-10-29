'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PowerContractType,
  ContractStatus,
  Currency,
  PowerContract,
} from '@core/entities';
import { usePowerProjectTypes } from '../../hooks/use-power-contracts';
import {
  CreatePowerContractPayload,
  UpdatePowerContractPayload,
} from '../../types/power-contract.types';
import { PowerContractFileDropzone } from './power-contract-file-dropzone';
import {
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
  Paperclip,
} from 'lucide-react';
import { CONTRACT_STATUS_MAP } from '@/utils/status-badge';

interface PowerContractFormProps {
  initialData?: PowerContract;
  onSubmit: (
    payload: CreatePowerContractPayload | UpdatePowerContractPayload,
    files: File[]
  ) => Promise<any>;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

export function PowerContractForm({
  initialData,
  onSubmit,
  isSubmitting,
  isEditMode = false,
}: PowerContractFormProps) {
  const router = useRouter();
  const { data: projectTypes = [], isLoading: isLoadingProjectTypes } =
    usePowerProjectTypes();

  // Files state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Form states
  const [contractType, setContractType] = useState<PowerContractType>(
    initialData?.contractType || PowerContractType.PURCHASE
  );
  const [contractNumber, setContractNumber] = useState(
    initialData?.contractNumber || ''
  );
  const [projectName, setProjectName] = useState(initialData?.projectName || '');
  const [projectTypeOrCustomer, setProjectTypeOrCustomer] = useState(
    initialData?.projectTypeOrCustomer || ''
  );
  const [durationText, setDurationText] = useState(
    initialData?.durationText || ''
  );
  const [durationMonths, setDurationMonths] = useState<string>(
    initialData?.durationMonths?.toString() || ''
  );
  const [signedDate, setSignedDate] = useState(
    initialData?.signedDate ? initialData.signedDate.substring(0, 10) : ''
  );
  const [effectiveDate, setEffectiveDate] = useState(
    initialData?.effectiveDate ? initialData.effectiveDate.substring(0, 10) : ''
  );
  const [expirationDate, setExpirationDate] = useState(
    initialData?.expirationDate ? initialData.expirationDate.substring(0, 10) : ''
  );
  const [installedCapacity, setInstalledCapacity] = useState(
    initialData?.installedCapacity || ''
  );
  const [capacityValue, setCapacityValue] = useState<string>(
    initialData?.capacityValue?.toString() || ''
  );
  const [capacityUnit, setCapacityUnit] = useState(
    initialData?.capacityUnit || 'MW'
  );
  const [projectLocation, setProjectLocation] = useState(
    initialData?.projectLocation || ''
  );
  const [tariff, setTariff] = useState(initialData?.tariff || '');
  const [tariffValue, setTariffValue] = useState<string>(
    initialData?.tariffValue?.toString() || ''
  );
  const [tariffCurrency, setTariffCurrency] = useState<Currency>(
    (initialData?.tariffCurrency as Currency) || Currency.USD
  );
  const [additionalDetails, setAdditionalDetails] = useState(
    initialData?.additionalDetails || ''
  );
  const [status, setStatus] = useState<ContractStatus>(
    initialData?.status || ContractStatus.ACTIVE
  );
  const [notifyDaysBefore, setNotifyDaysBefore] = useState<number>(
    initialData?.notifyDaysBefore || 60
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreatePowerContractPayload | UpdatePowerContractPayload = {
      contractType,
      projectName: projectName.trim(),
      projectTypeOrCustomer: projectTypeOrCustomer.trim(),
      contractNumber: contractNumber.trim() || undefined,
      durationText: durationText.trim() || undefined,
      durationMonths: durationMonths ? parseInt(durationMonths, 10) : undefined,
      signedDate: signedDate || undefined,
      effectiveDate: effectiveDate || undefined,
      expirationDate: expirationDate || undefined,
      installedCapacity: installedCapacity.trim() || undefined,
      capacityValue: capacityValue ? parseFloat(capacityValue) : undefined,
      capacityUnit: capacityUnit.trim() || 'MW',
      projectLocation: projectLocation.trim() || undefined,
      tariff: tariff.trim() || undefined,
      tariffValue: tariffValue ? parseFloat(tariffValue) : undefined,
      tariffCurrency,
      additionalDetails: additionalDetails.trim() || undefined,
      notifyDaysBefore: notifyDaysBefore || 60,
    };

    if (isEditMode) {
      (payload as UpdatePowerContractPayload).status = status;
    }

    const result = await onSubmit(payload, selectedFiles);
    if (result && !isEditMode) {
      router.push(`/power-contracts/${result.id || ''}`);
    } else if (isEditMode && initialData) {
      router.push(`/power-contracts/${initialData.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Contract Type Selection (PURCHASE vs SALE) */}
      <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
            1. ປະເພດສັນຍາຊື້-ຂາຍໄຟຟ້າ <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-text-secondary">
            ເລືອກວ່າເປັນສັນຍາຊື້ໄຟ (PPA) ຫຼື ສັນຍາຂາຍໄຟ (PSA)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Purchase PPA Option */}
          <button
            type="button"
            onClick={() => {
              setContractType(PowerContractType.PURCHASE);
              // Clear or preset default project type if it was custom
              if (contractType !== PowerContractType.PURCHASE) {
                setProjectTypeOrCustomer('');
              }
            }}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              contractType === PowerContractType.PURCHASE
                ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 text-blue-950'
                : 'bg-white border-border-line hover:border-slate-300 text-text-secondary'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                contractType === PowerContractType.PURCHASE
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">
                ສັນຍາຊື້ໄຟຟ້າ (Power Purchase Agreement - PPA)
              </p>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                ຟຟລ ຊື້ໄຟຟ້າຈາກຜູ້ຜະລິດເອກະລາດ (IPP) ເຊັ່ນ: ເຂື່ອນໄຟຟ້າ, ໂຊລາຟາມ,
                ໂຄງການພະລັງງານລົມ
              </p>
            </div>
          </button>

          {/* Sale PSA Option */}
          <button
            type="button"
            onClick={() => {
              setContractType(PowerContractType.SALE);
              if (contractType !== PowerContractType.SALE) {
                setProjectTypeOrCustomer('');
              }
            }}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              contractType === PowerContractType.SALE
                ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950'
                : 'bg-white border-border-line hover:border-slate-300 text-text-secondary'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                contractType === PowerContractType.SALE
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">
                ສັນຍາຂາຍໄຟຟ້າ (Power Sale Agreement - PSA)
              </p>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                ຟຟລ ຂາຍໄຟຟ້າໃຫ້ລູກຄ້າອຸດສາຫະກຳ, ເຂດເສດຖະກິດພິເສດ, ຫຼື
                ສົ່ງອອກຂາຍຕ່າງປະເທດ (EVN, EGAT)
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Core Project Information */}
      <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line/70">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-text-primary">
            2. ຂໍ້ມູນຫຼັກຂອງໂຄງການ
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Project Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ຊື່ໂຄງການ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="ຕົວຢ່າງ: ໂຄງການເຂື່ອນໄຟຟ້ານ້ຳອູ 1, ໂຊລາຟາມ ໄຊຍະບູລີ"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Contract Number */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ເລກທີສັນຍາ
            </label>
            <input
              type="text"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              placeholder="ຕົວຢ່າງ: PPA-2026-001 ຫຼື PSA/EDL/2026"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
            />
          </div>

          {/* Conditional Project Type or Customer */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              {contractType === PowerContractType.PURCHASE ? (
                <span>
                  ປະເພດໂຄງການຜະລິດໄຟ (5 ປະເພດ) <span className="text-red-500">*</span>
                </span>
              ) : (
                <span>
                  ຊື່ລູກຄ້າ / ຜູ້ຊື້ໄຟຟ້າ <span className="text-red-500">*</span>
                </span>
              )}
            </label>

            {contractType === PowerContractType.PURCHASE ? (
              <select
                required
                value={projectTypeOrCustomer}
                onChange={(e) => setProjectTypeOrCustomer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">-- ເລືອກ 1 ໃນ 5 ປະເພດໂຄງການ --</option>
                {projectTypes.map((pt) => (
                  <option key={pt.id} value={pt.nameLo}>
                    {pt.nameLo} ({pt.nameEn})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={projectTypeOrCustomer}
                onChange={(e) => setProjectTypeOrCustomer(e.target.value)}
                placeholder="ປ້ອນຊື່ລູກຄ້າ ຫຼື ປະເພດໂຄງການ (ຕົວຢ່າງ: ບໍລິສັດ ບໍ່ຄຳ ເຊໂປນ, EGAT)"
                className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            )}
          </div>

          {/* Project Location */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ທີ່ຕັ້ງໂຄງການ
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
                placeholder="ຕົວຢ່າງ: ເມືອງຂວາ, ແຂວງຜົ້ງສາລີ ຫຼື ເຂດເສດຖະກິດພິເສດ ບໍ່ເຕັນ"
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Capacity & Tariff Specifications */}
      <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line/70">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-text-primary">
            3. ກຳລັງການຕິດຕັ້ງ ແລະ ລາຄາໄຟຟ້າ
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Capacity Value in MW */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ກຳລັງຕິດຕັ້ງຕົວເລກ (MW)
            </label>
            <input
              type="number"
              step="any"
              value={capacityValue}
              onChange={(e) => {
                setCapacityValue(e.target.value);
                if (e.target.value) {
                  setInstalledCapacity(`${e.target.value} ${capacityUnit || 'MW'}`);
                }
              }}
              placeholder="ຕົວຢ່າງ: 50 ຫຼື 120.5"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-[11px] text-text-muted mt-1">
              ໃຊ້ຄຳນວນຍອດລວມໃນ Dashboard
            </p>
          </div>

          {/* Installed Capacity Text */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ຂໍ້ຄວາມກຳລັງຕິດຕັ້ງ
            </label>
            <input
              type="text"
              value={installedCapacity}
              onChange={(e) => setInstalledCapacity(e.target.value)}
              placeholder="ຕົວຢ່າງ: 50 MW ຫຼື 120,000 kW"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Capacity Unit */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ຫົວໜ່ວຍກຳລັງຕິດຕັ້ງ
            </label>
            <select
              value={capacityUnit}
              onChange={(e) => setCapacityUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="MW">MW (Megawatt)</option>
              <option value="kW">kW (Kilowatt)</option>
              <option value="GW">GW (Gigawatt)</option>
            </select>
          </div>

          {/* Tariff Value */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ລາຄາໄຟຟ້າຕົວເລກ (ຕໍ່ kWh)
            </label>
            <input
              type="number"
              step="any"
              value={tariffValue}
              onChange={(e) => {
                setTariffValue(e.target.value);
                if (e.target.value) {
                  setTariff(`${e.target.value} ${tariffCurrency}/kWh`);
                }
              }}
              placeholder="ຕົວຢ່າງ: 0.065 ຫຼື 850"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Tariff Text */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ຂໍ້ຄວາມລາຄາໄຟ (Tariff)
            </label>
            <input
              type="text"
              value={tariff}
              onChange={(e) => setTariff(e.target.value)}
              placeholder="ຕົວຢ່າງ: 0.065 USD/kWh ຫຼື 850 LAK/kWh"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Tariff Currency */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ສະກຸນເງິນລາຄາໄຟ
            </label>
            <select
              value={tariffCurrency}
              onChange={(e) => setTariffCurrency(e.target.value as Currency)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value={Currency.USD}>USD ($)</option>
              <option value={Currency.LAK}>LAK (₭)</option>
              <option value={Currency.CNY}>CNY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Timeline & Expiration */}
      <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line/70">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-text-primary">
            4. ໄລຍະເວລາ ແລະ ວັນໝົດອາຍຸສັນຍາ
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Duration Text */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ອາຍຸສັນຍາ (ຂໍ້ຄວາມ)
            </label>
            <input
              type="text"
              value={durationText}
              onChange={(e) => setDurationText(e.target.value)}
              placeholder="ຕົວຢ່າງ: 25 ປີ"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Duration in Months */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ຈຳນວນເດືອນອາຍຸສັນຍາ
            </label>
            <input
              type="number"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
              placeholder="ຕົວຢ່າງ: 300 (25 ປີ x 12)"
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Notify Days Before */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ແຈ້ງເຕືອນລ່ວງໜ້າ (ວັນ)
            </label>
            <input
              type="number"
              value={notifyDaysBefore}
              onChange={(e) => setNotifyDaysBefore(parseInt(e.target.value, 10) || 60)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-[11px] text-text-muted mt-1">
              ຄ່າເລີ່ມຕົ້ນ 60 ວັນ
            </p>
          </div>

          {/* Signed Date */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ມື້ລົງລາຍເຊັນ
            </label>
            <input
              type="date"
              value={signedDate}
              onChange={(e) => setSignedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ມື້ມີຜົນບັງຄັບໃຊ້
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ມື້ສິ້ນສຸດສັນຍາ (Expiration Date)
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            />
          </div>
        </div>

        {/* Status in Edit Mode */}
        {isEditMode && (
          <div className="pt-3 border-t border-border-line/70">
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ສະຖານະສັນຍາ
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContractStatus)}
              className="w-full sm:w-72 px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold"
            >
              {Object.entries(CONTRACT_STATUS_MAP).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 5. Additional Details */}
      <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs space-y-3">
        <label className="block text-xs font-bold text-text-primary">
          5. ລາຍລະອຽດເພີ່ມເຕີມ / ໝາຍເຫດ
        </label>
        <textarea
          rows={3}
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          placeholder="ລະບຸເງື່ອນໄຂພິເສດ, ໄລຍະເວລາກໍ່ສ້າງ, ຫຼື ຂໍ້ມູນອື່ນໆ ທີ່ກ່ຽວຂ້ອງກັບສັນຍາ..."
          className="w-full px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
        />
      </div>

      {/* 6. File Attachments */}
      <div className="bg-surface p-6 rounded-2xl border border-border-line shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-line/70">
          <Paperclip className="w-4 h-4 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              6. ເອກະສານຕິດຄັດ / ໄຟລ໌ແນບສັນຍາ (File Attachments)
            </h3>
            <p className="text-[11px] text-text-secondary">
              ອັບໂຫຼດໄຟລ໌ສັນຍາສະແກນ, ເອກະສານອະນຸມັດ, ຫຼື ໄຟລ໌ທີ່ກ່ຽວຂ້ອງ (PDF, ຮູບພາບ)
            </p>
          </div>
        </div>

        <PowerContractFileDropzone
          files={selectedFiles}
          onFilesChange={setSelectedFiles}
          maxFiles={10}
          maxSizeInMb={25}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-line">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
        >
          ຍົກເລີກ
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !projectName.trim() || !projectTypeOrCustomer.trim()}
          className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isEditMode ? 'ບັນທຶກການແກ້ໄຂ' : 'ບັນທຶກສັນຍາ'}</span>
        </button>
      </div>
    </form>
  );
}
