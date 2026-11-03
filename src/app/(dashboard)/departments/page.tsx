import type { Metadata } from 'next';
import { DepartmentsManagementView } from '@/modules/departments';

export const metadata: Metadata = {
  title: 'ຈັດການຫ້ອງການ / ຝ່າຍ (Departments)',
  description: 'ຈັດການລາຍຊື່ຫ້ອງການ, ຝ່າຍ, ສະຖາບັນ ພາຍໃຕ້ລັດວິສາຫະກິດໄຟຟ້າລາວ ແລະ Sync ຂໍ້ມູນຈາກ HRM',
};

export default function DepartmentsPage() {
  return <DepartmentsManagementView />;
}
