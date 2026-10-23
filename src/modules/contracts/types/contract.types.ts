import { ContractStatus, Currency, Contract, ContractAttachment } from '@core/entities';

/**
 * Backend contract dashboard response structure
 */
export interface ContractDashboardData {
  summary: {
    totalContracts: number;
    expiringSoonCount: number;
    expiredCount: number;
  };
  statusChart: {
    status: ContractStatus;
    count: number;
  }[];
  currencyChart: {
    currency: Currency;
    count: number;
  }[];
  valueByCurrency: {
    currency: Currency;
    totalValue: number;
  }[];
  typeChart: {
    contractTypeId: number;
    nameLo: string;
    nameEn: string | null;
    count: number;
  }[];
}

/**
 * Dropdown item for 14 Contract Types
 */
export interface ContractTypeDropdownItem {
  id: number;
  value: number;
  nameLo: string;
  nameEn: string | null;
  label: string;
}

/**
 * Contract query filters
 */
export interface ContractQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContractStatus;
  contractTypeId?: number;
  currency?: Currency;
  departmentId?: string;
}

/**
 * Payload to create a contract
 */
export interface CreateContractPayload {
  title: string;
  contractTypeId: number;
  contractNumber: string;
  durationText?: string;
  durationMonths?: number;
  signedDate?: string;
  effectiveDate?: string;
  expirationDate?: string;
  contractValue?: number;
  currency?: Currency;
  equityOrCapitalContribution?: string;
  sharePercentage?: number;
  implementer?: string;
  additionalDetails?: string;
  notifyDaysBefore?: number;
}

/**
 * Payload to update a contract
 */
export interface UpdateContractPayload {
  title?: string;
  contractTypeId?: number;
  contractNumber?: string;
  durationText?: string;
  durationMonths?: number;
  signedDate?: string;
  effectiveDate?: string;
  expirationDate?: string;
  contractValue?: number;
  currency?: Currency;
  equityOrCapitalContribution?: string;
  sharePercentage?: number;
  implementer?: string;
  additionalDetails?: string;
  notifyDaysBefore?: number;
  status?: ContractStatus;
}

/**
 * Contract Attachment item alias
 */
export type ContractAttachmentItem = ContractAttachment;

/**
 * Audit log entry for contract changes
 */
export interface ContractAuditLog {
  id: string;
  action: string;
  actionLabelLo?: string;
  user?: {
    id: string;
    fullName: string;
    employeeCode: string;
    department?: string;
    role?: string;
  };
  ipAddress?: string | null;
  createdAt: string;
  changes?: {
    field: string;
    fieldLabelLo?: string;
    oldValue: any;
    newValue: any;
  }[];
  oldValues?: any;
  newValues?: any;
}

/**
 * Detailed contract entity with attachments and audit trail
 */
export interface ContractDetail extends Contract {
  auditLogs?: ContractAuditLog[];
}
