'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contractApi } from '../api/contract.api';
import {
  ContractQueryParams,
  CreateContractPayload,
  UpdateContractPayload,
} from '../types/contract.types';
import { getErrorMessage } from '@core/errors';

export function useContractsList(params?: ContractQueryParams) {
  return useQuery({
    queryKey: ['contracts', params],
    queryFn: () => contractApi.getContracts(params),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useContractTypesDropdown() {
  return useQuery({
    queryKey: ['contract-types', 'dropdown'],
    queryFn: () => contractApi.getContractTypesDropdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache for master dropdown
    refetchOnWindowFocus: false,
  });
}

export function useContractDetail(id: string) {
  return useQuery({
    queryKey: ['contracts', id],
    queryFn: () => contractApi.getContractById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContractPayload) => contractApi.createContract(payload),
    onSuccess: () => {
      toast.success('ສ້າງສັນຍາໃໝ່ສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
    onError: (err) => {
      toast.error('ສ້າງສັນຍາບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useUpdateContract(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateContractPayload) => contractApi.updateContract(id, payload),
    onSuccess: () => {
      toast.success('ອັບເດດຂໍ້ມູນສັນຍາສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts', id] });
    },
    onError: (err) => {
      toast.error('ອັບເດດສັນຍາບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractApi.deleteContract(id),
    onSuccess: () => {
      toast.success('ລົບສັນຍາສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
    onError: (err) => {
      toast.error('ລົບສັນຍາບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useUploadAttachment(contractId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => contractApi.uploadAttachment(contractId, file),
    onSuccess: () => {
      toast.success('ອັບໂຫຼດເອກະສານສຳເລັດ');
      queryClient.invalidateQueries({ queryKey: ['contracts', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
    onError: (err) => {
      toast.error('ອັບໂຫຼດເອກະສານບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useDeleteAttachment(contractId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId: string) => contractApi.deleteAttachment(attachmentId),
    onSuccess: () => {
      toast.success('ລົບເອກະສານສຳເລັດ');
      queryClient.invalidateQueries({ queryKey: ['contracts', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
    onError: (err) => {
      toast.error('ລົບເອກະສານບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}
