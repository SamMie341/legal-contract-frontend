'use client';

import { useQuery } from '@tanstack/react-query';
import { auditLogsApi } from '../api/audit-logs.api';
import { AuditLogQueryParams } from '../types/audit-log.types';

export function useAuditLogs(params?: AuditLogQueryParams) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => auditLogsApi.getAuditLogs(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useAuditLogStats() {
  return useQuery({
    queryKey: ['audit-logs', 'stats'],
    queryFn: () => auditLogsApi.getAuditLogStats(),
    staleTime: 60 * 1000, // 1 minute
  });
}
