import { Department } from './department.entity';

/**
 * Court dispute progress stages
 */
export enum DisputeStatus {
  FIRST_INSTANCE = 'FIRST_INSTANCE',
  APPEAL = 'APPEAL',
  SUPREME = 'SUPREME',
  CLOSED = 'CLOSED',
  RESOLVED = 'RESOLVED',
}

/**
 * Legal Case Classifications
 */
export enum CaseType {
  COMMERCIAL = 'COMMERCIAL',
  CIVIL = 'CIVIL',
  CRIMINAL = 'CRIMINAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  OTHER = 'OTHER',
}

/**
 * File attachment for legal case dossier
 */
export interface CaseAttachment {
  id: string;
  legalCaseId?: string;
  fileName: string;
  fileUrl?: string;
  fileType?: string;
  mimeType?: string;
  fileSize: number;
  uploadedById?: string;
  uploadedBy?: {
    id?: string;
    fullName: string;
  };
  createdAt: string;
}

/**
 * Legal Case & Dispute Entity
 */
export interface LegalCase {
  internalId: string;
  id?: string;
  caseCode: string;
  defendant: string;
  allegation?: string | null;
  departmentId?: string | null;
  department?: Department;
  departmentAction?: string | null;
  caseType: CaseType;
  damageLak: number;
  damageUsd: number;
  fineLak: number;
  fineUsd: number;
  totalDueLak: number;
  totalDueUsd: number;
  disputeStatus: DisputeStatus;
  recoveredLak: number;
  recoveredUsd: number;
  date: string;
  disputeProgress?: string | null;
  externalUrl?: string | null;
  createdById: string;
  createdBy?: {
    id?: string;
    fullName: string;
    employeeCode?: string;
  };
  attachments?: CaseAttachment[];
  _count?: {
    attachments: number;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/**
 * Legal Case Dashboard statistics
 */
export interface CaseDashboardStats {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  financials: {
    totalDamageLak: number;
    totalDamageUsd: number;
    totalFineLak: number;
    totalFineUsd: number;
    totalDueLak: number;
    totalDueUsd: number;
    totalRecoveredLak: number;
    totalRecoveredUsd: number;
  };
  byStatus: {
    status: DisputeStatus;
    count: number;
  }[];
  byType: {
    caseType: CaseType;
    count: number;
  }[];
  byDepartment: {
    departmentId: string;
    departmentName: string;
    count: number;
  }[];
}
