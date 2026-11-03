import type { Metadata } from 'next';
import { RolesManagementView } from '@modules/roles';

export const metadata: Metadata = {
  title: 'ຈັດການບົດບາດ & ສິດທິລະບົບ (Roles & Permissions)',
  description: 'ກຳນົດບົດບາດ ແລະ ສິດທິລະດັບໂມດູນ (Module-Scoped RBAC)',
};

export default function RolesPage() {
  return <RolesManagementView />;
}
