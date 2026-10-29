import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  FileText,
  Scale,
  Zap,
  ArrowRight,
  ClockAlert,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'ໜ້າຫຼັກ (Dashboard Overview)',
  description: 'ພາບລວມລະບົບຄຸ້ມຄອງສັນຍາ, ນິຕິກຳ ແລະ ຄະດີຄວາມ ໄຟຟ້າລາວ (EDL)',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary to-[#1d2f6f] text-white shadow-lg relative overflow-hidden">
        {/* Faded Background Logo Watermark */}
        <div className="absolute -right-8 -bottom-10 w-72 h-72 sm:w-80 sm:h-80 opacity-15 pointer-events-none select-none z-0">
          <Image
            src="/edl-logo.png"
            alt="EDL Logo Watermark"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-blue-200 backdrop-blur-sm mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ລະບົບຄຸ້ມຄອງສັນຍາ, ນິຕິກຳ ແລະ ຄະດີຄວາມ ຟຟລ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ສະບາຍດີ, ຍິນດີຕ້ອນຮັບສູ່ລະບົບ
          </h1>
          <p className="text-sm text-blue-100/90 mt-2 leading-relaxed">
            ສູນກາງຕິດຕາມຂໍ້ມູນສັນຍາທຸລະກິດ, ຈັດເກັບນິຕິກຳ, ຄຸ້ມຄອງສຳນວນຄະດີ ແລະ
            ຕິດຕາມສັນຍາຊື້-ຂາຍໄຟຟ້າ (PPA & PSA) ຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ
          </p>
        </div>
      </div>

      {/* 3 Core Divisions Cards (3 ພະແນກຫຼັກ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Division 1: General Contracts */}
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

        {/* Division 2: Legal Affairs & Dispute Resolution */}
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

        {/* Division 3: Power Purchase & Sale Contracts */}
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
      </div>

      {/* Quick Access Info Section */}
      <div className="p-5 rounded-2xl bg-surface border border-border-line">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            ແຈ້ງການຈາກລະບົບ (System Notice)
          </h4>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          ລະບົບໄດ້ເຊື່ອມຕໍ່ກັບຖານຂໍ້ມູນ EDL HRM API ແລະ ຈະທຳການກວດສອບວັນໝົດອາຍຸຂອງສັນຍາທຸກທ່ຽງຄືນ (00:00) ຫາກສັນຍາເຫຼືອເວລາ ≤ 60 ວັນ ລະບົບຈະປັບສະຖານະເປັນ <code>EXPIRING_SOON</code> ແລະ ແຈ້ງເຕືອນອັດຕະໂນມັດ.
        </p>
      </div>
    </div>
  );
}
