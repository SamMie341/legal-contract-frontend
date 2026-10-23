import { Department } from './department.entity';

/**
 * Legal Document Status
 */
export enum LegalDocumentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * Legal Document Category Types
 */
export enum DocumentType {
  REGULATION = 'REGULATION',
  PROVISION = 'PROVISION',
  AGREEMENT = 'AGREEMENT',
  NOTICE = 'NOTICE',
  MANUAL = 'MANUAL',
  CONTRACT = 'CONTRACT',
  OTHER = 'OTHER',
}

/**
 * File attachment for legal document
 */
export interface DocumentAttachment {
  id: string;
  legalDocumentId?: string;
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
 * Legal Document Entity
 */
export interface LegalDocument {
  id: string;
  docTitle: string;
  docType: DocumentType;
  issueYear: number;
  docNumberDate: string;
  status: LegalDocumentStatus;
  responsiblePerson?: string | null;
  departmentId: string;
  department?: Department;
  purpose?: string | null;
  externalUrl?: string | null;
  createdById: string;
  createdBy?: {
    id?: string;
    fullName: string;
    employeeCode?: string;
  };
  attachments?: DocumentAttachment[];
  _count?: {
    attachments: number;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/**
 * Legal Documents Dashboard statistics
 */
export interface DocumentDashboardStats {
  totalDocuments: number;
  activeDocuments: number;
  inactiveDocuments: number;
  totalDepartmentsWithDocs: number;
  byType: {
    docType: DocumentType;
    count: number;
  }[];
  byDepartment: {
    departmentId: string;
    departmentName: string;
    count: number;
  }[];
}
