import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginBrandHero, LoginForm } from '@modules/auth';

export const metadata: Metadata = {
  title: 'ເຂົ້າສູ່ລະບົບ',
  description: 'ເຂົ້າສູ່ລະບົບຄຸ້ມຄອງສັນຍາ, ນິຕິກຳ ແລະ ຄະດີຄວາມ ໄຟຟ້າລາວ (EDL)',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-background-base">
      {/* Brand Hero (Desktop Left Half) */}
      <LoginBrandHero />

      {/* Login Form Container (Right Half) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 my-auto">
        <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/60 border border-border-line">
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
