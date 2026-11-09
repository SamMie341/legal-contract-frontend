import {
  User,
  UserRole,
  SystemModuleKey,
  ModulePermission,
  RoleItem,
} from '@core/entities';
import {
  isGeneralContractDivision,
  isPowerContractDivision,
  isLegalAndDisputeDivision,
} from '@core/constants';

export const DEFAULT_MODULE_PERMISSIONS: Record<SystemModuleKey, ModulePermission> = {
  CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  LEGAL_AND_DISPUTE: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
};

export function normalizeModKey(moduleInput: any): SystemModuleKey | null {
  if (!moduleInput) return null;
  const s = String(moduleInput).toUpperCase().replace(/-/g, '_').trim();
  if (s === 'CONTRACTS' || s === 'CONTRACT_TYPES') return 'CONTRACTS';
  if (s === 'POWER_CONTRACTS') return 'POWER_CONTRACTS';
  if (s === 'LEGAL_DOCUMENTS') return 'LEGAL_DOCUMENTS';
  if (s === 'LEGAL_CASES') return 'LEGAL_CASES';
  if (s === 'LEGAL_AND_DISPUTE') return 'LEGAL_AND_DISPUTE';
  return null;
}

/**
 * Builds the default permission matrix for a role, scoped to division for system roles.
 */
export function buildMatrixForRole(
  roleItem?: RoleItem | null,
  division?: string | null
): Record<SystemModuleKey, ModulePermission> {
  const result: Record<SystemModuleKey, ModulePermission> = {
    CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    LEGAL_AND_DISPUTE: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
  };

  if (!roleItem) return result;

  const roleName = String(roleItem.name || '').toUpperCase();

  // 1. ADMIN: Full access to all 3 pillars
  if (roleName === 'ADMIN') {
    (Object.keys(result) as SystemModuleKey[]).forEach((m) => {
      result[m] = { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true };
    });
    return result;
  }

  // 2. DEPARTMENT_HEAD: View and download across all 3 pillars
  if (roleName === 'DEPARTMENT_HEAD') {
    (Object.keys(result) as SystemModuleKey[]).forEach((m) => {
      result[m] = { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true };
    });
    return result;
  }

  // 3. System Roles (DIVISION_HEAD, MAIN_USER, EDITOR, VIEWER)
  // Scoped strictly to the user's home division
  const isSystemRole =
    roleItem.isSystem ||
    Object.values(UserRole).includes(roleName as UserRole);

  if (isSystemRole) {
    const isGen = isGeneralContractDivision(division);
    const isPwr = isPowerContractDivision(division);
    const isLeg = isLegalAndDisputeDivision(division);

    const getRolePermForMod = (mod: string): ModulePermission => {
      const p = roleItem.permissions?.find((rp: any) => normalizeModKey(rp.module) === mod);
      if (p) {
        return {
          canView: Boolean(p.canView),
          canUpload: Boolean(p.canUpload),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
          canDownload: Boolean(p.canDownload),
        };
      }
      const isFull = roleName === 'DIVISION_HEAD' || roleName === 'MAIN_USER';
      const isEd = roleName === 'EDITOR';
      const isVw = roleName === 'VIEWER';
      return {
        canView: true,
        canUpload: isFull || isEd,
        canEdit: isFull || isEd,
        canDelete: isFull,
        canDownload: isFull || isEd || !isVw,
      };
    };

    if (isGen) {
      result.CONTRACTS = getRolePermForMod('CONTRACTS');
    }
    if (isPwr) {
      result.POWER_CONTRACTS = getRolePermForMod('POWER_CONTRACTS');
    }
    if (isLeg) {
      const docP = getRolePermForMod('LEGAL_DOCUMENTS');
      const caseP = getRolePermForMod('LEGAL_CASES');
      result.LEGAL_DOCUMENTS = docP;
      result.LEGAL_CASES = caseP;
      result.LEGAL_AND_DISPUTE = {
        canView: Boolean(docP.canView || caseP.canView),
        canUpload: Boolean(docP.canUpload || caseP.canUpload),
        canEdit: Boolean(docP.canEdit || caseP.canEdit),
        canDelete: Boolean(docP.canDelete || caseP.canDelete),
        canDownload: Boolean(docP.canDownload || caseP.canDownload),
      };
    }

    return result;
  }

  // 4. Custom Roles: Use permissions directly from role configuration
  if (roleItem.permissions && Array.isArray(roleItem.permissions)) {
    roleItem.permissions.forEach((p: any) => {
      const perm: ModulePermission = {
        canView: Boolean(p.canView),
        canUpload: Boolean(p.canUpload),
        canEdit: Boolean(p.canEdit),
        canDelete: Boolean(p.canDelete),
        canDownload: Boolean(p.canDownload),
      };

      const normalized = normalizeModKey(p.module);
      if (normalized === 'LEGAL_AND_DISPUTE') {
        result.LEGAL_AND_DISPUTE = { ...perm };
        result.LEGAL_DOCUMENTS = { ...perm };
        result.LEGAL_CASES = { ...perm };
      } else if (normalized === 'LEGAL_DOCUMENTS' || normalized === 'LEGAL_CASES') {
        result[normalized] = { ...perm };
        result.LEGAL_AND_DISPUTE = {
          canView: Boolean(result.LEGAL_AND_DISPUTE.canView || perm.canView),
          canUpload: Boolean(result.LEGAL_AND_DISPUTE.canUpload || perm.canUpload),
          canEdit: Boolean(result.LEGAL_AND_DISPUTE.canEdit || perm.canEdit),
          canDelete: Boolean(result.LEGAL_AND_DISPUTE.canDelete || perm.canDelete),
          canDownload: Boolean(result.LEGAL_AND_DISPUTE.canDownload || perm.canDownload),
        };
      } else if (normalized && result[normalized]) {
        result[normalized] = { ...perm };
      }
    });
  }

  return result;
}

/**
 * Checks whether two permission matrices have different settings.
 */
export function isMatrixDifferent(
  a: Record<SystemModuleKey, ModulePermission>,
  b: Record<SystemModuleKey, ModulePermission>
): boolean {
  const keys: SystemModuleKey[] = ['CONTRACTS', 'POWER_CONTRACTS', 'LEGAL_DOCUMENTS', 'LEGAL_CASES'];
  return keys.some((k) => {
    const ma = a[k] || { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false };
    const mb = b[k] || { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false };
    return (
      Boolean(ma.canView) !== Boolean(mb.canView) ||
      Boolean(ma.canUpload) !== Boolean(mb.canUpload) ||
      Boolean(ma.canEdit) !== Boolean(mb.canEdit) ||
      Boolean(ma.canDelete) !== Boolean(mb.canDelete) ||
      Boolean(ma.canDownload) !== Boolean(mb.canDownload)
    );
  });
}

/**
 * Resolves the initial permission matrix for a user in the Edit Permissions modal.
 * Only grants and checks modules that the user actually has access to.
 */
export function resolveInitialMatrix(
  user: User,
  roles?: RoleItem[]
): { matrix: Record<SystemModuleKey, ModulePermission>; isOverride: boolean; selectedRoleId: string } {
  const matchedRole =
    roles?.find((r) => r.id === user.roleId || r.name === user.role) ||
    user.roleRef;

  const roleId = user.roleId || matchedRole?.id || '';
  const roleName = String(user.role || matchedRole?.name || 'VIEWER').toUpperCase();
  const isAdmin = roleName === 'ADMIN';
  const isDeptHead = roleName === 'DEPARTMENT_HEAD';

  // 1. ADMIN
  if (isAdmin) {
    const adminMatrix: Record<SystemModuleKey, ModulePermission> = {
      CONTRACTS: { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true },
      POWER_CONTRACTS: { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true },
      LEGAL_AND_DISPUTE: { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true },
      LEGAL_DOCUMENTS: { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true },
      LEGAL_CASES: { canView: true, canUpload: true, canEdit: true, canDelete: true, canDownload: true },
    };
    return { matrix: adminMatrix, isOverride: false, selectedRoleId: roleId };
  }

  // 2. DEPARTMENT_HEAD
  if (isDeptHead) {
    const deptMatrix: Record<SystemModuleKey, ModulePermission> = {
      CONTRACTS: { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true },
      POWER_CONTRACTS: { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true },
      LEGAL_AND_DISPUTE: { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true },
      LEGAL_DOCUMENTS: { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true },
      LEGAL_CASES: { canView: true, canUpload: false, canEdit: false, canDelete: false, canDownload: true },
    };
    return { matrix: deptMatrix, isOverride: false, selectedRoleId: roleId };
  }

  const defaultMatrix = buildMatrixForRole(matchedRole as RoleItem, user.division);

  // 3. User-Specific Overrides (modulePermissions or permissionsByModule)
  const hasModulePermissions = Boolean(
    user.modulePermissions && Array.isArray(user.modulePermissions) && user.modulePermissions.length > 0
  );
  const hasPermissionsByModule = Boolean(
    user.permissionsByModule && Object.keys(user.permissionsByModule).length > 0
  );

  if (hasModulePermissions || hasPermissionsByModule) {
    const customMatrix: Record<SystemModuleKey, ModulePermission> = {
      CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
      POWER_CONTRACTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
      LEGAL_AND_DISPUTE: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
      LEGAL_DOCUMENTS: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
      LEGAL_CASES: { canView: false, canUpload: false, canEdit: false, canDelete: false, canDownload: false },
    };

    if (hasModulePermissions && user.modulePermissions) {
      user.modulePermissions.forEach((p) => {
        const perm: ModulePermission = {
          canView: Boolean(p.canView),
          canUpload: Boolean(p.canUpload),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
          canDownload: Boolean(p.canDownload),
        };

        const normalized = normalizeModKey(p.module);
        if (normalized === 'CONTRACTS') customMatrix.CONTRACTS = { ...perm };
        else if (normalized === 'POWER_CONTRACTS') customMatrix.POWER_CONTRACTS = { ...perm };
        else if (normalized === 'LEGAL_DOCUMENTS') customMatrix.LEGAL_DOCUMENTS = { ...perm };
        else if (normalized === 'LEGAL_CASES') customMatrix.LEGAL_CASES = { ...perm };
        else if (normalized === 'LEGAL_AND_DISPUTE') {
          customMatrix.LEGAL_AND_DISPUTE = { ...perm };
          customMatrix.LEGAL_DOCUMENTS = { ...perm };
          customMatrix.LEGAL_CASES = { ...perm };
        }
      });
    } else if (hasPermissionsByModule && user.permissionsByModule) {
      Object.entries(user.permissionsByModule).forEach(([mod, p]) => {
        const perm: ModulePermission = {
          canView: Boolean(p.canView),
          canUpload: Boolean(p.canUpload),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
          canDownload: Boolean(p.canDownload),
        };

        const normalized = normalizeModKey(mod);
        if (normalized === 'CONTRACTS') customMatrix.CONTRACTS = { ...perm };
        else if (normalized === 'POWER_CONTRACTS') customMatrix.POWER_CONTRACTS = { ...perm };
        else if (normalized === 'LEGAL_DOCUMENTS') customMatrix.LEGAL_DOCUMENTS = { ...perm };
        else if (normalized === 'LEGAL_CASES') customMatrix.LEGAL_CASES = { ...perm };
        else if (normalized === 'LEGAL_AND_DISPUTE') {
          customMatrix.LEGAL_AND_DISPUTE = { ...perm };
          customMatrix.LEGAL_DOCUMENTS = { ...perm };
          customMatrix.LEGAL_CASES = { ...perm };
        }
      });
    }

    // Synthesize LEGAL_AND_DISPUTE from its sub-modules
    customMatrix.LEGAL_AND_DISPUTE = {
      canView: Boolean(customMatrix.LEGAL_AND_DISPUTE.canView || customMatrix.LEGAL_DOCUMENTS.canView || customMatrix.LEGAL_CASES.canView),
      canUpload: Boolean(customMatrix.LEGAL_AND_DISPUTE.canUpload || customMatrix.LEGAL_DOCUMENTS.canUpload || customMatrix.LEGAL_CASES.canUpload),
      canEdit: Boolean(customMatrix.LEGAL_AND_DISPUTE.canEdit || customMatrix.LEGAL_DOCUMENTS.canEdit || customMatrix.LEGAL_CASES.canEdit),
      canDelete: Boolean(customMatrix.LEGAL_AND_DISPUTE.canDelete || customMatrix.LEGAL_DOCUMENTS.canDelete || customMatrix.LEGAL_CASES.canDelete),
      canDownload: Boolean(customMatrix.LEGAL_AND_DISPUTE.canDownload || customMatrix.LEGAL_DOCUMENTS.canDownload || customMatrix.LEGAL_CASES.canDownload),
    };

    const isDifferent = isMatrixDifferent(customMatrix, defaultMatrix);
    return { matrix: customMatrix, isOverride: isDifferent, selectedRoleId: roleId };
  }

  // 4. Default Role Template
  return { matrix: defaultMatrix, isOverride: false, selectedRoleId: roleId };
}

/**
 * Resolves the 3 core pillars for UserDetailModal.
 */
export function resolveEffectiveUserPillars(
  user: User,
  roles?: RoleItem[]
): Record<'CONTRACTS' | 'POWER_CONTRACTS' | 'LEGAL_AND_DISPUTE', { permissions: ModulePermission; isOverride: boolean }> {
  const { matrix, isOverride } = resolveInitialMatrix(user, roles);

  return {
    CONTRACTS: { permissions: matrix.CONTRACTS, isOverride },
    POWER_CONTRACTS: { permissions: matrix.POWER_CONTRACTS, isOverride },
    LEGAL_AND_DISPUTE: { permissions: matrix.LEGAL_AND_DISPUTE, isOverride },
  };
}

/**
 * Gets accessible modules for PermissionPills in UserTable.
 */
export function getAccessiblePillarsForUser(user: User, roles?: RoleItem[]): string[] {
  const roleName = String(user.role || '').toUpperCase();
  if (roleName === 'ADMIN' || roleName === 'DEPARTMENT_HEAD') {
    return ['CONTRACTS', 'POWER_CONTRACTS', 'LEGAL_DOCUMENTS', 'LEGAL_CASES'];
  }

  const { matrix } = resolveInitialMatrix(user, roles);
  const accessible: string[] = [];
  if (matrix.CONTRACTS?.canView) accessible.push('CONTRACTS');
  if (matrix.POWER_CONTRACTS?.canView) accessible.push('POWER_CONTRACTS');
  if (matrix.LEGAL_AND_DISPUTE?.canView || matrix.LEGAL_DOCUMENTS?.canView || matrix.LEGAL_CASES?.canView) {
    accessible.push('LEGAL_DOCUMENTS');
    accessible.push('LEGAL_CASES');
  }
  return accessible;
}

/**
 * Returns backend module keys allowed for a division.
 * Used for DIVISION_HEAD scoping so forbidden modules outside their division are never sent.
 */
export function getAllowedBackendKeysForDivision(division?: string | null): SystemModuleKey[] {
  if (isGeneralContractDivision(division)) {
    return ['CONTRACTS'];
  }
  if (isPowerContractDivision(division)) {
    return ['POWER_CONTRACTS'];
  }
  if (isLegalAndDisputeDivision(division)) {
    return ['LEGAL_DOCUMENTS', 'LEGAL_CASES'];
  }
  return [];
}

/**
 * Returns the 3-pillar keys allowed for a division.
 */
export function getAllowedPillarsForDivision(
  division?: string | null
): ('CONTRACTS' | 'POWER_CONTRACTS' | 'LEGAL_AND_DISPUTE')[] {
  if (isGeneralContractDivision(division)) {
    return ['CONTRACTS'];
  }
  if (isPowerContractDivision(division)) {
    return ['POWER_CONTRACTS'];
  }
  if (isLegalAndDisputeDivision(division)) {
    return ['LEGAL_AND_DISPUTE'];
  }
  return [];
}
