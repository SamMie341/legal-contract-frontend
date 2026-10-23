'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Image, X, AlertCircle } from 'lucide-react';

interface ContractFileDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeInMb?: number;
}

export function ContractFileDropzone({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeInMb = 25,
}: ContractFileDropzoneProps) {
  const maxSizeBytes = maxSizeInMb * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = maxFiles - files.length;
      if (remainingSlots <= 0) return;

      const newValidFiles = acceptedFiles.slice(0, remainingSlots);
      onFilesChange([...files, ...newValidFiles]);
    },
    [files, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: maxSizeBytes,
    disabled: files.length >= maxFiles,
  });

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-3">
      {/* Dropzone Box */}
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-slate-300 hover:border-primary/60 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">
                {isDragActive
                  ? 'ວາງໄຟລ໌ລົງທີ່ນີ້...'
                  : 'ລາກ ແລະ ວາງໄຟລ໌ເອກະສານ ຫຼື ຄລິກເພື່ອເລືອກໄຟລ໌'}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                ຮອງຮັບສະເພາະ PDF, PNG, JPG, WEBP (ຂະໜາດສູງສຸດບໍ່ເກີນ {maxSizeInMb}MB, ສູງສຸດ {maxFiles} ໄຟລ໌)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Errors from rejected files */}
      {fileRejections.length > 0 && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">ໄຟລ໌ບາງອັນບໍ່ຖືກຕ້ອງ:</p>
            {fileRejections.map(({ file, errors }) => (
              <p key={file.name} className="text-[11px]">
                • {file.name}: {errors.map((e) => e.message).join(', ')}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-text-primary">
            ໄຟລ໌ທີ່ເລືອກ ({files.length}/{maxFiles} ໄຟລ໌):
          </p>
          <div className="space-y-1.5">
            {files.map((file, idx) => {
              const isPdf = file.type === 'application/pdf';

              return (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-border-line text-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isPdf
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}
                    >
                      {isPdf ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <Image className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-text-muted font-mono">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-text-muted hover:text-red-600 transition-colors"
                    title="ລົບໄຟລ໌"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
