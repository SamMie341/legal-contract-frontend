'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber } from '@/utils/formatters';

interface ContractTypeChartProps {
  data: {
    contractTypeId: number;
    nameLo: string;
    nameEn: string | null;
    count: number;
  }[];
}

export function ContractTypeChart({ data }: ContractTypeChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = data
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.nameLo,
      count: item.count,
    }));

  if (!mounted) {
    return (
      <div className="h-72 flex items-center justify-center text-xs text-text-muted">
        ກຳລັງໂຫຼດກຣາບປະເພດສັນຍາ...
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="p-5 bg-surface rounded-2xl border border-border-line shadow-xs">
        <h3 className="text-sm font-bold text-text-primary tracking-tight mb-2">
          ສະຖິຕິຕາມ 14 ປະເພດສັນຍາ (Contract Types)
        </h3>
        <div className="h-64 flex items-center justify-center text-xs text-text-muted">
          ຍັງບໍ່ມີຂໍ້ມູນສັນຍາໃນແຕ່ລະປະເພດ
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-surface rounded-2xl border border-border-line shadow-xs">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-text-primary tracking-tight">
          ສະຖິຕິຕາມ 14 ປະເພດສັນຍາ (Contract Types)
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          ຈຳນວນສັນຍາທີ່ກຳລັງດຳເນີນການແຍກຕາມໝວດໝູ່
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#475569' }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#475569' }}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value: any) => [`${formatNumber(value)} ສັນຍາ`, 'ຈຳນວນ']}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Bar
              dataKey="count"
              fill="#162456"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
