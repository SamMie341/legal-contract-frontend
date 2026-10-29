import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginBrandHero, LoginForm } from '@modules/auth';

export const metadata: Metadata = {
  title: 'ເຂົ້າສູ່ລະບົບ',
  description: 'ເຂົ້າສູ່ລະບົບຄຸ້ມຄອງສັນຍາ, ນິຕິກຳ ແລະ ຄະດີຄວາມ ໄຟຟ້າລາວ (EDL)',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-background-base relative overflow-hidden">
      {/* Brand Hero (Desktop Left Half) */}
      <LoginBrandHero />

      {/* Login Form Container (Right Half) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 my-auto relative">
        {/* Faint EDL Logo Watermark on form side */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <div className="w-96 h-96 opacity-[0.045]">
            <Image
              src="/edl-logo.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/60 border border-border-line relative z-10">
          <Suspense
            fallback={
              <div className="text-center py-12 text-sm text-text-secondary">
                ກຳລັງໂຫຼດໜ້າເຂົ້າສູ່ລະບົບ...
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
