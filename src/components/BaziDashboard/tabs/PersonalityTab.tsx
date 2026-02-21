'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BaZiAnalysis, ShiShen, WuXing } from '@/lib/bazi/types';
import { TEN_GOD_DESCRIPTIONS, WUXING_DESCRIPTIONS } from '@/data/copywriting';
import { WUXING_COLOR } from '@/data/constants';
import { GlossaryTerm } from '@/components/ui/Tooltip';
import { InsightCallout, CloudDivider } from '@/components/ui/EasternDecor';
import { ChevronDown, ChevronUp, User, Heart, Sparkles } from 'lucide-react';

interface PersonalityTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

// 十神宮位對照 - 按年月日時順序排列
const PALACE_POSITIONS = {
  年干: { palace: '外交宮', meaning: '社交圈、外在形象、對外表現', period: '童年', icon: '🌐' },
  年支: { palace: '祖德宮', meaning: '祖先庇蔭、成長環境、家族影響', period: '0-16歲', icon: '🏠' },
  月干: { palace: '父母宮', meaning: '父母關係、事業發展、社會地位', period: '青年', icon: '👔' },
  月支: { palace: '兄弟宮', meaning: '兄弟朋友、合作夥伴、同儕關係', period: '17-32歲', icon: '🤝' },
  日干: { palace: '命宮', meaning: '自我本質、核心性格、生命主軸', period: '中年', icon: '⭐' },
  日支: { palace: '配偶宮', meaning: '婚姻關係、內心世界、親密感情', period: '33-48歲', icon: '💑' },
  時干: { palace: '子女宮', meaning: '子女緣分、晚年運勢、事業成果', period: '晚年', icon: '👶' },
  時支: { palace: '田宅宮', meaning: '財產歸宿、安定感、最終成就', period: '49歲後', icon: '🏡' },
};

// 做事風格分析
const ACTION_STYLES: Record<ShiShen, { style: string; emoji: string; description: string; strengths: string[]; weaknesses: string[]; tip: string }> = {
  比肩: {
    style: '獨立自主型',
    emoji: '🦁',
    description: '習慣獨自完成任務，不喜歡依賴他人。做事有主見，堅持自己的想法和做法。',
    strengths: ['獨立性強', '自信堅定', '不輕易妥協'],
    weaknesses: ['過於固執', '難以合作', '聽不進建議'],
    tip: '適時尋求合作，開放心胸接納不同意見，可以事半功倍。',
  },
  劫財: {
    style: '競爭挑戰型',
    emoji: '🔥',
    description: '喜歡挑戰和競爭，行動力極強。面對困難時勇往直前，但容易衝動決策。',
    strengths: ['行動力強', '敢於挑戰', '不畏困難'],
    weaknesses: ['衝動決策', '爭強好勝', '不夠穩重'],
    tip: '三思而後行，避免因衝動而損失。學會策略性退讓。',
  },
  食神: {
    style: '創意享樂型',
    emoji: '🎨',
    description: '思維活躍，富有創意。做事享受過程勝過結果，追求生活品質和精神滿足。',
    strengths: ['創意豐富', '樂觀開朗', '享受生活'],
    weaknesses: ['缺乏效率', '容易散漫', '不夠務實'],
    tip: '設定明確目標和截止日期，把創意轉化為實際成果。',
  },
  傷官: {
    style: '創新突破型',
    emoji: '💡',
    description: '敢於挑戰傳統，追求創新突破。表達能力強，見解獨到，但言語容易得罪人。',
    strengths: ['創新能力', '表達力強', '見解獨到'],
    weaknesses: ['口無遮攔', '不夠圓融', '容易樹敵'],
    tip: '學會圓融溝通，保持謙虛態度。表達時注意場合和措辭。',
  },
  偏財: {
    style: '機會靈活型',
    emoji: '🎯',
    description: '善於把握機會，頭腦靈活，交際能力出眾。但容易見異思遷，穩定性不足。',
    strengths: ['眼光敏銳', '人脈廣泛', '靈活變通'],
    weaknesses: ['三心二意', '不夠專注', '穩定性差'],
    tip: '專注核心目標，避免分散精力。深耕一個領域再拓展。',
  },
  正財: {
    style: '穩健踏實型',
    emoji: '🏦',
    description: '做事踏實，步步為營。重視穩定和安全，凡事追求實際效益。',
    strengths: ['踏實穩重', '財務觀念', '注重實效'],
    weaknesses: ['過於保守', '缺乏冒險', '靈活性差'],
    tip: '適度冒險，把握成長機會。不要因為求穩而錯失良機。',
  },
  七殺: {
    style: '強勢領導型',
    emoji: '⚔️',
    description: '魄力十足，敢於承擔重任。領導能力強，能在壓力下保持冷靜和決斷。',
    strengths: ['領導魄力', '抗壓性強', '決斷力佳'],
    weaknesses: ['過於專斷', '不夠柔軟', '壓迫感強'],
    tip: '聽取不同意見，建立團隊信任。剛柔並濟才能走得更遠。',
  },
  正官: {
    style: '規範守則型',
    emoji: '📋',
    description: '遵守規則，做事有條理。責任感強，重視榮譽和名聲。',
    strengths: ['守規矩', '責任感強', '做事有條理'],
    weaknesses: ['缺乏靈活', '過於拘謹', '創新不足'],
    tip: '保持原則的同時，適度變通。規則是底線不是天花板。',
  },
  偏印: {
    style: '獨特深思型',
    emoji: '🔮',
    description: '思維獨特，見解不凡。喜歡深入研究，對特殊領域有獨到的理解和造詣。',
    strengths: ['思維獨特', '研究深入', '專業能力'],
    weaknesses: ['過於孤僻', '難以溝通', '不夠實際'],
    tip: '主動與人交流，分享你的想法。把專業轉化為實際價值。',
  },
  正印: {
    style: '學習成長型',
    emoji: '📚',
    description: '善於學習，吸收能力強。有耐心，懂得積累，重視知識和修養。',
    strengths: ['學習力強', '有耐心', '修養好'],
    weaknesses: ['過於被動', '行動力弱', '依賴他人'],
    tip: '主動出擊，把知識轉化為行動。學以致用才能發揮價值。',
  },
};

// 十神類型分組
const TEN_GOD_CATEGORIES = {
  '自我力量': ['比肩', '劫財'],
  '才華表現': ['食神', '傷官'],
  '財富獲取': ['偏財', '正財'],
  '權力壓力': ['七殺', '正官'],
  '智慧支持': ['偏印', '正印'],
};

export default function PersonalityTab({ analysis }: PersonalityTabProps) {
  const [expandedPalace, setExpandedPalace] = useState<string | null>(null);

  const monthPillar = analysis.chart.month;
  const monthGanDesc = TEN_GOD_DESCRIPTIONS[monthPillar.ganShiShen || '比肩'];
  const monthZhiElement = monthPillar.zhiElement;

  // 計算十神分布
  const tenGodCounts: Record<ShiShen, number> = {
    比肩: 0, 劫財: 0, 食神: 0, 傷官: 0, 偏財: 0,
    正財: 0, 七殺: 0, 正官: 0, 偏印: 0, 正印: 0,
  };

  // 統計天干十神
  const pillars = [analysis.chart.year, analysis.chart.month, analysis.chart.hour];
  for (const pillar of pillars) {
    if (pillar.ganShiShen) {
      tenGodCounts[pillar.ganShiShen]++;
    }
  }

  // 統計地支藏干十神
  const allPillars = [analysis.chart.year, analysis.chart.month, analysis.chart.day, analysis.chart.hour];
  for (const pillar of allPillars) {
    for (const hidden of pillar.hiddenStems) {
      if (hidden.shiShen) {
        tenGodCounts[hidden.shiShen] += hidden.weight;
      }
    }
  }

  // 找出主導十神（前三名）
  const sortedTenGods = Object.entries(tenGodCounts)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  const dominantGod = sortedTenGods[0]?.[0] as ShiShen || '比肩';
  const secondGod = sortedTenGods[1]?.[0] as ShiShen;
  const thirdGod = sortedTenGods[2]?.[0] as ShiShen;
  const actionStyle = ACTION_STYLES[dominantGod];

  // 計算類型分布（用於雷達顯示）
  const categoryScores = Object.entries(TEN_GOD_CATEGORIES).map(([category, gods]) => {
    const score = gods.reduce((sum, god) => sum + (tenGodCounts[god as ShiShen] || 0), 0);
    return { category, score, percentage: Math.round((score / 8) * 100) };
  });

  // 十神宮位分析 - 按年→月→日→時順序
  const palaceAnalysis = [
    { pos: '年干', stem: analysis.chart.year.gan, shiShen: analysis.chart.year.ganShiShen, element: analysis.chart.year.ganElement },
    { pos: '年支', stem: analysis.chart.year.zhi, element: analysis.chart.year.zhiElement },
    { pos: '月干', stem: analysis.chart.month.gan, shiShen: analysis.chart.month.ganShiShen, element: analysis.chart.month.ganElement },
    { pos: '月支', stem: analysis.chart.month.zhi, element: analysis.chart.month.zhiElement },
    { pos: '日干', stem: analysis.chart.day.gan, element: analysis.chart.day.ganElement, isDay: true },
    { pos: '日支', stem: analysis.chart.day.zhi, element: analysis.chart.day.zhiElement },
    { pos: '時干', stem: analysis.chart.hour.gan, shiShen: analysis.chart.hour.ganShiShen, element: analysis.chart.hour.ganElement },
    { pos: '時支', stem: analysis.chart.hour.zhi, element: analysis.chart.hour.zhiElement },
  ];

  return (
    <div className="space-y-8">
      {/* 第一區塊：月柱分析 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold shadow-lg">
            1
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">月柱分析</h2>
            <p className="text-sm text-slate-500">表象（天干）與內在（地支）的對比</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 天干 - 表象 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: WUXING_COLOR[monthPillar.ganElement] }}
              >
                <span className="text-white font-bold text-2xl font-serif">{monthPillar.gan}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">外在表現</span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg">
                  月干：<GlossaryTerm term={monthPillar.ganShiShen || '比肩'}>{monthPillar.ganShiShen || '比肩'}</GlossaryTerm>
                </h4>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-4">
              {monthGanDesc.personality}
            </p>

            <div className="p-3 bg-white/60 rounded-xl mb-4">
              <p className="text-sm text-purple-700">
                <span className="font-bold">他人眼中的你：</span>
                給人「{monthGanDesc.keywords[0]}」的第一印象，在社交場合展現出{monthGanDesc.keywords[1] || monthGanDesc.keywords[0]}的特質。
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {monthGanDesc.keywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 bg-white/70 text-sm text-purple-600 rounded-full font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 地支 - 內在 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: WUXING_COLOR[monthZhiElement] }}
              >
                <span className="text-white font-bold text-2xl font-serif">{monthPillar.zhi}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">內在本質</span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg">
                  月支：<GlossaryTerm term={monthZhiElement}>{monthZhiElement}</GlossaryTerm>氣
                </h4>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-4">
              月支為{monthPillar.zhi}，屬{monthZhiElement}。
              {WUXING_DESCRIPTIONS[monthZhiElement].personality}
            </p>

            <div className="p-3 bg-white/60 rounded-xl mb-4">
              <p className="text-sm text-blue-700">
                <span className="font-bold">真實的你：</span>
                內心深處追求{monthZhiElement}行所代表的價值——{WUXING_DESCRIPTIONS[monthZhiElement].strengths[0]}，
                這是驅動你行動的根本力量。
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {monthPillar.hiddenStems.map((stem, i) => (
                <div key={i} className="px-3 py-1.5 bg-white/70 rounded-lg text-sm">
                  <span className="font-bold" style={{ color: WUXING_COLOR[monthZhiElement] }}>
                    {stem.gan}
                  </span>
                  <span className="text-slate-400 ml-1.5">
                    <GlossaryTerm term={stem.shiShen || ''}>{stem.shiShen}</GlossaryTerm>
                    <span className="ml-1">{Math.round(stem.weight * 100)}%</span>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 表裡一致度分析 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <InsightCallout
            title="表裡對照分析"
            variant="fortune"
            icon="🎭"
          >
            <p>
              月干「{monthPillar.ganShiShen || '比肩'}」代表你對外展現的形象，
              月支「{monthZhiElement}」則是內心真實的驅動力。
              {monthPillar.ganElement === monthZhiElement ? (
                <span className="text-emerald-700 font-medium">
                  兩者五行相同，表裡一致，言行合一，容易獲得他人信任。
                </span>
              ) : (
                <span>
                  兩者五行不同，代表外在表現和內在動機有差異，
                  這種差異可以是「深藏不露」的優勢，也需要注意內外協調。
                </span>
              )}
            </p>
          </InsightCallout>
        </motion.div>
      </section>

      <CloudDivider />

      {/* 第二區塊：做事風格 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-lg">
            2
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">做事風格</h2>
            <p className="text-sm text-slate-500">基於主導十神的行為模式分析</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-2xl border border-amber-100"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 主導風格展示 */}
            <div className="flex-shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex flex-col items-center justify-center text-white shadow-lg shadow-amber-200 relative overflow-hidden">
                <span className="text-5xl mb-2">{actionStyle.emoji}</span>
                <span className="text-2xl font-bold">{dominantGod}</span>
                <span className="text-xs opacity-80 mt-1">主導十神</span>

                {/* 排名標籤 */}
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/20 rounded-full text-[10px]">
                  #1
                </div>
              </div>

              {/* 次要十神 */}
              {secondGod && (
                <div className="flex gap-2 mt-3">
                  <div className="flex-1 p-2 bg-white rounded-lg text-center">
                    <span className="text-lg">{ACTION_STYLES[secondGod].emoji}</span>
                    <div className="text-xs font-medium text-slate-600">{secondGod}</div>
                    <div className="text-[10px] text-slate-400">#2</div>
                  </div>
                  {thirdGod && (
                    <div className="flex-1 p-2 bg-white rounded-lg text-center">
                      <span className="text-lg">{ACTION_STYLES[thirdGod].emoji}</span>
                      <div className="text-xs font-medium text-slate-600">{thirdGod}</div>
                      <div className="text-[10px] text-slate-400">#3</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 風格描述 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-amber-500 text-white font-bold rounded-full text-lg">
                  {actionStyle.style}
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed mb-4">
                {actionStyle.description}
              </p>

              {/* 優劣勢分析 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1">
                    <span>✓</span> 優勢特質
                  </h4>
                  <ul className="space-y-1">
                    {actionStyle.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-slate-600">• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <h4 className="text-xs font-bold text-rose-700 mb-2 flex items-center gap-1">
                    <span>!</span> 需注意
                  </h4>
                  <ul className="space-y-1">
                    {actionStyle.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-slate-600">• {w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-white/60 rounded-xl">
                <h4 className="text-sm font-bold text-amber-600 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  改善建議
                </h4>
                <p className="text-sm text-slate-600">{actionStyle.tip}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <CloudDivider />

      {/* 第三區塊：十神能量分布 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold shadow-lg">
            3
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">十神能量分布</h2>
            <p className="text-sm text-slate-500">各類十神在命盤中的強弱</p>
          </div>
        </div>

        {/* 類型分布 */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {categoryScores.map((cat, index) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-white rounded-xl border border-slate-100 text-center"
            >
              <div className="text-xs text-slate-500 mb-1">{cat.category}</div>
              <div className="text-xl font-bold text-violet-600">{cat.score.toFixed(1)}</div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 詳細十神分布 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {sortedTenGods.map(([god, count], index) => {
            const isTop3 = index < 3;
            const godKey = god as ShiShen;

            return (
              <motion.div
                key={god}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl text-center cursor-pointer transition-all hover:shadow-md ${
                  isTop3
                    ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200'
                    : 'bg-white border border-slate-100'
                }`}
              >
                <div className="text-2xl mb-1">{ACTION_STYLES[godKey].emoji}</div>
                <div className={`text-lg font-bold mb-1 ${isTop3 ? 'text-violet-600' : 'text-slate-600'}`}>
                  <GlossaryTerm term={god}>{god}</GlossaryTerm>
                </div>
                <div className="text-xs text-slate-500 mb-2">
                  {(count as number).toFixed(1)} 能量
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((count as number) * 25, 100)}%` }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                    className={`h-full rounded-full ${isTop3 ? 'bg-violet-500' : 'bg-slate-300'}`}
                  />
                </div>
                {isTop3 && (
                  <div className="mt-2 text-[10px] text-violet-500 font-medium">
                    TOP {index + 1}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      <CloudDivider />

      {/* 第四區塊：宮位分析 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white font-bold shadow-lg">
            4
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">八宮十神分析</h2>
            <p className="text-sm text-slate-500">年 → 月 → 日 → 時，人生各階段的重點</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {palaceAnalysis.map((item, index) => {
            const palace = PALACE_POSITIONS[item.pos as keyof typeof PALACE_POSITIONS];
            const element = item.element as WuXing;
            const isExpanded = expandedPalace === item.pos;

            return (
              <motion.div
                key={item.pos}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setExpandedPalace(isExpanded ? null : item.pos)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  item.isDay
                    ? 'bg-gradient-to-br from-amber-100 to-orange-100 ring-2 ring-amber-300'
                    : 'bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl">{palace.icon}</span>
                  </div>
                  <span
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg font-serif shadow"
                    style={{
                      backgroundColor: element ? WUXING_COLOR[element] : '#94a3b8',
                    }}
                  >
                    {item.stem}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-400">{item.pos}</span>
                  <span className="text-[10px] text-slate-300">·</span>
                  <span className="text-[10px] text-slate-400">{palace.period}</span>
                </div>

                <div className="text-sm font-bold text-slate-800 mb-1">
                  {palace.palace}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 mt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">{palace.meaning}</p>
                        {item.shiShen && (
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <span className="text-xs font-bold text-indigo-600">
                              <GlossaryTerm term={item.shiShen}>{item.shiShen}</GlossaryTerm>
                            </span>
                            <p className="text-[10px] text-indigo-500 mt-1">
                              {TEN_GOD_DESCRIPTIONS[item.shiShen].title}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-center mt-2 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 人生時間軸 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-400" />
              <span className="text-xs text-slate-600">年柱 0-16歲</span>
            </div>
            <div className="flex-1 h-0.5 mx-2 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-xs text-slate-600">月柱 17-32歲</span>
            </div>
            <div className="flex-1 h-0.5 mx-2 bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-xs text-slate-600">日柱 33-48歲</span>
            </div>
            <div className="flex-1 h-0.5 mx-2 bg-gradient-to-r from-orange-200 to-rose-200" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="text-xs text-slate-600">時柱 49歲後</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
