'use client';

import { useAuthStore } from '@application/store';
import { UserRole, UserPermissions } from '@core/entities';

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
    hasRole,
    hasPermission,
  };
}
