'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Briefcase, Zap, Scale } from 'lucide-react';
import { usePermissions } from '@/presentation/hooks';

interface AccessDeniedViewProps {
  requiredDivisionName: string;
  moduleName?: string;
}

export function AccessDeniedView({
  requiredDivisionName,
  moduleName,
}: AccessDeniedViewProps) {
  const router = useRouter();
  const {
    user,
    canAccessContracts,
    canAccessPowerContracts,
    canAccessLegalAndDispute,
  } = usePermissions();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface border border-border-line rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 text-center space-y-6 animate-fadeIn">
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້າວຽກນີ້
          </h2>
          <p className="text-xs text-text-secondary">
            ລະຫັດຂໍ້ຜິດພາດ: 403 Forbidden • Access Denied
          </p>
        </div>

        {/* Explanation Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-border-line text-left space-y-2.5 text-xs">
          {moduleName && (
            <div className="flex justify-between items-center pb-2 border-b border-border-line/70">
              <span className="text-text-muted">ໜ້າວຽກທີ່ພະຍາຍາມເຂົ້າເຖິງ:</span>
              <span className="font-bold text-text-primary">{moduleName}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-text-muted">ສິດທີ່ຕ້ອງການ:</span>
            <span className="font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
              {requiredDivisionName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted">ພະແນກປັດຈຸບັນຂອງທ່ານ:</span>
            <span className="font-medium text-text-primary">
              {user?.division || 'ບໍ່ມີຂໍ້ມູນພະແນກ (Unassigned)'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted">ບັນຊີຜູ້ໃຊ້:</span>
            <span className="font-mono text-text-secondary">
              {user?.fullName} ({user?.employeeCode || '-'})
            </span>
          </div>
        </div>

        {/* Informative Note */}
        <p className="text-[11px] text-text-muted leading-relaxed">
          ລະບົບຖືກອອກແບບມາເພື່ອແຍກສິດການເຂົ້າເຖິງຂໍ້ມູນສັນຍາ ແລະ ນິຕິກຳ ຕາມພະແນກທີ່ຮັບຜິດຊອບຕົວຈິງ. ຫາກທ່ານຕ້ອງການເຂົ້າເຖິງໜ້າວຽກນີ້ ກະລຸນາຕິດຕໍ່ຜູ້ດູແລລະບົບ (Admin).
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>ກັບຄືນໜ້າຫຼັກ (Dashboard)</span>
          </button>

          {/* Quick jump to authorized division */}
          {canAccessContracts && (
            <Link
              href="/contracts"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-line hover:bg-slate-50 text-xs font-semibold text-text-primary transition-colors"
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>ໄປໜ້າສັນຍາທົ່ວໄປ</span>
            </Link>
          )}

          {canAccessPowerContracts && (
            <Link
              href="/power-contracts"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-line hover:bg-slate-50 text-xs font-semibold text-text-primary transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>ໄປໜ້າສັນຍາຊື້-ຂາຍໄຟ</span>
            </Link>
          )}

          {canAccessLegalAndDispute && (
            <Link
              href="/legal-documents"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-line hover:bg-slate-50 text-xs font-semibold text-text-primary transition-colors"
            >
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>ໄປໜ້ານິຕິກຳ ແລະ ຄະດີ</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
