'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePermissions } from '@/presentation/hooks';
import { notificationApi } from '../api/notification.api';
import {
  AppNotification,
  RawContractNotification,
  RawPowerContractNotification,
  NotificationType,
} from '@core/entities';

export function useNotifications() {
  const queryClient = useQueryClient();
  const { isAdmin, canAccessDivision } = usePermissions();

  const canAccessContracts = isAdmin || canAccessDivision('CONTRACTS');
  const canAccessPower = isAdmin || canAccessDivision('POWER_CONTRACTS');

  // Query general contract notifications
  const generalQuery = useQuery({
    queryKey: ['notifications', 'general'],
    queryFn: () => notificationApi.getGeneralNotifications(false),
    enabled: Boolean(canAccessContracts),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  // Query power contract notifications
  const powerQuery = useQuery({
    queryKey: ['notifications', 'power'],
    queryFn: () => notificationApi.getPowerNotifications(false),
    enabled: Boolean(canAccessPower),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  // Combine and normalize notifications
  const normalizedNotifications: AppNotification[] = [];

  const calculateDaysLeft = (dateStr?: string): number | undefined => {
    if (!dateStr) return undefined;
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (generalQuery.data?.data) {
    for (const item of generalQuery.data.data) {
      normalizedNotifications.push({
        id: item.id,
        type: 'CONTRACT',
        targetId: item.contractId,
        title: item.title,
        message: item.message,
        isRead: item.isRead,
        notifiedDate: item.notifiedDate,
        contractNumber: item.contract?.contractNumber,
        contractName: item.contract?.title,
        expirationDate: item.contract?.expirationDate,
        daysLeft: calculateDaysLeft(item.contract?.expirationDate),
      });
    }
  }

  if (powerQuery.data?.data) {
    for (const item of powerQuery.data.data) {
      normalizedNotifications.push({
        id: item.id,
        type: 'POWER_CONTRACT',
        targetId: item.powerContractId,
        title: item.title,
        message: item.message,
        isRead: item.isRead,
        notifiedDate: item.notifiedDate,
        contractNumber: item.powerContract?.contractNumber,
        contractName: item.powerContract?.projectName,
        expirationDate: item.powerContract?.expirationDate,
        daysLeft: calculateDaysLeft(item.powerContract?.expirationDate),
      });
    }
  }

  // Sort descending by notified date
  normalizedNotifications.sort((a, b) => {
    return new Date(b.notifiedDate).getTime() - new Date(a.notifiedDate).getTime();
  });

  const unreadCount = normalizedNotifications.filter((n) => !n.isRead).length;

  // Mark single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: NotificationType }) => {
      if (type === 'CONTRACT') {
        return notificationApi.markGeneralAsRead(id);
      }
      return notificationApi.markPowerAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const promises: Promise<any>[] = [];
      if (canAccessContracts) {
        promises.push(notificationApi.markAllGeneralAsRead());
      }
      if (canAccessPower) {
        promises.push(notificationApi.markAllPowerAsRead());
      }
      return Promise.allSettled(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: normalizedNotifications,
    unreadCount,
    isLoading: generalQuery.isLoading || powerQuery.isLoading,
    isError: generalQuery.isError && powerQuery.isError,
    markAsRead: (id: string, type: NotificationType) =>
      markAsReadMutation.mutateAsync({ id, type }),
    markAllAsRead: () => markAllAsReadMutation.mutateAsync(),
    isMarkingAll: markAllAsReadMutation.isPending,
    refetch: () => {
      if (canAccessContracts) generalQuery.refetch();
      if (canAccessPower) powerQuery.refetch();
    },
  };
}
