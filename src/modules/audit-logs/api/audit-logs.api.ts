import { apiClient } from '@infrastructure/api/client';
import { AuditLogStats } from '@core/entities';
import {
  AuditLogQueryParams,
  AuditLogsResponse,
  AuditLogStatsResponse,
} from '../types/audit-log.types';

export const auditLogsApi = {
  /**
   * Get paginated audit logs with search, category, action, and date filters
   */
  async getAuditLogs(params?: AuditLogQueryParams): Promise<AuditLogsResponse> {
    const cleanParams: Record<string, any> = {};

    if (params) {
      if (params.page) cleanParams.page = params.page;
      if (params.limit) cleanParams.limit = params.limit;
      if (params.search?.trim()) cleanParams.search = params.search.trim();
      if (params.category && params.category !== 'ALL') cleanParams.category = params.category;
      if (params.action && params.action !== 'ALL') cleanParams.action = params.action;
      if (params.startDate) cleanParams.startDate = params.startDate;
      if (params.endDate) cleanParams.endDate = params.endDate;
      if (params.userId) cleanParams.userId = params.userId;
      if (params.contractId) cleanParams.contractId = params.contractId;
      if (params.powerContractId) cleanParams.powerContractId = params.powerContractId;
    }

    return apiClient.get<AuditLogsResponse>('/audit-logs', { params: cleanParams });
  },

  /**
   * Get high-level audit logs statistics and KPI counts
   */
  async getAuditLogStats(): Promise<AuditLogStats> {
    const res = await apiClient.get<AuditLogStatsResponse>('/audit-logs/stats');
    return res.data;
  },
};
