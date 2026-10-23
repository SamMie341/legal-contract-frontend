import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CaseEditView } from '@modules/legal-disputes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'ແກ້ໄຂສຳນວນຄະດີ | EDL Legal & Contract',
  description: 'ແກ້ໄຂຂໍ້ມູນສຳນວນຄະດີ ແລະ ເອກະສານຕິດຄັດ',
};

async function CaseEditContent({ params }: PageProps) {
  const { id } = await params;
  return <CaseEditView id={id} />;
}

export default function CaseEditPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted animate-pulse">
          ກຳລັງໂຫຼດຂໍ້ມູນສຳນວນຄະດີ...
        </div>
      }
    >
      <CaseEditContent params={params} />
    </Suspense>
  );
}
