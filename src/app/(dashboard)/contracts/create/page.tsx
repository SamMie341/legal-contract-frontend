import type { Metadata } from 'next';
import { ContractCreateView } from '@modules/contracts';

export const metadata: Metadata = {
  title: 'ສ້າງສັນຍາໃໝ່ | EDL Legal & Contract',
  description: 'ເພີ່ມຂໍ້ມູນສັນຍາໃໝ່ ແລະ ແນບເອກະສານສັນຍາ ລັດວິສາຫະກິດໄຟຟ້າລາວ',
};

export default function CreateContractPage() {
  return <ContractCreateView />;
}
