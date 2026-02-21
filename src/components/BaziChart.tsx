'use client';

import type { BaZiChart as BaZiChartType, Pillar } from '@/lib/bazi/types';
import { WUXING_COLOR } from '@/data/constants';

interface BaziChartProps {
  chart: BaZiChartType;
}

function PillarCard({ pillar, label, isDay }: { pillar: Pillar; label: string; isDay?: boolean }) {
  const ganColor = WUXING_COLOR[pillar.ganElement];
  const zhiColor = WUXING_COLOR[pillar.zhiElement];

  return (
    <div
      className={`flex flex-col items-center p-2 sm:p-3 rounded-lg min-w-0 ${
        isDay ? 'bg-red-50 border-2 border-red-200' : 'bg-stone-50 border border-stone-200'
      }`}
    >
      {/* 標籤 */}
      <div className={`text-xs font-bold mb-1 sm:mb-2 ${isDay ? 'text-red-600' : 'text-stone-500'}`}>
        {label}
      </div>

      {/* 天干 */}
      <div
        className="text-2xl sm:text-3xl font-serif font-bold mb-0.5 sm:mb-1"
        style={{ color: ganColor }}
      >
        {pillar.gan}
      </div>
      <div className="text-[10px] sm:text-xs text-stone-400 mb-1 sm:mb-2 truncate max-w-full">
        {pillar.ganShiShen || (isDay ? '日主' : '')}
      </div>

      {/* 地支 */}
      <div
        className="text-2xl sm:text-3xl font-serif font-bold mb-0.5 sm:mb-1"
        style={{ color: zhiColor }}
      >
        {pillar.zhi}
      </div>

      {/* 藏干 */}
      <div className="flex gap-0.5 sm:gap-1 mt-1 flex-wrap justify-center">
        {pillar.hiddenStems.map((stem, i) => (
          <span
            key={i}
            className="text-[10px] sm:text-xs px-0.5 sm:px-1 py-0.5 bg-white rounded border border-stone-200"
            title={stem.shiShen ? `${stem.shiShen} (${Math.round(stem.weight * 100)}%)` : undefined}
          >
            {stem.gan}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function BaziChart({ chart }: BaziChartProps) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-stone-200">
      <h3 className="text-base sm:text-lg font-bold text-stone-800 mb-3 sm:mb-4 border-l-4 border-red-600 pl-3">
        本命八字盤
      </h3>

      <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
        <PillarCard pillar={chart.hour} label="時柱" />
        <PillarCard pillar={chart.day} label="日柱" isDay />
        <PillarCard pillar={chart.month} label="月柱" />
        <PillarCard pillar={chart.year} label="年柱" />
      </div>

      {/* 圖例 */}
      <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-stone-100">
        {(['木', '火', '土', '金', '水'] as const).map((element) => (
          <div key={element} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: WUXING_COLOR[element] }}
            />
            <span className="text-xs text-stone-500">{element}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
