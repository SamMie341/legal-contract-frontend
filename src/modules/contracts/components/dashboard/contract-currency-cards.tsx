import React from 'react';
import { Coins } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Currency } from '@core/entities';
import { ContractDashboardData } from '../../types/contract.types';

interface ContractCurrencyCardsProps {
  data: ContractDashboardData;
}

export function ContractCurrencyCards({ data }: ContractCurrencyCardsProps) {
  const { valueByCurrency, currencyChart } = data;

  const currencies = [
    {
      currency: Currency.LAK,
      name: 'ສະກຸນເງິນກີບ (LAK)',
      symbol: '₭',
      borderAccent: 'border-l-4 border-l-sky-500',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      currency: Currency.USD,
      name: 'ສະກຸນເງິນໂດລາ (USD)',
      symbol: '$',
      borderAccent: 'border-l-4 border-l-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      currency: Currency.CNY,
      name: 'ສະກຸນເງິນຢວນ (CNY)',
      symbol: '¥',
      borderAccent: 'border-l-4 border-l-rose-500',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Coins className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-text-primary tracking-tight">
          ມູນຄ່າສັນຍາລວມຕາມ 3 ສະກຸນເງິນ (Contract Value by Currency)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currencies.map((c) => {
          const valObj = valueByCurrency.find((v) => v.currency === c.currency);
          const countObj = currencyChart.find((chart) => chart.currency === c.currency);

          const totalValue = valObj?.totalValue || 0;
          const contractCount = countObj?.count || 0;

          return (
            <div
              key={c.currency}
              className={`p-5 bg-surface rounded-2xl border border-border-line ${c.borderAccent} shadow-xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">
                  {c.name}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${c.badgeBg}`}>
                  {c.symbol}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                  {formatCurrency(totalValue, c.currency)}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  ຈຳນວນ: <span className="font-semibold text-text-primary">{formatNumber(contractCount)}</span> ສັນຍາ
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
