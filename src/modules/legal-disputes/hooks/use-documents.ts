'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { documentApi } from '../api/document.api';
import {
  QueryLegalDocumentParams,
  CreateLegalDocumentPayload,
  UpdateLegalDocumentPayload,
} from '../types/document.types';
import { getErrorMessage } from '@core/errors';

export function useDocumentsList(params?: QueryLegalDocumentParams) {
  return useQuery({
    queryKey: ['legal-documents', params],
    queryFn: () => documentApi.getDocuments(params),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useDocumentDetail(id: string) {
  return useQuery({
    queryKey: ['legal-documents', id],
    queryFn: () => documentApi.getDocumentById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLegalDocumentPayload) => documentApi.createDocument(payload),
    onSuccess: () => {
      toast.success('ສ້າງນິຕິກຳໃໝ່ສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['legal-documents'] });
    },
    onError: (err) => {
      toast.error('ສ້າງນິຕິກຳບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useUpdateDocument(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLegalDocumentPayload) => documentApi.updateDocument(id, payload),
    onSuccess: () => {
      toast.success('ອັບເດດຂໍ້ມູນນິຕິກຳສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['legal-documents'] });
      queryClient.invalidateQueries({ queryKey: ['legal-documents', id] });
    },
    onError: (err) => {
      toast.error('ອັບເດດນິຕິກຳບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentApi.deleteDocument(id),
    onSuccess: () => {
      toast.success('ລົບນິຕິກຳສຳເລັດແລ້ວ');
      queryClient.invalidateQueries({ queryKey: ['legal-documents'] });
    },
    onError: (err) => {
      toast.error('ລົບນິຕິກຳບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useUploadDocumentAttachment(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => documentApi.uploadAttachment(documentId, file),
    onSuccess: () => {
      toast.success('ອັບໂຫຼດເອກະສານສຳເລັດ');
      queryClient.invalidateQueries({ queryKey: ['legal-documents', documentId] });
      queryClient.invalidateQueries({ queryKey: ['legal-documents'] });
    },
    onError: (err) => {
      toast.error('ອັບໂຫຼດເອກະສານບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}

export function useDeleteDocumentAttachment(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId: string) => documentApi.deleteAttachment(attachmentId),
    onSuccess: () => {
      toast.success('ລົບເອກະສານສຳເລັດ');
      queryClient.invalidateQueries({ queryKey: ['legal-documents', documentId] });
      queryClient.invalidateQueries({ queryKey: ['legal-documents'] });
    },
    onError: (err) => {
      toast.error('ລົບເອກະສານບໍ່ສຳເລັດ', {
        description: getErrorMessage(err),
      });
    },
  });
}
