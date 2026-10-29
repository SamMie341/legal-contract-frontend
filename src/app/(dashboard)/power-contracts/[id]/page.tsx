import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PowerContractDetailView } from '@/modules/power-contracts/components/detail/power-contract-detail-view';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'ລາຍລະອຽດສັນຍາຊື້-ຂາຍໄຟຟ້າ | EDL Legal & Contract',
  description: 'ລາຍລະອຽດຂໍ້ມູນສັນຍາ, ເອກະສານຕິດຄັດ ແລະ ປະຫວັດການດັດແກ້',
};

async function PowerContractDetailContent({ params }: PageProps) {
  const { id } = await params;
  return <PowerContractDetailView id={id} />;
}

export default function PowerContractDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted animate-pulse">
          ກຳລັງໂຫຼດຂໍ້ມູນສັນຍາ...
        </div>
      }
    >
      <PowerContractDetailContent params={params} />
    </Suspense>
  );
}
