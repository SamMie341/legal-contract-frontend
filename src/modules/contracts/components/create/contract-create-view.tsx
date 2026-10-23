'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FilePlus, ShieldAlert } from 'lucide-react';
import { useContractTypesDropdown } from '../../hooks/use-contracts';
import { ContractForm } from './contract-form';
import { usePermissions } from '@/presentation/hooks/use-permissions';

export function ContractCreateView() {
  const { canUpload } = usePermissions();
  const { data: contractTypes = [], isLoading: isLoadingTypes } = useContractTypesDropdown();

  if (!canUpload) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-surface rounded-2xl border border-border-line text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-primary">
            ທ່ານບໍ່ມີສິດສ້າງສັນຍາໃໝ່
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            ການສ້າງສັນຍາ ຫຼື ອັບໂຫຼດເອກະສານ ຮຽກຮ້ອງສິດທິ <span className="font-mono font-bold text-primary">canUpload</span>. ກະລຸນາຕິດຕໍ່ຜູ້ເບິ່ງແຍງລະບົບ (Admin).
          </p>
        </div>
        <Link
          href="/contracts"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນໜ້າລາຍການສັນຍາ</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <Link
            href="/contracts"
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ກັບໄປລາຍການສັນຍາທັງໝົດ</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight flex items-center gap-2">
            <FilePlus className="w-6 h-6 text-primary" />
            <span>ສ້າງສັນຍາໃໝ່ (New Contract)</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ປ້ອນຂໍ້ມູນສັນຍາ, ເລືອກ 1 ໃນ 14 ປະເພດສັນຍາ ແລະ ແນບເອກະສານສັນຍາ (PDF / ຮູບພາບ)
          </p>
        </div>
      </div>

      {/* Main Form */}
      {isLoadingTypes ? (
        <div className="p-8 bg-surface rounded-2xl border border-border-line space-y-4 animate-pulse">
          <div className="h-40 bg-slate-200/60 rounded-xl" />
          <div className="h-40 bg-slate-200/60 rounded-xl" />
        </div>
      ) : (
        <ContractForm mode="create" contractTypes={contractTypes} />
      )}
    </div>
  );
}
