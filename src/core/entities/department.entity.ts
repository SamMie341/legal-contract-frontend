/**
 * Department / Division Entity (HRM Synced)
 */
export interface Department {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
