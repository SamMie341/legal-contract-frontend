'use client';

import React from 'react';
import {
  Clock,
  Eye,
  User,
  Network,
  FileText,
  Zap,
  Building,
  Shield,
  Layers,
} from 'lucide-react';
import { AuditLog } from '@core/entities';
import { formatDate } from '@/utils/formatters';
import { AuditActionBadge } from './audit-action-badge';

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  onViewDetail: (log: AuditLog) => void;
}

export function AuditLogTable({
  logs,
  isLoading,
  onViewDetail,
}: AuditLogTableProps) {
  if (isLoading) {
    return (
      <div className="p-6 bg-surface rounded-2xl border border-border-line space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-14 bg-slate-200/60 rounded-xl" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-16 bg-surface rounded-2xl border border-border-line text-center text-xs text-text-muted space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
          <Layers className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-text-primary">
          ບໍ່ພົບປະຫວັດການດຳເນີນງານ (No Audit Logs Found)
        </p>
        <p className="max-w-sm mx-auto text-text-secondary">
          ບໍ່ມີຂໍ້ມູນທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ ຫຼື ຕົວກັ່ນຕອງທີ່ເລືອກໄວ້.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border-line shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-slate-100/70 border-b border-border-line text-text-secondary uppercase tracking-wider text-[11px] font-bold">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">ເວລາ / ວັນທີ</th>
              <th className="py-3.5 px-4">ຜູ້ດຳເນີນງານ (Actor)</th>
              <th className="py-3.5 px-4">ການກະທຳ (Action)</th>
              <th className="py-3.5 px-4">ເປົ້າໝາຍ / ລາຍການ</th>
              <th className="py-3.5 px-4">IP Address</th>
              <th className="py-3.5 px-4 text-right">ລາຍລະອຽດ</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border-line">
            {logs.map((log) => {
              const resourceTitle =
                log.contract?.title ||
                log.powerContract?.projectName ||
                (log.newValues?.attemptedPath ? `Path: ${log.newValues.attemptedPath}` : null) ||
                (log.newValues?.targetUserId ? `User ID: ${log.newValues.targetUserId.slice(0, 8)}...` : null) ||
                (log.oldValues?.username ? `ບັນຊີ: @${log.oldValues.username}` : null) ||
                '-';

              const resourceNumber =
                log.contract?.contractNumber || log.powerContract?.contractNumber;

              return (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Column 1: Date & Time */}
                  <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary text-xs">
                          {formatDate(log.createdAt)}
                        </p>
                        <p className="text-[10px] text-text-muted font-mono">
                          {new Date(log.createdAt).toLocaleTimeString('lo-LA')}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Actor */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {log.user?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary truncate" title={log.user?.fullName}>
                          {log.user?.fullName || 'ລະບົບອັດຕະໂນມັດ'}
                        </p>
                        <p className="text-[10px] text-text-muted font-mono truncate">
                          {log.user?.employeeCode ? `ລະຫັດ: ${log.user.employeeCode}` : '-'}
                          {log.user?.department ? ` • ${log.user.department}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Action */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <AuditActionBadge action={log.action} size="sm" />
                  </td>

                  {/* Column 4: Target Resource */}
                  <td className="py-3.5 px-4 min-w-[180px]">
                    <div className="min-w-0">
                      <p
                        className="font-bold text-text-primary truncate max-w-xs"
                        title={resourceTitle}
                      >
                        {resourceTitle}
                      </p>
                      {resourceNumber && (
                        <p className="text-[10px] text-emerald-700 font-mono font-semibold">
                          ເລກທີ: {resourceNumber}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Column 5: IP Address */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-text-secondary bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      <Network className="w-3 h-3 text-slate-400" />
                      <span>{log.ipAddress || '127.0.0.1'}</span>
                    </span>
                  </td>

                  {/* Column 6: Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onViewDetail(log)}
                      className="px-2.5 py-1.5 rounded-lg border border-border-line bg-white hover:bg-slate-100 text-primary font-semibold text-[11px] inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                      title="ເບິ່ງລາຍລະອຽດການປ່ຽນແປງ"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>ເບິ່ງ</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
