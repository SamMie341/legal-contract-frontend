import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { DashboardDivisionCards } from '@/presentation/components/dashboard/dashboard-division-cards';

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

      {/* 3 Core Divisions Cards (Filtered dynamically based on user permissions) */}
      <DashboardDivisionCards />

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
