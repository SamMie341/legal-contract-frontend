/**
 * System Modules in EDL Legal System
 */
export type SystemModuleKey =
  | 'CONTRACTS'
  | 'POWER_CONTRACTS'
  | 'LEGAL_DOCUMENTS'
  | 'LEGAL_CASES';

/**
 * Permission Actions per module
 */
export type PermissionActionKey =
  | 'canView'
  | 'canUpload'
  | 'canEdit'
  | 'canDelete'
  | 'canDownload';

/**
 * Granular permissions for a module or global user
 */
export interface ModulePermission {
  canView: boolean;
  canUpload: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canDownload: boolean;
}

/**
 * User Roles in EDL Legal System
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  MAIN_USER = 'MAIN_USER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

/**
 * User Permissions (legacy and global convenience)
 */
export interface UserPermissions extends ModulePermission {}

/**
 * User-specific module permission override item
 */
export interface UserModulePermissionItem extends ModulePermission {
  id?: string;
  userId?: string;
  module: SystemModuleKey | string;
}

/**
 * User Entity matching backend V2 schema
 */
export interface User extends Partial<UserPermissions> {
  id: string;
  employeeCode: string;
  fullName: string;
  username?: string;
  role: string | UserRole;
  roleId?: string | null;
  roleTitle?: string | null;
  department?: string | null;
  division?: string | null;
  unit?: string | null;
  position?: string | null;
  email?: string | null;
  phone?: string | null;
  isActive?: boolean;
  accessibleModules?: string[];
  permissionsByModule?: Record<string, ModulePermission>;
  modulePermissions?: UserModulePermissionItem[];
  roleRef?: {
    id: string;
    name: string;
    title: string;
    description?: string | null;
    isSystem: boolean;
    permissions?: Array<{
      module: string;
      canView: boolean;
      canUpload: boolean;
      canEdit: boolean;
      canDelete: boolean;
      canDownload: boolean;
    }>;
  } | null;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Auth Token and Session payload returned on login
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

/**
 * Login payload
 */
export interface LoginCredentials {
  username: string;
  password: string;
}
