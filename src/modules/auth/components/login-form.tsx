'use client';

import React from 'react';
import Image from 'next/image';
import { useLogin } from '../hooks/use-login';
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export function LoginForm() {
  const {
    form,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
    isLoading,
    error,
    isExpired,
  } = useLogin();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mobile Branding Header (visible only on small screens) */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md flex items-center justify-center border border-border-line shrink-0">
          <Image
            src="/edl-logo.png"
            alt="EDL Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <div className="text-left">
          <h2 className="text-base font-bold text-text-primary">
            ລັດວິສາຫະກິດໄຟຟ້າລາວ
          </h2>
          <p className="text-xs text-text-secondary">
            EDL Legal & Contract Management
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center lg:text-left mb-6">
        <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
          ເຂົ້າສູ່ລະບົບ
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
          ປ້ອນຊື່ຜູ້ໃຊ້ງານ ຫຼື ລະຫັດພະນັກງານ ແລະ ລະຫັດຜ່ານເພື່ອເຂົ້າສູ່ລະບົບ
        </p>
      </div>

      {/* Session Expired Banner */}
      {isExpired && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>ເຊສຊັນໝົດອາຍຸແລ້ວ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່ອີກຄັ້ງ</span>
        </div>
      )}

      {/* Error Message Box */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Username / Employee Code */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            ຊື່ຜູ້ໃຊ້ງານ ຫຼື ລະຫັດພະນັກງານ (Username / Employee Code)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
              <UserIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              autoComplete="username"
              placeholder="ປ້ອນຊື່ບັນຊີ ຫຼື ລະຫັດພະນັກງານ (ຕົວຢ່າງ: admin, 44652)"
              disabled={isLoading}
              {...register('username')}
              className={`w-full pl-10 pr-4 py-2.5 bg-surface border rounded-xl text-sm text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.username
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            ລະຫັດຜ່ານ (Password)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isLoading}
              {...register('password')}
              className={`w-full pl-10 pr-11 py-2.5 bg-surface border rounded-xl text-sm text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.password
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-border-line focus:border-primary'
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Info Note */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-text-secondary flex items-start gap-2 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            ທ່ານສາມາດນຳໃຊ້ ຊື່ບັນຊີລະບົບ (Username) ຫຼື ລະຫັດພະນັກງານ (Employee Code) ພ້ອມລະຫັດຜ່ານ ເພື່ອເຂົ້າສູ່ລະບົບໄດ້ທັນທີ
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-primary hover:bg-primary-hover active:bg-primary-active text-white rounded-xl text-sm font-semibold shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>ກຳລັງກວດສອບຂໍ້ມູນ...</span>
            </>
          ) : (
            <span>ເຂົ້າສູ່ລະບົບ</span>
          )}
        </button>
      </form>

      {/* Support hotline contact */}
      <div className="mt-8 pt-6 border-t border-border-line text-center text-xs text-text-secondary">
        <p>
          ມີບັນຫາໃນການເຂົ້າສູ່ລະບົບ? ຕິດຕໍ່ສາຍດ່ວນ IT Support
        </p>
        <p className="font-semibold text-text-primary mt-1">
          ໂທ: 1199 ຫຼື ຕິດຕໍ່ ພະແນກເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ ຟຟລ
        </p>
      </div>
    </div>
  );
}
