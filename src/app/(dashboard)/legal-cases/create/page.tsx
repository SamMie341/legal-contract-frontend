import type { Metadata } from 'next';
import { CaseCreateView } from '@modules/legal-disputes';

export const metadata: Metadata = {
  title: 'ສ້າງສຳນວນຄະດີໃໝ່ | EDL Legal & Contract',
  description: 'ບັນທຶກສຳນວນຄະດີ ແລະ ຂໍ້ຂັດແຍ່ງໃໝ່',
};

export default function CreateLegalCasePage() {
  return <CaseCreateView />;
}
