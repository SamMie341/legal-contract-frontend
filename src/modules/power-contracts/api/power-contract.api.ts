import { apiClient } from '@infrastructure/api/client';
import { ApiResponse, PaginatedResponse } from '@core/api';
import {
  PowerContract,
  PowerContractDashboardData,
  PowerProjectTypeOption,
  PowerContractAttachment,
} from '@core/entities';
import { ENV } from '@core/config/env';
import { TokenStorage } from '@infrastructure/storage/token-storage';
import {
  CreatePowerContractPayload,
  UpdatePowerContractPayload,
  PowerContractQueryParams,
  PowerContractAuditLog,
} from '../types/power-contract.types';

export const powerContractApi = {
  /**
   * ດຶງຂໍ້ມູນສະຖິຕິ Dashboard ສັນຍາຊື້-ຂາຍໄຟຟ້າ
   */
  async getDashboard(): Promise<PowerContractDashboardData> {
    const res = await apiClient.get<ApiResponse<PowerContractDashboardData>>(
      '/power-contracts/dashboard'
    );
    return res.data;
  },

  /**
   * ດຶງ 5 ປະເພດໂຄງການສັນຍາຊື້ໄຟຟ້າ (Dropdown)
   */
  async getProjectTypes(): Promise<PowerProjectTypeOption[]> {
    const res = await apiClient.get<ApiResponse<PowerProjectTypeOption[]>>(
      '/power-contracts/project-types'
    );
    return res.data || [];
  },

  /**
   * ດຶງລາຍການສັນຍາຊື້-ຂາຍໄຟຟ້າທັງໝົດ ພ້ອມ Pagination ແລະ Filter
   */
  async getContracts(
    params?: PowerContractQueryParams
  ): Promise<PaginatedResponse<PowerContract>> {
    return apiClient.get<PaginatedResponse<PowerContract>>('/power-contracts', {
      params,
    });
  },

  /**
   * ດຶງລາຍລະອຽດສັນຍາຊື້-ຂາຍໄຟຟ້າຕາມ ID
   */
  async getContractById(id: string): Promise<PowerContract> {
    const res = await apiClient.get<ApiResponse<PowerContract>>(
      `/power-contracts/${id}`
    );
    return res.data;
  },

  /**
   * ສ້າງສັນຍາຊື້-ຂາຍໄຟຟ້າໃໝ່
   */
  async createContract(
    payload: CreatePowerContractPayload
  ): Promise<PowerContract> {
    const res = await apiClient.post<ApiResponse<PowerContract>>(
      '/power-contracts',
      payload
    );
    return res.data;
  },

  /**
   * ແກ້ໄຂຂໍ້ມູນສັນຍາຊື້-ຂາຍໄຟຟ້າ
   */
  async updateContract(
    id: string,
    payload: UpdatePowerContractPayload
  ): Promise<PowerContract> {
    const res = await apiClient.patch<ApiResponse<PowerContract>>(
      `/power-contracts/${id}`,
      payload
    );
    return res.data;
  },

  /**
   * ລົບສັນຍາຊື້-ຂາຍໄຟຟ້າ (Soft Delete)
   */
  async deleteContract(id: string): Promise<void> {
    await apiClient.delete(`/power-contracts/${id}`);
  },

  /**
   * ດຶງປະຫວັດການແກ້ໄຂສັນຍາ (Audit Trail / History)
   */
  async getContractHistory(
    id: string,
    params?: { page?: number; limit?: number; action?: string }
  ): Promise<PowerContractAuditLog[]> {
    const res = await apiClient.get<{
      message: string;
      data: PowerContractAuditLog[];
    }>(`/power-contracts/${id}/history`, { params });
    return res.data || [];
  },

  /**
   * ດຶງລາຍການໄຟລ໌ແນບຂອງສັນຍາ
   */
  async getAttachments(
    powerContractId: string
  ): Promise<PowerContractAttachment[]> {
    const res = await apiClient.get<ApiResponse<PowerContractAttachment[]>>(
      `/power-contracts/${powerContractId}/attachments`
    );
    return res.data || [];
  },

  /**
   * ອັບໂຫຼດໄຟລ໌ແນບສັນຍາຊື້-ຂາຍໄຟຟ້າ
   */
  async uploadAttachment(
    powerContractId: string,
    file: File
  ): Promise<PowerContractAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<PowerContractAttachment>>(
      `/power-contracts/${powerContractId}/attachments`,
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
   * ດາວໂຫຼດໄຟລ໌ແນບ
   */
  async downloadAttachment(
    attachmentId: string,
    fileName: string
  ): Promise<void> {
    const token = TokenStorage.getAccessToken();
    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : '';
    const endpoint = `${ENV.API_URL}/power-contracts/attachments/${attachmentId}/download${tokenQuery}`;

    const link = document.createElement('a');
    link.href = endpoint;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * ດຶງ URL ສຳລັບ Preview ໄຟລ໌ PDF ຫຼື ຮູບພາບ Inline
   */
  getAttachmentPreviewUrl(attachmentId: string): string {
    const token = TokenStorage.getAccessToken();
    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : '';
    return `${ENV.API_URL}/power-contracts/attachments/${attachmentId}/preview${tokenQuery}`;
  },

  /**
   * ລົບໄຟລ໌ແນບ
   */
  async deleteAttachment(attachmentId: string): Promise<void> {
    await apiClient.delete(`/power-contracts/attachments/${attachmentId}`);
  },
};
