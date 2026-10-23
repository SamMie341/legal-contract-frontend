'use client';

import { useQuery } from '@tanstack/react-query';
import { caseApi } from '../api/case.api';
import { CaseDashboardData } from '../types/case.types';

export function useCaseDashboard() {
  return useQuery<CaseDashboardData>({
    queryKey: ['legal-cases', 'dashboard'],
    queryFn: () => caseApi.getDashboard(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
