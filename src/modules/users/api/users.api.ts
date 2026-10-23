import { apiClient } from '@infrastructure/api/client';
import { ApiResponse, PaginatedResponse } from '@core/api';
import { User } from '@core/entities';
import {
  HrmEmployeeLookup,
  CreateUserPayload,
  UpdateUserPayload,
  UserQueryParams,
} from '../types/user-management.types';

export const usersApi = {
  /**
   * Fetch all users with pagination, search and filters
   */
  async getUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>('/users', { params });
  },

  /**
   * Fetch single user details by ID
   */
  async getUserById(id: string): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return res.data;
  },

  /**
   * Lookup employee from EDL HRM API by Employee Code
   */
  async lookupHrmEmployee(empCode: string): Promise<HrmEmployeeLookup> {
    const res = await apiClient.get<ApiResponse<HrmEmployeeLookup>>(`/users/hrm/${encodeURIComponent(empCode)}`);
    return res.data;
  },

  /**
   * Create a new user account (auto-syncs from HRM)
   */
  async createUser(payload: CreateUserPayload): Promise<User> {
    const res = await apiClient.post<ApiResponse<User>>('/users', payload);
    return res.data;
  },

  /**
   * Update user role, active status, or granular permissions
   */
  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    const res = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, payload);
    return res.data;
  },

  /**
   * Soft delete user account
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
