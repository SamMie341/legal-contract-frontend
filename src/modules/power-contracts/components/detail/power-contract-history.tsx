'use client';

import React from 'react';
import {
  History,
  User,
  Clock,
  ArrowRight,
  Sparkles,
  Edit3,
  Paperclip,
  Download,
  Trash2,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import { PowerContractAuditLog } from '../../types/power-contract.types';
import { formatDate } from '@/utils/formatters';

interface PowerContractHistoryProps {
  auditLogs?: PowerContractAuditLog[];
}

const FIELD_LABELS_LO: Record<string, string> = {
  contractType: 'ປະເພດສັນຍາ (ຊື້/ຂາຍ)',
  projectName: 'ຊື່ໂຄງການ',
  projectTypeOrCustomer: 'ປະເພດໂຄງການ / ລູກຄ້າ',
  contractNumber: 'ເລກທີສັນຍາ',
  durationText: 'ອາຍຸສັນຍາ',
  durationMonths: 'ຈຳນວນເດືອນອາຍຸສັນຍາ',
  signedDate: 'ມື້ລົງລາຍເຊັນ',
  effectiveDate: 'ມື້ມີຜົນບັງຄັບໃຊ້',
  expirationDate: 'ມື້ສິ້ນສຸດສັນຍາ',
  installedCapacity: 'ກຳລັງການຕິດຕັ້ງ',
  capacityValue: 'ຄ່າກຳລັງການຕິດຕັ້ງ (MW)',
  capacityUnit: 'ຫົວໜ່ວຍກຳລັງການຕິດຕັ້ງ',
  projectLocation: 'ທີ່ຕັ້ງໂຄງການ',
  tariff: 'ລາຄາໄຟຟ້າ',
  tariffValue: 'ຄ່າລາຄາໄຟຟ້າ',
  tariffCurrency: 'ສະກຸນເງິນລາຄາໄຟ',
  additionalDetails: 'ລາຍລະອຽດເພີ່ມເຕີມ',
  status: 'ສະຖານະສັນຍາ',
  notifyDaysBefore: 'ແຈ້ງເຕືອນລ່ວງໜ້າ (ວັນ)',
  isExpiryNotified: 'ສະຖານະການແຈ້ງເຕືອນ',
  fileName: 'ຊື່ໄຟລ໌ແນບ',
  fileSize: 'ຂະໜາດໄຟລ໌',
};

const ACTION_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    badgeClass: string;
    dotClass: string;
  }
> = {
  CREATE_POWER_CONTRACT: {
    label: 'ສ້າງສັນຍາຊື້-ຂາຍໄຟໃໝ່',
    icon: Sparkles,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500 ring-emerald-100',
  },
  UPDATE_POWER_CONTRACT: {
    label: 'ດັດແກ້ສັນຍາຊື້-ຂາຍໄຟ',
    icon: Edit3,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500 ring-blue-100',
  },
  UPLOAD_POWER_ATTACHMENT: {
    label: 'ອັບໂຫຼດເອກະສານຕິດຄັດ',
    icon: Paperclip,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500 ring-amber-100',
  },
  DOWNLOAD_POWER_ATTACHMENT: {
    label: 'ດາວໂຫຼດເອກະສານຕິດຄັດ',
    icon: Download,
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500 ring-purple-100',
  },
  DELETE_POWER_ATTACHMENT: {
    label: 'ລົບເອກະສານຕິດຄັດ',
    icon: Trash2,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500 ring-rose-100',
  },
  DELETE_POWER_CONTRACT: {
    label: 'ລົບສັນຍາຊື້-ຂາຍໄຟ',
    icon: AlertTriangle,
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    dotClass: 'bg-red-500 ring-red-100',
  },
};

interface ParsedChange {
  field: string;
  fieldLabel: string;
  oldValue: any;
  newValue: any;
}

function parseChanges(log: PowerContractAuditLog): ParsedChange[] {
  const result: ParsedChange[] = [];

  if (Array.isArray(log.changes)) {
    for (const item of log.changes) {
      if (!item || typeof item !== 'object') continue;
      const field = item.field || '';
      const fieldLabel =
        item.fieldNameLo ||
        item.fieldLabelLo ||
        FIELD_LABELS_LO[field] ||
        field;
      result.push({
        field,
        fieldLabel,
        oldValue: item.oldValue,
        newValue: item.newValue,
      });
    }
  } else if (log.changes && typeof log.changes === 'object') {
    for (const [key, val] of Object.entries(log.changes)) {
      if (!val || typeof val !== 'object') continue;
      const fieldLabel = FIELD_LABELS_LO[key] || key;
      const oldVal = (val as any).oldValue ?? (val as any).old ?? null;
      const newVal = (val as any).newValue ?? (val as any).new ?? null;
      result.push({
        field: key,
        fieldLabel,
        oldValue: oldVal,
        newValue: newVal,
      });
    }
  }

  // Fallback: If CREATE_POWER_CONTRACT and changes is empty but newValues exist
  if (
    result.length === 0 &&
    log.action === 'CREATE_POWER_CONTRACT' &&
    log.newValues
  ) {
    const fields = [
      'projectName',
      'contractType',
      'projectTypeOrCustomer',
      'contractNumber',
      'installedCapacity',
      'tariff',
      'durationText',
      'effectiveDate',
      'expirationDate',
    ];
    for (const f of fields) {
      const val = log.newValues[f];
      if (val !== undefined && val !== null && val !== '') {
        result.push({
          field: f,
          fieldLabel: FIELD_LABELS_LO[f] || f,
          oldValue: null,
          newValue: val,
        });
      }
    }
  }

  // Fallback: If UPLOAD_POWER_ATTACHMENT and changes is empty but newValues exist
  if (
    result.length === 0 &&
    log.action === 'UPLOAD_POWER_ATTACHMENT' &&
    log.newValues
  ) {
    if (log.newValues.fileName) {
      result.push({
        field: 'fileName',
        fieldLabel: 'ຊື່ໄຟລ໌ແນບ',
        oldValue: null,
        newValue: log.newValues.fileName,
      });
    }
    if (log.newValues.fileSize) {
      result.push({
        field: 'fileSize',
        fieldLabel: 'ຂະໜາດໄຟລ໌',
        oldValue: null,
        newValue: `${(Number(log.newValues.fileSize) / 1024).toFixed(1)} KB`,
      });
    }
  }

  return result;
}

function formatValue(val: any): string {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'boolean') return val ? 'ແມ່ນ' : 'ບໍ່ແມ່ນ';
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val);
}

export function PowerContractHistory({
  auditLogs = [],
}: PowerContractHistoryProps) {
  if (auditLogs.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-border-line p-10 text-center text-xs text-text-muted shadow-xs">
        <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold text-text-primary">
          ຍັງບໍ່ມີປະຫວັດການປ່ຽນແປງ
        </p>
        <p className="mt-0.5">ການດັດແກ້ສັນຍາຈະຖືກບັນທຶກໄວ້ໂດຍອັດຕະໂນມັດ</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
      <div className="p-5 border-b border-border-line flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              ປະຫວັດການດຳເນີນງານ & ການດັດແກ້ (Audit Trail)
            </h3>
            <p className="text-[11px] text-text-secondary">
              ບັນທຶກການສ້າງ, ແກ້ໄຂ, ແລະ ການປ່ຽນແປງຂໍ້ມູນສັນຍາຊື້-ຂາຍໄຟຟ້າທັງໝົດ ({auditLogs.length} ລາຍການ)
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {auditLogs.map((log) => {
            const config = ACTION_CONFIG[log.action] || {
              label: log.actionLabelLo || log.action,
              icon: History,
              badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
              dotClass: 'bg-slate-400 ring-slate-100',
            };
            const ActionIcon = config.icon;

            const formattedTime = log.createdAt
              ? new Date(log.createdAt).toLocaleTimeString('lo-LA', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : '';

            const userInfo = log.user || log.performedBy;
            const changes = parseChanges(log);

            return (
              <div key={log.id} className="relative group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full ${config.dotClass} ring-4 transition-all group-hover:scale-125`}
                />

                <div className="p-4 rounded-xl bg-white border border-border-line shadow-2xs hover:shadow-xs transition-shadow space-y-3">
                  {/* Row 1: Action Header & Timestamp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${config.badgeClass}`}
                      >
                        <ActionIcon className="w-3.5 h-3.5" />
                        <span>{config.label}</span>
                      </span>
                      {log.action !== config.label && (
                        <span className="font-mono text-[10px] text-text-muted hidden md:inline">
                          ({log.action})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDate(log.createdAt)} {formattedTime}
                      </span>
                      {log.ipAddress && (
                        <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px]">
                          <Globe className="w-2.5 h-2.5" />
                          {log.ipAddress}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Performed By User */}
                  {userInfo ? (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary pt-0.5">
                      <div className="flex items-center gap-1.5 font-medium text-text-primary">
                        <User className="w-3.5 h-3.5 text-text-muted" />
                        <span>
                          {userInfo.fullName || 'ຜູ້ໃຊ້ງານລະບົບ'}
                        </span>
                        {userInfo.employeeCode && (
                          <span className="text-[11px] font-mono text-text-muted">
                            ({userInfo.employeeCode})
                          </span>
                        )}
                      </div>
                      {log.user?.department && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {log.user.department}
                        </span>
                      )}
                      {log.user?.role && (
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {log.user.role}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <User className="w-3.5 h-3.5 text-slate-300" />
                      <span>ຜູ້ໃຊ້ງານລະບົບ</span>
                    </div>
                  )}

                  {/* Row 3: Changes List */}
                  {changes.length > 0 ? (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <p className="text-[11px] font-semibold text-text-muted">
                        {log.action === 'CREATE_POWER_CONTRACT'
                          ? 'ລາຍລະອຽດຂໍ້ມູນຕັ້ງຕົ້ນ:'
                          : 'ລາຍການປ່ຽນແປງ:'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {changes.map((c, i) => {
                          const hasOld = c.oldValue !== null && c.oldValue !== undefined;
                          const hasNew = c.newValue !== null && c.newValue !== undefined;

                          return (
                            <div
                              key={i}
                              className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-slate-50/80 border border-slate-100 text-[11px]"
                            >
                              <span className="font-bold text-text-primary">
                                {c.fieldLabel}:
                              </span>

                              {hasOld && hasNew ? (
                                <>
                                  <span className="line-through text-red-500 font-mono">
                                    {formatValue(c.oldValue)}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-text-muted inline" />
                                  <span className="text-emerald-600 font-bold font-mono">
                                    {formatValue(c.newValue)}
                                  </span>
                                </>
                              ) : hasNew ? (
                                <span className="text-emerald-700 font-semibold font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                  {formatValue(c.newValue)}
                                </span>
                              ) : hasOld ? (
                                <span className="text-red-600 line-through font-mono bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                  {formatValue(c.oldValue)}
                                </span>
                              ) : (
                                <span className="text-text-muted">-</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-text-muted italic">
                      {log.action === 'CREATE_POWER_CONTRACT'
                        ? 'ສ້າງສັນຍາຊື້-ຂາຍໄຟຟ້າເຂົ້າສູ່ລະບົບຮຽບຮ້ອຍແລ້ວ'
                        : log.action === 'UPDATE_POWER_CONTRACT'
                        ? 'ບັນທຶກຂໍ້ມູນສັນຍາ (ບໍ່ມີການປ່ຽນແປງຄ່າຂໍ້ມູນ)'
                        : log.action === 'UPLOAD_POWER_ATTACHMENT'
                        ? 'ອັບໂຫຼດໄຟລ໌ແນບເຂົ້າສູ່ສັນຍາຮຽບຮ້ອຍແລ້ວ'
                        : 'ດຳເນີນການສຳເລັດ'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
