import type { Metadata } from 'next';
import { DocumentCreateView } from '@modules/legal-disputes';

export const metadata: Metadata = {
  title: 'ເພີ່ມນິຕິກຳໃໝ່ | EDL Legal & Contract',
  description: 'ເພີ່ມຂໍ້ມູນນິຕິກຳ, ລະບຽບການ ແລະ ແນບເອກະສານ',
};

export default function CreateLegalDocumentPage() {
  return <DocumentCreateView />;
}
