/**
 * Contract Lifecycle Status
 */
export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
}

/**
 * Supported Currencies in EDL
 */
export enum Currency {
  LAK = 'LAK',
  USD = 'USD',
  CNY = 'CNY',
}

/**
 * File attachment for contract
 */
export interface ContractAttachment {
  id: string;
  contractId?: string;
  fileName: string;
  fileUrl?: string;
  fileType?: string;
  mimeType?: string;
  fileSize: number;
  version?: number;
  uploadedById?: string;
  uploadedBy?: {
    id?: string;
    fullName: string;
  };
  createdAt: string;
}

/**
 * Contract Entity matching backend
 */
export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  contractTypeId: number;
  contractType?: {
    id: number;
    nameLo?: string;
    nameEn?: string | null;
    name?: string;
    code?: string;
  };
  departmentId?: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  implementer?: string | null;
  durationText?: string | null;
  durationMonths?: number | null;
  signedDate?: string | null;
  currency: Currency;
  contractValue: number | string;
  status: ContractStatus;
  effectiveDate: string;
  expirationDate: string;
  equityOrCapitalContribution?: string | null;
  sharePercentage?: number | string | null;
  additionalDetails?: string | null;
  notifyDaysBefore: number;
  isExpiryNotified?: boolean;
  lastNotifiedAt?: string | null;
  createdById: string;
  createdBy?: {
    id?: string;
    fullName: string;
    employeeCode?: string;
    department?: string;
  };
  updatedById?: string | null;
  attachments?: ContractAttachment[];
  _count?: {
    attachments: number;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/**
 * Contract Dashboard statistics
 */
export interface ContractDashboardStats {
  totalContracts: number;
  activeContracts: number;
  expiringSoonContracts: number;
  expiredContracts: number;
  byStatus: Record<ContractStatus, number>;
  byCurrency: {
    currency: Currency;
    totalValue: number;
    count: number;
  }[];
  byType: {
    typeId: number;
    typeName: string;
    count: number;
  }[];
}
