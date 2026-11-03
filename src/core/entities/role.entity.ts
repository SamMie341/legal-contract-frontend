import { SystemModuleKey, ModulePermission } from './user.entity';

/**
 * Permission assignment for a role
 */
export interface RolePermissionItem extends ModulePermission {
  id?: string;
  roleId?: string;
  module: SystemModuleKey | string;
}

/**
 * Role Item returned by GET /api/roles
 */
export interface RoleItem {
  id: string;
  name: string;
  title: string;
  description?: string | null;
  isSystem: boolean;
  permissions: RolePermissionItem[];
  _count?: {
    users: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload to create a new role
 */
export interface CreateRolePayload {
  name: string;
  title: string;
  description?: string;
  permissions: {
    module: SystemModuleKey | string;
    canView: boolean;
    canUpload: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canDownload: boolean;
  }[];
}

/**
 * Payload to update an existing role
 */
export interface UpdateRolePayload {
  name?: string;
  title?: string;
  description?: string;
  permissions?: {
    module: SystemModuleKey | string;
    canView: boolean;
    canUpload: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canDownload: boolean;
  }[];
}
