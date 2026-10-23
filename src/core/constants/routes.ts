/**
 * Application route definitions
 */
export const APP_ROUTES = {
  AUTH: {
    LOGIN: '/login',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    CONTRACTS: '/dashboard/contracts',
    DOCUMENTS: '/dashboard/documents',
    CASES: '/dashboard/cases',
  },
  CONTRACTS: {
    LIST: '/contracts',
    CREATE: '/contracts/create',
    DETAIL: (id: string) => `/contracts/${id}`,
    EDIT: (id: string) => `/contracts/${id}/edit`,
  },
  LEGAL_DOCUMENTS: {
    LIST: '/legal-documents',
    CREATE: '/legal-documents/create',
    DETAIL: (id: string) => `/legal-documents/${id}`,
    EDIT: (id: string) => `/legal-documents/${id}/edit`,
  },
  LEGAL_CASES: {
    LIST: '/legal-cases',
    CREATE: '/legal-cases/create',
    DETAIL: (id: string) => `/legal-cases/${id}`,
    EDIT: (id: string) => `/legal-cases/${id}/edit`,
  },
  USERS: {
    LIST: '/users',
  },
  DEPARTMENTS: {
    LIST: '/departments',
  },
  AUDIT_LOGS: {
    LIST: '/audit-logs',
  },
} as const;
