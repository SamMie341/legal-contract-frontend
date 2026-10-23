import { DocumentType, LegalDocumentStatus, LegalDocument, DocumentAttachment } from '@core/entities';

export interface DocumentDashboardData {
  summary: {
    totalDocuments: number;
    activeDocuments: number;
    inactiveDocuments: number;
    totalDepartmentsWithDocuments: number;
  };
  donutChart: {
    docType: DocumentType;
    count: number;
  }[];
  departmentBarChart: {
    id: string;
    name: string;
    code: string;
    count: number;
  }[];
}

export interface QueryLegalDocumentParams {
  page?: number;
  limit?: number;
  search?: string;
  docType?: DocumentType;
  status?: LegalDocumentStatus;
  issueYear?: number;
  departmentId?: string;
}

export interface CreateLegalDocumentPayload {
  docTitle: string;
  docType: DocumentType;
  issueYear: number;
  docNumberDate: string;
  status?: LegalDocumentStatus;
  responsiblePerson?: string;
  departmentId: string;
  purpose?: string;
  externalUrl?: string;
}

export interface UpdateLegalDocumentPayload {
  docTitle?: string;
  docType?: DocumentType;
  issueYear?: number;
  docNumberDate?: string;
  status?: LegalDocumentStatus;
  responsiblePerson?: string;
  departmentId?: string;
  purpose?: string;
  externalUrl?: string;
}

export type DocumentAttachmentItem = DocumentAttachment;
export type LegalDocumentDetail = LegalDocument;
