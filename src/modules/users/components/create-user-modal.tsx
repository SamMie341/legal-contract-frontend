'use client';

import React, { useState } from 'react';
import {
  X,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building,
  Briefcase,
  UserPlus,
} from 'lucide-react';
import { UserRole, UserPermissions } from '@core/entities';
import { usersApi } from '../api/users.api';
import { HrmEmployeeLookup } from '../types/user-management.types';
import { useCreateUser } from '../hooks/use-users';
import { PermissionCheckboxGroup } from './permission-checkbox-group';
import { getErrorMessage } from '@core/errors';

interface CreateUserModalProps {
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

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [empCode, setEmpCode] = useState('');
  const [isSearchingHrm, setIsSearchingHrm] = useState(false);
  const [hrmResult, setHrmResult] = useState<HrmEmployeeLookup | null>(null);
  const [hrmError, setHrmError] = useState<string | null>(null);

  const [role, setRole] = useState<UserRole>(UserRole.VIEWER);
  const [permissions, setPermissions] = useState<UserPermissions>(
    ROLE_PRESETS[UserRole.VIEWER]
  );

  const createUserMutation = useCreateUser();

  if (!isOpen) return null;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setPermissions(ROLE_PRESETS[newRole]);
  };

  const handleLookupHrm = async () => {
    if (!empCode.trim()) return;

    setIsSearchingHrm(true);
    setHrmError(null);
    setHrmResult(null);

    try {
      const data = await usersApi.lookupHrmEmployee(empCode.trim());
      setHrmResult(data);
    } catch (err) {
      setHrmError(getErrorMessage(err));
    } finally {
      setIsSearchingHrm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empCode.trim()) return;

    try {
      await createUserMutation.mutateAsync({
        employeeCode: empCode.trim(),
        role,
        ...permissions,
      });

      handleClose();
    } catch {
      // Error is caught and displayed by useCreateUser onError toast
    }
  };

  const handleClose = () => {
    setEmpCode('');
    setHrmResult(null);
    setHrmError(null);
    setRole(UserRole.VIEWER);
    setPermissions(ROLE_PRESETS[UserRole.VIEWER]);
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
      <div className="relative w-full max-w-lg bg-surface rounded-2xl border border-border-line shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-line bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-primary">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary tracking-tight">
                ເພີ່ມຜູ້ໃຊ້ງານໃໝ່ (Add User)
              </h2>
              <p className="text-xs text-text-secondary">
                ດຶງຂໍ້ມູນພະນັກງານຈາກ HRM ແລະ ກຳນົດສິດທິການນຳໃຊ້
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Employee Code & HRM Lookup */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ລະຫັດພະນັກງານ ຟຟລ (Employee Code) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={empCode}
                onChange={(e) => setEmpCode(e.target.value)}
                placeholder="ຕົວຢ່າງ: 44652 ຫຼື ADMIN-002"
                required
                className="flex-1 px-3.5 py-2.5 bg-white border border-border-line rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={handleLookupHrm}
                disabled={isSearchingHrm || !empCode.trim()}
                className="px-4 py-2.5 bg-primary hover:bg-primary-hover active:bg-primary-active text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isSearchingHrm ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>ກວດສອບ HRM</span>
              </button>
            </div>
          </div>

          {/* HRM Employee Preview Card */}
          {hrmResult && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ພົບຂໍ້ມູນໃນລະບົບ HRM: {hrmResult.fullName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-950 pt-1 border-t border-emerald-200/60">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">{hrmResult.department || 'ບໍ່ລະບຸຝ່າຍ'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">{hrmResult.position || 'ບໍ່ລະບຸຕຳແໜ່ງ'}</span>
                </div>
              </div>
              {hrmResult.alreadyInSystem && (
                <p className="text-[11px] text-amber-700 font-medium">
                  ⚠️ ພະນັກງານທ່ານນີ້ມີບັນຊີໃນລະບົບແລ້ວ
                </p>
              )}
            </div>
          )}

          {/* HRM Lookup Error */}
          {hrmError && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{hrmError}</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  (ທ່ານຍັງສາມາດກົດບັນທຶກເພື່ອສ້າງບັນຊີດ້ວຍລະຫັດນີ້ໄດ້)
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Role Selection */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ບົດບາດຫຼັກໃນລະບົບ (Role) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { r: UserRole.VIEWER, label: 'VIEWER', desc: 'ເບິ່ງຢ່າງດຽວ' },
                { r: UserRole.EDITOR, label: 'EDITOR', desc: 'ແກ້ໄຂໄດ້' },
                { r: UserRole.MAIN_USER, label: 'MAIN USER', desc: 'ຈັດການພະແນກ' },
                { r: UserRole.ADMIN, label: 'ADMIN', desc: 'ຜູ້ດູແລສູງສຸດ' },
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => handleRoleChange(item.r)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    role === item.r
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-white text-text-secondary border-border-line hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">{item.label}</p>
                  <p className={`text-[10px] mt-0.5 ${role === item.r ? 'text-blue-200' : 'text-text-muted'}`}>
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Fine-grained permissions */}
          <PermissionCheckboxGroup
            permissions={permissions}
            onChange={setPermissions}
            disabled={role === UserRole.ADMIN} // Admin has all permissions locked
          />

          {/* Modal Actions */}
          <div className="pt-4 border-t border-border-line flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={createUserMutation.isPending}
              className="px-4 py-2.5 rounded-xl border border-border-line text-xs font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={createUserMutation.isPending || !empCode.trim()}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {createUserMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <span>ບັນທຶກຜູ້ໃຊ້ງານ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
