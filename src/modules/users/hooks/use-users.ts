'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api/users.api';
import {
  UserQueryParams,
  CreateUserPayload,
  UpdateUserPayload,
} from '../types/user-management.types';
import { getErrorMessage } from '@core/errors';

export function useUsersList(params?: UserQueryParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.createUser(payload),
    onSuccess: () => {
      toast.success('ເພີ່ມຜູ້ໃຊ້ງານໃໝ່ສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error('ເພີ່ມຜູ້ໃຊ້ບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersApi.updateUser(id, payload),
    onSuccess: () => {
      toast.success('ອັບເດດສິດທິຜູ້ໃຊ້ສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error('ອັບເດດສິດທິບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      toast.success('ລົບບັນຊີຜູ້ໃຊ້ສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error('ລົບຜູ້ໃຊ້ບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}
