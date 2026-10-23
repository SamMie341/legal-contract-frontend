import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DocumentDashboardView } from '@/modules/legal-disputes/components/documents/dashboard/document-dashboard-view';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ສະຖິຕິ Dashboard ນິຕິກຳ (Legal Documents Dashboard)',
  description: 'ພາບລວມສະຖິຕິເອກະສານນິຕິກຳ ແລະ ລະບຽບການ ໄຟຟ້າລາວ (EDL)',
};

export default function LegalDocumentsDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 flex flex-col items-center justify-center gap-2 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs">ກຳລັງໂຫຼດໜ້າ Dashboard ນິຕິກຳ...</p>
        </div>
      }
    >
      <DocumentDashboardView />
    </Suspense>
  );
}
