import {
  PowerContractType,
  PowerContract,
  ContractStatus,
  Currency,
} from '@core/entities';

export interface CreatePowerContractPayload {
  contractType: PowerContractType;
  contractNumber?: string;
  projectName: string;
  projectTypeOrCustomer: string;
  durationText?: string;
  durationMonths?: number;
  signedDate?: string;
  effectiveDate?: string;
  expirationDate?: string;
  installedCapacity?: string;
  capacityValue?: number;
  capacityUnit?: string;
  projectLocation?: string;
  tariff?: string;
  tariffValue?: number;
  tariffCurrency?: Currency;
  additionalDetails?: string;
  notifyDaysBefore?: number;
}

export type UpdatePowerContractPayload = Partial<CreatePowerContractPayload> & {
  status?: ContractStatus;
};

export interface PowerContractQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  contractType?: PowerContractType;
  status?: ContractStatus;
  projectTypeOrCustomer?: string;
}

export interface PowerContractAuditLog {
  id: string;
  action: string;
  performedBy?: {
    id: string;
    fullName: string;
    employeeCode: string;
  };
  changes?: Record<string, { old: any; new: any }>;
  createdAt: string;
}
