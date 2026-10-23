import { Suspense } from 'react';
import type { Metadata } from 'next';
import { DocumentDetailView } from '@modules/legal-disputes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'ລາຍລະອຽດນິຕິກຳ | EDL Legal & Contract',
  description: 'ລາຍລະອຽດຂໍ້ມູນນິຕິກຳ ແລະ ເອກະສານຕິດຄັດ',
};

async function DocumentDetailContent({ params }: PageProps) {
  const { id } = await params;
  return <DocumentDetailView id={id} />;
}

export default function DocumentDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted animate-pulse">
          ກຳລັງໂຫຼດຂໍ້ມູນນິຕິກຳ...
        </div>
      }
    >
      <DocumentDetailContent params={params} />
    </Suspense>
  );
}
