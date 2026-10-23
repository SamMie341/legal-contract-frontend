'use client';

import { useQuery } from '@tanstack/react-query';
import { departmentApi } from '@infrastructure/api/department.api';

export function useDepartmentsList() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentApi.getDepartments(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });
}
