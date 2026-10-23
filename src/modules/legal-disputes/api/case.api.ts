import { apiClient, httpClient } from '@infrastructure/api/client';
import { ApiResponse, PaginatedResponse } from '@core/api';
import { LegalCase } from '@core/entities';
import { ENV } from '@core/config/env';
import { TokenStorage } from '@infrastructure/storage/token-storage';
import {
  CaseDashboardData,
  QueryLegalCaseParams,
  CreateLegalCasePayload,
  UpdateLegalCasePayload,
  CaseAttachmentItem,
} from '../types/case.types';

export const caseApi = {
  /**
   * Fetch legal cases & disputes dashboard statistics
   */
  async getDashboard(): Promise<CaseDashboardData> {
    const res = await apiClient.get<ApiResponse<CaseDashboardData>>('/legal-cases/dashboard');
    return res.data;
  },

  /**
   * Fetch legal cases with pagination & filter
   */
  async getCases(params?: QueryLegalCaseParams): Promise<PaginatedResponse<LegalCase>> {
    return apiClient.get<PaginatedResponse<LegalCase>>('/legal-cases', { params });
  },

  /**
   * Fetch single case by ID (UUID or caseCode)
   */
  async getCaseById(id: string): Promise<LegalCase> {
    const res = await apiClient.get<ApiResponse<LegalCase>>(`/legal-cases/${id}`);
    return res.data;
  },

  /**
   * Create new legal case
   */
  async createCase(payload: CreateLegalCasePayload): Promise<LegalCase> {
    const res = await apiClient.post<ApiResponse<LegalCase>>('/legal-cases', payload);
    return res.data;
  },

  /**
   * Update legal case
   */
  async updateCase(id: string, payload: UpdateLegalCasePayload): Promise<LegalCase> {
    const res = await apiClient.patch<ApiResponse<LegalCase>>(`/legal-cases/${id}`, payload);
    return res.data;
  },

  /**
   * Soft delete case
   */
  async deleteCase(id: string): Promise<void> {
    await apiClient.delete(`/legal-cases/${id}`);
  },

  /**
   * Upload an attachment file to a case
   */
  async uploadAttachment(caseId: string, file: File): Promise<CaseAttachmentItem> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<CaseAttachmentItem>>(
      `/legal-cases/${caseId}/attachments`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
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
    const endpoint = `${ENV.API_URL}/legal-cases/attachments/${attachmentId}/download${tokenQuery}`;

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
    return `${ENV.API_URL}/legal-cases/attachments/${attachmentId}/preview${tokenQuery}`;
  },

  /**
   * Delete an attachment
   */
  async deleteAttachment(attachmentId: string): Promise<void> {
    await apiClient.delete(`/legal-cases/attachments/${attachmentId}`);
  },
};
