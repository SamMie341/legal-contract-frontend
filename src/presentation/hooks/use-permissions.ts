'use client';

import { useAuthStore } from '@application/store';
import { UserRole, UserPermissions } from '@core/entities';
import {
  isGeneralContractDivision,
  isLegalAndDisputeDivision,
} from '@core/constants';

export type DivisionAccessKey =
  | 'CONTRACTS'
  | 'LEGAL_AND_DISPUTE'
  | 'LEGAL_DOCUMENTS'
  | 'LEGAL_CASES';

/**
 * Custom React hook for clean and reactive permission checking in UI components
 */
export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const isAdmin = user?.role === UserRole.ADMIN;
  const canView = isAdmin || Boolean(user?.canView);
  const canUpload = isAdmin || Boolean(user?.canUpload);
  const canEdit = isAdmin || Boolean(user?.canEdit);
  const canDelete = isAdmin || Boolean(user?.canDelete);
  const canDownload = isAdmin || Boolean(user?.canDownload);

  // Division-level permissions (2 Divisions: Contracts & Legal/Disputes)
  const canAccessContracts = isAdmin || isGeneralContractDivision(user?.division);
  const canAccessLegalAndDispute = isAdmin || isLegalAndDisputeDivision(user?.division);
  const canAccessLegalDocuments = canAccessLegalAndDispute;
  const canAccessLegalCases = canAccessLegalAndDispute;

  const canAccessDivision = (divisionKey?: DivisionAccessKey): boolean => {
    if (!divisionKey || isAdmin) return true;
    switch (divisionKey) {
      case 'CONTRACTS':
        return canAccessContracts;
      case 'LEGAL_AND_DISPUTE':
      case 'LEGAL_DOCUMENTS':
      case 'LEGAL_CASES':
        return canAccessLegalAndDispute;
      default:
        return true;
    }
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!user) return false;
    if (isAdmin) return true;
    return Boolean(user[permission]);
  };

  return {
    user,
    role: user?.role,
    isAuthenticated,
    isAdmin,
    canView,
    canUpload,
    canEdit,
    canDelete,
    canDownload,
    canAccessContracts,
    canAccessLegalAndDispute,
    canAccessLegalDocuments,
    canAccessLegalCases,
    canAccessDivision,
    hasRole,
    hasPermission,
  };
}
