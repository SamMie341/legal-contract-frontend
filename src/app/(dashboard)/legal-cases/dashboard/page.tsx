import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CaseDashboardView } from '@/modules/legal-disputes/components/cases/dashboard/case-dashboard-view';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ສະຖິຕິ Dashboard ຄະດີຄວາມ (Legal Cases Dashboard)',
  description: 'ພາບລວມສະຖິຕິສຳນວນຄະດີ ແລະ ຂໍ້ຂັດແຍ່ງ ໄຟຟ້າລາວ (EDL)',
};

export default function LegalCasesDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 flex flex-col items-center justify-center gap-2 text-text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs">ກຳລັງໂຫຼດໜ້າ Dashboard ຄະດີຄວາມ...</p>
        </div>
      }
    >
      <CaseDashboardView />
    </Suspense>
  );
}
