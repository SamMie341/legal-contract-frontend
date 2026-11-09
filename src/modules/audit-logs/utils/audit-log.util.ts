import { AuditLog, AuditLogTargetUser } from '@core/entities';

export interface AuditResourceInfo {
  category:
    | 'CONTRACT'
    | 'POWER_CONTRACT'
    | 'LEGAL_DOCUMENT'
    | 'LEGAL_CASE'
    | 'ROLE'
    | 'USER'
    | 'SECURITY'
    | 'ATTACHMENT'
    | 'OTHER';
  typeLabel: string;
  title: string;
  codeOrNumber?: string | null;
  secondaryInfo?: string | null;
  attachment?: {
    fileName: string;
    fileSize?: number | null;
    attachmentId?: string | null;
  } | null;
  badgeColor: 'blue' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
}

/**
 * Resolves the target user object from the log, with fallback to oldValues/newValues
 */
export function resolveTargetUser(log: AuditLog): AuditLogTargetUser | null {
  if (log.targetUser && (log.targetUser.fullName || log.targetUser.employeeCode || log.targetUser.username)) {
    return log.targetUser;
  }

  const fromNew = log.newValues?.targetUser;
  if (fromNew && (fromNew.fullName || fromNew.employeeCode || fromNew.username)) {
    return fromNew;
  }

  const fromOld = log.oldValues?.targetUser;
  if (fromOld && (fromOld.fullName || fromOld.employeeCode || fromOld.username)) {
    return fromOld;
  }

  if (log.oldValues?.deletedUserId || log.oldValues?.username || log.oldValues?.employeeCode) {
    return {
      id: log.oldValues.deletedUserId || log.targetUserId || undefined,
      employeeCode: log.oldValues.employeeCode,
      username: log.oldValues.username,
      fullName: log.oldValues.fullName,
      department: log.oldValues.department,
      division: log.oldValues.division,
      role: log.oldValues.role,
    };
  }

  if (log.targetUserId) {
    return {
      id: log.targetUserId,
    };
  }

  return null;
}

/**
 * Resolves the primary target resource information for any audit log across modules
 */
export function resolveResourceInfo(log: AuditLog): AuditResourceInfo {
  const actionStr = String(log.action || '');
  const oldVals = log.oldValues || {};
  const newVals = log.newValues || {};

  // 1. Check for Attachment
  const isAttachmentAction =
    actionStr.includes('ATTACHMENT') ||
    Boolean(newVals.fileName || oldVals.fileName || newVals.attachmentId || oldVals.attachmentId);

  const attachmentData = isAttachmentAction
    ? {
        fileName: newVals.fileName || oldVals.fileName || 'ເອກະສານແນບ',
        fileSize: newVals.fileSize ?? oldVals.fileSize ?? null,
        attachmentId: newVals.attachmentId || oldVals.attachmentId || null,
      }
    : null;

  // 2. Power Contracts (or Attachment on Power Contract)
  if (
    actionStr.includes('POWER') ||
    log.powerContract ||
    log.powerContractId ||
    newVals.projectName ||
    oldVals.projectName
  ) {
    const title =
      log.powerContract?.projectName ||
      newVals.projectName ||
      oldVals.projectName ||
      (log.powerContractId ? `ສັນຍາໄຟຟ້າ ID: ${log.powerContractId.slice(0, 8)}...` : 'ສັນຍາຊື້-ຂາຍໄຟຟ້າ');

    const code =
      log.powerContract?.contractNumber ||
      newVals.contractNumber ||
      oldVals.contractNumber ||
      null;

    return {
      category: isAttachmentAction ? 'ATTACHMENT' : 'POWER_CONTRACT',
      typeLabel: isAttachmentAction ? 'ໄຟລ໌ແນບສັນຍາໄຟຟ້າ' : 'ສັນຍາຊື້-ຂາຍໄຟຟ້າ',
      title: isAttachmentAction ? attachmentData!.fileName : title,
      codeOrNumber: code ? `ເລກທີ: ${code}` : null,
      secondaryInfo: isAttachmentAction ? `ໂຄງການ: ${title}` : null,
      attachment: attachmentData,
      badgeColor: 'indigo',
    };
  }

  // 3. General Contracts (or Attachment on General Contract)
  if (
    actionStr.includes('CONTRACT') ||
    isAttachmentAction ||
    log.contract ||
    log.contractId ||
    newVals.title ||
    oldVals.title
  ) {
    const title =
      log.contract?.title ||
      newVals.title ||
      oldVals.title ||
      (log.contractId ? `ສັນຍາ ID: ${log.contractId.slice(0, 8)}...` : 'ສັນຍາທົ່ວໄປ');

    const code =
      log.contract?.contractNumber ||
      newVals.contractNumber ||
      oldVals.contractNumber ||
      null;

    return {
      category: isAttachmentAction ? 'ATTACHMENT' : 'CONTRACT',
      typeLabel: isAttachmentAction ? 'ໄຟລ໌ແນບສັນຍາທົ່ວໄປ' : 'ສັນຍາທົ່ວໄປ',
      title: isAttachmentAction ? attachmentData!.fileName : title,
      codeOrNumber: code ? `ເລກທີ: ${code}` : null,
      secondaryInfo: isAttachmentAction ? `ສັນຍາ: ${title}` : null,
      attachment: attachmentData,
      badgeColor: 'blue',
    };
  }

  // 4. Legal Documents
  if (
    actionStr.includes('LEGAL_DOCUMENT') ||
    newVals.docTitle ||
    oldVals.docTitle ||
    newVals.docNumberDate ||
    oldVals.docNumberDate
  ) {
    const title = newVals.docTitle || oldVals.docTitle || 'ເອກະສານນິຕິກຳ';
    const code = newVals.docNumberDate || oldVals.docNumberDate || null;
    const docType = newVals.docType || oldVals.docType || null;

    return {
      category: 'LEGAL_DOCUMENT',
      typeLabel: 'ນິຕິກຳ ແລະ ລະບຽບການ',
      title,
      codeOrNumber: code ? `ເລກທີ/ວັນທີ: ${code}` : null,
      secondaryInfo: docType ? `ປະເພດ: ${docType}` : null,
      badgeColor: 'emerald',
    };
  }

  // 5. Legal Cases
  if (
    actionStr.includes('LEGAL_CASE') ||
    newVals.caseCode ||
    oldVals.caseCode ||
    newVals.caseTitle ||
    oldVals.caseTitle ||
    newVals.defendant ||
    oldVals.defendant
  ) {
    const defendant = newVals.defendant || oldVals.defendant;
    const caseTitle = newVals.caseTitle || oldVals.caseTitle;
    const title =
      caseTitle ||
      (defendant ? `ຄະດີ: ${defendant}` : 'ສຳນວນຄະດີ ແລະ ຂໍ້ຂັດແຍ່ງ');

    const code =
      newVals.caseCode ||
      oldVals.caseCode ||
      newVals.internalId ||
      oldVals.internalId ||
      null;

    const caseType = newVals.caseType || oldVals.caseType || null;

    return {
      category: 'LEGAL_CASE',
      typeLabel: 'ສຳນວນຄະດີ & ຂໍ້ຂັດແຍ່ງ',
      title,
      codeOrNumber: code ? `ລະຫັດຄະດີ: ${code}` : null,
      secondaryInfo: caseType ? `ປະເພດ: ${caseType}` : null,
      badgeColor: 'emerald',
    };
  }

  // 6. Roles
  if (
    actionStr.includes('ROLE') ||
    newVals.roleId ||
    oldVals.roleId ||
    (newVals.name && (newVals.permissions || newVals.title))
  ) {
    const title =
      newVals.title ||
      oldVals.title ||
      newVals.name ||
      oldVals.name ||
      'ບົດບາດລະບົບ';

    const roleName = newVals.name || oldVals.name || null;

    return {
      category: 'ROLE',
      typeLabel: 'ບົດບາດ ແລະ ສິດທິ (Role)',
      title,
      codeOrNumber: roleName ? `Role: ${roleName}` : null,
      secondaryInfo: newVals.details || oldVals.details || null,
      badgeColor: 'purple',
    };
  }

  // 7. Security Alerts (Path Tampering)
  if (newVals.alertType === 'PATH_TAMPERING_DETECTED') {
    return {
      category: 'SECURITY',
      typeLabel: 'ຄວາມປອດໄພ / Path Alert',
      title: newVals.attemptedPath ? `Path: ${newVals.attemptedPath}` : 'Path Tampering Detected',
      codeOrNumber: newVals.targetModule ? `ໂມດູນ: ${newVals.targetModule}` : null,
      secondaryInfo: newVals.requiredDivision ? `ພະແນກທີ່ອະນຸຍາດ: ${newVals.requiredDivision}` : null,
      badgeColor: 'rose',
    };
  }

  // 8. User Target
  const targetUser = resolveTargetUser(log);
  if (targetUser && (targetUser.fullName || targetUser.employeeCode || targetUser.username)) {
    return {
      category: 'USER',
      typeLabel: 'ບັນຊີຜູ້ໃຊ້ງານ',
      title: targetUser.fullName || `@${targetUser.username}` || 'ຜູ້ໃຊ້ລະບົບ',
      codeOrNumber: targetUser.employeeCode ? `ລະຫັດ: ${targetUser.employeeCode}` : null,
      secondaryInfo: [targetUser.role, targetUser.division || targetUser.department].filter(Boolean).join(' • '),
      badgeColor: 'purple',
    };
  }

  // 9. Fallback
  return {
    category: 'OTHER',
    typeLabel: 'ລະບົບທົ່ວໄປ',
    title: 'ການດຳເນີນງານລະບົບ',
    codeOrNumber: null,
    secondaryInfo: null,
    badgeColor: 'slate',
  };
}

/**
 * Formats byte size into human readable KB / MB
 */
export function formatFileSize(bytes: number | string | null | undefined): string {
  if (bytes === null || bytes === undefined) return '-';
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(num) || num < 0) return String(bytes);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Lao translation dictionary for audit log fields
 */
export const AUDIT_FIELD_LABELS: Record<string, string> = {
  // General & Contracts
  title: 'ຫົວຂໍ້ສັນຍາ',
  contractTitle: 'ຫົວຂໍ້ສັນຍາ',
  projectName: 'ຊື່ໂຄງການ',
  contractNumber: 'ເລກທີສັນຍາ',
  contractTypeId: 'ລະຫັດປະເພດສັນຍາ',
  contractType: 'ປະເພດສັນຍາ',
  status: 'ສະຖານະ',
  durationText: 'ອາຍຸສັນຍາ',
  durationMonths: 'ຈຳນວນເດືອນອາຍຸສັນຍາ',
  signedDate: 'ວັນທີລົງລາຍເຊັນ',
  effectiveDate: 'ວັນທີມີຜົນບັງຄັບໃຊ້',
  expirationDate: 'ວັນທີໝົດອາຍຸ',
  expiryDate: 'ວັນທີໝົດອາຍຸ',
  amount: 'ມູນຄ່າສັນຍາ',
  contractValue: 'ມູນຄ່າສັນຍາ',
  currency: 'ສະກຸນເງິນ',
  equityOrCapitalContribution: 'ສັດສ່ວນຫຸ້ນ / ເງິນປະກອບທຶນ',
  sharePercentage: 'ເປີເຊັນຫຸ້ນ (%)',
  implementer: 'ຜູ້ຈັດຕັ້ງປະຕິບັດ',
  additionalDetails: 'ລາຍລະອຽດເພີ່ມເຕີມ',
  partnerName: 'ຄູ່ສັນຍາ / ບໍລິສັດຄູ່ຮ່ວມ',
  partyA: 'ຄູ່ສັນຍາ ຝ່າຍ ກ',
  partyB: 'ຄູ່ສັນຍາ ຝ່າຍ ຂ',
  firstParty: 'ຄູ່ສັນຍາ ຝ່າຍ ກ',
  secondParty: 'ຄູ່ສັນຍາ ຝ່າຍ ຂ',
  thirdParty: 'ຄູ່ສັນຍາ ຝ່າຍ ຄ',
  notifyDaysBefore: 'ແຈ້ງເຕືອນລ່ວງໜ້າ (ວັນ)',
  isExpiryNotified: 'ສະຖານະການແຈ້ງເຕືອນ',

  // Attachments
  fileName: 'ຊື່ໄຟລ໌ເອກະສານແນບ',
  fileSize: 'ຂະໜາດໄຟລ໌',
  mimeType: 'ປະເພດໄຟລ໌ (MIME)',
  attachmentId: 'ລະຫັດໄຟລ໌ແນບ',
  version: 'ເວີຊັນໄຟລ໌',

  // Power Contracts
  installedCapacity: 'ກຳລັງການຜະລິດຕິດຕັ້ງ (MW)',
  commercialOperationDate: 'ວັນທີດຳເນີນງານທາງການຄ້າ (COD)',
  tariff: 'ລາຄາຄ່າໄຟຟ້າ',
  transmissionLine: 'ສາຍສົ່ງ',
  substation: 'ສະຖານີໄຟຟ້າ',
  location: 'ສະຖານທີ່ຕັ້ງ',

  // Legal Documents
  docTitle: 'ຫົວຂໍ້ນິຕິກຳ',
  docNumberDate: 'ເລກທີ ແລະ ວັນທີນິຕິກຳ',
  docType: 'ປະເພດນິຕິກຳ',
  documentType: 'ປະເພດນິຕິກຳ',
  issueYear: 'ປີອອກນິຕິກຳ',
  responsiblePerson: 'ຜູ້ຮັບຜິດຊອບ',
  departmentId: 'ລະຫັດຫ້ອງການ/ຝ່າຍ',

  // Legal Cases
  internalId: 'ລະຫັດພາຍໃນສຳນວນຄະດີ',
  caseCode: 'ລະຫັດເລກທີຄະດີ',
  caseNumber: 'ເລກທີຄະດີ',
  caseTitle: 'ຫົວຂໍ້ຄະດີ',
  caseType: 'ປະເພດຄະດີ',
  defendant: 'ຈຳເລີຍ / ຄູ່ກໍລະນີ',
  allegation: 'ຂໍ້ກ່າວຫາ / ຂໍ້ຂັດແຍ່ງ',
  disputeStatus: 'ສະຖານະຂໍ້ຂັດແຍ່ງ',
  courtLevel: 'ຂັ້ນສານ / ອົງການແກ້ໄຂ',
  verdictDate: 'ວັນທີຕັດສິນ',
  financialImpact: 'ມູນຄ່າຜົນກະທົບ',

  // Users & Roles
  role: 'ບົດບາດ (Role)',
  roleId: 'ລະຫັດບົດບາດ (Role ID)',
  roleName: 'ຊື່ບົດບາດ',
  name: 'ຊື່ (Name)',
  username: 'ຊື່ບັນຊີຜູ້ໃຊ້ (Username)',
  fullName: 'ຊື່ ແລະ ນາມສະກຸນ',
  employeeCode: 'ລະຫັດພະນັກງານ',
  syncedEmployeeCode: 'ລະຫັດພະນັກງານຊິງຄ໌ (HRM)',
  department: 'ຫ້ອງການ/ຝ່າຍ (Department)',
  division: 'ສັງກັດພະແນກ (Division)',
  unit: 'ໜ່ວຍງານ (Unit)',
  position: 'ຕຳແໜ່ງ (Position)',
  phone: 'ເບີໂທລະສັບ',
  email: 'ອີເມວ',
  isActive: 'ເປີດນຳໃຊ້ບັນຊີ',
  permissions: 'ສິດທິການນຳໃຊ້ (Permissions)',
  modulePermissions: 'ສິດທິລາຍໂມດູນ (Module Permissions)',
  canView: 'ສິດເບິ່ງ (canView)',
  canUpload: 'ສິດສ້າງ/ອັບໂຫຼດ (canUpload)',
  canEdit: 'ສິດແກ້ໄຂ (canEdit)',
  canDelete: 'ສິດລົບ (canDelete)',
  canDownload: 'ສິດດາວໂຫຼດ (canDownload)',
  targetUser: 'ຜູ້ໃຊ້ເປົ້າໝາຍ (Target User)',
  targetUserId: 'ລະຫັດຜູ້ໃຊ້ເປົ້າໝາຍ',
  deletedUserId: 'ລະຫັດຜູ້ໃຊ້ທີ່ຖືກລົບ',
  temporaryPassword: 'ລະຫັດຜ່ານຊົ່ວຄາວ',
  passwordChangedAt: 'ວັນທີປ່ຽນລະຫັດຜ່ານ',
  tokenVersion: 'Token Version',
  details: 'ລາຍລະອຽດ',
  description: 'ຄຳອະທິບາຍ',

  // Security / System
  attemptedPath: 'Path ທີ່ພະຍາຍາມເຂົ້າເຖິງ',
  httpMethod: 'Method ຮ້ອງຂໍ (HTTP)',
  requiredAction: 'ສິດທິທີ່ຕ້ອງການ',
  targetModule: 'ໂມດູນເປົ້າໝາຍ',
  requiredDivision: 'ພະແນກທີ່ໄດ້ຮັບອະນຸຍາດ',
  alertType: 'ປະເພດການແຈ້ງເຕືອນ',
  deletedAt: 'ວັນທີລົບ (Soft Delete)',
  action: 'ການດຳເນີນງານ (Action)',
};

export const MODULE_LABELS: Record<string, string> = {
  CONTRACTS: '1. ສັນຍາທົ່ວໄປ',
  POWER_CONTRACTS: '2. ສັນຍາຊື້-ຂາຍໄຟຟ້າ',
  LEGAL_DOCUMENTS: '3. ນິຕິກຳ ແລະ ລະບຽບການ',
  LEGAL_CASES: '3. ສຳນວນຄະດີ & ຂໍ້ຂັດແຍ່ງ',
  LEGAL_AND_DISPUTE: '3. ນິຕິກຳ ແລະ ແກ້ໄຂຂໍ້ຂັດແຍ່ງ',
};
