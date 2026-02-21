'use client';

import { motion } from 'framer-motion';
import type { BaZiAnalysis, ShiShen, WuXing } from '@/lib/bazi/types';
import { TEN_GOD_DESCRIPTIONS, WUXING_DESCRIPTIONS } from '@/data/copywriting';
import { WUXING_COLOR } from '@/data/constants';

interface AdvancedTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

// 十神宮位對照
const PALACE_POSITIONS = {
  年干: { palace: '外交宮', meaning: '社交圈、外在形象' },
  年支: { palace: '祖德宮', meaning: '祖先庇蔭、童年環境' },
  月干: { palace: '父母宮', meaning: '父母關係、事業發展' },
  月支: { palace: '兄弟宮', meaning: '兄弟朋友、合作夥伴' },
  日干: { palace: '命宮', meaning: '自我本質、核心性格' },
  日支: { palace: '配偶宮', meaning: '婚姻關係、內心世界' },
  時干: { palace: '子女宮', meaning: '子女緣分、晚年運勢' },
  時支: { palace: '田宅宮', meaning: '財產歸宿、安定感' },
};

// 做事風格分析
const ACTION_STYLES: Record<ShiShen, { style: string; description: string; tip: string }> = {
  比肩: {
    style: '獨立型',
    description: '習慣獨自完成任務，不喜歡依賴他人。做事有主見，但有時固執。',
    tip: '適時尋求合作，可以事半功倍。'
  },
  劫財: {
    style: '競爭型',
    description: '喜歡挑戰和競爭，行動力強。容易衝動決策，需要冷靜思考。',
    tip: '三思而後行，避免因衝動而損失。'
  },
  食神: {
    style: '創意型',
    description: '思維活躍，富有創意。做事享受過程，但有時缺乏效率。',
    tip: '設定明確目標和截止日期。'
  },
  傷官: {
    style: '突破型',
    description: '敢於挑戰傳統，追求創新。表達能力強，但容易得罪人。',
    tip: '學會圓融溝通，保持謙虛。'
  },
  偏財: {
    style: '機會型',
    description: '善於把握機會，頭腦靈活。但容易見異思遷，穩定性不足。',
    tip: '專注核心目標，避免分散精力。'
  },
  正財: {
    style: '穩健型',
    description: '做事踏實，步步為營。重視穩定和安全，但可能過於保守。',
    tip: '適度冒險，把握成長機會。'
  },
  七殺: {
    style: '強勢型',
    description: '魄力十足，敢於承擔。領導能力強，但可能過於專斷。',
    tip: '聽取不同意見，建立團隊信任。'
  },
  正官: {
    style: '規範型',
    description: '遵守規則，做事有條理。責任感強，但可能缺乏靈活性。',
    tip: '保持原則的同時，適度變通。'
  },
  偏印: {
    style: '獨特型',
    description: '思維獨特，見解不凡。喜歡深入研究，但可能孤僻。',
    tip: '主動與人交流，分享想法。'
  },
  正印: {
    style: '學習型',
    description: '善於學習，吸收能力強。有耐心，但可能過於被動。',
    tip: '主動出擊，把知識轉化為行動。'
  },
};

export default function AdvancedTab({ analysis }: AdvancedTabProps) {
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

  // 找出主導十神
  const sortedTenGods = Object.entries(tenGodCounts)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  const dominantGod = sortedTenGods[0]?.[0] as ShiShen || '比肩';
  const actionStyle = ACTION_STYLES[dominantGod];

  // 十神宮位分析
  const palaceAnalysis = [
    { pos: '年干', stem: analysis.chart.year.gan, shiShen: analysis.chart.year.ganShiShen },
    { pos: '年支', stem: analysis.chart.year.zhi, element: analysis.chart.year.zhiElement },
    { pos: '月干', stem: analysis.chart.month.gan, shiShen: analysis.chart.month.ganShiShen },
    { pos: '月支', stem: analysis.chart.month.zhi, element: analysis.chart.month.zhiElement },
    { pos: '日干', stem: analysis.chart.day.gan, element: analysis.chart.day.ganElement },
    { pos: '日支', stem: analysis.chart.day.zhi, element: analysis.chart.day.zhiElement },
    { pos: '時干', stem: analysis.chart.hour.gan, shiShen: analysis.chart.hour.ganShiShen },
    { pos: '時支', stem: analysis.chart.hour.zhi, element: analysis.chart.hour.zhiElement },
  ];

  return (
    <div className="space-y-8">
      {/* 做事風格 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">做事風格分析</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl border border-purple-100"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* 主導風格 */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center text-white shadow-lg shadow-purple-200">
                <span className="text-4xl sm:text-5xl font-bold mb-1">{dominantGod}</span>
                <span className="text-sm opacity-80">主導十神</span>
              </div>
            </div>

            {/* 風格描述 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-purple-500 text-white font-bold rounded-full text-lg">
                  {actionStyle.style}
                </span>
                <span className="text-slate-500 text-sm">
                  {TEN_GOD_DESCRIPTIONS[dominantGod].title}
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed mb-4">
                {actionStyle.description}
              </p>

              <div className="p-4 bg-white/60 rounded-xl">
                <h4 className="text-sm font-bold text-purple-600 mb-2">建議</h4>
                <p className="text-sm text-slate-600">{actionStyle.tip}</p>
              </div>

              {/* 十神關鍵詞 */}
              <div className="flex flex-wrap gap-2 mt-4">
                {TEN_GOD_DESCRIPTIONS[dominantGod].keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white text-purple-600 text-sm font-medium rounded-full shadow-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 十神分布 */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-4">十神能量分布</h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {sortedTenGods.map(([god, count], index) => {
            const desc = TEN_GOD_DESCRIPTIONS[god as ShiShen];
            const isTop = index < 3;

            return (
              <motion.div
                key={god}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl text-center ${
                  isTop
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200'
                    : 'bg-white border border-slate-100'
                }`}
              >
                <div className={`text-2xl font-bold mb-1 ${isTop ? 'text-amber-600' : 'text-slate-600'}`}>
                  {god}
                </div>
                <div className="text-sm text-slate-500 mb-2">
                  {(count as number).toFixed(1)} 分
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((count as number) * 25, 100)}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full ${isTop ? 'bg-amber-400' : 'bg-slate-300'}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 十神宮位精準分析 */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-4">十神宮位精準分析</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {palaceAnalysis.map((item, index) => {
            const palace = PALACE_POSITIONS[item.pos as keyof typeof PALACE_POSITIONS];
            const element = item.element as WuXing | undefined;

            return (
              <motion.div
                key={item.pos}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  item.pos === '日干'
                    ? 'bg-gradient-to-br from-amber-100 to-orange-100 ring-2 ring-amber-300'
                    : 'bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">{item.pos}</span>
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      backgroundColor: element
                        ? WUXING_COLOR[element]
                        : item.shiShen
                        ? '#8b5cf6'
                        : '#94a3b8',
                    }}
                  >
                    {item.stem}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-800 mb-1">
                  {palace.palace}
                </div>
                <div className="text-xs text-slate-500 mb-2">
                  {palace.meaning}
                </div>

                {item.shiShen && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-medium text-purple-600">
                      {item.shiShen}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      {TEN_GOD_DESCRIPTIONS[item.shiShen].title}
                    </span>
                  </div>
                )}

                {element && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span
                      className="text-xs font-medium"
                      style={{ color: WUXING_COLOR[element] }}
                    >
                      {element}行
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      {WUXING_DESCRIPTIONS[element].season}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 格局詳解 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl text-white"
      >
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-3xl font-bold">{analysis.pattern.name.slice(0, 2)}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">
              {analysis.pattern.name}
              <span className="ml-3 text-sm font-normal text-indigo-300">
                {analysis.pattern.type} · {analysis.pattern.status}
              </span>
            </h3>
            <p className="text-indigo-200 leading-relaxed">
              {analysis.pattern.description}
            </p>
            {analysis.pattern.keyGod && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                <span className="text-sm text-indigo-300">用神</span>
                <span className="font-bold">{analysis.pattern.keyGod}</span>
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
