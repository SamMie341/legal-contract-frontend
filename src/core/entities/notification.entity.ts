export type NotificationType = 'CONTRACT' | 'POWER_CONTRACT';

export interface AppNotification {
  id: string;
  type: NotificationType;
  targetId: string;
  title: string;
  message: string;
  isRead: boolean;
  notifiedDate: string;
  contractNumber?: string;
  contractName?: string;
  expirationDate?: string;
  daysLeft?: number;
}

export interface RawContractNotification {
  id: string;
  contractId: string;
  userId?: string | null;
  title: string;
  message: string;
  isRead: boolean;
  notifiedDate: string;
  contract?: {
    id?: string;
    contractNumber?: string;
    title?: string;
    expirationDate?: string;
  };
}

export interface RawPowerContractNotification {
  id: string;
  powerContractId: string;
  userId?: string | null;
  title: string;
  message: string;
  isRead: boolean;
  notifiedDate: string;
  powerContract?: {
    id?: string;
    contractNumber?: string;
    projectName?: string;
    contractType?: string;
    expirationDate?: string;
  };
}

export interface NotificationApiResponse<T> {
  message: string;
  unreadCount: number;
  total: number;
  data: T[];
}
