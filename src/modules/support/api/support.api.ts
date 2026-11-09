import { apiClient } from '@infrastructure/api/client';
import {
  CreateContactChannelDto,
  CreateSupportTicketDto,
  UpdateSupportTicketDto,
  SupportTicketsQueryParams,
  ContactChannelsResponse,
  SupportTicketsResponse,
  SupportTicketDetailResponse,
} from '../types/support.types';

export const supportApi = {
  /**
   * ດຶງລາຍການຊ່ອງທາງຕິດຕໍ່ທັງໝົດ
   */
  async getContactChannels(): Promise<ContactChannelsResponse> {
    return apiClient.get<ContactChannelsResponse>('/support/contacts');
  },

  /**
   * ເພີ່ມຊ່ອງທາງຕິດຕໍ່ໃໝ່ (Admin Only)
   */
  async createContactChannel(dto: CreateContactChannelDto): Promise<any> {
    return apiClient.post('/support/contacts', dto);
  },

  /**
   * ລົບຊ່ອງທາງຕິດຕໍ່ (Admin Only)
   */
  async deleteContactChannel(id: number): Promise<any> {
    return apiClient.delete(`/support/contacts/${id}`);
  },

  /**
   * ດຶງລາຍການ Support Tickets (User ທຳມະດາເຫັນສະເພາະຂອງຕົນເອງ, Admin ເຫັນທັງໝົດ)
   */
  async getTickets(
    params?: SupportTicketsQueryParams
  ): Promise<SupportTicketsResponse> {
    const cleanParams: Record<string, any> = {};
    if (params) {
      if (params.page) cleanParams.page = params.page;
      if (params.limit) cleanParams.limit = params.limit;
      if (params.status) cleanParams.status = params.status;
      if (params.priority) cleanParams.priority = params.priority;
    }
    return apiClient.get<SupportTicketsResponse>('/support/tickets', {
      params: cleanParams,
    });
  },

  /**
   * ດຶງລາຍລະອຽດ Support Ticket ຕາມ ID
   */
  async getTicketById(id: string): Promise<SupportTicketDetailResponse> {
    return apiClient.get<SupportTicketDetailResponse>(`/support/tickets/${id}`);
  },

  /**
   * ສົ່ງຄຳຂໍແຈ້ງບັນຫາໃໝ່ ພ້ອມອັບໂຫຼດໄຟລ໌ຮູບພາບ (Multipart Form Data)
   */
  async createTicket(dto: CreateSupportTicketDto): Promise<any> {
    const formData = new FormData();
    formData.append('subject', dto.subject.trim());
    formData.append('description', dto.description.trim());
    if (dto.priority) {
      formData.append('priority', dto.priority);
    }
    if (dto.file) {
      formData.append('file', dto.file);
    }

    return apiClient.post('/support/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * ອັບເດດສະຖານະ ຫຼື ບັນທຶກ Admin Note ສຳລັບ Ticket (Admin Only)
   */
  async updateTicket(
    id: string,
    dto: UpdateSupportTicketDto
  ): Promise<any> {
    return apiClient.patch(`/support/tickets/${id}`, dto);
  },

  /**
   * ດຶງ Blob ຮູບພາບແນບຂອງ Ticket ພ້ອມ Authorization Token
   */
  async getTicketAttachmentBlob(id: string): Promise<Blob> {
    const response = await apiClient.get<Blob>(`/support/tickets/${id}/attachment`, {
      responseType: 'blob',
    });
    return response as unknown as Blob;
  },
};
