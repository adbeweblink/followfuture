'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BaZiAnalysis, WuXing, ShiShen } from '@/lib/bazi/types';
import { WUXING_COLOR, TIAN_GAN_ELEMENT, DI_ZHI_ELEMENT } from '@/data/constants';
import { TEN_GOD_DESCRIPTIONS } from '@/data/copywriting';
import { getTenGod } from '@/lib/bazi';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  Target,
  AlertCircle,
} from 'lucide-react';
import { GlossaryTerm, CloudDivider, InsightCallout } from '@/components/ui';

interface FortuneTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

// 大運主題描述
const DAYUN_THEMES: Record<ShiShen, { theme: string; focus: string; opportunity: string; risk: string }> = {
  比肩: { theme: '自我成長期', focus: '個人能力提升、獨立發展', opportunity: '創業、自主事業、技能精進', risk: '競爭壓力、獨斷固執' },
  劫財: { theme: '競爭突破期', focus: '把握機會、拓展人脈', opportunity: '投資機會、合作項目、社交拓展', risk: '財務風險、衝動決策' },
  食神: { theme: '才華展現期', focus: '創意發揮、享受生活', opportunity: '藝術創作、教學分享、品牌建立', risk: '過於安逸、缺乏目標' },
  傷官: { theme: '創新突破期', focus: '打破框架、技術創新', opportunity: '專利發明、技術突破、個人品牌', risk: '人際衝突、口舌是非' },
  偏財: { theme: '財運活絡期', focus: '商業機會、投資理財', opportunity: '副業發展、投資收益、人脈變現', risk: '財來財去、感情複雜' },
  正財: { theme: '穩健積累期', focus: '穩定收入、財富累積', opportunity: '薪資成長、儲蓄投資、家庭建設', risk: '過於保守、錯失機會' },
  七殺: { theme: '權力挑戰期', focus: '事業突破、領導力', opportunity: '升遷機會、權力擴張、競爭勝出', risk: '壓力過大、健康問題' },
  正官: { theme: '穩定發展期', focus: '名譽地位、事業穩定', opportunity: '升職加薪、社會認可、穩定發展', risk: '壓力內化、過於拘謹' },
  偏印: { theme: '學習轉型期', focus: '進修學習、思維轉變', opportunity: '專業深造、特殊領域、研究成果', risk: '孤獨感、方向迷失' },
  正印: { theme: '貴人相助期', focus: '學業進步、貴人提攜', opportunity: '學歷提升、貴人助力、智慧增長', risk: '依賴他人、行動力不足' },
};

export default function FortuneTab({ analysis }: FortuneTabProps) {
  const [showAllLuckPillars, setShowAllLuckPillars] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();
  const birthYear = analysis.basic.birthDate.getFullYear();
  const currentAge = currentYear - birthYear;
  const currentMonth = new Date().getMonth() + 1;

  // 找出當前大運
  const currentDaYunIndex = analysis.luckPillars.findIndex(
    (p) => currentAge >= p.ageStart && currentAge <= p.ageEnd
  );

  // 計算大運進度
  const getDaYunProgress = () => {
    if (currentDaYunIndex < 0) return 0;
    const pillar = analysis.luckPillars[currentDaYunIndex];
    const totalYears = pillar.ageEnd - pillar.ageStart + 1;
    const yearsIn = currentAge - pillar.ageStart;
    return Math.round((yearsIn / totalYears) * 100);
  };

  const daYunProgress = getDaYunProgress();

  // 流月數據
  const monthlyFortunes = analysis.monthlyFortunes || [];
  const avgScore = monthlyFortunes.length > 0
    ? Math.round(monthlyFortunes.reduce((sum, m) => sum + m.score, 0) / monthlyFortunes.length)
    : 50;

  // 顯示的大運數量
  const visibleLuckPillars = showAllLuckPillars
    ? analysis.luckPillars
    : analysis.luckPillars.slice(0, 6);

  // 計算單一大運分數
  const calculateScore = (ganZhi: string) => {
    const gan = ganZhi[0];
    const zhi = ganZhi[1];
    const ganElement = TIAN_GAN_ELEMENT[gan as keyof typeof TIAN_GAN_ELEMENT] as WuXing;
    const zhiElement = DI_ZHI_ELEMENT[zhi as keyof typeof DI_ZHI_ELEMENT] as WuXing;
    let score = 50;
    if (analysis.favorable.includes(ganElement)) score += 20;
    if (analysis.favorable.includes(zhiElement)) score += 15;
    if (analysis.unfavorable.includes(ganElement)) score -= 15;
    if (analysis.unfavorable.includes(zhiElement)) score -= 10;
    return Math.max(20, Math.min(100, score));
  };

  return (
    <div className="space-y-8">
      {/* 1. 當前大運 - 核心焦點 */}
      {currentDaYunIndex >= 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              1
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">當前大運</h2>
              <p className="text-sm text-slate-500">
                {currentAge} 歲 · {currentYear} 年 · <GlossaryTerm term="大運">大運</GlossaryTerm>每十年一轉
              </p>
            </div>
          </div>

          {(() => {
            const pillar = analysis.luckPillars[currentDaYunIndex];
            const gan = pillar.ganZhi[0];
            const zhi = pillar.ganZhi[1];
            const ganElement = TIAN_GAN_ELEMENT[gan as keyof typeof TIAN_GAN_ELEMENT] as WuXing;
            const zhiElement = DI_ZHI_ELEMENT[zhi as keyof typeof DI_ZHI_ELEMENT] as WuXing;
            const tenGod = getTenGod(analysis.chart.day.gan, gan as any);
            const theme = DAYUN_THEMES[tenGod];
            const tenGodDesc = TEN_GOD_DESCRIPTIONS[tenGod];
            const score = calculateScore(pillar.ganZhi);

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl border border-blue-100"
              >
                {/* 進度條 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      大運進度
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {daYunProgress}% · 剩餘 {pillar.ageEnd - currentAge + 1} 年
                    </span>
                  </div>
                  <div className="h-3 bg-white/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${daYunProgress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full relative"
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-blue-500" />
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{pillar.ageStart} 歲開始</span>
                    <span>{pillar.ageEnd} 歲結束</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 左側 - 主運資訊 */}
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
                          {pillar.ageStart}-{pillar.ageEnd} 歲 · 主星
                          <GlossaryTerm term={tenGod}>{tenGod}</GlossaryTerm>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`px-2 py-0.5 text-xs rounded-full ${
                            score >= 70 ? 'bg-emerald-100 text-emerald-700' :
                            score >= 50 ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {score >= 70 ? '🌟' : score >= 50 ? '☀️' : '🌙'} 運勢 {score} 分
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/60 rounded-xl">
                      <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        核心焦點
                      </h4>
                      <p className="text-sm text-slate-600">{theme.focus}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <h4 className="text-xs font-bold text-emerald-600 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          把握機會
                        </h4>
                        <p className="text-xs text-slate-600">{theme.opportunity}</p>
                      </div>
                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                        <h4 className="text-xs font-bold text-rose-600 mb-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          注意風險
                        </h4>
                        <p className="text-xs text-slate-600">{theme.risk}</p>
                      </div>
                    </div>
                  </div>

                  {/* 右側 - 十神特質 */}
                  <div className="p-4 bg-white rounded-xl">
                    <h4 className="font-bold text-slate-800 mb-3">
                      <GlossaryTerm term={tenGod}>{tenGod}</GlossaryTerm> · {tenGodDesc.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {tenGodDesc.personality.slice(0, 120)}...
                    </p>

                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-500">這步大運宜：</h5>
                      <ul className="grid grid-cols-2 gap-2">
                        {tenGodDesc.strengths.slice(0, 4).map((s, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                            <span className="text-emerald-500">✓</span>
                            {s.slice(0, 12)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <span className="font-bold">💡 建議：</span>
                        {tenGodDesc.advice}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </section>
      )}

      <CloudDivider />

      {/* 2. 大運走勢 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            2
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">十年大運一覽</h2>
            <p className="text-sm text-slate-500">
              共 {analysis.luckPillars.length} 步<GlossaryTerm term="大運">大運</GlossaryTerm>，每步十年
            </p>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm font-medium rounded-full">
            第 {currentDaYunIndex + 1} 步
          </span>
        </div>

        {/* 視覺化時間軸 */}
        <div className="mb-6 relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 rounded-full -translate-y-1/2" />
          <div
            className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full -translate-y-1/2"
            style={{ width: `${((currentDaYunIndex + 1) / analysis.luckPillars.length) * 100}%` }}
          />
          <div className="relative flex justify-between px-2">
            {analysis.luckPillars.slice(0, 8).map((_, idx) => {
              const isCurrent = idx === currentDaYunIndex;
              const isPast = idx < currentDaYunIndex;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 ${
                    isCurrent
                      ? 'bg-blue-500 border-blue-500 ring-4 ring-blue-200'
                      : isPast
                      ? 'bg-blue-400 border-blue-400'
                      : 'bg-white border-slate-300'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {visibleLuckPillars.map((pillar, index) => {
            const isCurrent = index === currentDaYunIndex;
            const isPast = currentAge > pillar.ageEnd;
            const gan = pillar.ganZhi[0];
            const zhi = pillar.ganZhi[1];
            const ganElement = TIAN_GAN_ELEMENT[gan as keyof typeof TIAN_GAN_ELEMENT] as WuXing;
            const zhiElement = DI_ZHI_ELEMENT[zhi as keyof typeof DI_ZHI_ELEMENT] as WuXing;
            const tenGod = getTenGod(analysis.chart.day.gan, gan as any);
            const score = calculateScore(pillar.ganZhi);
            const theme = DAYUN_THEMES[tenGod];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-3 rounded-xl text-center ${
                  isCurrent
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                    : isPast
                    ? 'bg-slate-100 opacity-60'
                    : 'bg-white border border-slate-100 hover:shadow-md transition-shadow'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-400 text-amber-900 text-[8px] font-bold rounded-full">
                    當前
                  </div>
                )}
                <div className="flex justify-center gap-0.5 mb-1">
                  <span className={`text-xl font-serif font-bold ${isCurrent ? 'text-white' : ''}`}
                    style={!isCurrent ? { color: WUXING_COLOR[ganElement] } : undefined}
                  >
                    {gan}
                  </span>
                  <span className={`text-xl font-serif font-bold ${isCurrent ? 'text-white' : ''}`}
                    style={!isCurrent ? { color: WUXING_COLOR[zhiElement] } : undefined}
                  >
                    {zhi}
                  </span>
                </div>
                <div className={`text-[10px] ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                  {pillar.ageStart}-{pillar.ageEnd}歲
                </div>
                <div className={`text-[10px] mt-1 ${isCurrent ? 'text-blue-100' : 'text-slate-500'}`}>
                  <GlossaryTerm term={tenGod}>{tenGod}</GlossaryTerm>
                </div>
                <div className={`text-[8px] mt-0.5 ${isCurrent ? 'text-blue-200' : 'text-slate-400'}`}>
                  {theme.theme.slice(0, 4)}
                </div>
                <div className={`h-1.5 rounded-full mt-2 ${isCurrent ? 'bg-white/30' : 'bg-slate-100'}`}>
                  <div
                    className={`h-full rounded-full ${
                      score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    } ${isCurrent ? '!bg-white' : ''}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <div className={`text-[10px] mt-1 ${isCurrent ? 'text-blue-100' : 'text-slate-500'}`}>
                  {score}分
                </div>
              </motion.div>
            );
          })}
        </div>

        {analysis.luckPillars.length > 6 && (
          <button
            onClick={() => setShowAllLuckPillars(!showAllLuckPillars)}
            className="mt-4 w-full py-2 text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1"
          >
            {showAllLuckPillars ? (
              <>收起 <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>展開全部 {analysis.luckPillars.length} 步大運 <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        )}
      </section>

      <CloudDivider />

      {/* 3. 流月運勢 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
            3
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              {currentYear} 年<GlossaryTerm term="流月">流月</GlossaryTerm>運勢
            </h2>
            <p className="text-sm text-slate-500">
              當前第 {currentMonth} 月，年度整體評分 {avgScore} 分
            </p>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
            <span className="text-xs text-slate-400">年度平均</span>
            <div className="flex items-center gap-1">
              <span className={`text-2xl font-bold ${
                avgScore >= 65 ? 'text-emerald-500' : avgScore >= 45 ? 'text-amber-500' : 'text-rose-500'
              }`}>
                {avgScore}
              </span>
              <span className="text-xs text-slate-400">分</span>
            </div>
          </div>
        </div>

        {/* 流月卡片 */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {monthlyFortunes.map((fortune, index) => {
            const isCurrent = fortune.month === currentMonth;
            const isPast = fortune.month < currentMonth;
            const gan = fortune.ganZhi[0];
            const zhi = fortune.ganZhi[1];
            const ganElement = TIAN_GAN_ELEMENT[gan as keyof typeof TIAN_GAN_ELEMENT] as WuXing;
            const zhiElement = DI_ZHI_ELEMENT[zhi as keyof typeof DI_ZHI_ELEMENT] as WuXing;
            const isExpanded = expandedMonth === fortune.month;

            const getStatusIcon = (status: 'green' | 'yellow' | 'red') => {
              switch (status) {
                case 'green': return <TrendingUp className="w-3 h-3 text-emerald-500" />;
                case 'yellow': return <Minus className="w-3 h-3 text-amber-500" />;
                case 'red': return <TrendingDown className="w-3 h-3 text-rose-500" />;
              }
            };

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setExpandedMonth(isExpanded ? null : fortune.month)}
                className={`relative p-3 rounded-xl cursor-pointer transition-all ${
                  isExpanded ? 'col-span-2 sm:col-span-2' : ''
                } ${
                  isCurrent
                    ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                    : isPast
                    ? 'bg-slate-50 border border-slate-100 opacity-70'
                    : fortune.status === 'green'
                    ? 'bg-emerald-50 border border-emerald-100'
                    : fortune.status === 'yellow'
                    ? 'bg-amber-50 border border-amber-100'
                    : 'bg-rose-50 border border-rose-100'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-white text-green-600 text-[8px] font-bold rounded shadow">
                    本月
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-slate-700'}`}>
                    {fortune.title.replace('月', '')}月
                  </span>
                  {!isCurrent && getStatusIcon(fortune.status)}
                </div>

                <div className="flex gap-0.5 mb-2">
                  <span className={`text-lg font-serif font-bold ${isCurrent ? 'text-white' : ''}`}
                    style={!isCurrent ? { color: WUXING_COLOR[ganElement] } : undefined}
                  >
                    {gan}
                  </span>
                  <span className={`text-lg font-serif font-bold ${isCurrent ? 'text-white' : ''}`}
                    style={!isCurrent ? { color: WUXING_COLOR[zhiElement] } : undefined}
                  >
                    {zhi}
                  </span>
                </div>

                <div className={`h-1 rounded-full ${isCurrent ? 'bg-white/30' : 'bg-white/60'}`}>
                  <div
                    className={`h-full rounded-full ${
                      isCurrent ? 'bg-white' :
                      fortune.status === 'green' ? 'bg-emerald-500' :
                      fortune.status === 'yellow' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${fortune.score}%` }}
                  />
                </div>

                <div className={`text-[10px] mt-1 text-center ${isCurrent ? 'text-green-100' : 'text-slate-500'}`}>
                  {fortune.score}分
                </div>

                {/* 展開內容 */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-dashed border-slate-200"
                    >
                      <p className={`text-xs ${isCurrent ? 'text-green-100' : 'text-slate-600'}`}>
                        {fortune.status === 'green'
                          ? '本月運勢順遂，適合積極行動，把握機會拓展事業或人際關係。'
                          : fortune.status === 'yellow'
                          ? '本月運勢平穩，宜穩守不宜冒進，專注手上事務。'
                          : '本月需謹慎行事，避免大動作，低調處理事務為佳。'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CloudDivider />

      {/* 4. 運勢趨勢圖 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
            4
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">大運能量趨勢</h2>
            <p className="text-sm text-slate-500">一生運勢走向可視化</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="relative h-32">
            {/* 參考線 */}
            <div className="absolute left-0 right-0 top-1/4 h-px bg-emerald-100" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-200" />
            <div className="absolute left-0 right-0 top-3/4 h-px bg-rose-100" />
            <div className="absolute right-0 top-1/4 -translate-y-1/2 text-[10px] text-emerald-500">佳</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">中</div>
            <div className="absolute right-0 top-3/4 -translate-y-1/2 text-[10px] text-rose-500">弱</div>

            <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
              {/* 漸層區域 */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1, delay: 1 }}
                d={analysis.luckPillars
                  .map((pillar, i) => {
                    const score = calculateScore(pillar.ganZhi);
                    const x = (i / (analysis.luckPillars.length - 1)) * 780 + 10;
                    const y = 110 - (score / 100) * 100;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ') + ` L 790 110 L 10 110 Z`}
                fill="url(#areaGradient)"
              />

              {/* 主線 */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                d={analysis.luckPillars
                  .map((pillar, i) => {
                    const score = calculateScore(pillar.ganZhi);
                    const x = (i / (analysis.luckPillars.length - 1)) * 780 + 10;
                    const y = 110 - (score / 100) * 100;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="url(#fortuneGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <defs>
                <linearGradient id="fortuneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* 節點 */}
              {analysis.luckPillars.map((pillar, i) => {
                const score = calculateScore(pillar.ganZhi);
                const x = (i / (analysis.luckPillars.length - 1)) * 780 + 10;
                const y = 110 - (score / 100) * 100;
                const isCurrent = i === currentDaYunIndex;

                return (
                  <g key={i}>
                    {isCurrent && (
                      <motion.circle
                        initial={{ r: 0 }}
                        animate={{ r: 16 }}
                        cx={x}
                        cy={y}
                        fill="#3b82f6"
                        opacity="0.2"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isCurrent ? 8 : 5}
                      fill={isCurrent ? '#3b82f6' : score >= 60 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'}
                      stroke="white"
                      strokeWidth="2"
                    />
                    {/* 標籤 */}
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="text-[10px]"
                      fill={isCurrent ? '#3b82f6' : '#64748b'}
                      fontWeight={isCurrent ? 'bold' : 'normal'}
                    >
                      {pillar.ganZhi}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500" /> 當前大運
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> 運勢佳
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> 運勢中
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-rose-500" /> 需注意
            </span>
          </div>
        </motion.div>
      </section>

      {/* 運勢總結 */}
      <InsightCallout
        title="運勢分析總結"
        variant={avgScore >= 60 ? 'success' : avgScore >= 45 ? 'default' : 'warning'}
      >
        {currentDaYunIndex >= 0 && (() => {
          const pillar = analysis.luckPillars[currentDaYunIndex];
          const gan = pillar.ganZhi[0];
          const tenGod = getTenGod(analysis.chart.day.gan, gan as any);
          const theme = DAYUN_THEMES[tenGod];
          const score = calculateScore(pillar.ganZhi);

          return (
            <div className="space-y-3">
              <p className="leading-relaxed">
                當前正處於「<GlossaryTerm term={tenGod}>{tenGod}</GlossaryTerm>」主導的「{theme.theme}」，
                整體運勢評分 {score} 分。
                {score >= 70
                  ? '此運勢優良，宜積極進取，把握機遇開創新局。'
                  : score >= 50
                  ? '此運勢平穩，適合穩步發展，鞏固現有基礎。'
                  : '此運勢偏弱，建議韜光養晦，靜待轉機。'}
              </p>
              <p className="leading-relaxed">
                <span className="font-medium">未來展望：</span>
                {analysis.luckPillars[currentDaYunIndex + 1] && (
                  <>
                    下一步<GlossaryTerm term="大運">大運</GlossaryTerm>將進入
                    「{analysis.luckPillars[currentDaYunIndex + 1].ganZhi}」運，
                    運勢評分 {calculateScore(analysis.luckPillars[currentDaYunIndex + 1].ganZhi)} 分，
                    {calculateScore(analysis.luckPillars[currentDaYunIndex + 1].ganZhi) > score
                      ? '運勢將有所提升，可提前佈局。'
                      : '運勢可能轉弱，建議提前做好準備。'}
                  </>
                )}
              </p>
            </div>
          );
        })()}
      </InsightCallout>
    </div>
  );
}
