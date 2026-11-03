'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useChangePassword } from '../hooks/use-users';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  const changeMutation = useChangePassword();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!currentPassword) {
      setValidationError('ກະລຸນາປ້ອນລະຫັດຜ່ານປັດຈຸບັນ');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setValidationError('ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ');
      return;
    }

    if (newPassword === currentPassword) {
      setValidationError('ລະຫັດຜ່ານໃໝ່ຕ້ອງບໍ່ຄືກັບລະຫັດຜ່ານປັດຈຸບັນ');
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError('ລະຫັດຜ່ານໃໝ່ ແລະ ຢືນຢັນລະຫັດຜ່ານບໍ່ກົງກັນ');
      return;
    }

    try {
      await changeMutation.mutateAsync({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      handleClose();
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setValidationError(null);
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
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                ປ່ຽນລະຫັດຜ່ານ (Change Password)
              </h2>
              <p className="text-[11px] text-text-secondary">
                ປ່ຽນລະຫັດຜ່ານສຳລັບບັນຊີທີ່ກຳລັງເຂົ້າສູ່ລະບົບ
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Validation Alert */}
          {validationError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-text-primary">
              ລະຫັດຜ່ານປັດຈຸບັນ (Current Password) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="ປ້ອນລະຫັດຜ່ານປັດຈຸບັນ"
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-text-primary">
              ລະຫັດຜ່ານໃໝ່ (New Password) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="ຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ"
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-text-muted">
              ຕ້ອງບໍ່ຄືກັບລະຫັດຜ່ານເກົ່າ ແລະ ມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ
            </p>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-text-primary">
              ຢືນຢັນລະຫັດຜ່ານໃໝ່ (Confirm New Password) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="ປ້ອນລະຫັດຜ່ານໃໝ່ອີກຄັ້ງ"
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && newPassword && (
              <p
                className={`text-[11px] font-semibold flex items-center gap-1 mt-1 ${
                  newPassword === confirmPassword ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {newPassword === confirmPassword ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ລະຫັດຜ່ານກົງກັນ</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>ລະຫັດຜ່ານຍັງບໍ່ກົງກັນ</span>
                  </>
                )}
              </p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-border-line flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={changeMutation.isPending}
              className="px-4 py-2.5 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={
                changeMutation.isPending ||
                !currentPassword ||
                !newPassword ||
                newPassword.length < 6 ||
                newPassword !== confirmPassword
              }
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              {changeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ກຳລັງປ່ຽນ...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>ຢືນຢັນປ່ຽນລະຫັດຜ່ານ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
