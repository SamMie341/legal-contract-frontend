import {
  SystemContactChannel,
  SupportTicket,
  TicketStatus,
  TicketPriority,
} from '@core/entities';

export interface CreateContactChannelDto {
  channelName: string;
  contactInfo: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateSupportTicketDto {
  subject: string;
  description: string;
  priority?: TicketPriority;
  file?: File;
}

export interface UpdateSupportTicketDto {
  status?: TicketStatus;
  priority?: TicketPriority;
  adminNote?: string;
  assignedToId?: string;
}

export interface SupportTicketsQueryParams {
  page?: number;
  limit?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
}

export interface ContactChannelsResponse {
  message: string;
  data: SystemContactChannel[];
}

export interface SupportTicketsResponse {
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: SupportTicket[];
}

export interface SupportTicketDetailResponse {
  message: string;
  data: SupportTicket;
}
