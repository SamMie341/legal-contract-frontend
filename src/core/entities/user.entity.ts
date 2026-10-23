/**
 * User Roles in EDL Legal System
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MAIN_USER = 'MAIN_USER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

/**
 * Granular permissions for operations
 */
export interface UserPermissions {
  canView: boolean;
  canUpload: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canDownload: boolean;
}

/**
 * User Entity matching backend schema
 */
export interface User extends UserPermissions {
  id: string;
  employeeCode: string;
  fullName: string;
  role: UserRole;
  department?: string | null;
  division?: string | null;
  unit?: string | null;
  email?: string | null;
  phone?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Auth Token and Session payload returned on login
 */
export interface AuthResponse {
  accessToken: string;
  user: User;
}

/**
 * Login payload
 */
export interface LoginCredentials {
  username: string;
  password: string;
}
