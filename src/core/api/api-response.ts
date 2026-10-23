/**
 * Metadata for paginated list responses from NestJS backend
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Standard paginated response format
 */
export interface PaginatedResponse<T> {
  message?: string;
  meta?: PaginationMeta;
  pagination?: PaginationMeta;
  data: T[];
}

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
  message?: string;
  data: T;
  statusCode?: number;
}

/**
 * Standard backend error response format (NestJS)
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}

/**
 * Type guard to check if an object is an ApiErrorResponse
 */
export function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error
  );
}
