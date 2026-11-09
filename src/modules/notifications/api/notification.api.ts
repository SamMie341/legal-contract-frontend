import { apiClient } from '@infrastructure/api/client';
import {
  NotificationApiResponse,
  RawContractNotification,
  RawPowerContractNotification,
} from '@core/entities';

export const notificationApi = {
  /**
   * ດຶງການແຈ້ງເຕືອນສັນຍາທົ່ວໄປ (General Contracts)
   */
  async getGeneralNotifications(
    unreadOnly: boolean = false
  ): Promise<NotificationApiResponse<RawContractNotification>> {
    return apiClient.get<NotificationApiResponse<RawContractNotification>>(
      '/notifications',
      {
        params: { unreadOnly: String(unreadOnly) },
      }
    );
  },

  /**
   * ດຶງການແຈ້ງເຕືອນສັນຍາຊື້-ຂາຍໄຟຟ້າ (Power Contracts)
   */
  async getPowerNotifications(
    unreadOnly: boolean = false
  ): Promise<NotificationApiResponse<RawPowerContractNotification>> {
    return apiClient.get<NotificationApiResponse<RawPowerContractNotification>>(
      '/power-notifications',
      {
        params: { unreadOnly: String(unreadOnly) },
      }
    );
  },

  /**
   * ໝາຍການແຈ້ງເຕືອນສັນຍາທົ່ວໄປວ່າອ່ານແລ້ວ
   */
  async markGeneralAsRead(id: string): Promise<any> {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  /**
   * ໝາຍການແຈ້ງເຕືອນສັນຍາຊື້-ຂາຍໄຟວ່າອ່ານແລ້ວ
   */
  async markPowerAsRead(id: string): Promise<any> {
    return apiClient.patch(`/power-notifications/${id}/read`);
  },

  /**
   * ໝາຍການແຈ້ງເຕືອນສັນຍາທົ່ວໄປທັງໝົດວ່າອ່ານແລ້ວ
   */
  async markAllGeneralAsRead(): Promise<any> {
    return apiClient.patch('/notifications/read-all');
  },

  /**
   * ໝາຍການແຈ້ງເຕືອນສັນຍາຊື້-ຂາຍໄຟທັງໝົດວ່າອ່ານແລ້ວ
   */
  async markAllPowerAsRead(): Promise<any> {
    return apiClient.patch('/power-notifications/read-all');
  },

  /**
   * ສັ່ງສະແກນສັນຍາທົ່ວໄປ ແລະ ສ້າງແຈ້ງເຕືອນທັນທີ (Trigger Expiry Check)
   */
  async triggerGeneralCheck(): Promise<any> {
    return apiClient.post('/notifications/trigger-check');
  },

  /**
   * ສັ່ງສະແກນສັນຍາຊື້-ຂາຍໄຟຟ້າ ແລະ ສ້າງແຈ້ງເຕືອນທັນທີ (Trigger Expiry Check)
   */
  async triggerPowerCheck(): Promise<any> {
    return apiClient.post('/power-notifications/trigger-check');
  },
};
