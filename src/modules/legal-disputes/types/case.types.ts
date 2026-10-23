import { CaseType, DisputeStatus, LegalCase, CaseAttachment } from '@core/entities';

export interface CaseDashboardData {
  summary: {
    totalCases: number;
    inProgressCases: number;
    resolvedCases: number;
  };
  financialSummary: {
    totalDamageLak: number;
    totalDamageUsd: number;
    totalFineLak: number;
    totalFineUsd: number;
    totalDueLak: number;
    totalDueUsd: number;
    totalRecoveredLak: number;
    totalRecoveredUsd: number;
  };
  statusDonutChart: {
    disputeStatus: DisputeStatus;
    count: number;
  }[];
  typeDonutChart: {
    caseType: CaseType;
    count: number;
  }[];
  departmentBarChart: {
    id: string;
    name: string;
    code: string;
    count: number;
  }[];
}

export interface QueryLegalCaseParams {
  page?: number;
  limit?: number;
  search?: string;
  caseType?: CaseType;
  disputeStatus?: DisputeStatus;
  departmentId?: string;
  year?: number;
}

export interface CreateLegalCasePayload {
  caseCode: string;
  defendant: string;
  allegation?: string;
  departmentId?: string;
  departmentAction?: string;
  caseType: CaseType;
  damageLak?: number;
  damageUsd?: number;
  fineLak?: number;
  fineUsd?: number;
  totalDueLak?: number;
  totalDueUsd?: number;
  disputeStatus?: DisputeStatus;
  recoveredLak?: number;
  recoveredUsd?: number;
  date: string;
  disputeProgress?: string;
  externalUrl?: string;
}

export interface UpdateLegalCasePayload {
  caseCode?: string;
  defendant?: string;
  allegation?: string;
  departmentId?: string;
  departmentAction?: string;
  caseType?: CaseType;
  damageLak?: number;
  damageUsd?: number;
  fineLak?: number;
  fineUsd?: number;
  totalDueLak?: number;
  totalDueUsd?: number;
  disputeStatus?: DisputeStatus;
  recoveredLak?: number;
  recoveredUsd?: number;
  date?: string;
  disputeProgress?: string;
  externalUrl?: string;
}

export type CaseAttachmentItem = CaseAttachment;
export type LegalCaseDetail = LegalCase;
