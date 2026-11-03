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
    onSuccess: (updatedUser, { id, payload }) => {
      toast.success('ອັບເດດສິດທິຜູ້ໃຊ້ສຳເລັດແລ້ວ');

      // Immediately sync cached users list so reopen/display reflects changes without lag
      queryClient.setQueriesData<{ data: any[]; meta: any }>(
        { queryKey: ['users'] },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((u) => {
              if (u.id !== id) return u;
              return {
                ...u,
                ...(updatedUser || {}),
                canView: payload.canView !== undefined ? payload.canView : u.canView,
                canUpload: payload.canUpload !== undefined ? payload.canUpload : u.canUpload,
                canEdit: payload.canEdit !== undefined ? payload.canEdit : u.canEdit,
                canDelete: payload.canDelete !== undefined ? payload.canDelete : u.canDelete,
                canDownload: payload.canDownload !== undefined ? payload.canDownload : u.canDownload,
                division: payload.division !== undefined ? payload.division : u.division,
                role: payload.role !== undefined ? payload.role : u.role,
                modulePermissions:
                  payload.modulePermissions !== undefined
                    ? payload.modulePermissions
                    : updatedUser?.modulePermissions || u.modulePermissions,
              };
            }),
          };
        }
      );

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

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      usersApi.updateUser(id, { isActive }),
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueriesData({ queryKey: ['users'] });

      queryClient.setQueriesData<{ data: any[]; meta: any }>(
        { queryKey: ['users'] },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((u) => (u.id === id ? { ...u, isActive } : u)),
          };
        }
      );

      return { previousUsers };
    },
    onSuccess: (_, { isActive }) => {
      toast.success(
        isActive
          ? 'ເປີດນຳໃຊ້ບັນຊີຜູ້ໃຊ້ສຳເລັດແລ້ວ'
          : 'ລະງັບການນຳໃຊ້ບັນຊີຜູ້ໃຊ້ສຳເລັດແລ້ວ'
      );
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err, _, context: any) => {
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('ປ່ຽນສະຖານະຜູ້ໃຊ້ບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: { newPassword?: string } }) =>
      usersApi.resetPassword(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error('ຣີເຊັດລະຫັດຜ່ານບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string; confirmPassword?: string }) =>
      usersApi.changePassword(payload),
    onSuccess: () => {
      toast.success('ປ່ຽນລະຫັດຜ່ານສຳເລັດແລ້ວ');
    },
    onError: (err) => {
      toast.error('ປ່ຽນລະຫັດຜ່ານບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

