/**
 * Support & Contact Channels Entities
 */

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface SystemContactChannel {
  id: number;
  channelName: string;
  contactInfo: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
}

export interface SupportTicketUser {
  fullName: string;
  department?: string | null;
  employeeCode?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  attachmentUrl?: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  adminNote?: string | null;
  reportedById: string;
  reportedBy?: SupportTicketUser | null;
  assignedToId?: string | null;
  assignedTo?: { fullName: string; email?: string | null } | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketStatusInfo {
  label: string;
  color: 'amber' | 'blue' | 'emerald' | 'slate';
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const TICKET_STATUS_MAP: Record<TicketStatus, TicketStatusInfo> = {
  OPEN: {
    label: 'ລໍຖ້າກວດສອບ',
    color: 'amber',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
  },
  IN_PROGRESS: {
    label: 'ກຳລັງແກ້ໄຂ',
    color: 'blue',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
  },
  RESOLVED: {
    label: 'ແກ້ໄຂສຳເລັດ',
    color: 'emerald',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
  },
  CLOSED: {
    label: 'ປິດເລື່ອງ',
    color: 'slate',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-600',
    borderClass: 'border-slate-300',
  },
};

export interface TicketPriorityInfo {
  label: string;
  color: 'slate' | 'blue' | 'amber' | 'rose';
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const TICKET_PRIORITY_MAP: Record<TicketPriority, TicketPriorityInfo> = {
  LOW: {
    label: 'ຕ່ຳ (Low)',
    color: 'slate',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-600',
    borderClass: 'border-slate-200',
  },
  MEDIUM: {
    label: 'ປານກາງ (Medium)',
    color: 'blue',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
  },
  HIGH: {
    label: 'ສູງ (High)',
    color: 'amber',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
  },
  URGENT: {
    label: 'ດ່ວນທີ່ສຸດ (Urgent)',
    color: 'rose',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-200',
  },
};
