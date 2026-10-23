/**
 * Common query params for listing endpoints with pagination & search
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter params for date range queries
 */
export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

/**
 * Common filter params for Legal Contract System
 */
export interface ContractFilterParams extends PaginationParams {
  status?: string;
  contractTypeId?: number;
  departmentId?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Common filter params for Legal Documents
 */
export interface LegalDocumentFilterParams extends PaginationParams {
  docType?: string;
  status?: string;
  issueYear?: number;
  departmentId?: string;
}

/**
 * Common filter params for Legal Cases
 */
export interface LegalCaseFilterParams extends PaginationParams {
  caseType?: string;
  disputeStatus?: string;
  departmentId?: string;
  year?: number;
}
