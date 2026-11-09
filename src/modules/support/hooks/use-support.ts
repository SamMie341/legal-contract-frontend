'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi } from '../api/support.api';
import {
  CreateContactChannelDto,
  CreateSupportTicketDto,
  UpdateSupportTicketDto,
  SupportTicketsQueryParams,
} from '../types/support.types';
import { toast } from 'sonner';

export function useContactChannels() {
  return useQuery({
    queryKey: ['support', 'contacts'],
    queryFn: () => supportApi.getContactChannels(),
    staleTime: 60 * 1000,
  });
}

export function useCreateContactChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateContactChannelDto) =>
      supportApi.createContactChannel(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'contacts'] });
      toast.success('ເພີ່ມຊ່ອງທາງຕິດຕໍ່ສຳເລັດແລ້ວ');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມຊ່ອງທາງຕິດຕໍ່');
    },
  });
}

export function useDeleteContactChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => supportApi.deleteContactChannel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'contacts'] });
      toast.success('ລົບຊ່ອງທາງຕິດຕໍ່ສຳເລັດແລ້ວ');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'ເກີດຂໍ້ຜິດພາດໃນການລົບຊ່ອງທາງຕິດຕໍ່');
    },
  });
}

export function useOpenTicketsCount(enabled: boolean = true) {
  const { data } = useQuery({
    queryKey: ['support', 'tickets', 'open-count'],
    queryFn: () => supportApi.getTickets({ status: 'OPEN', limit: 1 }),
    enabled,
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });

  return data?.meta?.total || 0;
}

export function useSupportTickets(params?: SupportTicketsQueryParams) {
  return useQuery({
    queryKey: ['support', 'tickets', params],
    queryFn: () => supportApi.getTickets(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export function useSupportTicket(id?: string) {
  return useQuery({
    queryKey: ['support', 'ticket', id],
    queryFn: () => (id ? supportApi.getTicketById(id) : null),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSupportTicketDto) => supportApi.createTicket(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
      toast.success('ສົ່ງເລື່ອງແຈ້ງບັນຫາສຳເລັດແລ້ວ ທີມງານຈະດຳເນີນການກວດສອບ');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'ເກີດຂໍ້ຜິດພາດໃນການສົ່ງເລື່ອງແຈ້ງບັນຫາ');
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto: UpdateSupportTicketDto;
    }) => supportApi.updateTicket(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support', 'ticket'] });
      toast.success('ອັບເດດສະຖານະ Ticket ສຳເລັດແລ້ວ');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ Ticket');
    },
  });
}
