'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, ShieldAlert } from 'lucide-react';
import { useCaseDetail } from '../../hooks/use-cases';
import { useDepartmentsList } from '@/presentation/hooks/use-departments';
import { CaseForm } from './case-form';
import { usePermissions } from '@/presentation/hooks/use-permissions';

interface CaseEditViewProps {
  id: string;
}

export function CaseEditView({ id }: CaseEditViewProps) {
  const { canEdit } = usePermissions();
  const { data: legalCase, isLoading: isLoadingCase } = useCaseDetail(id);
  const { data: departments = [], isLoading: isLoadingDepts } = useDepartmentsList();

  if (!canEdit) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-surface rounded-2xl border border-border-line text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-primary">
            ທ່ານບໍ່ມີສິດແກ້ໄຂສຳນວນຄະດີ
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            ການແກ້ໄຂຄະດີ ຮຽກຮ້ອງສິດທິ <span className="font-mono font-bold text-primary">canEdit</span>. ກະລຸນາຕິດຕໍ່ຜູ້ເບິ່ງແຍງລະບົບ (Admin).
          </p>
        </div>
        <Link
          href={`/legal-cases/${id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນໜ້າລາຍລະອຽດຄະດີ</span>
        </Link>
      </div>
    );
  }

  if (isLoadingCase || isLoadingDepts) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200/60 rounded-xl w-1/3" />
        <div className="h-64 bg-slate-200/60 rounded-2xl" />
      </div>
    );
  }

  if (!legalCase) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface rounded-2xl border border-border-line text-center space-y-4">
        <p className="text-sm font-bold text-text-primary">ບໍ່ພົບຂໍ້ມູນສຳນວນຄະດີທີ່ຕ້ອງການແກ້ໄຂ</p>
        <Link
          href="/legal-cases"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນໜ້າລາຍການຄະດີ</span>
        </Link>
      </div>
    );
  }

  const caseId = legalCase.internalId || legalCase.id || legalCase.caseCode;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-line">
        <div>
          <Link
            href={`/legal-cases/${caseId}`}
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ກັບໄປລາຍລະອຽດ ({legalCase.caseCode})</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight flex items-center gap-2">
            <Edit className="w-6 h-6 text-primary" />
            <span>ແກ້ໄຂຂໍ້ມູນສຳນວນຄະດີ (Edit Legal Case)</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            ປັບປຸງຂໍ້ມູນຄະດີ: <span className="font-bold text-text-primary">{legalCase.defendant}</span> ({legalCase.caseCode})
          </p>
        </div>
      </div>

      {/* Main Form */}
      <CaseForm
        mode="edit"
        initialData={legalCase}
        departments={departments}
      />
    </div>
  );
}
