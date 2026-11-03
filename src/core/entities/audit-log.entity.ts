/**
 * Audit Log Entity and Types
 */

export enum AuditAction {
  // General Contracts
  CREATE_CONTRACT = 'CREATE_CONTRACT',
  UPDATE_CONTRACT = 'UPDATE_CONTRACT',
  DELETE_CONTRACT = 'DELETE_CONTRACT',
  UPLOAD_ATTACHMENT = 'UPLOAD_ATTACHMENT',
  DOWNLOAD_ATTACHMENT = 'DOWNLOAD_ATTACHMENT',
  DELETE_ATTACHMENT = 'DELETE_ATTACHMENT',

  // Power Contracts
  CREATE_POWER_CONTRACT = 'CREATE_POWER_CONTRACT',
  UPDATE_POWER_CONTRACT = 'UPDATE_POWER_CONTRACT',
  DELETE_POWER_CONTRACT = 'DELETE_POWER_CONTRACT',
  UPLOAD_POWER_ATTACHMENT = 'UPLOAD_POWER_ATTACHMENT',
  DOWNLOAD_POWER_ATTACHMENT = 'DOWNLOAD_POWER_ATTACHMENT',
  DELETE_POWER_ATTACHMENT = 'DELETE_POWER_ATTACHMENT',

  // Legal Documents
  CREATE_LEGAL_DOCUMENT = 'CREATE_LEGAL_DOCUMENT',
  UPDATE_LEGAL_DOCUMENT = 'UPDATE_LEGAL_DOCUMENT',
  DELETE_LEGAL_DOCUMENT = 'DELETE_LEGAL_DOCUMENT',

  // Legal Cases
  CREATE_LEGAL_CASE = 'CREATE_LEGAL_CASE',
  UPDATE_LEGAL_CASE = 'UPDATE_LEGAL_CASE',
  DELETE_LEGAL_CASE = 'DELETE_LEGAL_CASE',

  // Security & Users
  USER_PERMISSION_CHANGE = 'USER_PERMISSION_CHANGE',

  // Roles
  CREATE_ROLE = 'CREATE_ROLE',
  UPDATE_ROLE = 'UPDATE_ROLE',
  DELETE_ROLE = 'DELETE_ROLE',
}

export type AuditLogCategory =
  | 'ALL'
  | 'SECURITY'
  | 'CONTRACTS'
  | 'POWER_CONTRACTS'
  | 'LEGAL'
  | 'ATTACHMENTS'
  | 'ROLES';

export interface AuditLogUser {
  id?: string;
  fullName?: string;
  employeeCode?: string;
  department?: string;
}

export interface AuditLogContract {
  id?: string;
  title?: string;
  contractNumber?: string;
}

export interface AuditLogPowerContract {
  id?: string;
  projectName?: string;
  contractNumber?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  contractId?: string | null;
  powerContractId?: string | null;
  action: AuditAction | string;
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  user?: AuditLogUser | null;
  contract?: AuditLogContract | null;
  powerContract?: AuditLogPowerContract | null;
}

export interface AuditLogStats {
  totalLogs: number;
  todayLogs: number;
  securityChanges: number;
  contractChanges: number;
  legalChanges: number;
  attachmentActions: number;
  roleChanges: number;
}

export interface AuditActionInfo {
  label: string;
  description: string;
  category: AuditLogCategory;
  color: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'slate';
}

export const AUDIT_ACTION_MAP: Record<string, AuditActionInfo> = {
  // General Contracts
  [AuditAction.CREATE_CONTRACT]: {
    label: 'ສ້າງສັນຍາທົ່ວໄປ',
    description: 'ເພີ່ມຂໍ້ມູນສັນຍາທົ່ວໄປສະບັບໃໝ່',
    category: 'CONTRACTS',
    color: 'blue',
  },
  [AuditAction.UPDATE_CONTRACT]: {
    label: 'ແກ້ໄຂສັນຍາທົ່ວໄປ',
    description: 'ປັບປຸງຂໍ້ມູນລາຍລະອຽດສັນຍາທົ່ວໄປ',
    category: 'CONTRACTS',
    color: 'amber',
  },
  [AuditAction.DELETE_CONTRACT]: {
    label: 'ລົບສັນຍາທົ່ວໄປ',
    description: 'ລົບສັນຍາທົ່ວໄປອອກຈາກລະບົບ (Soft Delete)',
    category: 'CONTRACTS',
    color: 'rose',
  },

  // Power Contracts
  [AuditAction.CREATE_POWER_CONTRACT]: {
    label: 'ສ້າງສັນຍາຊື້-ຂາຍໄຟຟ້າ',
    description: 'ເພີ່ມຂໍ້ມູນສັນຍາຊື້-ຂາຍໄຟຟ້າສະບັບໃໝ່',
    category: 'POWER_CONTRACTS',
    color: 'indigo',
  },
  [AuditAction.UPDATE_POWER_CONTRACT]: {
    label: 'ແກ້ໄຂສັນຍາຊື້-ຂາຍໄຟຟ້າ',
    description: 'ປັບປຸງຂໍ້ມູນສັນຍາຊື້-ຂາຍໄຟຟ້າ',
    category: 'POWER_CONTRACTS',
    color: 'amber',
  },
  [AuditAction.DELETE_POWER_CONTRACT]: {
    label: 'ລົບສັນຍາຊື້-ຂາຍໄຟຟ້າ',
    description: 'ລົບສັນຍາຊື້-ຂາຍໄຟຟ້າ (Soft Delete)',
    category: 'POWER_CONTRACTS',
    color: 'rose',
  },

  // Attachments
  [AuditAction.UPLOAD_ATTACHMENT]: {
    label: 'ອັບໂຫຼດໄຟລ໌ສັນຍາທົ່ວໄປ',
    description: 'ອັບໂຫຼດເອກະສານແນບສັນຍາທົ່ວໄປ',
    category: 'ATTACHMENTS',
    color: 'blue',
  },
  [AuditAction.DOWNLOAD_ATTACHMENT]: {
    label: 'ດາວໂຫຼດໄຟລ໌ສັນຍາທົ່ວໄປ',
    description: 'ດາວໂຫຼດເອກະສານແນບສັນຍາທົ່ວໄປ',
    category: 'ATTACHMENTS',
    color: 'slate',
  },
  [AuditAction.DELETE_ATTACHMENT]: {
    label: 'ລົບໄຟລ໌ສັນຍາທົ່ວໄປ',
    description: 'ລົບເອກະສານແນບສັນຍາທົ່ວໄປ',
    category: 'ATTACHMENTS',
    color: 'rose',
  },
  [AuditAction.UPLOAD_POWER_ATTACHMENT]: {
    label: 'ອັບໂຫຼດໄຟລ໌ສັນຍາໄຟຟ້າ',
    description: 'ອັບໂຫຼດເອກະສານແນບສັນຍາຊື້-ຂາຍໄຟຟ້າ',
    category: 'ATTACHMENTS',
    color: 'indigo',
  },
  [AuditAction.DOWNLOAD_POWER_ATTACHMENT]: {
    label: 'ດາວໂຫຼດໄຟລ໌ສັນຍາໄຟຟ້າ',
    description: 'ດາວໂຫຼດເອກະສານແນບສັນຍາຊື້-ຂາຍໄຟຟ້າ',
    category: 'ATTACHMENTS',
    color: 'slate',
  },
  [AuditAction.DELETE_POWER_ATTACHMENT]: {
    label: 'ລົບໄຟລ໌ສັນຍາໄຟຟ້າ',
    description: 'ລົບເອກະສານແນບສັນຍາຊື້-ຂາຍໄຟຟ້າ',
    category: 'ATTACHMENTS',
    color: 'rose',
  },

  // Legal Documents
  [AuditAction.CREATE_LEGAL_DOCUMENT]: {
    label: 'ສ້າງນິຕິກຳໃໝ່',
    description: 'ເພີ່ມເອກະສານນິຕິກຳ ແລະ ລະບຽບການໃໝ່',
    category: 'LEGAL',
    color: 'emerald',
  },
  [AuditAction.UPDATE_LEGAL_DOCUMENT]: {
    label: 'ແກ້ໄຂນິຕິກຳ',
    description: 'ປັບປຸງຂໍ້ມູນເອກະສານນິຕິກຳ',
    category: 'LEGAL',
    color: 'amber',
  },
  [AuditAction.DELETE_LEGAL_DOCUMENT]: {
    label: 'ລົບນິຕິກຳ',
    description: 'ລົບເອກະສານນິຕິກຳອອກຈາກລະບົບ',
    category: 'LEGAL',
    color: 'rose',
  },

  // Legal Cases
  [AuditAction.CREATE_LEGAL_CASE]: {
    label: 'ສ້າງສຳນວນຄະດີ',
    description: 'ເພີ່ມຂໍ້ມູນສຳນວນຄະດີ ແລະ ຂໍ້ຂັດແຍ່ງໃໝ່',
    category: 'LEGAL',
    color: 'emerald',
  },
  [AuditAction.UPDATE_LEGAL_CASE]: {
    label: 'ແກ້ໄຂສຳນວນຄະດີ',
    description: 'ປັບປຸງສະຖານະ ແລະ ຂໍ້ມູນຄະດີ',
    category: 'LEGAL',
    color: 'amber',
  },
  [AuditAction.DELETE_LEGAL_CASE]: {
    label: 'ລົບສຳນວນຄະດີ',
    description: 'ລົບສຳນວນຄະດີອອກຈາກລະບົບ',
    category: 'LEGAL',
    color: 'rose',
  },

  // Security & Permissions
  [AuditAction.USER_PERMISSION_CHANGE]: {
    label: 'ປ່ຽນແປງສິດທິ / ລະຫັດຜ່ານ',
    description: 'ປັບບົດບາດ, ສິດທິ Matrix, ຣີເຊັດລະຫັດຜ່ານ ຫຼື ກວດພົບການລະເມີດ Path',
    category: 'SECURITY',
    color: 'purple',
  },

  // Roles
  [AuditAction.CREATE_ROLE]: {
    label: 'ສ້າງບົດບາດໃໝ່',
    description: 'ສ້າງ Role ໃໝ່ພ້ອມກຳນົດສິດ Matrix ເລີ່ມຕົ້ນ',
    category: 'ROLES',
    color: 'purple',
  },
  [AuditAction.UPDATE_ROLE]: {
    label: 'ແກ້ໄຂບົດບາດ',
    description: 'ປັບປຸງຊື່ ຫຼື Matrix ສິດທິຂອງ Role',
    category: 'ROLES',
    color: 'amber',
  },
  [AuditAction.DELETE_ROLE]: {
    label: 'ລົບບົດບາດ',
    description: 'ລົບບົດບາດ Custom ອອກຈາກລະບົບ',
    category: 'ROLES',
    color: 'rose',
  },
};
