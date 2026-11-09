import type { Metadata } from 'next';
import { SupportView } from '@/modules/support';

export const metadata: Metadata = {
  title: 'ສູນຊ່ວຍເຫຼືອ & ແຈ້ງບັນຫາລະບົບ (Help & Support) | ໄຟຟ້າລາວ EDL',
  description: 'ຊ່ອງທາງຕິດຕໍ່ສາຍດ່ວນ IT ແລະ ລະບົບສົ່ງຄຳຮ້ອງຂໍປັບປຸງ/ແກ້ໄຂບັນຫາລະບົບ (ຂໍ້ 6)',
};

export default function SupportPage() {
  return <SupportView />;
}
