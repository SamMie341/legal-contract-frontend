import { apiClient } from '@infrastructure/api/client';
import {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  HrmDepartmentPreviewItem,
  SyncDepartmentsResponse,
} from '@core/entities';

export interface DepartmentQueryParams {
  search?: string;
  isActive?: boolean;
}

export const departmentsApi = {
  /**
   * Fetch all departments with optional search and active status filter
   */
  async getDepartments(params?: DepartmentQueryParams): Promise<{ total: number; data: Department[] }> {
    const query: Record<string, any> = {};
    if (params?.search) query.search = params.search;
    if (params?.isActive !== undefined) query.isActive = String(params.isActive);

    const res = await apiClient.get<{ message?: string; total?: number; data: Department[] }>(
      '/departments',
      { params: query }
    );

    const items = res.data || [];
    return {
      total: res.total ?? items.length,
      data: items,
    };
  },

  /**
   * Fetch single department by ID
   */
  async getDepartmentById(id: string): Promise<Department> {
    const res = await apiClient.get<{ message?: string; data: Department }>(`/departments/${id}`);
    return res.data;
  },

  /**
   * Preview list of departments from EDL HRM API before syncing
   */
  async getHrmPreview(): Promise<{ total: number; data: HrmDepartmentPreviewItem[] }> {
    const res = await apiClient.get<{ message?: string; total?: number; data: HrmDepartmentPreviewItem[] }>(
      '/departments/hrm'
    );
    return {
      total: res.total ?? (res.data || []).length,
      data: res.data || [],
    };
  },

  /**
   * Execute full sync of departments from EDL HRM API
   */
  async syncFromHrm(): Promise<SyncDepartmentsResponse> {
    const res = await apiClient.post<SyncDepartmentsResponse>('/departments/sync');
    return res;
  },

  /**
   * Create a new department manually
   */
  async createDepartment(payload: CreateDepartmentPayload): Promise<Department> {
    const res = await apiClient.post<{ message?: string; data: Department }>(
      '/departments',
      payload
    );
    return res.data;
  },

  /**
   * Update department details
   */
  async updateDepartment(id: string, payload: UpdateDepartmentPayload): Promise<Department> {
    const res = await apiClient.patch<{ message?: string; data: Department }>(
      `/departments/${id}`,
      payload
    );
    return res.data;
  },

  /**
   * Delete department (blocked if attached documents/cases exist)
   */
  async deleteDepartment(id: string): Promise<void> {
    await apiClient.delete(`/departments/${id}`);
  },
};
