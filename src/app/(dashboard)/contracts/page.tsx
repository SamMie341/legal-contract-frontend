import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContractsListView } from '@modules/contracts';

export const metadata: Metadata = {
  title: 'ລາຍການສັນຍາທັງໝົດ | EDL Legal & Contract',
  description: 'ລະບົບຄົ້ນຫາ, ຕິດຕາມສະຖານະ, ແລະ ຄຸ້ມຄອງສັນຍາ 14 ປະເພດຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ',
};

export default function ContractsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-text-muted">
          ກຳລັງໂຫຼດຂໍ້ມູນສັນຍາ...
        </div>
      }
    >
      <ContractsListView />
    </Suspense>
  );
}
