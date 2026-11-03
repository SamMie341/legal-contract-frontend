'use client';

import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { User } from '@core/entities';
import { useResetPassword } from '../hooks/use-users';

interface ResetPasswordModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPasswordModal({
  user,
  isOpen,
  onClose,
}: ResetPasswordModalProps) {
  const [resetType, setResetType] = useState<'default' | 'custom'>('default');
  const [customPassword, setCustomPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resultPassword, setResultPassword] = useState<string | null>(null);

  const resetMutation = useResetPassword();

  if (!isOpen || !user) return null;

  const defaultSuggestedPass = `EDL@${user.employeeCode || '123456'}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload =
      resetType === 'custom' && customPassword.trim()
        ? { newPassword: customPassword.trim() }
        : undefined;

    try {
      const res = await resetMutation.mutateAsync({
        id: user.id,
        payload,
      });

      setResultPassword(res.temporaryPassword);
    } catch {
      // Error handled by mutation
    }
  };

  const handleCopy = () => {
    if (!resultPassword) return;
    navigator.clipboard.writeText(resultPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    setResetType('default');
    setCustomPassword('');
    setShowPassword(false);
    setCopied(false);
    setResultPassword(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-surface rounded-2xl border border-border-line shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border-line flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                ຣີເຊັດລະຫັດຜ່ານ (Reset Password)
              </h2>
              <p className="text-[11px] text-text-secondary">
                ສຳລັບບັນຊີ: {user.fullName} ({user.employeeCode})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {resultPassword ? (
          /* Success Screen with Copyable Password */
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-text-primary">
                ຣີເຊັດລະຫັດຜ່ານສຳເລັດແລ້ວ!
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                ລະຫັດຜ່ານຊົ່ວຄາວໃໝ່ຂອງ <span className="font-semibold text-text-primary">{user.fullName}</span> ແມ່ນ:
              </p>
            </div>

            {/* Password Display Box */}
            <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between gap-3 font-mono font-bold text-sm text-primary">
              <span className="truncate select-all">{resultPassword}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-border-line text-xs font-semibold text-text-secondary hover:text-primary hover:bg-slate-50 transition-all shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">ກັອບປີ້ແລ້ວ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>ກັອບປີ້</span>
                  </>
                )}
              </button>
            </div>

            {/* Security Warning Notice */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-left text-xs text-amber-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                ກະລຸນາແຈ້ງລະຫັດຜ່ານນີ້ໃຫ້ພະນັກງານ ແລະ ແນະນຳໃຫ້ພະນັກງານທຳການ <span className="font-bold">ປ່ຽນລະຫັດຜ່ານໃໝ່ທັນທີ</span> ຫຼັງຈາກເຂົ້າສູ່ລະບົບ.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all"
              >
                ສຳເລັດ / ປິດໜ້າຕ່າງ
              </button>
            </div>
          </div>
        ) : (
          /* Form Input Screen */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* User Info Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-text-primary">{user.fullName}</p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  ລະຫັດພະນັກງານ: <span className="font-mono">{user.employeeCode}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-text-muted block">ພະແນກ:</span>
                <span className="font-medium text-text-primary text-[11px] truncate max-w-[140px] block">
                  {user.division || user.department || '-'}
                </span>
              </div>
            </div>

            {/* Selection Options */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
                ເລືອກຮູບແບບການຣີເຊັດ
              </label>

              {/* Option 1: Default Pattern */}
              <label
                onClick={() => setResetType('default')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  resetType === 'default'
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/10'
                    : 'bg-white border-border-line hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="resetType"
                  checked={resetType === 'default'}
                  onChange={() => setResetType('default')}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-text-primary">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>ສ້າງລະຫັດຜ່ານອັດຕະໂນມັດ (ແນະນຳ)</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    ລະບົບຈະກຳນົດເປັນ: <code className="font-mono font-bold text-primary">{defaultSuggestedPass}</code>
                  </p>
                </div>
              </label>

              {/* Option 2: Custom Password */}
              <label
                onClick={() => setResetType('custom')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  resetType === 'custom'
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/10'
                    : 'bg-white border-border-line hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="resetType"
                  checked={resetType === 'custom'}
                  onChange={() => setResetType('custom')}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <p className="font-bold text-xs text-text-primary">
                    ກຳນົດລະຫັດຜ່ານຊົ່ວຄາວເອງ
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    ປ້ອນລະຫັດຜ່ານໃໝ່ທີ່ຕ້ອງການ (ຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ)
                  </p>
                </div>
              </label>
            </div>

            {/* Custom Password Input */}
            {resetType === 'custom' && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="block text-xs font-bold text-text-primary">
                  ລະຫັດຜ່ານໃໝ່ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="ປ້ອນລະຫັດຜ່ານຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-border-line flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={resetMutation.isPending}
                className="px-4 py-2.5 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
              >
                ຍົກເລີກ
              </button>
              <button
                type="submit"
                disabled={
                  resetMutation.isPending ||
                  (resetType === 'custom' && (!customPassword.trim() || customPassword.length < 6))
                }
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
              >
                {resetMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>ກຳລັງຣີເຊັດ...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>ຢືນຢັນຣີເຊັດລະຫັດຜ່ານ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
