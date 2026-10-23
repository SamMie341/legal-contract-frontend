import React from 'react';
import { UserRole } from '@core/entities';
import { ShieldCheck, Shield, User, Edit } from 'lucide-react';

interface UserRoleBadgeProps {
  role: UserRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  switch (role) {
    case UserRole.ADMIN:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>ADMIN</span>
        </span>
      );
    case UserRole.MAIN_USER:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>MAIN USER</span>
        </span>
      );
    case UserRole.EDITOR:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Edit className="w-3 h-3 text-emerald-600" />
          <span>EDITOR</span>
        </span>
      );
    case UserRole.VIEWER:
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <User className="w-3 h-3 text-slate-500" />
          <span>VIEWER</span>
        </span>
      );
  }
}
