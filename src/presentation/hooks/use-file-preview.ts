'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@core/errors';

export interface PreviewableAttachment {
  id: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  fileType?: string;
}

export function useFilePreview(
  fetchPreviewUrl: (id: string) => Promise<string> | string,
  downloadFile?: (id: string, fileName: string) => Promise<void> | void
) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<PreviewableAttachment | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const openPreview = useCallback(
    async (item: PreviewableAttachment) => {
      // Clean up previous blob URL if any
      setFileUrl((prevUrl) => {
        if (prevUrl && prevUrl.startsWith('blob:')) {
          window.URL.revokeObjectURL(prevUrl);
        }
        return null;
      });

      // Normalize mimeType across different module schemas (mimeType vs fileType)
      const normalizedMime =
        item.mimeType ||
        item.fileType ||
        (item.fileName?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : undefined);

      setCurrentFile({
        ...item,
        mimeType: normalizedMime,
      });
      setIsOpen(true);
      setIsLoading(true);
      setError(null);
      setPreviewingId(item.id);

      try {
        const url = await fetchPreviewUrl(item.id);
        setFileUrl(url);
      } catch (err) {
        console.error('File preview error:', err);
        const msg = getErrorMessage(err);
        setError(msg || 'ບໍ່ສາມາດເປີດເບິ່ງໄຟລ໌ໄດ້');
        toast.error(msg || 'ບໍ່ສາມາດເປີດເບິ່ງໄຟລ໌ໄດ້');
      } finally {
        setIsLoading(false);
        setPreviewingId(null);
      }
    },
    [fetchPreviewUrl]
  );

  const closePreview = useCallback(() => {
    setFileUrl((prevUrl) => {
      if (prevUrl && prevUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(prevUrl);
      }
      return null;
    });
    setIsOpen(false);
    setCurrentFile(null);
    setError(null);
    setIsLoading(false);
    setPreviewingId(null);
  }, []);

  const handleDownloadCurrent = useCallback(async () => {
    if (!currentFile || !downloadFile) return;
    try {
      await downloadFile(currentFile.id, currentFile.fileName);
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg || 'ບໍ່ສາມາດດາວໂຫຼດໄຟລ໌ໄດ້');
    }
  }, [currentFile, downloadFile]);

  return {
    isOpen,
    currentFile,
    fileUrl,
    isLoading,
    error,
    previewingId,
    openPreview,
    closePreview,
    handleDownloadCurrent,
  };
}
