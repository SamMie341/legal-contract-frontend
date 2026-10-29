import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PowerContractEditView } from '@/modules/power-contracts/components/detail/power-contract-edit-view';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'ແກ້ໄຂສັນຍາຊື້-ຂາຍໄຟຟ້າ | EDL Legal & Contract',
  description: 'ດັດແກ້ຂໍ້ມູນສັນຍາຊື້-ຂາຍໄຟຟ້າ ຟຟລ',
};

async function PowerContractEditContent({ params }: PageProps) {
  const { id } = await params;
  return <PowerContractEditView id={id} />;
}

export default function PowerContractEditPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted animate-pulse">
          ກຳລັງໂຫຼດຟອມແກ້ໄຂສັນຍາ...
        </div>
      }
    >
      <PowerContractEditContent params={params} />
    </Suspense>
  );
}
