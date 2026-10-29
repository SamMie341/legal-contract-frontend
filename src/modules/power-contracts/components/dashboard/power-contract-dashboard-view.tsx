'use client';

import React from 'react';
import Link from 'next/link';
import { PowerContractDashboardData, PowerContractType } from '@core/entities';
import {
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  ClockAlert,
  Calendar,
  AlertCircle,
  TrendingUp,
  FileText,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { CONTRACT_STATUS_MAP } from '@/utils/status-badge';
import { PowerContractTypeBadge } from '../power-contract-type-badge';

interface PowerContractDashboardViewProps {
  data: PowerContractDashboardData;
}

export function PowerContractDashboardView({
  data,
}: PowerContractDashboardViewProps) {
  const {
    total,
    expiringSoonCount,
    expiredCount,
    byStatus,
    byContractType,
    byProjectType,
    totalInstalledCapacity,
    expiringSoonList,
  } = data;

  const purchaseCount = byContractType?.purchaseCount || 0;
  const saleCount = byContractType?.saleCount || 0;
  const purchaseCapacity = byContractType?.totalCapacityPurchase || 0;
  const saleCapacity = byContractType?.totalCapacitySale || 0;

  return (
    <div className="space-y-6">
      {/* 5 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contracts */}
        <div className="p-5 rounded-2xl bg-surface border border-border-line shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              ສັນຍາທັງໝົດ
            </p>
            <p className="text-2xl font-black text-text-primary mt-1">{total}</p>
            <p className="text-[11px] text-text-muted mt-0.5">
              PPA {purchaseCount} • PSA {saleCount}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 text-primary border border-blue-100">
            <Zap className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Total Installed Capacity */}
        <div className="p-5 rounded-2xl bg-surface border border-border-line shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              ກຳລັງຕິດຕັ້ງລວມ
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-amber-600">
                {totalInstalledCapacity.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-text-secondary">MW</span>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">
              ກວມທັງສັນຍາຊື້ ແລະ ຂາຍ
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
            <Activity className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        {/* Purchase (PPA) */}
        <div className="p-5 rounded-2xl bg-surface border border-border-line shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>ສັນຍາຊື້ໄຟ (PPA)</span>
            </p>
            <p className="text-2xl font-black text-text-primary mt-1">
              {purchaseCount}
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              ກຳລັງຜະລິດ {purchaseCapacity.toLocaleString()} MW
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Expiring Soon Alert Card */}
        <div
          className={`p-5 rounded-2xl border shadow-xs flex items-center justify-between transition-all ${
            expiringSoonCount > 0
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-surface border-border-line text-text-primary'
          }`}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <ClockAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>ໃກ້ໝົດອາຍຸ (≤ 60 ວັນ)</span>
            </p>
            <p className="text-2xl font-black text-amber-700 mt-1">
              {expiringSoonCount}
            </p>
            <p className="text-[11px] text-amber-700/80 mt-0.5">
              ໝົດອາຍຸແລ້ວ {expiredCount} ສັນຍາ
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300/50">
            <ClockAlert className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      {/* 2 Detail Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: By Project Type */}
        <div className="p-6 rounded-2xl bg-surface border border-border-line shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">
                ກຳລັງຕິດຕັ້ງແຍກຕາມປະເພດໂຄງການ
              </h3>
            </div>
            <span className="text-xs text-text-muted font-medium">
              {byProjectType?.length || 0} ປະເພດ
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {byProjectType && byProjectType.length > 0 ? (
              byProjectType.map((item, idx) => {
                const percent =
                  totalInstalledCapacity > 0
                    ? Math.round((item.totalCapacity / totalInstalledCapacity) * 100)
                    : 0;

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-primary">
                        {item.name || 'ບໍ່ລະບຸ'}
                      </span>
                      <span className="font-mono text-text-secondary">
                        {item.totalCapacity.toLocaleString()} MW ({item.count}{' '}
                        ສັນຍາ)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-text-muted text-center py-6">
                ບໍ່ມີຂໍ້ມູນປະເພດໂຄງການ
              </p>
            )}
          </div>
        </div>

        {/* Card 2: Status Breakdown */}
        <div className="p-6 rounded-2xl bg-surface border border-border-line shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-text-primary">
                ສະຖານະສັນຍາຊື້-ຂາຍໄຟຟ້າ
              </h3>
            </div>
            <span className="text-xs text-text-muted font-medium">
              ທັງໝົດ {total}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {byStatus && byStatus.length > 0 ? (
              byStatus.map((item, idx) => {
                const conf = CONTRACT_STATUS_MAP[item.status] || {
                  label: item.status,
                  className: 'bg-slate-100 text-slate-700',
                  dotColor: 'bg-slate-400',
                };

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-border-line/70 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${conf.dotColor}`}
                      />
                      <span className="text-xs font-semibold text-text-primary">
                        {conf.label}
                      </span>
                    </div>
                    <span className="text-base font-bold text-text-primary">
                      {item._count.id}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-text-muted text-center py-6 col-span-2">
                ບໍ່ມີຂໍ້ມູນສະຖານະ
              </p>
            )}
          </div>

          {/* Quick link to table */}
          <div className="pt-2 border-t border-border-line/60">
            <Link
              href="/power-contracts"
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center justify-between"
            >
              <span>ເບິ່ງລາຍການສັນຍາທັງໝົດ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Expiring soon list */}
      {expiringSoonList && expiringSoonList.length > 0 && (
        <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <ClockAlert className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold">
                ສັນຍາໃກ້ໝົດອາຍຸ (Expiring Soon - ພາຍໃນ 60 ວັນ)
              </h3>
            </div>
            <Link
              href="/power-contracts?status=EXPIRING_SOON"
              className="text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              ເບິ່ງທັງໝົດ ({expiringSoonCount})
            </Link>
          </div>

          <div className="divide-y divide-amber-200/60 bg-white rounded-xl border border-amber-200 overflow-hidden">
            {expiringSoonList.map((c) => (
              <div
                key={c.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-amber-50/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <PowerContractTypeBadge type={c.contractType} />
                  <div>
                    <Link
                      href={`/power-contracts/${c.id}`}
                      className="text-xs font-bold text-text-primary hover:text-primary block"
                    >
                      {c.projectName}
                    </Link>
                    <p className="text-[11px] text-text-muted">
                      {c.contractNumber || 'ບໍ່ມີເລກທີ'} •{' '}
                      {c.projectTypeOrCustomer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  {c.installedCapacity && (
                    <span className="font-semibold text-amber-700">
                      {c.installedCapacity}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-text-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>ໝົດອາຍຸ: {formatDate(c.expirationDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
