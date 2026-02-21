'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { BaZiAnalysis, Pillar, WuXing, ShenSha, PreferenceAnalysis } from '@/lib/bazi/types';
import { WUXING_COLOR } from '@/data/constants';
import { WUXING_DESCRIPTIONS } from '@/data/copywriting';
import { getShenShaSummary, getKongWangDescription } from '@/lib/bazi/shensha';
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
  ReferenceLine,
} from 'recharts';
import { GlossaryTerm } from '@/components/ui/Tooltip';
import { InsightCallout, TaijiSymbol, SealStamp, CloudDivider } from '@/components/ui/EasternDecor';
import { Sparkles, Scale, Zap, Star, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface OverviewTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

// 五行漸層色彩
const WUXING_GRADIENT: Record<WuXing, { from: string; to: string; bg: string }> = {
  '木': { from: '#10B981', to: '#059669', bg: 'bg-emerald-50' },
  '火': { from: '#EF4444', to: '#DC2626', bg: 'bg-red-50' },
  '土': { from: '#F59E0B', to: '#D97706', bg: 'bg-amber-50' },
  '金': { from: '#6B7280', to: '#4B5563', bg: 'bg-gray-50' },
  '水': { from: '#3B82F6', to: '#2563EB', bg: 'bg-blue-50' },
};

// 身強身弱對應建議
const STRENGTH_ADVICE: Record<string, { summary: string; strategy: string; direction: string }> = {
  '身極強': {
    summary: '日主力量極強，需要洩耗來平衡。',
    strategy: '宜發揮、宜開創、宜主導，適合創業或領導角色。',
    direction: '多接觸食傷、財星元素，將過剩能量轉化為成果。',
  },
  '身強': {
    summary: '日主力量充足，具備主動出擊的能量。',
    strategy: '可積極進取，把握機會，適合開拓新事業。',
    direction: '善用食傷生財的路線，創造價值。',
  },
  '身旺': {
    summary: '日主力量偏強，有足夠能量發揮。',
    strategy: '保持平衡發展，不宜過度冒進。',
    direction: '適當洩耗，避免剛愎自用。',
  },
  '中和': {
    summary: '日主與環境力量均衡，為最佳狀態。',
    strategy: '各方面發展均衡，順勢而為即可。',
    direction: '維持現狀，遇喜用神流年加分。',
  },
  '身弱': {
    summary: '日主力量不足，需要生扶來增強。',
    strategy: '宜借力使力，依附強者發展。',
    direction: '多接觸印星、比劫元素，增強自身能量。',
  },
  '身衰': {
    summary: '日主力量偏弱，需謹慎行事。',
    strategy: '不宜單打獨鬥，需團隊支持。',
    direction: '尋求貴人相助，避免獨自承擔重任。',
  },
  '身極弱': {
    summary: '日主力量極弱，以柔克剛為上策。',
    strategy: '從勢而行，不強求主導地位。',
    direction: '順應環境，借力打力，反而能有所成就。',
  },
};

// 四柱卡片組件
function PillarCard({
  pillar,
  label,
  desc,
  index,
  isDay,
}: {
  pillar: Pillar;
  label: string;
  desc: string;
  index: number;
  isDay?: boolean;
}) {
  const ganGradient = WUXING_GRADIENT[pillar.ganElement];
  const zhiGradient = WUXING_GRADIENT[pillar.zhiElement];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`
        relative flex flex-col items-center p-2 sm:p-4 lg:p-6 rounded-2xl min-w-0
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
      <div className="text-center mb-2 sm:mb-3">
        <span className={`text-xs sm:text-sm font-bold ${isDay ? 'text-amber-600' : 'text-slate-600'}`}>
          {label}
        </span>
        <p className="text-[8px] sm:text-[10px] text-slate-400 truncate">{desc}</p>
      </div>

      {/* 天干 */}
      <div className="relative mb-1 sm:mb-2">
        <div
          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner"
          style={{
            background: `linear-gradient(135deg, ${ganGradient.from}, ${ganGradient.to})`,
          }}
        >
          <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white drop-shadow">
            {pillar.gan}
          </span>
        </div>
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 sm:px-2 py-0.5 bg-white text-[8px] sm:text-[10px] font-bold rounded shadow whitespace-nowrap"
          style={{ color: ganGradient.from }}
        >
          <GlossaryTerm term={pillar.ganElement}>{pillar.ganElement}</GlossaryTerm>
          {pillar.ganYinYang}
        </div>
      </div>

      {/* 十神 */}
      <div className={`text-[10px] sm:text-xs font-medium mb-2 sm:mb-3 ${isDay ? 'text-amber-700' : 'text-slate-500'}`}>
        {pillar.ganShiShen ? (
          <GlossaryTerm term={pillar.ganShiShen}>{pillar.ganShiShen}</GlossaryTerm>
        ) : (
          isDay ? '元神' : '—'
        )}
      </div>

      {/* 地支 */}
      <div className="relative">
        <div
          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner"
          style={{
            background: `linear-gradient(135deg, ${zhiGradient.from}, ${zhiGradient.to})`,
          }}
        >
          <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white drop-shadow">
            {pillar.zhi}
          </span>
        </div>
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 sm:px-2 py-0.5 bg-white text-[8px] sm:text-[10px] font-bold rounded shadow whitespace-nowrap"
          style={{ color: zhiGradient.from }}
        >
          <GlossaryTerm term={pillar.zhiElement}>{pillar.zhiElement}</GlossaryTerm>
          {pillar.zhiYinYang}
        </div>
      </div>

      {/* 藏干 */}
      <div className="flex gap-0.5 sm:gap-1 mt-2 sm:mt-4 flex-wrap justify-center">
        {pillar.hiddenStems.map((stem, i) => (
          <div
            key={i}
            className="flex flex-col items-center px-1 sm:px-2 py-0.5 sm:py-1 bg-slate-50 rounded-lg"
            title={`${stem.shiShen || ''} (${Math.round(stem.weight * 100)}%)`}
          >
            <span className="text-xs sm:text-sm font-bold" style={{ color: WUXING_COLOR[pillar.zhiElement] }}>
              {stem.gan}
            </span>
            <span className="text-[6px] sm:text-[8px] text-slate-400">
              {i === 0 ? '本' : i === 1 ? '中' : '餘'}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function OverviewTab({ analysis }: OverviewTabProps) {
  const dayElement = analysis.chart.day.ganElement;
  const dayDesc = WUXING_DESCRIPTIONS[dayElement];
  const strengthAdvice = STRENGTH_ADVICE[analysis.strength.verdict] || STRENGTH_ADVICE['中和'];

  // 五行分布數據（加入理想值參考線）
  const wuXingData = (['木', '火', '土', '金', '水'] as WuXing[]).map((element) => ({
    element,
    value: analysis.wuXingPercentage[element] || 0,
    ideal: 20, // 理想平衡值
    fullMark: 50,
    fill: WUXING_COLOR[element],
  }));

  // 計算五行平衡度（0-100，越高越平衡）
  const maxWuXing = Math.max(...Object.values(analysis.wuXingPercentage));
  const minWuXing = Math.min(...Object.values(analysis.wuXingPercentage));
  const balanceScore = Math.round(100 - (maxWuXing - minWuXing) * 2);

  // 四柱資料（傳統排列：年月日時從右到左）
  const pillars = [
    { pillar: analysis.chart.hour, label: '時柱', desc: '子女・49歲後' },
    { pillar: analysis.chart.day, label: '日柱', desc: '自我・33-48歲', isDay: true },
    { pillar: analysis.chart.month, label: '月柱', desc: '父母・17-32歲' },
    { pillar: analysis.chart.year, label: '年柱', desc: '祖德・0-16歲' },
  ];

  return (
    <div className="space-y-8">
      {/* 第一區塊：八字盤 */}
      <section className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-lg">
            1
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">本命八字盤</h2>
            <p className="text-sm text-slate-500">傳統排列：年月日時（從右到左）</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 lg:gap-6">
          {pillars.map((item, index) => (
            <PillarCard
              key={item.label}
              pillar={item.pillar}
              label={item.label}
              desc={item.desc}
              index={index}
              isDay={item.isDay}
            />
          ))}
        </div>

        {/* 印章裝飾 */}
        <div className="absolute -top-2 -right-2 opacity-30 hidden sm:block">
          <SealStamp text="本命" size="sm" variant="red" />
        </div>

        {/* 五行圖例 */}
        <div className="flex justify-center gap-4 mt-6">
          {(['木', '火', '土', '金', '水'] as WuXing[]).map((element) => (
            <div key={element} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: WUXING_COLOR[element] }}
              />
              <GlossaryTerm term={element}>
                <span className="text-sm text-slate-600">{element}</span>
              </GlossaryTerm>
            </div>
          ))}
        </div>
      </section>

      <CloudDivider />

      {/* 第二區塊：格局 + 用神 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold shadow-lg">
            2
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">格局與用神</h2>
            <p className="text-sm text-slate-500">命盤核心結構分析</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 格局分析 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-2xl text-white overflow-hidden"
          >
            {/* 背景太極 */}
            <div className="absolute top-4 right-4 opacity-10">
              <TaijiSymbol size={60} />
            </div>

            <div className="relative">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur">
                  <span className="text-2xl font-serif font-bold">{analysis.pattern.name.slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-1">
                    <GlossaryTerm term={analysis.pattern.name} className="text-white border-white/50">
                      {analysis.pattern.name}
                    </GlossaryTerm>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full backdrop-blur">
                      {analysis.pattern.type}
                    </span>
                    <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full backdrop-blur">
                      {analysis.pattern.status}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                {analysis.pattern.description}
              </p>

              {/* 格局關鍵解讀 */}
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold text-amber-300">格局關鍵</span>
                </div>
                <p className="text-xs text-indigo-200">
                  此格局以「{analysis.pattern.name.includes('官') ? '正官' :
                    analysis.pattern.name.includes('印') ? '正印' :
                    analysis.pattern.name.includes('財') ? '正財' :
                    analysis.pattern.name.includes('殺') ? '七殺' : '食神'}」為核心，
                  {analysis.pattern.status === '成格'
                    ? '格局成立，發揮空間大。'
                    : '格局需調整，宜順勢而為。'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 用神喜忌 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Scale className="w-5 h-5 text-slate-600" />
                <GlossaryTerm term="喜用神">用神喜忌</GlossaryTerm>
              </h3>
              {/* 分析方法標籤 */}
              {analysis.preferenceAnalysis && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                  {analysis.preferenceAnalysis.method}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* 喜用神 */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-1">
                  ✓ <GlossaryTerm term="喜用神">喜用神</GlossaryTerm>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(analysis.preferenceAnalysis?.favorable || analysis.favorable).map((element, idx) => (
                    <div
                      key={element}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg shadow-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: WUXING_COLOR[element as WuXing] }}
                      />
                      <GlossaryTerm term={element}>
                        <span className="font-bold text-slate-700">{element}</span>
                      </GlossaryTerm>
                      {idx === 0 && (
                        <span className="text-[10px] text-emerald-500 font-bold">首選</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 忌神 */}
              <div className="p-4 bg-gradient-to-br from-rose-50 to-red-50 rounded-xl border border-rose-100">
                <h4 className="text-sm font-bold text-rose-700 mb-3 flex items-center gap-1">
                  ✗ <GlossaryTerm term="忌神">忌神</GlossaryTerm>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(analysis.preferenceAnalysis?.unfavorable || analysis.unfavorable).map((element) => (
                    <div
                      key={element}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg shadow-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: WUXING_COLOR[element as WuXing] }}
                      />
                      <GlossaryTerm term={element}>
                        <span className="font-bold text-slate-700">{element}</span>
                      </GlossaryTerm>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 調候用神（如果需要） */}
            {analysis.preferenceAnalysis?.tiaoHou && analysis.preferenceAnalysis.tiaoHou.tiaoHouShen.length > 0 && (
              <div className={`p-3 mb-4 rounded-xl border ${
                analysis.preferenceAnalysis.tiaoHou.isSufficient
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-700">
                    <GlossaryTerm term="調候用神">調候用神</GlossaryTerm>：
                  </span>
                  {analysis.preferenceAnalysis.tiaoHou.tiaoHouShen.map((element) => (
                    <span
                      key={element}
                      className="px-2 py-0.5 rounded font-bold text-white text-sm"
                      style={{ backgroundColor: WUXING_COLOR[element] }}
                    >
                      {element}
                    </span>
                  ))}
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    analysis.preferenceAnalysis.tiaoHou.isSufficient
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {analysis.preferenceAnalysis.tiaoHou.isSufficient ? '調候有情' : '急需調候'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {analysis.preferenceAnalysis.tiaoHou.description}
                </p>
              </div>
            )}

            {/* 用神力量評估 */}
            {analysis.preferenceAnalysis?.ushenStrength && (
              <div className="p-3 mb-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-slate-700">用神力量：</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    analysis.preferenceAnalysis.ushenStrength.strength === '有力'
                      ? 'bg-emerald-100 text-emerald-700'
                      : analysis.preferenceAnalysis.ushenStrength.strength === '中等'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {analysis.preferenceAnalysis.ushenStrength.element} {analysis.preferenceAnalysis.ushenStrength.strength}
                  </span>
                </div>
                {analysis.preferenceAnalysis.ushenStrength.factors.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {analysis.preferenceAnalysis.ushenStrength.factors.map((factor, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-600">
                        {factor}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 詳細分析說明 */}
            {analysis.preferenceAnalysis?.description && (
              <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl text-sm">
                <p className="text-slate-700 leading-relaxed">
                  {analysis.preferenceAnalysis.description}
                </p>
              </div>
            )}

            {/* 簡易應用建議 */}
            {!analysis.preferenceAnalysis && (
              <div className="p-3 bg-slate-50 rounded-xl text-sm">
                <p className="text-slate-600">
                  <span className="font-bold text-slate-800">應用建議：</span>
                  多接觸「{analysis.favorable.join('、')}」相關的方位、顏色、行業；
                  減少「{analysis.unfavorable.join('、')}」元素的接觸，可趨吉避凶。
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <CloudDivider />

      {/* 第三區塊：日主 & 五行 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold shadow-lg">
            3
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">元神與五行</h2>
            <p className="text-sm text-slate-500">日主特質與五行能量分布</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 日主詳解 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`p-6 rounded-2xl ${WUXING_GRADIENT[dayElement].bg} border border-slate-100`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${WUXING_GRADIENT[dayElement].from}, ${WUXING_GRADIENT[dayElement].to})`,
                }}
              >
                <span className="text-white">{dayDesc.symbol}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  元神屬「<GlossaryTerm term={dayElement}>{dayElement}</GlossaryTerm>」
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
              <div className="p-3 bg-white/70 rounded-xl backdrop-blur">
                <h4 className="text-xs font-bold text-emerald-600 mb-2 flex items-center gap-1">
                  <span className="text-emerald-500">✓</span> 性格優勢
                </h4>
                <ul className="space-y-1">
                  {dayDesc.strengths.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-xs text-slate-600">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-white/70 rounded-xl backdrop-blur">
                <h4 className="text-xs font-bold text-rose-600 mb-2 flex items-center gap-1">
                  <span className="text-rose-500">!</span> 需要注意
                </h4>
                <ul className="space-y-1">
                  {dayDesc.weaknesses.slice(0, 3).map((w, i) => (
                    <li key={i} className="text-xs text-slate-600">
                      • {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 五行能量分布 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">五行能量分布</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">平衡度</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  balanceScore >= 70 ? 'bg-emerald-100 text-emerald-700' :
                  balanceScore >= 40 ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {balanceScore}%
                </span>
              </div>
            </div>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={wuXingData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="element"
                    tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 50]} tick={false} axisLine={false} />
                  {/* 理想平衡線 */}
                  <Radar
                    name="理想"
                    dataKey="ideal"
                    stroke="#94a3b8"
                    fill="transparent"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                  {/* 實際值 */}
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
            <div className="h-24 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wuXingData} layout="vertical">
                  <XAxis type="number" domain={[0, 50]} hide />
                  <YAxis type="category" dataKey="element" width={30} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, '占比']}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  {/* 理想值參考線 */}
                  <ReferenceLine x={20} stroke="#94a3b8" strokeDasharray="3 3" />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {wuXingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-slate-400 text-center mt-2">
              虛線為理想平衡值（20%）
            </p>
          </motion.div>
        </div>
      </section>

      <CloudDivider />

      {/* 第四區塊：身強身弱 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold shadow-lg">
            4
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              <GlossaryTerm term={analysis.strength.verdict}>身強身弱判定</GlossaryTerm>
            </h2>
            <p className="text-sm text-slate-500">日主力量強弱分析</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white"
        >
          {/* 判定指標 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl ${analysis.strength.deLing ? 'bg-emerald-500/20 ring-1 ring-emerald-400/50' : 'bg-slate-700/50'}`}>
              <div className="text-2xl mb-1">{analysis.strength.deLing ? '✓' : '✗'}</div>
              <div className="text-sm font-medium">得令</div>
              <div className="text-xs text-slate-400">月令生扶日主</div>
            </div>
            <div className={`p-4 rounded-xl ${analysis.strength.deDi ? 'bg-emerald-500/20 ring-1 ring-emerald-400/50' : 'bg-slate-700/50'}`}>
              <div className="text-2xl mb-1">{analysis.strength.deDi ? '✓' : '✗'}</div>
              <div className="text-sm font-medium">得地</div>
              <div className="text-xs text-slate-400">地支通根有力</div>
            </div>
            <div className={`p-4 rounded-xl ${analysis.strength.deShi ? 'bg-emerald-500/20 ring-1 ring-emerald-400/50' : 'bg-slate-700/50'}`}>
              <div className="text-2xl mb-1">{analysis.strength.deShi ? '✓' : '✗'}</div>
              <div className="text-sm font-medium">得勢</div>
              <div className="text-xs text-slate-400">印比生扶較多</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 ring-1 ring-amber-400/50">
              <div className="text-2xl font-bold mb-1">{analysis.strength.verdict}</div>
              <div className="text-sm font-medium">判定結果</div>
              <div className="text-xs text-amber-300">分數 {analysis.strength.score}/100</div>
            </div>
          </div>

          {/* 強度條 */}
          <div className="mb-6">
            <div className="relative h-6 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.strength.score}%` }}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 rounded-full"
              />
              <motion.div
                initial={{ left: 0 }}
                animate={{ left: `calc(${analysis.strength.score}% - 12px)` }}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-amber-500 flex items-center justify-center"
              >
                <Zap className="w-3 h-3 text-amber-500" />
              </motion.div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>身極弱</span>
              <span>身弱</span>
              <span className="text-emerald-400 font-bold">中和</span>
              <span>身強</span>
              <span>身極強</span>
            </div>
          </div>

          {/* 解讀建議 */}
          <InsightCallout
            title={`${analysis.strength.verdict}解讀`}
            variant="fortune"
            icon="🎯"
          >
            <p className="mb-2">{strengthAdvice.summary}</p>
            <p className="mb-2"><strong>行事策略：</strong>{strengthAdvice.strategy}</p>
            <p><strong>調整方向：</strong>{strengthAdvice.direction}</p>
          </InsightCallout>
        </motion.div>
      </section>

      {/* 第五區塊：神煞與空亡 */}
      {analysis.shenSha && analysis.shenSha.length > 0 && (
        <>
          <CloudDivider />
          <ShenShaSection analysis={analysis} />
        </>
      )}
    </div>
  );
}

// 神煞展示區塊
function ShenShaSection({ analysis }: { analysis: BaZiAnalysis }) {
  const [expandedShenSha, setExpandedShenSha] = useState<string | null>(null);

  if (!analysis.shenSha || analysis.shenSha.length === 0) return null;

  const { auspicious, inauspicious, neutral, summary } = getShenShaSummary(analysis.shenSha);
  const kongWangDesc = analysis.kongWang ? getKongWangDescription(analysis.kongWang) : '';

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold shadow-lg">
          5
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            <GlossaryTerm term="神煞">神煞吉凶</GlossaryTerm>
          </h2>
          <p className="text-sm text-slate-500">命中星曜與特殊標記</p>
        </div>
      </div>

      {/* 神煞統計概覽 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-700">吉神</span>
          </div>
          <div className="text-3xl font-bold text-emerald-600">{auspicious.length}</div>
          <p className="text-xs text-emerald-600 mt-1">貴人助力</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gradient-to-br from-rose-50 to-red-50 rounded-xl border border-rose-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-bold text-rose-700">凶煞</span>
          </div>
          <div className="text-3xl font-bold text-rose-600">{inauspicious.length}</div>
          <p className="text-xs text-rose-600 mt-1">需化解</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-bold text-slate-700">中性</span>
          </div>
          <div className="text-3xl font-bold text-slate-600">{neutral.length}</div>
          <p className="text-xs text-slate-600 mt-1">看運用</p>
        </motion.div>
      </div>

      {/* 神煞詳細列表 */}
      <div className="space-y-4">
        {/* 吉神 */}
        {auspicious.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-gradient-to-r from-emerald-50 to-transparent rounded-xl"
          >
            <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" /> 吉神星曜
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {auspicious.map((shensha, idx) => (
                <ShenShaCard
                  key={`${shensha.name}-${idx}`}
                  shensha={shensha}
                  isExpanded={expandedShenSha === `${shensha.name}-${idx}`}
                  onToggle={() => setExpandedShenSha(
                    expandedShenSha === `${shensha.name}-${idx}` ? null : `${shensha.name}-${idx}`
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* 凶煞 */}
        {inauspicious.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-gradient-to-r from-rose-50 to-transparent rounded-xl"
          >
            <h4 className="text-sm font-bold text-rose-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> 凶煞提醒
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {inauspicious.map((shensha, idx) => (
                <ShenShaCard
                  key={`${shensha.name}-${idx}`}
                  shensha={shensha}
                  isExpanded={expandedShenSha === `${shensha.name}-inauspicious-${idx}`}
                  onToggle={() => setExpandedShenSha(
                    expandedShenSha === `${shensha.name}-inauspicious-${idx}` ? null : `${shensha.name}-inauspicious-${idx}`
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* 中性 */}
        {neutral.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-xl"
          >
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 中性星曜
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {neutral.map((shensha, idx) => (
                <ShenShaCard
                  key={`${shensha.name}-${idx}`}
                  shensha={shensha}
                  isExpanded={expandedShenSha === `${shensha.name}-neutral-${idx}`}
                  onToggle={() => setExpandedShenSha(
                    expandedShenSha === `${shensha.name}-neutral-${idx}` ? null : `${shensha.name}-neutral-${idx}`
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 空亡分析 */}
      {analysis.kongWang && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100"
        >
          <h4 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
            <GlossaryTerm term="空亡">空亡分析</GlossaryTerm>
          </h4>
          <p className="text-sm text-slate-600 mb-2">
            日柱空亡：<span className="font-bold text-indigo-600">{analysis.kongWang.dayKong.join('、')}</span>
          </p>
          <p className="text-sm text-slate-600">{kongWangDesc}</p>
        </motion.div>
      )}

      {/* 天干合化分析 */}
      {analysis.ganHe && analysis.ganHe.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100"
        >
          <h4 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
            <GlossaryTerm term="天干五合">天干合化</GlossaryTerm>
          </h4>
          <div className="space-y-2">
            {analysis.ganHe.map((he, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-white/70 rounded-lg">
                <span className="px-2 py-1 bg-amber-100 rounded text-amber-700 font-bold text-sm">
                  {he.position1}{he.gan1}
                </span>
                <span className="text-amber-500">⟷</span>
                <span className="px-2 py-1 bg-amber-100 rounded text-amber-700 font-bold text-sm">
                  {he.position2}{he.gan2}
                </span>
                <span className="text-sm text-slate-500">→</span>
                <span className={`px-2 py-1 rounded text-sm font-bold ${
                  he.isHua ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {he.isHua ? `化${he.huaElement}成功` : '合而不化'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-600 mt-2">
            {analysis.ganHe[0]?.description}
          </p>
        </motion.div>
      )}

      {/* 神煞總評 */}
      <InsightCallout
        title="神煞總評"
        variant="fortune"
        className="mt-6"
      >
        <p className="leading-relaxed">{summary}</p>
      </InsightCallout>
    </section>
  );
}

// 單個神煞卡片
function ShenShaCard({
  shensha,
  isExpanded,
  onToggle,
}: {
  shensha: ShenSha;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const typeStyles = {
    auspicious: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    inauspicious: 'bg-rose-100 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`w-full p-3 rounded-lg border text-left transition-all ${typeStyles[shensha.type]} hover:shadow-md`}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">{shensha.name}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
        <span className="text-xs opacity-70">{shensha.position}柱</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute z-10 left-0 right-0 mt-1 p-3 bg-white rounded-lg shadow-lg border border-slate-200"
          >
            <p className="text-xs text-slate-600 mb-2">{shensha.description}</p>
            <p className="text-xs text-slate-500"><strong>影響：</strong>{shensha.effect}</p>
            <p className="text-xs text-emerald-600 mt-1"><strong>建議：</strong>{shensha.advice}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
