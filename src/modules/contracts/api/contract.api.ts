import { apiClient, httpClient } from '@infrastructure/api/client';
import { ApiResponse, PaginatedResponse } from '@core/api';
import { Contract } from '@core/entities';
import { ENV } from '@core/config/env';
import { TokenStorage } from '@infrastructure/storage/token-storage';
import {
  ContractDashboardData,
  ContractQueryParams,
  ContractTypeDropdownItem,
  CreateContractPayload,
  UpdateContractPayload,
  ContractDetail,
  ContractAttachmentItem,
  ContractAuditLog,
} from '../types/contract.types';

export const contractApi = {
  /**
   * Fetch contract dashboard statistics
   */
  async getDashboard(): Promise<ContractDashboardData> {
    const res = await apiClient.get<ApiResponse<ContractDashboardData>>('/contracts/dashboard');
    return res.data;
  },

  /**
   * Fetch contracts with pagination & filtering
   */
  async getContracts(params?: ContractQueryParams): Promise<PaginatedResponse<Contract>> {
    return apiClient.get<PaginatedResponse<Contract>>('/contracts', { params });
  },

  /**
   * Fetch single contract details by ID with attachments and audit trail
   */
  async getContractById(id: string): Promise<ContractDetail> {
    const res = await apiClient.get<ApiResponse<ContractDetail>>(`/contracts/${id}`);
    return res.data;
  },

  /**
   * Create a new contract
   */
  async createContract(payload: CreateContractPayload): Promise<Contract> {
    const res = await apiClient.post<ApiResponse<Contract>>('/contracts', payload);
    return res.data;
  },

  /**
   * Update contract information
   */
  async updateContract(id: string, payload: UpdateContractPayload): Promise<Contract> {
    const res = await apiClient.patch<ApiResponse<Contract>>(`/contracts/${id}`, payload);
    return res.data;
  },

  /**
   * Fetch 14 master contract types for dropdown selection
   */
  async getContractTypesDropdown(): Promise<ContractTypeDropdownItem[]> {
    const res = await apiClient.get<{ message: string; total: number; data: ContractTypeDropdownItem[] }>(
      '/contract-types/dropdown'
    );
    return res.data || [];
  },

  /**
   * Soft delete a contract
   */
  async deleteContract(id: string): Promise<void> {
    await apiClient.delete(`/contracts/${id}`);
  },

  /**
   * Upload an attachment file to a contract
   */
  async uploadAttachment(contractId: string, file: File): Promise<ContractAttachmentItem> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<ContractAttachmentItem>>(
      `/contracts/${contractId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  },

  /**
   * Securely download an attachment
   */
  async downloadAttachment(attachmentId: string, fileName: string): Promise<void> {
    const token = TokenStorage.getAccessToken();
    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : '';
    const endpoint = `${ENV.API_URL}/contracts/attachments/${attachmentId}/download${tokenQuery}`;

    const link = document.createElement('a');
    link.href = endpoint;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * Get preview stream URL for PDF or image attachment
   */
  async getAttachmentPreviewUrl(attachmentId: string): Promise<string> {
    const token = TokenStorage.getAccessToken();
    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : '';
    return `${ENV.API_URL}/contracts/attachments/${attachmentId}/preview${tokenQuery}`;
  },

  /**
   * Delete an attachment
   */
  async deleteAttachment(attachmentId: string): Promise<void> {
    await apiClient.delete(`/contracts/attachments/${attachmentId}`);
  },

  /**
   * Fetch contract edit history / audit trail
   */
  async getContractHistory(contractId: string): Promise<ContractAuditLog[]> {
    const res = await apiClient.get<{ message: string; data: ContractAuditLog[] }>(
      `/contracts/${contractId}/history`
    );
    return res.data || [];
  },
};
