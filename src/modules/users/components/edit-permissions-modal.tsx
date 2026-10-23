'use client';

import React, { useState, useEffect } from 'react';
import { X, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { User, UserRole, UserPermissions } from '@core/entities';
import { useUpdateUser } from '../hooks/use-users';
import { PermissionCheckboxGroup } from './permission-checkbox-group';

interface EditPermissionsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_PRESETS: Record<UserRole, UserPermissions> = {
  [UserRole.ADMIN]: {
    canView: true,
    canUpload: true,
    canEdit: true,
    canDelete: true,
    canDownload: true,
  },
  [UserRole.MAIN_USER]: {
    canView: true,
    canUpload: true,
    canEdit: true,
    canDelete: true,
    canDownload: false,
  },
  [UserRole.EDITOR]: {
    canView: true,
    canUpload: true,
    canEdit: true,
    canDelete: false,
    canDownload: false,
  },
  [UserRole.VIEWER]: {
    canView: true,
    canUpload: false,
    canEdit: false,
    canDelete: false,
    canDownload: false,
  },
};

export function EditPermissionsModal({
  user,
  isOpen,
  onClose,
}: EditPermissionsModalProps) {
  const [role, setRole] = useState<UserRole>(UserRole.VIEWER);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<UserPermissions>({
    canView: true,
    canUpload: false,
    canEdit: false,
    canDelete: false,
    canDownload: false,
  });

  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setIsActive(user.isActive !== false);
      setPermissions({
        canView: Boolean(user.canView),
        canUpload: Boolean(user.canUpload),
        canEdit: Boolean(user.canEdit),
        canDelete: Boolean(user.canDelete),
        canDownload: Boolean(user.canDownload),
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setPermissions(ROLE_PRESETS[newRole]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateUserMutation.mutateAsync({
      id: user.id,
      payload: {
        role,
        isActive,
        ...permissions,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-surface rounded-2xl border border-border-line shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-line bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary tracking-tight">
                ແກ້ໄຂສິດທິຜູ້ໃຊ້ (Edit Permissions)
              </h2>
              <p className="text-xs text-text-secondary">
                {user.fullName} ({user.employeeCode})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* User Summary Info */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-text-primary">{user.fullName}</p>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {user.department || 'ບໍ່ລະບຸຝ່າຍ'} • {user.email || 'ບໍ່ມີອີເມວ'}
              </p>
            </div>

            {/* Active Toggle Switch */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-[11px] font-semibold text-text-secondary">
                {isActive ? 'ເປີດນຳໃຊ້' : 'ລະງັບການນຳໃຊ້'}
              </span>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ປ່ຽນບົດບາດຫຼັກ (Change Role)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { r: UserRole.VIEWER, label: 'VIEWER' },
                { r: UserRole.EDITOR, label: 'EDITOR' },
                { r: UserRole.MAIN_USER, label: 'MAIN USER' },
                { r: UserRole.ADMIN, label: 'ADMIN' },
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => handleRoleChange(item.r)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    role === item.r
                      ? 'bg-primary text-white border-primary shadow-xs font-bold'
                      : 'bg-white text-text-secondary border-border-line hover:border-slate-300 text-xs'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Granular Permissions */}
          <PermissionCheckboxGroup
            permissions={permissions}
            onChange={setPermissions}
            disabled={role === UserRole.ADMIN} // Admin has all permissions locked
          />

          {/* Actions */}
          <div className="pt-4 border-t border-border-line flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={updateUserMutation.isPending}
              className="px-4 py-2.5 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {updateUserMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <span>ບັນທຶກການແກ້ໄຂ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
