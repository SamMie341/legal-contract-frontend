'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ContractStatus } from '@core/entities';
import { CONTRACT_STATUS_MAP } from '@/utils/status-badge';
import { formatNumber } from '@/utils/formatters';

interface ContractStatusChartProps {
  data: {
    status: ContractStatus;
    count: number;
  }[];
}

const STATUS_COLORS: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: '#64748b',
  [ContractStatus.ACTIVE]: '#10b981',
  [ContractStatus.EXPIRING_SOON]: '#f59e0b',
  [ContractStatus.EXPIRED]: '#ef4444',
  [ContractStatus.TERMINATED]: '#475569',
};

export function ContractStatusChart({ data }: ContractStatusChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = data.map((item) => {
    const config = CONTRACT_STATUS_MAP[item.status];
    return {
      name: config?.label || item.status,
      status: item.status,
      value: item.count,
      color: STATUS_COLORS[item.status] || '#94a3b8',
    };
  });

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (!mounted) {
    return (
      <div className="h-72 flex items-center justify-center text-xs text-text-muted">
        ກຳລັງໂຫຼດກຣາບສະຖານະ...
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-xs text-text-muted">
        ຍັງບໍ່ມີຂໍ້ມູນສະຖານະສັນຍາ
      </div>
    );
  }

  return (
    <div className="p-5 bg-surface rounded-2xl border border-border-line shadow-xs">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-text-primary tracking-tight">
          ສັດສ່ວນຕາມສະຖານະສັນຍາ (Contract Status)
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          ຈຳນວນສັນຍາທັງໝົດ {formatNumber(total)} ສະບັບ
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [
                `${formatNumber(value)} ສັນຍາ (${((Number(value) / total) * 100).toFixed(1)}%)`,
                name,
              ]}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
