'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  PowerContractForm,
  useCreatePowerContract,
  powerContractApi,
} from '@/modules/power-contracts';
import { toast } from 'sonner';

export default function CreatePowerContractPage() {
  const createMutation = useCreatePowerContract();

  const handleCreate = async (payload: any, files: File[]) => {
    const newContract = await createMutation.mutateAsync(payload);
    if (newContract?.id && files.length > 0) {
      toast.info(`ກຳລັງອັບໂຫຼດເອກະສານ ${files.length} ໄຟລ໌...`);
      for (const file of files) {
        try {
          await powerContractApi.uploadAttachment(newContract.id, file);
        } catch {
          toast.error(`ອັບໂຫຼດໄຟລ໌ ${file.name} ບໍ່ສຳເລັດ`);
        }
      }
    }
    return newContract;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/power-contracts"
          className="p-2 rounded-xl border border-border-line bg-white hover:bg-slate-100 text-text-secondary transition-colors"
          title="ກັບຄືນ"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
            ສ້າງສັນຍາຊື້-ຂາຍໄຟຟ້າໃໝ່
          </h1>
          <p className="text-xs text-text-secondary">
            ປ້ອນຂໍ້ມູນສັນຍາຊື້ໄຟ (PPA) ຫຼື ສັນຍາຂາຍໄຟ (PSA) ພ້ອມກຳລັງຕິດຕັ້ງ,
            ລາຄາໄຟ ແລະ ແນບໄຟລ໌ເອກະສານ
          </p>
        </div>
      </div>

      {/* Form Card */}
      <PowerContractForm
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
