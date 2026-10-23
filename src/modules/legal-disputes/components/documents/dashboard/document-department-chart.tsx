'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Building2 } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';

interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  count: number;
}

interface DocumentDepartmentChartProps {
  data: DepartmentItem[];
}

export function DocumentDepartmentChart({ data }: DocumentDepartmentChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter departments that have documents, or take top 8 departments
  const sortedDepts = [...data].sort((a, b) => b.count - a.count);
  const activeDepts = sortedDepts.filter((d) => d.count > 0);
  const displayData = (activeDepts.length > 0 ? activeDepts : sortedDepts).slice(0, 8);

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  if (!mounted) {
    return (
      <div className="p-5 bg-surface rounded-2xl border border-border-line shadow-xs h-80 flex items-center justify-center text-xs text-text-muted">
        ກຳລັງໂຫຼດກຣາບຫ້ອງການ/ຝ່າຍ...
      </div>
    );
  }

  return (
    <div className="p-5 bg-surface rounded-2xl border border-border-line shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            ນິຕິກຳຕາມຫ້ອງການ / ຝ່າຍ (By Department)
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5">
            ການແບ່ງປັນຄວາມຮັບຜິດຊອບຂອງແຕ່ລະພາກສ່ວນ
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-text-secondary text-xs">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold">{data.length} ຝ່າຍ</span>
        </div>
      </div>

      {total === 0 ? (
        <div className="h-64 my-2 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-semibold text-text-primary">
            ຍັງບໍ່ມີນິຕິກຳທີ່ຜູກກັບຫ້ອງການ/ຝ່າຍ
          </p>
          <p className="text-[11px] text-text-muted mt-1">
            ເມື່ອມີການກຳນົດຫ້ອງການຮັບຜິດຊອບ ຂໍ້ມູນຈະປາກົດທີ່ນີ້
          </p>
        </div>
      ) : (
        <div className="h-64 my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={{ fontSize: 11, fill: '#334155' }}
                tickFormatter={(val: string) => {
                  if (val.length > 18) return `${val.substring(0, 16)}...`;
                  return val;
                }}
              />
              <Tooltip
                formatter={(val: any) => [`${formatNumber(Number(val))} ສະບັບ`, 'ຈຳນວນ']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  fontWeight: 600,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={22}>
                {displayData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#1d2f6f' : '#3b82f6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-3 border-t border-border-line flex items-center justify-between text-[11px] text-text-muted">
        <span>ສະແດງສະເພາະ 8 ຝ່າຍທີ່ມີເອກະສານສູງສຸດ</span>
        <span className="font-semibold text-primary">ລວມ: {formatNumber(total)} ສະບັບ</span>
      </div>
    </div>
  );
}
