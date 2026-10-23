import { Suspense } from 'react';
import type { Metadata } from 'next';
import { DocumentsListView } from '@modules/legal-disputes';

export const metadata: Metadata = {
  title: 'ຄຸ້ມຄອງນິຕິກຳ ແລະ ລະບຽບການ | EDL Legal & Contract',
  description: 'ລະບົບຄຸ້ມຄອງ ແລະ ຕິດຕາມນິຕິກຳ, ຂໍ້ກຳນົດ, ຂໍ້ຕົກລົງ ແລະ ແຈ້ງການ ລັດວິສາຫະກິດໄຟຟ້າລາວ',
};

export default function LegalDocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted">
          ກຳລັງໂຫຼດຂໍ້ມູນນິຕິກຳ...
        </div>
      }
    >
      <DocumentsListView />
    </Suspense>
  );
}
