'use client';

import { motion } from 'framer-motion';
import type { BaZiAnalysis, WuXing, LuckYearInteraction } from '@/lib/bazi/types';
import { WUXING_COLOR, TIAN_GAN_ELEMENT, DI_ZHI_ELEMENT } from '@/data/constants';
import { TEN_GOD_DESCRIPTIONS, DAYUN_THEMES } from '@/data/copywriting';
import { getTenGod } from '@/lib/bazi';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Zap, RefreshCw } from 'lucide-react';

interface DaYunTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

export default function DaYunTab({ analysis }: DaYunTabProps) {
  const currentYear = new Date().getFullYear();
  const birthYear = analysis.basic.birthDate.getFullYear();
  const currentAge = currentYear - birthYear;

  // 找出當前大運
  const currentDaYunIndex = analysis.luckPillars.findIndex(
    (p) => currentAge >= p.ageStart && currentAge <= p.ageEnd
  );

  return (
    <div className="space-y-8">
      {/* 標題 */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">十年大運走勢</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
          共 {analysis.luckPillars.length} 步大運
        </span>
      </div>

      {/* 大運時間軸 */}
      <div className="relative">
        {/* 橫向時間軸 */}
        <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-blue-200 to-slate-200" />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {analysis.luckPillars.map((pillar, index) => {
            const isCurrent = index === currentDaYunIndex;
            const isPast = currentAge > pillar.ageEnd;
            const gan = pillar.ganZhi[0];
            const zhi = pillar.ganZhi[1];

            // 計算大運五行和十神
            const ganElement = TIAN_GAN_ELEMENT[gan as keyof typeof TIAN_GAN_ELEMENT] as WuXing;
            const zhiElement = DI_ZHI_ELEMENT[zhi as keyof typeof DI_ZHI_ELEMENT] as WuXing;
            const tenGod = getTenGod(analysis.chart.day.gan, gan as any);
            const theme = DAYUN_THEMES[tenGod];

            // 計算大運分數（基於喜用神）
            let score = 50;
            if (analysis.favorable.includes(ganElement)) score += 20;
            if (analysis.favorable.includes(zhiElement)) score += 15;
            if (analysis.unfavorable.includes(ganElement)) score -= 15;
            if (analysis.unfavorable.includes(zhiElement)) score -= 10;
            score = Math.max(20, Math.min(100, score));

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col rounded-2xl overflow-hidden ${
                  isCurrent
                    ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-200/50'
                    : isPast
                    ? 'opacity-60'
                    : ''
                }`}
              >
                {/* 當前標記 */}
                {isCurrent && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-b-lg z-10">
                    當前
                  </div>
                )}

                {/* 干支區域 */}
                <div
                  className="p-4 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${WUXING_COLOR[ganElement]}20, ${WUXING_COLOR[zhiElement]}20)`,
                  }}
                >
                  <div className="flex justify-center gap-1 mb-2">
                    <span
                      className="text-2xl sm:text-3xl font-serif font-bold"
                      style={{ color: WUXING_COLOR[ganElement] }}
                    >
                      {gan}
                    </span>
                    <span
                      className="text-2xl sm:text-3xl font-serif font-bold"
                      style={{ color: WUXING_COLOR[zhiElement] }}
                    >
                      {zhi}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {pillar.ageStart}-{pillar.ageEnd} 歲
                  </div>
                </div>

                {/* 詳情區域 */}
                <div className="p-3 bg-white">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-600">
                      {tenGod}
                    </span>
                  </div>

                  {/* 分數條 */}
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className={`h-full rounded-full ${
                        score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    />
                  </div>

                  <div className="text-[10px] text-slate-400 text-center">
                    {theme.theme}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 當前大運詳解 */}
      {currentDaYunIndex >= 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl border border-blue-100"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4">當前大運詳解</h3>

          {(() => {
            const pillar = analysis.luckPillars[currentDaYunIndex];
            const detailedAnalysis = analysis.luckPillarAnalysis?.[currentDaYunIndex];
            const gan = pillar.ganZhi[0];
            const zhi = pillar.ganZhi[1];
            const ganElement = TIAN_GAN_ELEMENT[gan as keyof typeof TIAN_GAN_ELEMENT] as WuXing;
            const zhiElement = DI_ZHI_ELEMENT[zhi as keyof typeof DI_ZHI_ELEMENT] as WuXing;
            const tenGod = getTenGod(analysis.chart.day.gan, gan as any);
            const theme = DAYUN_THEMES[tenGod];
            const tenGodDesc = TEN_GOD_DESCRIPTIONS[tenGod];

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 左側 - 基本資訊 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-20 h-20 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${WUXING_COLOR[ganElement]}, ${WUXING_COLOR[zhiElement]})`,
                        }}
                      >
                        <span className="text-3xl font-serif font-bold">
                          {pillar.ganZhi}
                        </span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-800">
                          {theme.theme}
                        </div>
                        <div className="text-slate-500">
                          {pillar.ageStart}-{pillar.ageEnd} 歲 · 主星{tenGod}
                        </div>
                        {/* 喜用神匹配度 */}
                        {detailedAnalysis && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">喜用匹配：</span>
                            <span className={`text-sm font-bold ${
                              detailedAnalysis.favorableMatch.score >= 70
                                ? 'text-emerald-600'
                                : detailedAnalysis.favorableMatch.score >= 50
                                  ? 'text-amber-600'
                                  : 'text-rose-600'
                            }`}>
                              {detailedAnalysis.favorableMatch.score}分
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-white/60 rounded-xl">
                      <h4 className="text-sm font-bold text-slate-700 mb-2">核心焦點</h4>
                      <p className="text-sm text-slate-600">{theme.focus}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-xl">
                        <h4 className="text-xs font-bold text-emerald-600 mb-1">機會</h4>
                        <p className="text-xs text-slate-600">{theme.opportunity}</p>
                      </div>
                      <div className="p-3 bg-rose-50 rounded-xl">
                        <h4 className="text-xs font-bold text-rose-600 mb-1">風險</h4>
                        <p className="text-xs text-slate-600">{theme.risk}</p>
                      </div>
                    </div>
                  </div>

                  {/* 右側 - 十神特質 */}
                  <div className="p-4 bg-white rounded-xl">
                    <h4 className="font-bold text-slate-800 mb-3">
                      {tenGod} · {tenGodDesc.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {tenGodDesc.personality.slice(0, 150)}...
                    </p>

                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-500">這步大運宜：</h5>
                      <ul className="grid grid-cols-2 gap-2">
                        {tenGodDesc.strengths.slice(0, 4).map((s, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                            <span className="text-emerald-500">✓</span>
                            {s.slice(0, 15)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                      <p className="text-xs text-amber-700">
                        <span className="font-bold">建議：</span>
                        {tenGodDesc.advice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 深度分析區塊 */}
                {detailedAnalysis && (
                  <div className="p-4 bg-white/80 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      深度解析
                    </h4>

                    <div className="space-y-3">
                      {/* 天干地支五行與十神 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <div className="text-xs text-slate-500 mb-1">天干</div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xl font-bold"
                              style={{ color: WUXING_COLOR[detailedAnalysis.ganElement] }}
                            >
                              {detailedAnalysis.gan}
                            </span>
                            <span className="text-sm text-slate-600">
                              {detailedAnalysis.ganElement} · {detailedAnalysis.ganTenGod}
                            </span>
                            {detailedAnalysis.favorableMatch.gan ? (
                              <TrendingUp className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <div className="text-xs text-slate-500 mb-1">地支</div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xl font-bold"
                              style={{ color: WUXING_COLOR[detailedAnalysis.zhiElement] }}
                            >
                              {detailedAnalysis.zhi}
                            </span>
                            <span className="text-sm text-slate-600">
                              {detailedAnalysis.zhiElement} · {detailedAnalysis.zhiTenGod}
                            </span>
                            {detailedAnalysis.favorableMatch.zhi ? (
                              <TrendingUp className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-rose-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 詳細描述 */}
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {detailedAnalysis.description}
                        </p>
                      </div>

                      {/* 注意事項 */}
                      {detailedAnalysis.cautions && detailedAnalysis.cautions.length > 0 && (
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-bold text-amber-700">注意事項</span>
                          </div>
                          <ul className="space-y-1">
                            {detailedAnalysis.cautions.map((caution, i) => (
                              <li key={i} className="text-xs text-amber-700 flex items-start gap-2">
                                <span>•</span>
                                <span>{caution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </motion.section>
      )}

      {/* 大運×流年交互分析 */}
      {analysis.luckYearInteractions && analysis.luckYearInteractions.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold text-slate-800">大運×流年交互分析</h3>
            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">
              未來 {analysis.luckYearInteractions.length} 年
            </span>
          </div>

          <div className="space-y-4">
            {analysis.luckYearInteractions.map((interaction: LuckYearInteraction, index: number) => {
              const scoreColor = interaction.score >= 70
                ? 'text-emerald-600'
                : interaction.score >= 50
                  ? 'text-amber-600'
                  : 'text-rose-600';

              const ScoreIcon = interaction.score >= 70
                ? TrendingUp
                : interaction.score >= 50
                  ? Minus
                  : TrendingDown;

              const hasFuYin = interaction.chartInteraction.fuYin;
              const hasFanYin = interaction.chartInteraction.fanYin;
              const hasGanInteraction = interaction.ganInteraction.type !== '無';
              const hasZhiInteraction = interaction.zhiInteraction.types.some(t => t !== '無');

              return (
                <motion.div
                  key={interaction.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* 年份與干支 */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex flex-col items-center justify-center text-white">
                        <span className="text-lg font-bold">{interaction.yearGanZhi}</span>
                        <span className="text-[10px] opacity-80">{interaction.year}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-800">{interaction.theme}</span>
                          <ScoreIcon className={`w-4 h-4 ${scoreColor}`} />
                        </div>
                        <div className={`text-2xl font-bold ${scoreColor}`}>
                          {interaction.score}分
                        </div>
                      </div>
                    </div>

                    {/* 交互標記 */}
                    <div className="flex flex-wrap gap-2 lg:ml-auto">
                      {/* 伏吟標記 */}
                      {hasFuYin && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                          <RefreshCw className="w-3 h-3" />
                          伏吟
                        </span>
                      )}

                      {/* 反吟標記 */}
                      {hasFanYin && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          反吟
                        </span>
                      )}

                      {/* 天干交互 */}
                      {hasGanInteraction && (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                          interaction.ganInteraction.impact === 'positive'
                            ? 'bg-emerald-100 text-emerald-700'
                            : interaction.ganInteraction.impact === 'negative'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}>
                          干{interaction.ganInteraction.type}
                        </span>
                      )}

                      {/* 地支交互 */}
                      {hasZhiInteraction && interaction.zhiInteraction.types.filter(t => t !== '無').map((type, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                            interaction.zhiInteraction.impact === 'positive'
                              ? 'bg-emerald-100 text-emerald-700'
                              : interaction.zhiInteraction.impact === 'negative'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          支{type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 詳細說明 */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* 天干互動詳情 */}
                      {hasGanInteraction && (
                        <div className="text-xs text-slate-600">
                          <span className="font-medium text-slate-700">天干：</span>
                          {interaction.ganInteraction.description}
                        </div>
                      )}

                      {/* 地支互動詳情 */}
                      {hasZhiInteraction && (
                        <div className="text-xs text-slate-600">
                          <span className="font-medium text-slate-700">地支：</span>
                          {interaction.zhiInteraction.description}
                        </div>
                      )}
                    </div>

                    {/* 伏吟/反吟詳情 */}
                    {(hasFuYin || hasFanYin) && (
                      <div className="mt-2 p-2 bg-amber-50 rounded-lg">
                        <p className="text-xs text-amber-700">
                          <span className="font-bold">⚠️ 特殊標記：</span>
                          {interaction.chartInteraction.description}
                        </p>
                      </div>
                    )}

                    {/* 建議 */}
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <span className="font-bold">💡 建議：</span>
                        {interaction.advice}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* 大運走勢圖表 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4">大運能量趨勢</h3>

        <div className="relative h-32">
          <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
            {/* 背景格線 */}
            <line x1="0" y1="60" x2="800" y2="60" stroke="#e2e8f0" strokeDasharray="4" />

            {/* 趨勢線 */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              d={analysis.luckPillars
                .map((pillar, i) => {
                  const gan = pillar.ganZhi[0];
                  const zhi = pillar.ganZhi[1];
                  const ganEl = TIAN_GAN_ELEMENT[gan as keyof typeof TIAN_GAN_ELEMENT] as WuXing;
                  const zhiEl = DI_ZHI_ELEMENT[zhi as keyof typeof DI_ZHI_ELEMENT] as WuXing;
                  let score = 50;
                  if (analysis.favorable.includes(ganEl)) score += 20;
                  if (analysis.favorable.includes(zhiEl)) score += 15;
                  if (analysis.unfavorable.includes(ganEl)) score -= 15;
                  if (analysis.unfavorable.includes(zhiEl)) score -= 10;
                  score = Math.max(20, Math.min(100, score));

                  const x = (i / (analysis.luckPillars.length - 1)) * 780 + 10;
                  const y = 110 - (score / 100) * 100;

                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 漸層定義 */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* 數據點 */}
            {analysis.luckPillars.map((pillar, i) => {
              const gan = pillar.ganZhi[0];
              const zhi = pillar.ganZhi[1];
              const ganEl = TIAN_GAN_ELEMENT[gan as keyof typeof TIAN_GAN_ELEMENT] as WuXing;
              const zhiEl = DI_ZHI_ELEMENT[zhi as keyof typeof DI_ZHI_ELEMENT] as WuXing;
              let score = 50;
              if (analysis.favorable.includes(ganEl)) score += 20;
              if (analysis.favorable.includes(zhiEl)) score += 15;
              if (analysis.unfavorable.includes(ganEl)) score -= 15;
              if (analysis.unfavorable.includes(zhiEl)) score -= 10;
              score = Math.max(20, Math.min(100, score));

              const x = (i / (analysis.luckPillars.length - 1)) * 780 + 10;
              const y = 110 - (score / 100) * 100;
              const isCurrent = i === currentDaYunIndex;

              return (
                <g key={i}>
                  <motion.circle
                    initial={{ r: 0 }}
                    animate={{ r: isCurrent ? 8 : 5 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    cx={x}
                    cy={y}
                    fill={isCurrent ? '#3b82f6' : '#94a3b8'}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y="118"
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400"
                  >
                    {pillar.ganZhi}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500">
          <span>上方 = 運勢較佳</span>
          <span>下方 = 運勢較弱</span>
          <span className="text-blue-500 font-medium">● 當前大運</span>
        </div>
      </motion.section>
    </div>
  );
}
