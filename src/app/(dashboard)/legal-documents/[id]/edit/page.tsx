import { Suspense } from 'react';
import type { Metadata } from 'next';
import { DocumentEditView } from '@modules/legal-disputes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'ແກ້ໄຂນິຕິກຳ | EDL Legal & Contract',
  description: 'ແກ້ໄຂຂໍ້ມູນນິຕິກຳ ແລະ ເອກະສານຕິດຄັດ',
};

async function DocumentEditContent({ params }: PageProps) {
  const { id } = await params;
  return <DocumentEditView id={id} />;
}

export default function DocumentEditPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted animate-pulse">
          ກຳລັງໂຫຼດຂໍ້ມູນນິຕິກຳ...
        </div>
      }
    >
      <DocumentEditContent params={params} />
    </Suspense>
  );
}
