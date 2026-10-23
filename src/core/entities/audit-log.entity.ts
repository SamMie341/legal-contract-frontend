/**
 * Audit Log Entity for tracking system actions
 */
export interface AuditLog {
  id: string | number;
  userId: string;
  user?: {
    id: string;
    fullName: string;
    employeeCode: string;
  };
  action: string; // e.g. CREATE, UPDATE, DELETE, UPLOAD, DOWNLOAD
  entity: string; // e.g. CONTRACT, LEGAL_DOCUMENT, LEGAL_CASE
  entityId: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
