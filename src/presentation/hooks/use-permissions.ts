'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@application/store';
import {
  UserRole,
  UserPermissions,
  SystemModuleKey,
  PermissionActionKey,
} from '@core/entities';
import {
  isGeneralContractDivision,
  isLegalAndDisputeDivision,
  isPowerContractDivision,
} from '@core/constants';

export type DivisionAccessKey =
  | 'CONTRACTS'
  | 'LEGAL_AND_DISPUTE'
  | 'LEGAL_DOCUMENTS'
  | 'LEGAL_CASES'
  | 'POWER_CONTRACTS';

function inferModuleFromPath(pathname: string): SystemModuleKey | undefined {
  if (pathname.startsWith('/power-contracts')) return 'POWER_CONTRACTS';
  if (pathname.startsWith('/contracts')) return 'CONTRACTS';
  if (pathname.startsWith('/legal-documents')) return 'LEGAL_DOCUMENTS';
  if (pathname.startsWith('/legal-cases')) return 'LEGAL_CASES';
  return undefined;
}

/**
 * Custom React hook for dynamic RBAC and granular permission matrix (V2)
 */
export function usePermissions(scopedModule?: SystemModuleKey) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeCan = useAuthStore((s) => s.can);
  const storeHasModule = useAuthStore((s) => s.hasModule);

  let currentPath = '';
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    currentPath = usePathname() || '';
  } catch {
    currentPath = '';
  }

  const resolvedModule = scopedModule || inferModuleFromPath(currentPath);

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === 'ADMIN';
  const isDepartmentHead =
    user?.role === UserRole.DEPARTMENT_HEAD || user?.role === 'DEPARTMENT_HEAD';

  const can = (
    module: SystemModuleKey | string,
    action: PermissionActionKey = 'canView'
  ): boolean => {
    return storeCan(module, action);
  };

  const hasModule = (module: SystemModuleKey | string): boolean => {
    return storeHasModule(module);
  };

  // Button-level permissions: Automatically scoped to the current module
  const canView = resolvedModule
    ? can(resolvedModule, 'canView')
    : isAdmin || Boolean(user?.canView);

  const canUpload = resolvedModule
    ? can(resolvedModule, 'canUpload')
    : isAdmin || Boolean(user?.canUpload);

  const canEdit = resolvedModule
    ? can(resolvedModule, 'canEdit')
    : isAdmin || Boolean(user?.canEdit);

  const canDelete = resolvedModule
    ? can(resolvedModule, 'canDelete')
    : isAdmin || Boolean(user?.canDelete);

  const canDownload = resolvedModule
    ? can(resolvedModule, 'canDownload')
    : isAdmin || Boolean(user?.canDownload);

  // Module / Division access permissions
  const canAccessContracts =
    isAdmin ||
    isDepartmentHead ||
    can('CONTRACTS', 'canView') ||
    isGeneralContractDivision(user?.division);

  const canAccessPowerContracts =
    isAdmin ||
    isDepartmentHead ||
    can('POWER_CONTRACTS', 'canView') ||
    isPowerContractDivision(user?.division);

  const canAccessLegalDocuments =
    isAdmin ||
    isDepartmentHead ||
    can('LEGAL_DOCUMENTS', 'canView') ||
    isLegalAndDisputeDivision(user?.division);

  const canAccessLegalCases =
    isAdmin ||
    isDepartmentHead ||
    can('LEGAL_CASES', 'canView') ||
    isLegalAndDisputeDivision(user?.division);

  const canAccessLegalAndDispute = canAccessLegalDocuments || canAccessLegalCases;

  const canAccessDivision = (divisionKey?: DivisionAccessKey): boolean => {
    if (!divisionKey || isAdmin || isDepartmentHead) return true;
    switch (divisionKey) {
      case 'CONTRACTS':
        return canAccessContracts;
      case 'POWER_CONTRACTS':
        return canAccessPowerContracts;
      case 'LEGAL_AND_DISPUTE':
        return canAccessLegalAndDispute;
      case 'LEGAL_DOCUMENTS':
        return canAccessLegalDocuments;
      case 'LEGAL_CASES':
        return canAccessLegalCases;
      default:
        return true;
    }
  };

  const hasRole = (...roles: (UserRole | string)[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!user) return false;
    if (isAdmin) return true;
    if (resolvedModule && permission in { canView: 1, canUpload: 1, canEdit: 1, canDelete: 1, canDownload: 1 }) {
      return can(resolvedModule, permission as PermissionActionKey);
    }
    return Boolean(user[permission]);
  };

  return {
    user,
    role: user?.role,
    roleTitle: user?.roleTitle || user?.role || 'VIEWER',
    isAuthenticated,
    isAdmin,
    isDepartmentHead,
    can,
    hasModule,
    canView,
    canUpload,
    canEdit,
    canDelete,
    canDownload,
    canAccessContracts,
    canAccessLegalAndDispute,
    canAccessLegalDocuments,
    canAccessLegalCases,
    canAccessPowerContracts,
    canAccessDivision,
    hasRole,
    hasPermission,
  };
}
