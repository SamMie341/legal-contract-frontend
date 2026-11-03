/**
 * Department / Division Entity (HRM Synced)
 */
export interface Department {
  id: string;
  name: string;
  code?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    legalDocuments?: number;
    legalCases?: number;
  };
}

export interface CreateDepartmentPayload {
  name: string;
  code?: string;
  isActive?: boolean;
}

export interface UpdateDepartmentPayload {
  name?: string;
  code?: string;
  isActive?: boolean;
}

export interface HrmDepartmentPreviewItem {
  departmentId: string | number;
  code?: string;
  name: string;
  phone?: string;
  email?: string;
  status?: string;
  isActive: boolean;
  alreadyInSystem: boolean;
}

export interface SyncDepartmentsResponse {
  message: string;
  totalFromHrm: number;
  createdCount: number;
  updatedCount: number;
  data: Department[];
}

/**
 * 14 Master Contract Types
 */
export interface ContractType {
  id: number;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
}
