import { apiClient } from './client';
import { Department } from '@core/entities';

export const departmentApi = {
  /**
   * Fetch all EDL departments
   */
  async getDepartments(): Promise<Department[]> {
    const res = await apiClient.get<{ message: string; total: number; data: Department[] }>(
      '/departments'
    );
    return res.data || [];
  },
};
