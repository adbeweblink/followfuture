'use client';

import { motion } from 'framer-motion';
import type { BaZiAnalysis, Pillar, WuXing } from '@/lib/bazi/types';
import { WUXING_COLOR } from '@/data/constants';
import { WUXING_DESCRIPTIONS, TEN_GOD_DESCRIPTIONS } from '@/data/copywriting';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

interface BasicTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

// 五行色彩映射（加深版本用於深色背景）
const WUXING_GRADIENT: Record<WuXing, { from: string; to: string; bg: string }> = {
  '木': { from: '#10B981', to: '#059669', bg: 'bg-emerald-50' },
  '火': { from: '#EF4444', to: '#DC2626', bg: 'bg-red-50' },
  '土': { from: '#F59E0B', to: '#D97706', bg: 'bg-amber-50' },
  '金': { from: '#6B7280', to: '#4B5563', bg: 'bg-gray-50' },
  '水': { from: '#3B82F6', to: '#2563EB', bg: 'bg-blue-50' },
};

function BaziPillarCard({
  pillar,
  label,
  isDay,
  delay,
}: {
  pillar: Pillar;
  label: string;
  isDay?: boolean;
  delay: number;
}) {
  const ganGradient = WUXING_GRADIENT[pillar.ganElement];
  const zhiGradient = WUXING_GRADIENT[pillar.zhiElement];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`
        relative flex flex-col items-center p-4 sm:p-6 rounded-2xl
        ${isDay
          ? 'bg-gradient-to-br from-amber-50 to-orange-50 ring-2 ring-amber-400 shadow-lg shadow-amber-200/50'
          : 'bg-white shadow-md hover:shadow-lg transition-shadow'
        }
      `}
    >
      {/* 日主標記 */}
      {isDay && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
          日主
        </div>
      )}

      {/* 柱位標籤 */}
      <span className={`text-xs font-bold mb-3 ${isDay ? 'text-amber-600' : 'text-slate-400'}`}>
        {label}
      </span>

      {/* 天干 */}
      <div className="relative mb-2">
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-inner"
          style={{
            background: `linear-gradient(135deg, ${ganGradient.from}, ${ganGradient.to})`,
          }}
        >
          <span className="text-3xl sm:text-4xl font-serif font-bold text-white drop-shadow">
            {pillar.gan}
          </span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white text-[10px] font-bold rounded shadow"
          style={{ color: ganGradient.from }}
        >
          {pillar.ganElement}{pillar.ganYinYang}
        </div>
      </div>

      {/* 十神 */}
      <div className={`text-xs font-medium mb-3 ${isDay ? 'text-amber-700' : 'text-slate-500'}`}>
        {pillar.ganShiShen || (isDay ? '元神' : '—')}
      </div>

      {/* 地支 */}
      <div className="relative">
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-inner"
          style={{
            background: `linear-gradient(135deg, ${zhiGradient.from}, ${zhiGradient.to})`,
          }}
        >
          <span className="text-3xl sm:text-4xl font-serif font-bold text-white drop-shadow">
            {pillar.zhi}
          </span>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white text-[10px] font-bold rounded shadow"
          style={{ color: zhiGradient.from }}
        >
          {pillar.zhiElement}{pillar.zhiYinYang}
        </div>
      </div>

      {/* 藏干 */}
      <div className="flex gap-1 mt-4">
        {pillar.hiddenStems.map((stem, i) => (
          <div
            key={i}
            className="flex flex-col items-center px-2 py-1 bg-slate-50 rounded-lg"
            title={`${stem.shiShen || ''} (${Math.round(stem.weight * 100)}%)`}
          >
            <span className="text-sm font-bold" style={{ color: WUXING_COLOR[pillar.zhiElement] }}>
              {stem.gan}
            </span>
            <span className="text-[8px] text-slate-400">
              {i === 0 ? '本' : i === 1 ? '中' : '餘'}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function BasicTab({ analysis }: BasicTabProps) {
  const dayElement = analysis.chart.day.ganElement;
  const dayDesc = WUXING_DESCRIPTIONS[dayElement];

  // 五行分布數據
  const wuXingData = (['木', '火', '土', '金', '水'] as WuXing[]).map((element) => ({
    element,
    value: analysis.wuXingPercentage[element] || 0,
    fullMark: 50,
    fill: WUXING_COLOR[element],
  }));

  // 月柱分析
  const monthPillar = analysis.chart.month;
  const monthGanDesc = TEN_GOD_DESCRIPTIONS[monthPillar.ganShiShen || '比肩'];
  const monthZhiElement = monthPillar.zhiElement;

  return (
    <div className="space-y-8">
      {/* 八字盤 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">本命八字盤</h2>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-6">
          {/* 傳統八字排盤：年月日時從右到左排列 */}
          <BaziPillarCard pillar={analysis.chart.hour} label="時柱" delay={0.1} />
          <BaziPillarCard pillar={analysis.chart.day} label="日柱" isDay delay={0.2} />
          <BaziPillarCard pillar={analysis.chart.month} label="月柱" delay={0.3} />
          <BaziPillarCard pillar={analysis.chart.year} label="年柱" delay={0.4} />
        </div>

        {/* 五行圖例 */}
        <div className="flex justify-center gap-4 mt-6">
          {(['木', '火', '土', '金', '水'] as WuXing[]).map((element) => (
            <div key={element} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: WUXING_COLOR[element] }}
              />
              <span className="text-sm text-slate-600">{element}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 日主詳解 & 五行分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 日主詳解 */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl ${WUXING_GRADIENT[dayElement].bg} border border-slate-100`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${WUXING_GRADIENT[dayElement].from}, ${WUXING_GRADIENT[dayElement].to})`,
              }}
            >
              <span className="text-white">{dayDesc.symbol}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                元神屬「{dayElement}」
              </h3>
              <p className="text-sm text-slate-500">
                {dayDesc.season} · {dayDesc.direction}方 · {dayDesc.color}
              </p>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mb-4">
            {dayDesc.personality}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/60 rounded-xl">
              <h4 className="text-xs font-bold text-emerald-600 mb-2">性格優勢</h4>
              <ul className="space-y-1">
                {dayDesc.strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                    <span className="text-emerald-500">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-white/60 rounded-xl">
              <h4 className="text-xs font-bold text-rose-600 mb-2">需要注意</h4>
              <ul className="space-y-1">
                {dayDesc.weaknesses.slice(0, 3).map((w, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                    <span className="text-rose-500">!</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* 五行能量分布 */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4">五行能量分布</h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={wuXingData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="element"
                  tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 50]} tick={false} axisLine={false} />
                <Radar
                  name="五行"
                  dataKey="value"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 柱狀圖 */}
          <div className="h-24 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wuXingData} layout="vertical">
                <XAxis type="number" domain={[0, 50]} hide />
                <YAxis type="category" dataKey="element" width={30} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, '占比']}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {wuXingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>

      {/* 月柱分析 - 表象與內在 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4">月柱分析：表象與內在</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 天干 - 表象 */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: WUXING_COLOR[monthPillar.ganElement] }}
              >
                <span className="text-white font-bold">{monthPillar.gan}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">月干：{monthPillar.ganShiShen || '比肩'}</h4>
                <p className="text-xs text-slate-500">外在表現 · 社會面具</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {monthGanDesc.personality.slice(0, 100)}...
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {monthGanDesc.keywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/70 text-xs text-purple-600 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* 地支 - 內在 */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: WUXING_COLOR[monthZhiElement] }}
              >
                <span className="text-white font-bold">{monthPillar.zhi}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">月支：{monthZhiElement}氣</h4>
                <p className="text-xs text-slate-500">內在本質 · 根基力量</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              月支為{monthPillar.zhi}，屬{monthZhiElement}，
              {WUXING_DESCRIPTIONS[monthZhiElement].personality.slice(0, 80)}...
            </p>
            <div className="mt-3 flex gap-2">
              {monthPillar.hiddenStems.map((stem, i) => (
                <div key={i} className="px-2 py-1 bg-white/70 rounded text-xs">
                  <span className="font-bold" style={{ color: WUXING_COLOR[monthZhiElement] }}>
                    {stem.gan}
                  </span>
                  <span className="text-slate-400 ml-1">
                    {stem.shiShen} {Math.round(stem.weight * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 身強身弱分析 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white"
      >
        <h3 className="text-lg font-bold mb-4">身強身弱判定</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-xl ${analysis.strength.deLing ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
            <div className="text-2xl mb-1">{analysis.strength.deLing ? '✓' : '✗'}</div>
            <div className="text-sm font-medium">得令</div>
            <div className="text-xs text-slate-400">月令生扶</div>
          </div>
          <div className={`p-4 rounded-xl ${analysis.strength.deDi ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
            <div className="text-2xl mb-1">{analysis.strength.deDi ? '✓' : '✗'}</div>
            <div className="text-sm font-medium">得地</div>
            <div className="text-xs text-slate-400">地支通根</div>
          </div>
          <div className={`p-4 rounded-xl ${analysis.strength.deShi ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
            <div className="text-2xl mb-1">{analysis.strength.deShi ? '✓' : '✗'}</div>
            <div className="text-sm font-medium">得勢</div>
            <div className="text-xs text-slate-400">印比生扶</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/20">
            <div className="text-2xl font-bold mb-1">{analysis.strength.verdict}</div>
            <div className="text-sm font-medium">判定結果</div>
            <div className="text-xs text-slate-400">分數 {analysis.strength.score}</div>
          </div>
        </div>

        {/* 強度條 */}
        <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analysis.strength.score}%` }}
            transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 rounded-full"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-amber-500"
            style={{ left: `calc(${analysis.strength.score}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>身極弱</span>
          <span>中和</span>
          <span>身極強</span>
        </div>
      </motion.section>
    </div>
  );
}
