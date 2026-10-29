import { ContractStatus, Currency } from './contract.entity';

/**
 * ປະເພດສັນຍາຊື້-ຂາຍໄຟຟ້າ (Power Contract Types)
 */
export enum PowerContractType {
  PURCHASE = 'PURCHASE', // ສັນຍາຊື້ໄຟຟ້າ (Power Purchase Agreement - PPA)
  SALE = 'SALE',         // ສັນຍາຂາຍໄຟຟ້າ (Power Sale Agreement - PSA)
}

/**
 * 5 ປະເພດໂຄງການສັນຍາຊື້ໄຟຟ້າ (PPA Project Types)
 */
export interface PowerProjectTypeOption {
  id: string;
  nameLo: string;
  nameEn: string;
  description?: string;
}

/**
 * ໄຟລ໌ແນບສັນຍາຊື້-ຂາຍໄຟຟ້າ
 */
export interface PowerContractAttachment {
  id: string;
  powerContractId: string;
  fileName: string;
  filePath?: string;
  fileSize: number;
  mimeType: string;
  version: number;
  uploadedById?: string;
  uploadedBy?: {
    id: string;
    fullName: string;
    employeeCode?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

/**
 * Entity ສັນຍາຊື້-ຂາຍໄຟຟ້າ (PowerContract)
 */
export interface PowerContract {
  id: string;
  contractType: PowerContractType;
  contractNumber?: string | null;
  projectName: string;
  projectTypeOrCustomer: string;
  durationText?: string | null;
  durationMonths?: number | null;
  signedDate?: string | null;
  effectiveDate?: string | null;
  expirationDate?: string | null;
  installedCapacity?: string | null;
  capacityValue?: number | null;
  capacityUnit?: string | null;
  projectLocation?: string | null;
  tariff?: string | null;
  tariffValue?: number | null;
  tariffCurrency?: Currency | null;
  additionalDetails?: string | null;
  status: ContractStatus;
  notifyDaysBefore: number;
  isExpiryNotified?: boolean;
  lastNotifiedAt?: string | null;
  createdById: string;
  createdBy?: {
    id: string;
    fullName: string;
    employeeCode?: string;
  };
  updatedById?: string | null;
  updatedBy?: {
    id: string;
    fullName: string;
    employeeCode?: string;
  } | null;
  attachments?: PowerContractAttachment[];
  _count?: {
    attachments: number;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/**
 * ຂໍ້ມູນສະຖິຕິ Dashboard ສັນຍາຊື້-ຂາຍໄຟຟ້າ
 */
export interface PowerContractDashboardData {
  total: number;
  expiringSoonCount: number;
  expiredCount: number;
  byStatus: Array<{
    status: ContractStatus;
    _count: { id: number };
  }>;
  byContractType: {
    purchaseCount: number;
    saleCount: number;
    totalCapacityPurchase: number;
    totalCapacitySale: number;
  };
  byProjectType: Array<{
    name: string;
    count: number;
    totalCapacity: number;
  }>;
  totalInstalledCapacity: number;
  expiringSoonList: Array<{
    id: string;
    projectName: string;
    contractType: PowerContractType;
    contractNumber?: string | null;
    expirationDate?: string | null;
    installedCapacity?: string | null;
    capacityValue?: number | null;
    projectTypeOrCustomer: string;
  }>;
}
