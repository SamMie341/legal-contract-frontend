'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { DisputeStatus } from '@core/entities';
import { formatNumber } from '@/utils/formatters';

interface CaseStatusChartProps {
  data: {
    disputeStatus: DisputeStatus;
    count: number;
  }[];
}

const STATUS_CONFIG: Record<
  DisputeStatus,
  { label: string; color: string }
> = {
  [DisputeStatus.FIRST_INSTANCE]: { label: 'ສານຂັ້ນຕົ້ນ (First Instance)', color: '#3b82f6' },
  [DisputeStatus.APPEAL]: { label: 'ສານອຸທອນ (Appeal)', color: '#f59e0b' },
  [DisputeStatus.SUPREME]: { label: 'ສານຂັ້ນລົບລ້າງ (Supreme)', color: '#a855f7' },
  [DisputeStatus.RESOLVED]: { label: 'ແກ້ໄຂສຳເລັດ (Resolved)', color: '#10b981' },
  [DisputeStatus.CLOSED]: { label: 'ປິດສຳນວນ (Closed)', color: '#64748b' },
};

export function CaseStatusChart({ data }: CaseStatusChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = data
    .filter((item) => item.count > 0)
    .map((item) => {
      const config = STATUS_CONFIG[item.disputeStatus] || {
        label: item.disputeStatus,
        color: '#94a3b8',
      };
      return {
        name: config.label,
        status: item.disputeStatus,
        value: item.count,
        color: config.color,
      };
    });

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (!mounted) {
    return (
      <div className="p-5 bg-surface rounded-2xl border border-border-line shadow-xs h-80 flex items-center justify-center text-xs text-text-muted">
        ກຳລັງໂຫຼດກຣາບສະຖານະຄະດີ...
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="p-5 bg-surface rounded-2xl border border-border-line shadow-xs h-80 flex flex-col items-center justify-center text-center">
        <p className="text-xs font-semibold text-text-primary">
          ຍັງບໍ່ມີຂໍ້ມູນສະຖານະຄະດີ
        </p>
        <p className="text-[11px] text-text-muted mt-1">
          ເມື່ອມີການບັນທຶກສຳນວນຄະດີ ລະບົບຈະສະແດງຂັ້ນຕອນສານທີ່ນີ້
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-surface rounded-2xl border border-border-line shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-text-primary">
          ຂັ້ນຕອນການດຳເນີນຄະດີ (Dispute Status)
        </h3>
        <p className="text-[11px] text-text-secondary mt-0.5">
          ສັດສ່ວນຄະດີຕາມຂັ້ນຕອນສານ ແລະ ສະຖານະການແກ້ໄຂ
        </p>
      </div>

      <div className="h-64 my-2 relative flex items-center justify-center">
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
              formatter={(value: any) => [`${formatNumber(Number(value))} ເລື່ອງ`, 'ຈຳນວນ']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '11px',
                fontWeight: 600,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black font-mono text-text-primary">
            {formatNumber(total)}
          </span>
          <span className="text-[10px] text-text-muted font-medium">ຄະດີທັງໝົດ</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border-line">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] text-text-secondary truncate">
                {item.name.split(' (')[0]}
              </span>
            </div>
            <span className="font-mono font-bold text-text-primary text-[11px] shrink-0 ml-1">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
