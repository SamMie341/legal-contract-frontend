import { ContractStatus, DisputeStatus, Currency, LegalDocumentStatus } from '@core/entities';

export interface StatusBadgeConfig {
  label: string;
  labelEn: string;
  className: string;
  dotColor: string;
}

/**
 * Contract status badge configuration
 */
export const CONTRACT_STATUS_MAP: Record<ContractStatus, StatusBadgeConfig> = {
  [ContractStatus.DRAFT]: {
    label: 'ຮ່າງສັນຍາ',
    labelEn: 'Draft',
    className: 'bg-slate-100 text-slate-700 border-slate-300',
    dotColor: 'bg-slate-500',
  },
  [ContractStatus.ACTIVE]: {
    label: 'ມີຜົນບັງຄັບໃຊ້',
    labelEn: 'Active',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    dotColor: 'bg-emerald-500',
  },
  [ContractStatus.EXPIRING_SOON]: {
    label: 'ໃກ້ໝົດອາຍຸ (≤ 60 ວັນ)',
    labelEn: 'Expiring Soon',
    className: 'bg-amber-50 text-amber-700 border-amber-300',
    dotColor: 'bg-amber-500 animate-pulse',
  },
  [ContractStatus.EXPIRED]: {
    label: 'ໝົດອາຍຸແລ້ວ',
    labelEn: 'Expired',
    className: 'bg-red-50 text-red-700 border-red-300',
    dotColor: 'bg-red-500',
  },
  [ContractStatus.TERMINATED]: {
    label: 'ຍົກເລີກກ່ອນກຳນົດ',
    labelEn: 'Terminated',
    className: 'bg-zinc-100 text-zinc-700 border-zinc-300',
    dotColor: 'bg-zinc-500',
  },
};

/**
 * Legal Case Dispute status badge configuration
 */
export const DISPUTE_STATUS_MAP: Record<DisputeStatus, StatusBadgeConfig> = {
  [DisputeStatus.FIRST_INSTANCE]: {
    label: 'ສານຂັ້ນຕົ້ນ',
    labelEn: 'First Instance',
    className: 'bg-blue-50 text-blue-700 border-blue-300',
    dotColor: 'bg-blue-500',
  },
  [DisputeStatus.APPEAL]: {
    label: 'ສານອຸທອນ',
    labelEn: 'Appeal Court',
    className: 'bg-purple-50 text-purple-700 border-purple-300',
    dotColor: 'bg-purple-500',
  },
  [DisputeStatus.SUPREME]: {
    label: 'ສານລົບລ້າງ',
    labelEn: 'Supreme Court',
    className: 'bg-orange-50 text-orange-700 border-orange-300',
    dotColor: 'bg-orange-500',
  },
  [DisputeStatus.RESOLVED]: {
    label: 'ສຳເລັດຄະດີ / ໄກ່ເກ່ຍແລ້ວ',
    labelEn: 'Resolved',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    dotColor: 'bg-emerald-500',
  },
  [DisputeStatus.CLOSED]: {
    label: 'ຈົບຄະດີ',
    labelEn: 'Closed',
    className: 'bg-slate-100 text-slate-700 border-slate-300',
    dotColor: 'bg-slate-500',
  },
};

/**
 * Currency badge configuration
 */
export const CURRENCY_MAP: Record<Currency, { label: string; symbol: string; className: string }> = {
  [Currency.LAK]: {
    label: 'ກີບ (LAK)',
    symbol: '₭',
    className: 'bg-sky-50 text-sky-700 border-sky-300 font-semibold',
  },
  [Currency.USD]: {
    label: 'ໂດລາ (USD)',
    symbol: '$',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold',
  },
  [Currency.CNY]: {
    label: 'ຢວນ (CNY)',
    symbol: '¥',
    className: 'bg-rose-50 text-rose-700 border-rose-300 font-semibold',
  },
};

/**
 * Legal document status badge
 */
export const LEGAL_DOC_STATUS_MAP: Record<LegalDocumentStatus, StatusBadgeConfig> = {
  [LegalDocumentStatus.ACTIVE]: {
    label: 'ນຳໃຊ້ປົກກະຕິ',
    labelEn: 'Active',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    dotColor: 'bg-emerald-500',
  },
  [LegalDocumentStatus.INACTIVE]: {
    label: 'ຍົກເລີກການນຳໃຊ້',
    labelEn: 'Inactive',
    className: 'bg-slate-100 text-slate-600 border-slate-300',
    dotColor: 'bg-slate-400',
  },
};
