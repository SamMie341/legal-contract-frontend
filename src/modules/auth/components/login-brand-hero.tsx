import React from 'react';
import Image from 'next/image';
import { FileText, Scale, ShieldCheck, Briefcase } from 'lucide-react';

export function LoginBrandHero() {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#1c2e6d] to-[#0f193d] opacity-90" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-hover rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20" />

      {/* Large Faded EDL Logo Watermark in Hero Background */}
      <div className="absolute -right-20 -bottom-20 w-[540px] h-[540px] opacity-[0.09] pointer-events-none select-none z-0">
        <Image
          src="/edl-logo.png"
          alt="EDL Watermark"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Top Header / Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0 border border-white/20">
            <Image
              src="/edl-logo.png"
              alt="EDL Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              ລັດວິສາຫະກິດໄຟຟ້າລາວ
            </h2>
            <p className="text-xs text-blue-200 tracking-wider font-medium">
              ELECTRICITÉ DU LAOS (EDL)
            </p>
          </div>
        </div>
      </div>

      {/* Center Hero Description */}
      <div className="relative z-10 my-auto py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-200 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ລະບົບຄຸ້ມຄອງຂໍ້ມູນກົດໝາຍມາດຕະຖານ Clean Architecture</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-extrabold leading-snug tracking-tight text-white mb-4">
          ລະບົບຄຸ້ມຄອງສັນຍາ, ນິຕິກຳ ແລະ ຄະດີຄວາມ
        </h1>
        <p className="text-sm xl:text-base text-blue-200/90 leading-relaxed max-w-lg mb-8">
          ສູນກາງຕິດຕາມສັນຍາທຸລະກິດ 14 ປະເພດ, ຈັດເກັບນິຕິກຳ ແລະ ຕິດຕາມສຳນວນຄະດີພ້ອມສະຖິຕິການເງິນ LAK & USD ແບບ Real-time
        </p>

        {/* 2 Core Divisions Cards */}
        <div className="grid gap-3 max-w-lg">
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">1. ພະແນກສັນຍາທົ່ວໄປ</h3>
              <p className="text-xs text-blue-200">ຕິດຕາມສັນຍາ 14 ປະເພດ (LAK, USD, CNY) ແລະ ແຈ້ງເຕືອນໃກ້ໝົດອາຍຸອັດຕະໂນມັດ</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">2. ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ</h3>
              <p className="text-xs text-blue-200">ຄຸ້ມຄອງລະບຽບການ/ນິຕິກຳ ແລະ ຕິດຕາມສຳນວນຄະດີ ພ້ອມມູນຄ່າການເງິນ LAK & USD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 flex items-center justify-between text-xs text-blue-300/80 pt-6 border-t border-white/10">
        <span>© 2026 Electricité du Laos. All rights reserved.</span>
        <span>Version 1.0.0</span>
      </div>
    </div>
  );
}
