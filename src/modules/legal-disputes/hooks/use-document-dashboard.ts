'use client';

import { useQuery } from '@tanstack/react-query';
import { documentApi } from '../api/document.api';
import { DocumentDashboardData } from '../types/document.types';

export function useDocumentDashboard() {
  return useQuery<DocumentDashboardData>({
    queryKey: ['legal-documents', 'dashboard'],
    queryFn: () => documentApi.getDashboard(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
