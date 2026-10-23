import type { Metadata } from 'next';
import { UserManagementView } from '@modules/users';

export const metadata: Metadata = {
  title: 'ຈັດການຜູ້ໃຊ້ງານ & ສິດທິລະບົບ',
  description: 'ຈັດການຜູ້ໃຊ້ງານ, ຊິ້ງຂໍ້ມູນຈາກ HRM ແລະ ແກ້ໄຂສິດທິການນຳໃຊ້ລະບົບ EDL Legal & Contract',
};

export default function UsersPage() {
  return <UserManagementView />;
}
