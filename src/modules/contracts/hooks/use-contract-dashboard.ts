'use client';

import { useQuery } from '@tanstack/react-query';
import { contractApi } from '../api/contract.api';
import { ContractDashboardData } from '../types/contract.types';

export function useContractDashboard() {
  return useQuery<ContractDashboardData>({
    queryKey: ['contracts', 'dashboard'],
    queryFn: () => contractApi.getDashboard(),
    staleTime: 60 * 1000, // 1 minute cache
    refetchOnWindowFocus: false,
  });
}
