import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CasesListView } from '@modules/legal-disputes';

export const metadata: Metadata = {
  title: 'ສຳນວນຄະດີ ແລະ ຂໍ້ຂັດແຍ່ງ | EDL Legal & Contract',
  description: 'ລະບົບຄຸ້ມຄອງ ແລະ ຕິດຕາມສຳນວນຄະດີ, ຂໍ້ຂັດແຍ່ງ ແລະ ຂັ້ນສານ ລັດວິສາຫະກິດໄຟຟ້າລາວ',
};

export default function LegalCasesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted">
          ກຳລັງໂຫຼດຂໍ້ມູນສຳນວນຄະດີ...
        </div>
      }
    >
      <CasesListView />
    </Suspense>
  );
}
