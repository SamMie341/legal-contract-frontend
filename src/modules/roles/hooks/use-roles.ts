'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rolesApi } from '../api/roles.api';
import {
  CreateRolePayload,
  UpdateRolePayload,
} from '@core/entities';
import { getErrorMessage } from '@core/errors';

export function useRolesList() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.getRoles(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useRoleDetail(id?: string) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => (id ? rolesApi.getRoleById(id) : null),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => rolesApi.createRole(payload),
    onSuccess: (data) => {
      toast.success(`ສ້າງບົດບາດ '${data.title || data.name}' ສຳເລັດແລ້ວ`);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (err) => {
      toast.error('ສ້າງບົດບາດບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      rolesApi.updateRole(id, payload),
    onSuccess: (data) => {
      toast.success(`ອັບເດດບົດບາດ '${data.title || data.name}' ສຳເລັດແລ້ວ`);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (err) => {
      toast.error('ແກ້ໄຂບົດບາດບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id),
    onSuccess: () => {
      toast.success('ລົບບົດບາດສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (err) => {
      toast.error('ລົບບົດບາດບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}
