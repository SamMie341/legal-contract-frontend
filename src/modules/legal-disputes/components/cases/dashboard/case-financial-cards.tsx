'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  AlertOctagon,
  Percent,
  Receipt,
  PiggyBank,
} from 'lucide-react';
import { Currency } from '@core/entities';
import { formatCurrency } from '@/utils/formatters';
import { CaseDashboardData } from '../../../types/case.types';

interface CaseFinancialCardsProps {
  data: CaseDashboardData;
}

export function CaseFinancialCards({ data }: CaseFinancialCardsProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'LAK' | 'USD'>('LAK');
  const { financialSummary } = data;

  const isLak = selectedCurrency === 'LAK';

  const damage = isLak
    ? financialSummary.totalDamageLak
    : financialSummary.totalDamageUsd;
  const fine = isLak
    ? financialSummary.totalFineLak
    : financialSummary.totalFineUsd;
  const due = isLak
    ? financialSummary.totalDueLak
    : financialSummary.totalDueUsd;
  const recovered = isLak
    ? financialSummary.totalRecoveredLak
    : financialSummary.totalRecoveredUsd;

  const recoveryRate = due > 0 ? Math.min(Math.round((recovered / due) * 100), 100) : 0;

  const currencyEnum = isLak ? Currency.LAK : Currency.USD;

  return (
    <div className="p-6 bg-surface rounded-2xl border border-border-line shadow-xs space-y-5">
      {/* Header & Currency Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-line">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              ມູນຄ່າການເງິນຂອງຄະດີ & ຂໍ້ຂັດແຍ່ງ (Dispute Financial Overview)
            </h3>
            <p className="text-[11px] text-text-secondary mt-0.5">
              ລວມມູນຄ່າຄວາມເສຍຫາຍ, ຄ່າປັບໃໝ, ຍອດຕ້ອງຮຽກເກັບ ແລະ ຍອດກູ້ຄືນໄດ້
            </p>
          </div>
        </div>

        {/* Currency Switch Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-border-line self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedCurrency('LAK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCurrency === 'LAK'
                ? 'bg-white text-primary shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            ກີບ (LAK)
          </button>
          <button
            type="button"
            onClick={() => setSelectedCurrency('USD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCurrency === 'USD'
                ? 'bg-white text-primary shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            ໂດລາ (USD)
          </button>
        </div>
      </div>

      {/* 4 Financial Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Damage */}
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800">
              ມູນຄ່າຄວາມເສຍຫາຍ
            </span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3">
            <p className="text-xl font-black font-mono text-rose-900 tracking-tight">
              {formatCurrency(damage, currencyEnum)}
            </p>
            <p className="text-[10px] text-rose-700/80 mt-0.5">
              Total Claimed Damage
            </p>
          </div>
        </div>

        {/* Total Fine */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">
              ຄ່າປັບໃໝທັງໝົດ
            </span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <p className="text-xl font-black font-mono text-amber-900 tracking-tight">
              {formatCurrency(fine, currencyEnum)}
            </p>
            <p className="text-[10px] text-amber-700/80 mt-0.5">
              Total Penalties / Fines
            </p>
          </div>
        </div>

        {/* Total Due */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800">
              ຍອດຕ້ອງຮຽກເກັບ
            </span>
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <p className="text-xl font-black font-mono text-blue-900 tracking-tight">
              {formatCurrency(due, currencyEnum)}
            </p>
            <p className="text-[10px] text-blue-700/80 mt-0.5">
              Total Due (Damage + Fine)
            </p>
          </div>
        </div>

        {/* Total Recovered & Rate */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">
              ຍອດກູ້ຄືນໄດ້ (ອັດຕາ {recoveryRate}%)
            </span>
            <PiggyBank className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <p className="text-xl font-black font-mono text-emerald-900 tracking-tight">
              {formatCurrency(recovered, currencyEnum)}
            </p>
            <div className="w-full bg-emerald-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${recoveryRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
