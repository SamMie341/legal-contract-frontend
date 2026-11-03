import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { departmentsApi, DepartmentQueryParams } from '../api/departments.api';
import {
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from '@core/entities';
import { getErrorMessage } from '@core/errors';

export const DEPARTMENT_QUERY_KEYS = {
  all: ['departments'] as const,
  list: (params?: DepartmentQueryParams) => ['departments', 'list', params] as const,
  hrmPreview: ['departments', 'hrm-preview'] as const,
  detail: (id: string) => ['departments', 'detail', id] as const,
};

/**
 * Hook to fetch departments with search & active filter
 */
export function useDepartments(params?: DepartmentQueryParams) {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.list(params),
    queryFn: () => departmentsApi.getDepartments(params),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to preview departments from HRM API before syncing
 */
export function useHrmDepartmentsPreview(enabled: boolean = false) {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.hrmPreview,
    queryFn: () => departmentsApi.getHrmPreview(),
    enabled,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to sync departments from EDL HRM API
 */
export function useSyncDepartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => departmentsApi.syncFromHrm(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      toast.success(
        `Sync ຝ່າຍຈາກ HRM ສຳເລັດ! ເພີ່ມໃໝ່ ${data.createdCount} ຝ່າຍ, ອັບເດດ ${data.updatedCount} ຝ່າຍ`
      );
    },
    onError: (err) => {
      toast.error(`Sync ຂໍ້ມູນຈາກ HRM ບໍ່ສຳເລັດ: ${getErrorMessage(err)}`);
    },
  });
}

/**
 * Hook to create a new department manually
 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) =>
      departmentsApi.createDepartment(payload),
    onSuccess: (dept) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      toast.success(`ສ້າງຫ້ອງການ/ຝ່າຍ "${dept.name}" ສຳເລັດ!`);
    },
    onError: (err) => {
      toast.error(`ສ້າງຫ້ອງການ/ຝ່າຍບໍ່ສຳເລັດ: ${getErrorMessage(err)}`);
    },
  });
}

/**
 * Hook to update an existing department
 */
export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDepartmentPayload }) =>
      departmentsApi.updateDepartment(id, payload),
    onSuccess: (dept) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      toast.success(`ອັບເດດຫ້ອງການ/ຝ່າຍ "${dept.name}" ສຳເລັດ!`);
    },
    onError: (err) => {
      toast.error(`ອັບເດດຫ້ອງການ/ຝ່າຍບໍ່ສຳເລັດ: ${getErrorMessage(err)}`);
    },
  });
}

/**
 * Hook to delete a department
 */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentsApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      toast.success('ລົບຫ້ອງການ/ຝ່າຍສຳເລັດ!');
    },
    onError: (err) => {
      toast.error(`ລົບຫ້ອງການ/ຝ່າຍບໍ່ສຳເລັດ: ${getErrorMessage(err)}`);
    },
  });
}
