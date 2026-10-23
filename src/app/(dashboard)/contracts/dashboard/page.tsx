import type { Metadata } from 'next';
import { ContractDashboardView } from '@modules/contracts';

export const metadata: Metadata = {
  title: 'ສະຖິຕິ Dashboard ຂອງສັນຍາ',
  description: 'ສະຖິຕິສັນຍາທັງໝົດ, ສະຖານະ, ມູນຄ່າການເງິນ 3 ສະກຸນ ແລະ 14 ປະເພດສັນຍາ EDL',
};

export default function ContractsDashboardPage() {
  return <ContractDashboardView />;
}
