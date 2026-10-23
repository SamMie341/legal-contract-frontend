'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  FileText,
  Image as ImageIcon,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Loader2,
  AlertCircle,
  FileQuestion,
} from 'lucide-react';

export interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string | null;
  fileSize?: number;
  mimeType?: string;
  fileType?: string;
  isLoading?: boolean;
  error?: string | null;
  onDownload?: () => void;
  canDownload?: boolean;
}

export function FilePreviewModal({
  isOpen,
  onClose,
  fileName,
  fileUrl,
  fileSize,
  mimeType,
  fileType,
  isLoading = false,
  error = null,
  onDownload,
  canDownload = false,
}: FilePreviewModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Reset image controls when URL changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
    }
  }, [isOpen, fileUrl]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const effectiveMimeType = (mimeType || fileType || '').toLowerCase();
  const lowerFileName = (fileName || '').toLowerCase();

  const isPdf =
    effectiveMimeType === 'application/pdf' ||
    effectiveMimeType.includes('pdf') ||
    lowerFileName.endsWith('.pdf');
  const isImage =
    effectiveMimeType.startsWith('image/') ||
    /\.(png|jpe?g|webp|gif|svg)$/i.test(lowerFileName);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleOpenInNewTab = useCallback(() => {
    if (!fileUrl) return;
    window.open(fileUrl, '_blank');
  }, [fileUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl h-[88vh] bg-surface rounded-2xl border border-border-line shadow-2xl overflow-hidden z-10 flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-line bg-white shrink-0">
          {/* File Information */}
          <div className="flex items-center gap-3 min-w-0 pr-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isPdf
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : isImage
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {isPdf ? (
                <FileText className="w-5 h-5" />
              ) : isImage ? (
                <ImageIcon className="w-5 h-5" />
              ) : (
                <FileQuestion className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <h2
                className="text-sm font-bold text-text-primary truncate"
                title={fileName}
              >
                {fileName}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-0.5">
                <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {isPdf ? 'PDF' : isImage ? 'IMAGE' : 'FILE'}
                </span>
                {fileSize && (
                  <span className="font-mono">{formatFileSize(fileSize)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Image Zoom & Rotate Controls */}
            {isImage && fileUrl && !isLoading && !error && (
              <div className="hidden sm:flex items-center gap-1 border-r border-border-line pr-2 mr-1">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-text-secondary transition-colors"
                  title="ຊູມເຂົ້າ (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-text-secondary transition-colors"
                  title="ຊູມອອກ (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-text-secondary transition-colors"
                  title="ໝຸນຮູບ 90 ອົງສາ"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-[11px] font-semibold text-text-secondary transition-colors"
                  title="ຣີເຊັດຂະໜາດ"
                >
                  {Math.round(zoom * 100)}%
                </button>
              </div>
            )}

            {/* Open in New Tab Button */}
            {fileUrl && !isLoading && !error && (
              <button
                type="button"
                onClick={handleOpenInNewTab}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-text-secondary text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="ເປີດໃນແທັບໃໝ່"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">ແທັບໃໝ່</span>
              </button>
            )}

            {/* Download Button */}
            {canDownload && onDownload && !isLoading && (
              <button
                type="button"
                onClick={onDownload}
                className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                title="ດາວໂຫຼດໄຟລ໌"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">ດາວໂຫຼດ</span>
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors ml-1"
              title="ປິດ (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-slate-100/70 overflow-hidden relative flex items-center justify-center p-2 sm:p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
              <Loader2 className="w-9 h-9 animate-spin text-primary" />
              <p className="text-sm font-semibold text-text-primary">
                ກຳລັງໂຫຼດເອກະສານ...
              </p>
              <p className="text-xs text-text-muted">ກະລຸນາລໍຖ້າຈັກໜ່ອຍ</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 p-8 max-w-md text-center bg-white rounded-2xl border border-border-line shadow-xs">
              <div className="p-3 rounded-full bg-red-50 text-red-600">
                <AlertCircle className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-text-primary">
                ບໍ່ສາມາດເປີດເບິ່ງໄຟລ໌ໄດ້
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {error}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-text-primary transition-colors"
              >
                ປິດໜ້າຕ່າງ
              </button>
            </div>
          ) : !fileUrl ? (
            <div className="text-center p-8 text-xs text-text-muted">
              ບໍ່ພົບຂໍ້ມູນໄຟລ໌
            </div>
          ) : isPdf ? (
            <iframe
              src={fileUrl}
              className="w-full h-full rounded-xl border border-border-line bg-white shadow-xs"
              title={fileName}
            />
          ) : isImage ? (
            <div className="w-full h-full overflow-auto flex items-center justify-center p-2 select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fileUrl}
                alt={fileName}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-md pointer-events-auto"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-8 max-w-md text-center bg-white rounded-2xl border border-border-line shadow-xs">
              <FileQuestion className="w-10 h-10 text-slate-400" />
              <p className="text-sm font-bold text-text-primary">
                ບໍ່ຮອງຮັບການສະແດງຕົວຢ່າງໄຟລ໌ປະເພດນີ້
              </p>
              <p className="text-xs text-text-secondary">
                ລະບົບຮອງຮັບສະເພາະໄຟລ໌ PDF ແລະ ຮູບພາບ (PNG, JPG, WEBP).
                ທ່ານສາມາດກົດດາວໂຫຼດເພື່ອເປີດເບິ່ງໃນຄອມພິວເຕີຂອງທ່ານໄດ້.
              </p>
              {canDownload && onDownload && (
                <button
                  type="button"
                  onClick={onDownload}
                  className="mt-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-primary-hover transition-colors"
                >
                  ດາວໂຫຼດໄຟລ໌ຕອນນີ້
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
