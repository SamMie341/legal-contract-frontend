'use client';

import { useState, useEffect } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rawUser = useAuthStore((s) => s.user);
  const rawIsAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeCan = useAuthStore((s) => s.can);
  const storeHasModule = useAuthStore((s) => s.hasModule);

  const pathname = usePathname();
  const currentPath = pathname || '';

  const resolvedModule = scopedModule || inferModuleFromPath(currentPath);

  // During SSR or before client mount, guard state to guarantee HTML matches
  const user = isMounted ? rawUser : null;
  const isAuthenticated = isMounted ? rawIsAuthenticated : false;

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === 'ADMIN';
  const isDepartmentHead =
    user?.role === UserRole.DEPARTMENT_HEAD || user?.role === 'DEPARTMENT_HEAD';
  const isDivisionHead =
    user?.role === UserRole.DIVISION_HEAD || user?.role === 'DIVISION_HEAD';

  const canManageUsers = Boolean(
    isMounted &&
      (isAdmin ||
        isDivisionHead ||
        user?.accessibleModules?.some((m) => String(m).toLowerCase().includes('user')))
  );

  const can = (
    module: SystemModuleKey | string,
    action: PermissionActionKey = 'canView'
  ): boolean => {
    if (!isMounted || !user) return false;
    return storeCan(module, action);
  };

  const hasModule = (module: SystemModuleKey | string): boolean => {
    if (!isMounted || !user) return false;
    return storeHasModule(module);
  };

  // Button-level permissions: Automatically scoped to the current module
  const canView = isMounted
    ? resolvedModule
      ? can(resolvedModule, 'canView')
      : isAdmin || Boolean(user?.canView)
    : false;

  const canUpload = isMounted
    ? resolvedModule
      ? can(resolvedModule, 'canUpload')
      : isAdmin || Boolean(user?.canUpload)
    : false;

  const canEdit = isMounted
    ? resolvedModule
      ? can(resolvedModule, 'canEdit')
      : isAdmin || Boolean(user?.canEdit)
    : false;

  const canDelete = isMounted
    ? resolvedModule
      ? can(resolvedModule, 'canDelete')
      : isAdmin || Boolean(user?.canDelete)
    : false;

  const canDownload = isMounted
    ? resolvedModule
      ? can(resolvedModule, 'canDownload')
      : isAdmin || Boolean(user?.canDownload)
    : false;

  // Has explicit module permissions defined in user profile (Dynamic RBAC V2)
  const hasExplicitRBAC = Boolean(
    user?.permissionsByModule && Object.keys(user.permissionsByModule).length > 0
  );

  // Module / Division access permissions
  const canAccessContracts = Boolean(
    isMounted &&
      (isAdmin ||
        isDepartmentHead ||
        can('CONTRACTS', 'canView') ||
        (!hasExplicitRBAC && isGeneralContractDivision(user?.division)))
  );

  const canAccessPowerContracts = Boolean(
    isMounted &&
      (isAdmin ||
        isDepartmentHead ||
        can('POWER_CONTRACTS', 'canView') ||
        (!hasExplicitRBAC && isPowerContractDivision(user?.division)))
  );

  const canAccessLegalDocuments = Boolean(
    isMounted &&
      (isAdmin ||
        isDepartmentHead ||
        can('LEGAL_DOCUMENTS', 'canView') ||
        (!hasExplicitRBAC && isLegalAndDisputeDivision(user?.division)))
  );

  const canAccessLegalCases = Boolean(
    isMounted &&
      (isAdmin ||
        isDepartmentHead ||
        can('LEGAL_CASES', 'canView') ||
        (!hasExplicitRBAC && isLegalAndDisputeDivision(user?.division)))
  );

  const canAccessLegalAndDispute = canAccessLegalDocuments || canAccessLegalCases;

  const canAccessDivision = (divisionKey?: DivisionAccessKey): boolean => {
    if (!isMounted) return false;
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
    if (!isMounted || !user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!isMounted || !user) return false;
    if (isAdmin) return true;
    if (
      resolvedModule &&
      permission in { canView: 1, canUpload: 1, canEdit: 1, canDelete: 1, canDownload: 1 }
    ) {
      return can(resolvedModule, permission as PermissionActionKey);
    }
    return Boolean(user[permission]);
  };

  return {
    isMounted,
    user,
    role: user?.role,
    roleTitle: user?.roleTitle || user?.role || 'VIEWER',
    isAuthenticated,
    isAdmin,
    isDepartmentHead,
    isDivisionHead,
    canManageUsers,
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
