import { AuditAction, AuditLog, AuditLogCategory, AuditLogStats } from '@core/entities';

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: AuditLogCategory;
  action?: AuditAction | string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  targetUserId?: string;
  contractId?: string;
  powerContractId?: string;
}

export interface AuditLogsResponse {
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: AuditLog[];
}

export interface AuditLogStatsResponse {
  message: string;
  data: AuditLogStats;
}
