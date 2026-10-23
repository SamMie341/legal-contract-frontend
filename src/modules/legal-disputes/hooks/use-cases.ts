'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { caseApi } from '../api/case.api';
import {
  QueryLegalCaseParams,
  CreateLegalCasePayload,
  UpdateLegalCasePayload,
} from '../types/case.types';
import { getErrorMessage } from '@core/errors';

export function useCasesList(params?: QueryLegalCaseParams) {
  return useQuery({
    queryKey: ['legal-cases', params],
    queryFn: () => caseApi.getCases(params),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCaseDetail(id: string) {
  return useQuery({
    queryKey: ['legal-cases', id],
    queryFn: () => caseApi.getCaseById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLegalCasePayload) => caseApi.createCase(payload),
    onSuccess: () => {
      toast.success('ສ້າງສຳນວນຄະດີໃໝ່ສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['legal-cases'] });
    },
    onError: (err) => {
      toast.error('ສ້າງສຳນວນຄະດີບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useUpdateCase(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLegalCasePayload) => caseApi.updateCase(id, payload),
    onSuccess: () => {
      toast.success('ອັບເດດຂໍ້ມູນຄະດີສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['legal-cases'] });
      queryClient.invalidateQueries({ queryKey: ['legal-cases', id] });
    },
    onError: (err) => {
      toast.error('ອັບເດດຄະດີບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useDeleteCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => caseApi.deleteCase(id),
    onSuccess: () => {
      toast.success('ລົບສຳນວນຄະດີສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['legal-cases'] });
    },
    onError: (err) => {
      toast.error('ລົບສຳນວນຄະດີບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useUploadCaseAttachment(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => caseApi.uploadAttachment(caseId, file),
    onSuccess: () => {
      toast.success('ອັບໂຫຼດເອກະສານສຳເລັດ');
      queryClient.invalidateQueries({ queryKey: ['legal-cases', caseId] });
      queryClient.invalidateQueries({ queryKey: ['legal-cases'] });
    },
    onError: (err) => {
      toast.error('ອັບໂຫຼດເອກະສານບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useDeleteCaseAttachment(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId: string) => caseApi.deleteAttachment(attachmentId),
    onSuccess: () => {
      toast.success('ລົບເອກະສານສຳເລັດ');
      queryClient.invalidateQueries({ queryKey: ['legal-cases', caseId] });
      queryClient.invalidateQueries({ queryKey: ['legal-cases'] });
    },
    onError: (err) => {
      toast.error('ລົບເອກະສານບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}
