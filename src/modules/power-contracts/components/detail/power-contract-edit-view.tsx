'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  usePowerContract,
  useUpdatePowerContract,
} from '../../hooks/use-power-contracts';
import { powerContractApi } from '../../api/power-contract.api';
import { PowerContractForm } from '../create/power-contract-form';

interface PowerContractEditViewProps {
  id: string;
}

export function PowerContractEditView({ id }: PowerContractEditViewProps) {
  const router = useRouter();
  const { data: contract, isLoading, error } = usePowerContract(id);
  const updateMutation = useUpdatePowerContract(id);

  const handleUpdate = async (payload: any, files: File[]) => {
    const updated = await updateMutation.mutateAsync(payload);
    if (files && files.length > 0) {
      toast.info(`ກຳລັງອັບໂຫຼດເອກະສານເພີ່ມເຕີມ ${files.length} ໄຟລ໌...`);
      for (const file of files) {
        try {
          await powerContractApi.uploadAttachment(id, file);
        } catch {
          toast.error(`ອັບໂຫຼດໄຟລ໌ ${file.name} ບໍ່ສຳເລັດ`);
        }
      }
      toast.success('ອັບໂຫຼດເອກະສານສຳເລັດແລ້ວ');
    }
    router.push(`/power-contracts/${id}`);
    return updated;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-10 bg-surface rounded-xl border border-border-line animate-pulse" />
        <div className="h-96 bg-surface rounded-2xl border border-border-line animate-pulse" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="max-w-4xl mx-auto bg-surface p-12 rounded-2xl border border-border-line text-center shadow-xs">
        <p className="text-sm font-bold text-text-primary">
          ບໍ່ພົບຂໍ້ມູນສັນຍາຊື້-ຂາຍໄຟຟ້າ
        </p>
        <Link
          href="/power-contracts"
          className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ກັບຄືນໜ້າລາຍການ</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/power-contracts/${id}`}
          className="p-2 rounded-xl border border-border-line bg-white hover:bg-slate-100 text-text-secondary transition-colors"
          title="ກັບຄືນ"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
            ແກ້ໄຂສັນຍາຊື້-ຂາຍໄຟຟ້າ
          </h1>
          <p className="text-xs text-text-secondary">
            {contract.projectName}{' '}
            {contract.contractNumber ? `(${contract.contractNumber})` : ''}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <PowerContractForm
        initialData={contract}
        isEditMode={true}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}
