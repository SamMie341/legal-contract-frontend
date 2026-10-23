import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CaseDetailView } from '@modules/legal-disputes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'ລາຍລະອຽດສຳນວນຄະດີ | EDL Legal & Contract',
  description: 'ລາຍລະອຽດຂໍ້ມູນຄະດີ, ມູນຄ່າຄວາມເສຍຫາຍ ແລະ ເອກະສານຕິດຄັດ',
};

async function CaseDetailContent({ params }: PageProps) {
  const { id } = await params;
  return <CaseDetailView id={id} />;
}

export default function CaseDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted animate-pulse">
          ກຳລັງໂຫຼດຂໍ້ມູນສຳນວນຄະດີ...
        </div>
      }
    >
      <CaseDetailContent params={params} />
    </Suspense>
  );
}
