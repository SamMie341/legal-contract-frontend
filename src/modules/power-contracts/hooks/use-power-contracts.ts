'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { powerContractApi } from '../api/power-contract.api';
import {
  CreatePowerContractPayload,
  UpdatePowerContractPayload,
  PowerContractQueryParams,
} from '../types/power-contract.types';
import { getErrorMessage } from '@core/errors';

export function usePowerDashboard() {
  return useQuery({
    queryKey: ['power-contracts', 'dashboard'],
    queryFn: () => powerContractApi.getDashboard(),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePowerProjectTypes() {
  return useQuery({
    queryKey: ['power-contracts', 'project-types'],
    queryFn: () => powerContractApi.getProjectTypes(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePowerContracts(params?: PowerContractQueryParams) {
  return useQuery({
    queryKey: ['power-contracts', params],
    queryFn: () => powerContractApi.getContracts(params),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePowerContract(id: string) {
  return useQuery({
    queryKey: ['power-contracts', id],
    queryFn: () => powerContractApi.getContractById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useCreatePowerContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePowerContractPayload) =>
      powerContractApi.createContract(payload),
    onSuccess: () => {
      toast.success('ສ້າງສັນຍາຊື້-ຂາຍໄຟຟ້າສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['power-contracts'] });
    },
    onError: (err) => {
      toast.error('ສ້າງສັນຍາບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useUpdatePowerContract(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePowerContractPayload) =>
      powerContractApi.updateContract(id, payload),
    onSuccess: () => {
      toast.success('ອັບເດດຂໍ້ມູນສັນຍາສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['power-contracts', id] });
      queryClient.invalidateQueries({ queryKey: ['power-contracts'] });
    },
    onError: (err) => {
      toast.error('ອັບເດດສັນຍາບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useDeletePowerContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => powerContractApi.deleteContract(id),
    onSuccess: () => {
      toast.success('ລົບສັນຍາສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['power-contracts'] });
    },
    onError: (err) => {
      toast.error('ລົບສັນຍາບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function usePowerContractHistory(id: string) {
  return useQuery({
    queryKey: ['power-contracts', id, 'history'],
    queryFn: () => powerContractApi.getContractHistory(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function usePowerAttachments(powerContractId: string) {
  return useQuery({
    queryKey: ['power-contracts', powerContractId, 'attachments'],
    queryFn: () => powerContractApi.getAttachments(powerContractId),
    enabled: Boolean(powerContractId),
  });
}

export function useUploadPowerAttachment(powerContractId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      powerContractApi.uploadAttachment(powerContractId, file),
    onSuccess: () => {
      toast.success('ອັບໂຫຼດໄຟລ໌ແນບສຳເລັດ');
      queryClient.invalidateQueries({
        queryKey: ['power-contracts', powerContractId, 'attachments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['power-contracts', powerContractId],
      });
    },
    onError: (err) => {
      toast.error('ອັບໂຫຼດໄຟລ໌ບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useDeletePowerAttachment(powerContractId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId: string) =>
      powerContractApi.deleteAttachment(attachmentId),
    onSuccess: () => {
      toast.success('ລົບໄຟລ໌ແນບສຳເລັດ');
      queryClient.invalidateQueries({
        queryKey: ['power-contracts', powerContractId, 'attachments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['power-contracts', powerContractId],
      });
    },
    onError: (err) => {
      toast.error('ລົບໄຟລ໌ບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}
