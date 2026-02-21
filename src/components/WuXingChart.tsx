'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import type { WuXingStats, WuXing } from '@/lib/bazi/types';
import { WUXING_COLOR } from '@/data/constants';

interface WuXingChartProps {
  stats: WuXingStats;
  dayElement: WuXing;
}

export default function WuXingChart({ stats, dayElement }: WuXingChartProps) {
  const data = (['木', '火', '土', '金', '水'] as WuXing[]).map((element) => ({
    name: element,
    value: stats[element],
    color: WUXING_COLOR[element],
    isDay: element === dayElement,
  }));

  const total = Object.values(stats).reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
      <h3 className="text-lg font-bold text-stone-800 mb-4 border-l-4 border-amber-500 pl-3">
        五行分布
      </h3>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={40}
              tick={{ fontSize: 14, fontWeight: 'bold' }}
            />
            <Tooltip
              formatter={(value) => {
                const numValue = typeof value === 'number' ? value : 0;
                return [
                  `${numValue.toFixed(1)} (${((numValue / total) * 100).toFixed(0)}%)`,
                  '力量',
                ];
              }}
            />
            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={entry.isDay ? '#000' : 'transparent'}
                  strokeWidth={entry.isDay ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 詳細數據 */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {data.map((item) => (
          <div
            key={item.name}
            className={`text-center p-2 rounded ${
              item.isDay ? 'bg-red-50 ring-2 ring-red-200' : 'bg-stone-50'
            }`}
          >
            <div className="text-lg font-bold" style={{ color: item.color }}>
              {item.name}
            </div>
            <div className="text-xs text-stone-500">
              {((item.value / total) * 100).toFixed(0)}%
            </div>
            {item.isDay && (
              <div className="text-[10px] text-red-500 font-bold">日主</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
