import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContractEditView } from '@modules/contracts';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'ແກ້ໄຂສັນຍາ | EDL Legal & Contract',
  description: 'ແກ້ໄຂຂໍ້ມູນສັນຍາ ແລະ ເອກະສານຕິດຄັດ',
};

async function ContractEditContent({ params }: PageProps) {
  const { id } = await params;
  return <ContractEditView id={id} />;
}

export default function ContractEditPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted animate-pulse">
          ກຳລັງໂຫຼດຂໍ້ມູນສັນຍາ...
        </div>
      }
    >
      <ContractEditContent params={params} />
    </Suspense>
  );
}
