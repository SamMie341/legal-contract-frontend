import { UserRole, UserPermissions, User } from '@core/entities';

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
}

export interface CreateUserPayload extends Partial<UserPermissions> {
  employeeCode: string;
  role?: UserRole;
}

export interface UpdateUserPayload extends Partial<UserPermissions> {
  role?: UserRole;
  isActive?: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}
