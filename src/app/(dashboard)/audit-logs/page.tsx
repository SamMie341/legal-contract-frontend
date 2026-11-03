import type { Metadata } from 'next';
import { AuditLogsView } from '@/modules/audit-logs';

export const metadata: Metadata = {
  title: 'ປະຫວັດການດຳເນີນງານລະບົບ (Audit Logs) | ໄຟຟ້າລາວ EDL',
  description: 'ຕິດຕາມ ແລະ ກວດສອບປະຫວັດການດຳເນີນງານທັງໝົດໃນລະບົບ (Security Audit Trail)',
};

export default function AuditLogsPage() {
  return <AuditLogsView />;
}
