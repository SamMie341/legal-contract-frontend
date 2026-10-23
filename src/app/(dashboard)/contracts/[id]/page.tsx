import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContractDetailView } from '@modules/contracts';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'ລາຍລະອຽດສັນຍາ | EDL Legal & Contract',
  description: 'ລາຍລະອຽດຂໍ້ມູນສັນຍາ, ເອກະສານຕິດຄັດ ແລະ ປະຫວັດການດັດແກ້',
};

async function ContractDetailContent({ params }: PageProps) {
  const { id } = await params;
  return <ContractDetailView id={id} />;
}

export default function ContractDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted animate-pulse">
          ກຳລັງໂຫຼດຂໍ້ມູນສັນຍາ...
        </div>
      }
    >
      <ContractDetailContent params={params} />
    </Suspense>
  );
}
