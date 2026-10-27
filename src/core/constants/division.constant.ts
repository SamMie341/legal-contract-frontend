/**
 * Division constants and division-based permission helpers
 * 1. ພະແນກສັນຍາທົ່ວໄປ (General Contracts Division)
 * 2. ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ (Legal Affairs & Dispute Resolution Division - ຄອບຄຸມທັງ ນິຕິກຳ ແລະ ຄະດີ)
 */

export const DIVISION_NAMES = {
  GENERAL_CONTRACT: 'ພະແນກສັນຍາທົ່ວໄປ',
  LEGAL_AND_DISPUTE: 'ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ',
} as const;

export const DIVISION_OPTIONS = [
  {
    value: 'ພະແນກສັນຍາທົ່ວໄປ',
    label: '1. ພະແນກສັນຍາທົ່ວໄປ (General Contracts)',
  },
  {
    value: 'ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ',
    label: '2. ພະແນກນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ (Legal Documents & Disputes)',
  },
];

/**
 * Checks if user belongs to General Contract Division
 */
export function isGeneralContractDivision(division?: string | null): boolean {
  if (!division) return false;
  return division.includes('ສັນຍາ');
}

/**
 * Checks if user belongs to Legal Affairs & Dispute Resolution Division
 * (ວຽກງານນິຕິກຳ ແລະ ຄະດີ/ຂໍ້ຂັດແຍ່ງ ແມ່ນສັງກັດພະແນກດຽວກັນ)
 */
export function isLegalAndDisputeDivision(division?: string | null): boolean {
  if (!division) return false;
  return (
    division.includes('ນິຕິກຳ') ||
    division.includes('ນິຕິກໍາ') ||
    division.includes('ຂັດແຍ່ງ') ||
    division.includes('ຄະດີ')
  );
}

// Aliases
export const isLegalDocumentDivision = isLegalAndDisputeDivision;
export const isDisputeResolutionDivision = isLegalAndDisputeDivision;
