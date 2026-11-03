import React from 'react';
import { UserRole } from '@core/entities';
import { ShieldCheck, Shield, User, Edit, Award } from 'lucide-react';

interface UserRoleBadgeProps {
  role: string | UserRole;
  roleTitle?: string | null;
}

export function UserRoleBadge({ role, roleTitle }: UserRoleBadgeProps) {
  const displayTitle = roleTitle || role;

  switch (role) {
    case UserRole.ADMIN:
    case 'ADMIN':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>{displayTitle || 'ADMIN'}</span>
        </span>
      );
    case UserRole.DEPARTMENT_HEAD:
    case 'DEPARTMENT_HEAD':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>{displayTitle || 'ຫົວໜ້າຝ່າຍ'}</span>
        </span>
      );
    case UserRole.MAIN_USER:
    case 'MAIN_USER':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>{displayTitle || 'MAIN USER'}</span>
        </span>
      );
    case UserRole.EDITOR:
    case 'EDITOR':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Edit className="w-3 h-3 text-emerald-600" />
          <span>{displayTitle || 'EDITOR'}</span>
        </span>
      );
    case UserRole.VIEWER:
    case 'VIEWER':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <User className="w-3 h-3 text-slate-500" />
          <span>{displayTitle || 'VIEWER'}</span>
        </span>
      );
    default:
      // Custom Role
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>{displayTitle}</span>
        </span>
      );
  }
}
