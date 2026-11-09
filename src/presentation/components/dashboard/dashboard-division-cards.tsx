'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Scale,
  Zap,
  ArrowRight,
  ClockAlert,
} from 'lucide-react';
import { usePermissions } from '@/presentation/hooks';

export function DashboardDivisionCards() {
  const {
    isMounted,
    canAccessContracts,
    canAccessLegalAndDispute,
    canAccessPowerContracts,
  } = usePermissions();

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="h-56 bg-slate-200/60 rounded-2xl border border-border-line" />
        <div className="h-56 bg-slate-200/60 rounded-2xl border border-border-line" />
        <div className="h-56 bg-slate-200/60 rounded-2xl border border-border-line" />
      </div>
    );
  }

  // Count active authorized cards
  const visibleCardsCount = [
    canAccessContracts,
    canAccessLegalAndDispute,
    canAccessPowerContracts,
  ].filter(Boolean).length;

  const gridClass =
    visibleCardsCount === 1
      ? 'grid grid-cols-1 max-w-xl'
      : visibleCardsCount === 2
      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <div className={gridClass}>
      {/* Division 1: General Contracts */}
      {canAccessContracts && (
        <div className="p-6 rounded-2xl bg-surface border border-border-line hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50 text-primary border border-blue-100">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                14 ປະເພດສັນຍາ
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-text-primary">
              1. ພະແນກສັນຍາທົ່ວໄປ
            </h3>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              ສູນກາງຕິດຕາມສັນຍາ 14 ປະເພດ (O&M, EPC, ເຊົ່າດິນ, MOA, PTA...),
              ຄຸ້ມຄອງມູນຄ່າສັນຍາ 3 ສະກຸນເງິນ (LAK, USD, CNY) ແລະ
              ແຈ້ງເຕືອນສັນຍາໃກ້ໝົດອາຍຸອັດຕະໂນມັດ (≤ 60 ວັນ).
            </p>
          </div>

          <div className="pt-6 mt-5 border-t border-border-line flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/contracts/dashboard"
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                <span>ສະຖິຕິ Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-border-line">|</span>
              <Link
                href="/contracts"
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                ລາຍການສັນຍາ
              </Link>
            </div>
            <Link
              href="/contracts?status=EXPIRING_SOON"
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
              title="ສັນຍາໃກ້ໝົດອາຍຸ"
            >
              <ClockAlert className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Division 2: Legal Affairs & Dispute Resolution */}
      {canAccessLegalAndDispute && (
        <div className="p-6 rounded-2xl bg-surface border border-border-line hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Scale className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  9 ໝວດນິຕິກຳ
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  ຄະດີ LAK/USD
                </span>
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-text-primary">
              2. ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ
            </h3>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              ຄຸ້ມຄອງລະບຽບການ, ຂໍ້ກຳນົດ, ແຈ້ງການ, ແລະ ປຶ້ມຄູ່ມືພ້ອມໄຟລ໌ແນບ
              ພ້ອມທັງຕິດຕາມສຳນວນຄະດີຄວາມ, ຂັ້ນຕອນສານ (ຂັ້ນຕົ້ນ, ອຸທອນ, ລົບລ້າງ)
              ແລະ ມູນຄ່າຄວາມເສຍຫາຍ/ຍອດກູ້ຄືນໄດ້.
            </p>
          </div>

          <div className="pt-6 mt-5 border-t border-border-line flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                href="/legal-documents/dashboard"
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>ສະຖິຕິນິຕິກຳ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-border-line">|</span>
              <Link
                href="/legal-cases/dashboard"
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>ສະຖິຕິຄະດີ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/legal-documents"
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                ລາຍການນິຕິກຳ
              </Link>
              <span className="text-border-line">|</span>
              <Link
                href="/legal-cases"
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                ລາຍການຄະດີ
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Division 3: Power Purchase & Sale Contracts */}
      {canAccessPowerContracts && (
        <div className="p-6 rounded-2xl bg-surface border border-border-line hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  PPA ຊື້ໄຟ
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  PSA ຂາຍໄຟ
                </span>
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-text-primary">
              3. ພະແນກສັນຍາຊື້-ຂາຍໄຟຟ້າ
            </h3>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              ສູນກາງຕິດຕາມສັນຍາຊື້ໄຟຟ້າ (PPA 5 ປະເພດ: ນ້ຳຕົກ, ແສງຕາເວັນ, ລົມ,
              ຄວາມຮ້ອນ, ຊີວະມວນ) ແລະ ສັນຍາຂາຍໄຟຟ້າ (PSA), ຄຸ້ມຄອງກຳລັງຕິດຕັ້ງ
              (MW) ແລະ ລາຄາໄຟ.
            </p>
          </div>

          <div className="pt-6 mt-5 border-t border-border-line flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/power-contracts/dashboard"
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <span>ສະຖິຕິ Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-border-line">|</span>
              <Link
                href="/power-contracts"
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                ລາຍການສັນຍາ
              </Link>
            </div>
            <Link
              href="/power-contracts?status=EXPIRING_SOON"
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
              title="ສັນຍາໃກ້ໝົດອາຍຸ"
            >
              <ClockAlert className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
