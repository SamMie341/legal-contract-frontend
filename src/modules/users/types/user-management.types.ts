import { UserRole, UserPermissions, User, SystemModuleKey } from '@core/entities';

export interface HrmEmployeeLookup {
  employeeCode: string;
  fullName: string;
  department: string;
  division: string;
  unit: string;
  position: string;
  email: string;
  phone: string;
  alreadyInSystem: boolean;
  isSameDivision?: boolean;
  canAdd?: boolean;
  divisionMismatchWarning?: string | null;
}

export interface UserModulePermissionInput {
  module: SystemModuleKey | string;
  canView: boolean;
  canUpload: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canDownload: boolean;
}

export interface CreateUserPayload extends Partial<UserPermissions> {
  employeeCode: string;
  role?: string | UserRole;
  roleId?: string;
  division?: string;
  department?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  modulePermissions?: UserModulePermissionInput[];
}

export interface UpdateUserPayload extends Partial<UserPermissions> {
  role?: string | UserRole;
  roleId?: string;
  isActive?: boolean;
  division?: string;
  department?: string;
  modulePermissions?: UserModulePermissionInput[];
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string | UserRole;
  isActive?: boolean;
}

export interface ResetPasswordPayload {
  newPassword?: string;
}

export interface ResetPasswordResult {
  userId: string;
  employeeCode: string;
  username: string;
  temporaryPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

