import { apiClient, httpClient } from '@infrastructure/api/client';
import { ApiResponse, PaginatedResponse } from '@core/api';
import { LegalDocument } from '@core/entities';
import { ENV } from '@core/config/env';
import { TokenStorage } from '@infrastructure/storage/token-storage';
import {
  DocumentDashboardData,
  QueryLegalDocumentParams,
  CreateLegalDocumentPayload,
  UpdateLegalDocumentPayload,
  DocumentAttachmentItem,
} from '../types/document.types';

export const documentApi = {
  /**
   * Fetch legal documents dashboard statistics
   */
  async getDashboard(): Promise<DocumentDashboardData> {
    const res = await apiClient.get<ApiResponse<DocumentDashboardData>>('/legal-documents/dashboard');
    return res.data;
  },

  /**
   * Fetch legal documents with pagination & filter
   */
  async getDocuments(params?: QueryLegalDocumentParams): Promise<PaginatedResponse<LegalDocument>> {
    return apiClient.get<PaginatedResponse<LegalDocument>>('/legal-documents', { params });
  },

  /**
   * Fetch single legal document by ID
   */
  async getDocumentById(id: string): Promise<LegalDocument> {
    const res = await apiClient.get<ApiResponse<LegalDocument>>(`/legal-documents/${id}`);
    return res.data;
  },

  /**
   * Create new legal document
   */
  async createDocument(payload: CreateLegalDocumentPayload): Promise<LegalDocument> {
    const res = await apiClient.post<ApiResponse<LegalDocument>>('/legal-documents', payload);
    return res.data;
  },

  /**
   * Update legal document
   */
  async updateDocument(id: string, payload: UpdateLegalDocumentPayload): Promise<LegalDocument> {
    const res = await apiClient.patch<ApiResponse<LegalDocument>>(`/legal-documents/${id}`, payload);
    return res.data;
  },

  /**
   * Soft delete legal document
   */
  async deleteDocument(id: string): Promise<void> {
    await apiClient.delete(`/legal-documents/${id}`);
  },

  /**
   * Upload an attachment file to a legal document
   */
  async uploadAttachment(documentId: string, file: File): Promise<DocumentAttachmentItem> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<DocumentAttachmentItem>>(
      `/legal-documents/${documentId}/attachments`,
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
    const endpoint = `${ENV.API_URL}/legal-documents/attachments/${attachmentId}/download${tokenQuery}`;

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
    return `${ENV.API_URL}/legal-documents/attachments/${attachmentId}/preview${tokenQuery}`;
  },

  /**
   * Delete an attachment
   */
  async deleteAttachment(attachmentId: string): Promise<void> {
    await apiClient.delete(`/legal-documents/attachments/${attachmentId}`);
  },
};
