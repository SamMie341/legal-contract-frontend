import { apiClient } from '@infrastructure/api/client';
import {
  RoleItem,
  CreateRolePayload,
  UpdateRolePayload,
} from '@core/entities';

export interface RolesListResponse {
  message?: string;
  total?: number;
  data: RoleItem[];
}

export interface RoleDetailResponse {
  message?: string;
  data: RoleItem;
}

export const rolesApi = {
  /**
   * Get all roles with permission matrix and user counts
   */
  async getRoles(): Promise<RoleItem[]> {
    const res = await apiClient.get<RolesListResponse | RoleItem[]>('/roles');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  },

  /**
   * Get role by ID
   */
  async getRoleById(id: string): Promise<RoleItem> {
    const res = await apiClient.get<RoleDetailResponse | RoleItem>(`/roles/${id}`);
    if ('data' in res && res.data) return res.data;
    return res as RoleItem;
  },

  /**
   * Create custom role with permissions matrix
   */
  async createRole(payload: CreateRolePayload): Promise<RoleItem> {
    const res = await apiClient.post<RoleDetailResponse | RoleItem>('/roles', payload);
    if ('data' in res && res.data) return res.data;
    return res as RoleItem;
  },

  /**
   * Update role
   */
  async updateRole(id: string, payload: UpdateRolePayload): Promise<RoleItem> {
    const res = await apiClient.patch<RoleDetailResponse | RoleItem>(`/roles/${id}`, payload);
    if ('data' in res && res.data) return res.data;
    return res as RoleItem;
  },

  /**
   * Delete custom role
   */
  async deleteRole(id: string): Promise<{ id: string }> {
    const res = await apiClient.delete<{ message?: string; data?: { id: string } }>(
      `/roles/${id}`
    );
    return res.data || { id };
  },
};
