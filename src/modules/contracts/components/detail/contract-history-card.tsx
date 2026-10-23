'use client';

import React from 'react';
import { History, User, Clock, ArrowRight } from 'lucide-react';
import { ContractAuditLog } from '../../types/contract.types';
import { formatDate } from '@/utils/formatters';

interface ContractHistoryCardProps {
  auditLogs?: ContractAuditLog[];
}

export function ContractHistoryCard({ auditLogs = [] }: ContractHistoryCardProps) {
  if (auditLogs.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-border-line p-8 text-center text-xs text-text-muted shadow-xs">
        <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold text-text-primary">ຍັງບໍ່ມີປະຫວັດການປ່ຽນແປງ</p>
        <p className="mt-0.5">ການດັດແກ້ສັນຍາຈະຖືກບັນທຶກໄວ້ໂດຍອັດຕະໂນມັດ</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
      <div className="p-5 border-b border-border-line flex items-center gap-2">
        <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
          <History className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            ປະຫວັດການດຳເນີນງານ & ການດັດແກ້ (Audit Trail)
          </h3>
          <p className="text-[11px] text-text-secondary">
            ບັນທຶກການສ້າງ, ແກ້ໄຂ, ແລະ ການປ່ຽນແປງຂໍ້ມູນສັນຍາທັງໝົດ
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {auditLogs.map((log) => {
            const formattedTime = log.createdAt
              ? new Date(log.createdAt).toLocaleTimeString('lo-LA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <div key={log.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />

                <div className="p-4 rounded-xl bg-white border border-border-line shadow-2xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-text-primary">
                      {log.actionLabelLo || log.action}
                    </span>
                    <span className="text-[11px] text-text-muted flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {formatDate(log.createdAt)} {formattedTime}
                    </span>
                  </div>

                  {log.user && (
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <User className="w-3.5 h-3.5 text-text-muted" />
                      <span className="font-semibold text-text-primary">
                        {log.user.fullName}
                      </span>
                      <span className="text-[11px] text-text-muted font-mono">
                        ({log.user.employeeCode})
                      </span>
                      {log.user.department && (
                        <span className="text-[11px] text-text-muted">
                          • {log.user.department}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Changes List */}
                  {log.changes && log.changes.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <p className="text-[11px] font-semibold text-text-muted">
                        ລາຍການປ່ຽນແປງ:
                      </p>
                      <div className="space-y-1 text-xs">
                        {log.changes.map((c, i) => (
                          <div
                            key={i}
                            className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px]"
                          >
                            <span className="font-bold text-text-primary">
                              {c.fieldLabelLo || c.field}:
                            </span>
                            <span className="line-through text-red-500 font-mono">
                              {String(c.oldValue ?? '-')}
                            </span>
                            <ArrowRight className="w-3 h-3 text-text-muted" />
                            <span className="text-emerald-600 font-bold font-mono">
                              {String(c.newValue ?? '-')}
                            </span>
                          </div>
                        ))}
                      </div>
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
