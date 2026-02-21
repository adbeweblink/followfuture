'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BaZiAnalysis, ShiShen } from '@/lib/bazi/types';
import { WUXING_COLOR } from '@/data/constants';
import { Link2, Unlink, AlertTriangle, CheckCircle, Circle, ArrowRight, ChevronDown, ChevronUp, Sparkles, Heart, Users, Baby, Crown } from 'lucide-react';
import { GlossaryTerm, CloudDivider, InsightCallout } from '@/components/ui';

interface RelationsTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

// 六親對照 - 增強版
const LIUQIN_MAP: Record<ShiShen, {
  name: string;
  relation: string;
  description: string;
  icon: string;
  advice: string;
  impact: 'high' | 'medium' | 'low';
}> = {
  '比肩': {
    name: '兄弟姐妹',
    relation: '同輩',
    description: '與日主同性同五行的天干，代表兄弟姐妹、朋友、同事等平輩關係。性格上表現為獨立、自信、競爭意識強。',
    icon: '👥',
    advice: '宜發展合作關係，但需避免利益衝突',
    impact: 'medium'
  },
  '劫財': {
    name: '競爭者',
    relation: '同輩',
    description: '與日主異性同五行的天干，代表競爭者、合作者。性格上表現為積極、冒險、善於交際，但也可能衝動。',
    icon: '⚡',
    advice: '保持謹慎，防止錢財外流或被奪',
    impact: 'medium'
  },
  '食神': {
    name: '子女/才華',
    relation: '晚輩',
    description: '日主所生的同性天干，代表才華、口福、子女（女命）。性格上表現為溫和、樂觀、有藝術天賦、享受生活。',
    icon: '🌟',
    advice: '適合發展創意事業，享受生活樂趣',
    impact: 'high'
  },
  '傷官': {
    name: '子女/創意',
    relation: '晚輩',
    description: '日主所生的異性天干，代表創意、表達、叛逆。性格上表現為聰明、創新、口才好，但可能過於自負。',
    icon: '💡',
    advice: '善用創意但需收斂鋒芒，避免口舌是非',
    impact: 'high'
  },
  '偏財': {
    name: '父親/偏財',
    relation: '長輩',
    description: '日主所剋的異性天干，代表意外之財、父親、情人。性格上表現為慷慨、交際廣、善於把握機會。',
    icon: '💰',
    advice: '把握投資機會，但需控制風險',
    impact: 'high'
  },
  '正財': {
    name: '妻子/正財',
    relation: '配偶',
    description: '日主所剋的同性天干，代表正當收入、妻子（男命）。性格上表現為務實、節儉、重視家庭。',
    icon: '💎',
    advice: '專注穩定收入，經營好家庭關係',
    impact: 'high'
  },
  '七殺': {
    name: '情人/壓力',
    relation: '權威',
    description: '剋日主的異性天干，代表壓力、競爭、權威。性格上表現為果斷、有魄力、領導力強，但也可能過於強勢。',
    icon: '⚔️',
    advice: '化壓力為動力，培養抗壓能力',
    impact: 'high'
  },
  '正官': {
    name: '丈夫/上司',
    relation: '權威',
    description: '剋日主的同性天干，代表規矩、上司、丈夫（女命）。性格上表現為正直、守規矩、有責任感。',
    icon: '👔',
    advice: '尊重權威，發展正當事業',
    impact: 'high'
  },
  '偏印': {
    name: '繼母/偏門',
    relation: '長輩',
    description: '生日主的異性天干，代表偏門學問、繼母。性格上表現為獨特思維、興趣廣泛，但可能孤僻。',
    icon: '📚',
    advice: '適合研究特殊領域，但需防鑽牛角尖',
    impact: 'medium'
  },
  '正印': {
    name: '母親/貴人',
    relation: '長輩',
    description: '生日主的同性天干，代表母親、貴人、學業。性格上表現為仁慈、有學識、受人尊重。',
    icon: '🎓',
    advice: '善用貴人運，發展學業或學術',
    impact: 'high'
  },
};

// 地支關係類型說明 - 增強版
const RELATION_INFO: Record<string, {
  emoji: string;
  nature: 'positive' | 'negative' | 'neutral';
  description: string;
  impact: string;
}> = {
  六合: {
    emoji: '💞',
    nature: 'positive',
    description: '子丑合、寅亥合、卯戌合、辰酉合、巳申合、午未合。六合為最吉的關係，代表和諧、融洽、貴人相助。合化後力量增強。',
    impact: '最佳吉象，貴人運強，諸事順遂'
  },
  三合: {
    emoji: '🔗',
    nature: 'positive',
    description: '申子辰合水、亥卯未合木、寅午戌合火、巳酉丑合金。三合為大吉，三方力量匯聚，主大事可成。',
    impact: '大吉之象，主大事可成，團隊合作有成'
  },
  半合: {
    emoji: '⚡',
    nature: 'positive',
    description: '三合局的兩個地支。力量雖不如三合完整，但仍有合化傾向，屬於吉象。',
    impact: '中吉之象，有助力但力量稍弱'
  },
  三會: {
    emoji: '🌊',
    nature: 'positive',
    description: '寅卯辰會木、巳午未會火、申酉戌會金、亥子丑會水。三會為方局，同方向的地支匯聚，力量強大。',
    impact: '力量強大，該五行特質明顯增強'
  },
  暗合: {
    emoji: '🌙',
    nature: 'positive',
    description: '地支藏干之間的天干五合關係。表面不顯，暗中有助力或牽連。',
    impact: '暗中助力，貴人相助於無形'
  },
  六沖: {
    emoji: '💥',
    nature: 'negative',
    description: '子午沖、丑未沖、寅申沖、卯酉沖、辰戌沖、巳亥沖。六沖為正面衝突，主變動、分離、動盪。但有時也代表突破。',
    impact: '變動之象，需注意衝突與分離'
  },
  三刑: {
    emoji: '⚔️',
    nature: 'negative',
    description: '寅巳申三刑、丑戌未三刑、子卯刑。三刑主是非、官司、疾病、意外。需特別注意對應的流年。',
    impact: '是非之象，需防官司、意外、疾病'
  },
  自刑: {
    emoji: '🔄',
    nature: 'negative',
    description: '辰辰自刑、午午自刑、酉酉自刑、亥亥自刑。自刑為自我傷害，主內心矛盾、自我懲罰。',
    impact: '內耗之象，需注意心理健康'
  },
  六害: {
    emoji: '😞',
    nature: 'negative',
    description: '子未害、丑午害、寅巳害、卯辰害、申亥害、酉戌害。六害為暗中傷害，主小人、阻礙、不順。',
    impact: '暗害之象，需防小人與阻礙'
  },
};

// 四柱關係連線圖
function RelationshipDiagram({ analysis, relations }: {
  analysis: BaZiAnalysis;
  relations: BaZiAnalysis['branchRelations']
}) {
  // 傳統排列：年月日時從右到左
  const pillars = [
    { label: '時柱', zhi: analysis.chart.hour.zhi },
    { label: '日柱', zhi: analysis.chart.day.zhi },
    { label: '月柱', zhi: analysis.chart.month.zhi },
    { label: '年柱', zhi: analysis.chart.year.zhi },
  ];

  // 計算連線
  const getConnections = () => {
    const connections: Array<{
      from: number;
      to: number;
      type: string;
      nature: 'positive' | 'negative';
    }> = [];

    relations.forEach(rel => {
      const indices: number[] = [];
      rel.positions.forEach(pos => {
        // 對應新的順序：時(0)、日(1)、月(2)、年(3)
        if (pos === '時') indices.push(0);
        if (pos === '日') indices.push(1);
        if (pos === '月') indices.push(2);
        if (pos === '年') indices.push(3);
      });

      if (indices.length >= 2) {
        for (let i = 0; i < indices.length - 1; i++) {
          connections.push({
            from: indices[i],
            to: indices[i + 1],
            type: rel.type,
            nature: RELATION_INFO[rel.type]?.nature === 'negative' ? 'negative' : 'positive'
          });
        }
      }
    });

    return connections;
  };

  const connections = getConnections();

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-32 h-32 bg-violet-500 rounded-full blur-3xl" />
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-amber-500 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* 四柱顯示 */}
        <div className="flex justify-between items-center mb-8">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-xs text-slate-500 mb-2">{pillar.label}</div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="w-14 h-14 rounded-xl bg-white shadow-lg border-2 border-slate-200 flex items-center justify-center"
              >
                <span className="text-2xl font-bold text-slate-800">{pillar.zhi}</span>
              </motion.div>
            </div>
          ))}
        </div>

        {/* SVG 連線 */}
        <svg className="absolute top-16 left-0 w-full h-16 pointer-events-none" style={{ top: '4.5rem' }}>
          {connections.map((conn, idx) => {
            const startX = (conn.from * 33.33) + 16.67;
            const endX = (conn.to * 33.33) + 16.67;
            const curveHeight = Math.abs(conn.to - conn.from) * 10 + 15;

            return (
              <motion.path
                key={idx}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.2, duration: 0.8 }}
                d={`M ${startX}% 0 Q ${(startX + endX) / 2}% ${curveHeight} ${endX}% 0`}
                fill="none"
                stroke={conn.nature === 'positive' ? '#10b981' : '#ef4444'}
                strokeWidth="2"
                strokeDasharray={conn.nature === 'negative' ? '5,5' : 'none'}
              />
            );
          })}
        </svg>

        {/* 關係標籤 */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {relations.slice(0, 6).map((rel, idx) => {
            const info = RELATION_INFO[rel.type];
            return (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  info?.nature === 'positive'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                <span>{info?.emoji}</span>
                <span>{rel.type}</span>
                <span className="text-slate-500">({rel.positions.join('')})</span>
              </motion.span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function RelationsTab({ analysis }: RelationsTabProps) {
  const relations = analysis.branchRelations;
  const [expandedLiuQin, setExpandedLiuQin] = useState<ShiShen | null>(null);

  // 計算十神統計
  const tenGodCounts: Record<ShiShen, number> = {
    '比肩': 0, '劫財': 0, '食神': 0, '傷官': 0, '偏財': 0,
    '正財': 0, '七殺': 0, '正官': 0, '偏印': 0, '正印': 0,
  };

  // 統計天干十神
  for (const pillar of [analysis.chart.year, analysis.chart.month, analysis.chart.hour]) {
    if (pillar.ganShiShen) {
      tenGodCounts[pillar.ganShiShen]++;
    }
  }

  // 統計地支藏干十神
  for (const pillar of [analysis.chart.year, analysis.chart.month, analysis.chart.day, analysis.chart.hour]) {
    for (const hidden of pillar.hiddenStems) {
      if (hidden.shiShen) {
        tenGodCounts[hidden.shiShen] += hidden.weight;
      }
    }
  }

  // 六親互動分析
  const liuQinData = Object.entries(tenGodCounts)
    .filter(([_, count]) => count > 0)
    .map(([shiShen, count]) => ({
      shiShen: shiShen as ShiShen,
      count,
      info: LIUQIN_MAP[shiShen as ShiShen],
    }))
    .sort((a, b) => b.count - a.count);

  // 分類地支關係
  const positiveRelations = relations.filter((r) =>
    ['六合', '三合', '半合', '三會', '暗合'].includes(r.type)
  );
  const negativeRelations = relations.filter((r) =>
    ['六沖', '三刑', '自刑', '六害'].includes(r.type)
  );

  // 計算整體人際和諧度
  const harmonyScore = Math.round(
    (positiveRelations.length * 15 - negativeRelations.length * 10 + 50)
  );
  const normalizedScore = Math.max(20, Math.min(100, harmonyScore));

  return (
    <div className="space-y-8">
      {/* 1. 四柱關係總覽 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">
            1
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">四柱關係總覽</h2>
            <p className="text-sm text-slate-500">
              <GlossaryTerm term="地支">地支</GlossaryTerm>之間的合沖刑害關係
            </p>
          </div>
        </div>

        {/* 關係連線圖 */}
        <RelationshipDiagram analysis={analysis} relations={relations} />
      </section>

      <CloudDivider />

      {/* 2. 六親互動分析 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
            2
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">六親互動分析</h2>
            <p className="text-sm text-slate-500">
              <GlossaryTerm term="十神">十神</GlossaryTerm>與人際關係對應
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {liuQinData.slice(0, 10).map((item, index) => (
            <motion.div
              key={item.shiShen}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl cursor-pointer transition-all ${
                expandedLiuQin === item.shiShen
                  ? 'col-span-2 sm:col-span-3 lg:col-span-5'
                  : ''
              } ${
                index < 3
                  ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200'
                  : 'bg-white border border-slate-100'
              }`}
              onClick={() => setExpandedLiuQin(
                expandedLiuQin === item.shiShen ? null : item.shiShen
              )}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{item.info.icon}</span>
                  <div className="flex items-center gap-2">
                    <GlossaryTerm term={item.shiShen}>
                      <span className={`text-lg font-bold ${index < 3 ? 'text-violet-600' : 'text-slate-600'}`}>
                        {item.shiShen}
                      </span>
                    </GlossaryTerm>
                    {expandedLiuQin === item.shiShen
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />
                    }
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-700 mb-1">
                  {item.info.name}
                </div>

                {expandedLiuQin !== item.shiShen ? (
                  <>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${index < 3 ? 'bg-violet-500' : 'bg-slate-300'}`}
                        style={{ width: `${Math.min(100, item.count * 25)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-right text-slate-400 mt-1">
                      {item.count.toFixed(1)} 能量
                    </div>
                  </>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3"
                    >
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.info.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.info.impact === 'high'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          影響力：{item.info.impact === 'high' ? '高' : '中'}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {item.info.relation}
                        </span>
                      </div>
                      <div className="p-3 bg-violet-50 rounded-lg">
                        <p className="text-sm text-violet-800">
                          <Sparkles className="w-4 h-4 inline mr-1" />
                          <span className="font-medium">建議：</span>{item.info.advice}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 六親總評 */}
        {liuQinData[0] && (
          <InsightCallout
            title="六親關係總評"
            variant="fortune"
            className="mt-6"
          >
            <p className="leading-relaxed">
              命盤中「<GlossaryTerm term={liuQinData[0].shiShen}>{liuQinData[0].shiShen}</GlossaryTerm>」能量最強（{liuQinData[0].count.toFixed(1)}），代表與{liuQinData[0].info.name}的緣分深厚，{liuQinData[0].info.advice}。
              {liuQinData[1] && (
                <>其次是「<GlossaryTerm term={liuQinData[1].shiShen}>{liuQinData[1].shiShen}</GlossaryTerm>」（{liuQinData[1].count.toFixed(1)}），{liuQinData[1].info.advice}。</>
              )}
              {liuQinData[2] && (
                <>第三是「<GlossaryTerm term={liuQinData[2].shiShen}>{liuQinData[2].shiShen}</GlossaryTerm>」（{liuQinData[2].count.toFixed(1)}），{liuQinData[2].info.advice}。</>
              )}
            </p>
          </InsightCallout>
        )}
      </section>

      <CloudDivider />

      {/* 3. 人際和諧指數 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            3
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">人際和諧指數</h2>
            <p className="text-sm text-slate-500">
              基於<GlossaryTerm term="地支">地支</GlossaryTerm>合沖刑害關係計算
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-1">整體和諧度</h3>
              <p className="text-slate-400 text-sm">
                反映命盤中人際關係的順暢程度
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`text-4xl font-bold ${
                  normalizedScore >= 70 ? 'text-emerald-400' :
                  normalizedScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {normalizedScore}
                </div>
                <div className="text-xs text-slate-400">
                  {normalizedScore >= 70 ? '和諧順遂' :
                   normalizedScore >= 50 ? '中等平穩' : '需要注意'}
                </div>
              </div>

              <div className="w-20 h-20 relative">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <motion.circle
                    initial={{ strokeDashoffset: 201 }}
                    animate={{ strokeDashoffset: 201 - (normalizedScore / 100) * 201 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    cx="40" cy="40" r="32" fill="none"
                    stroke={normalizedScore >= 70 ? '#10b981' : normalizedScore >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="6" strokeLinecap="round" strokeDasharray="201"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 統計 */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">合局</span>
              </div>
              <div className="text-2xl font-bold">{positiveRelations.length}</div>
              <div className="text-xs text-slate-400">有利關係</div>
            </div>
            <div className="p-4 bg-rose-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Unlink className="w-4 h-4 text-rose-400" />
                <span className="text-rose-400 font-medium">刑沖害</span>
              </div>
              <div className="text-2xl font-bold">{negativeRelations.length}</div>
              <div className="text-xs text-slate-400">需注意關係</div>
            </div>
          </div>
        </motion.div>
      </section>

      <CloudDivider />

      {/* 4. 地支關係詳解 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold">
            4
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">地支關係詳解</h2>
            <p className="text-sm text-slate-500">依年 → 月 → 日 → 時順序解析</p>
          </div>
        </div>

        {/* 吉利關係 */}
        {positiveRelations.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-slate-800">
                吉利關係（<GlossaryTerm term="六合">合局</GlossaryTerm>）
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {positiveRelations.map((relation, index) => {
                const info = RELATION_INFO[relation.type];

                return (
                  <motion.div
                    key={`${relation.type}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{info.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <GlossaryTerm term={relation.type}>
                            <span className="font-bold text-slate-800">{relation.type}</span>
                          </GlossaryTerm>
                          <span className="text-sm text-slate-500">
                            {relation.positions.join('、')}柱
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {relation.branches.map((branch, i) => (
                            <span
                              key={i}
                              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow"
                              style={{ backgroundColor: WUXING_COLOR[relation.result || '土'] }}
                            >
                              {branch}
                            </span>
                          ))}
                          {relation.result && (
                            <>
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                              <span className="px-2 py-1 bg-white rounded text-sm font-bold"
                                style={{ color: WUXING_COLOR[relation.result] }}
                              >
                                化{relation.result}
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-sm text-slate-600 mb-2">
                          {relation.description || info.description}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium">
                          ✨ {info.impact}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* 需注意關係 */}
        {negativeRelations.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-slate-800">
                需注意關係（<GlossaryTerm term="六沖">刑沖害</GlossaryTerm>）
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {negativeRelations.map((relation, index) => {
                const info = RELATION_INFO[relation.type];

                return (
                  <motion.div
                    key={`${relation.type}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-br from-rose-50 to-red-50 rounded-xl border border-rose-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{info.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <GlossaryTerm term={relation.type}>
                            <span className="font-bold text-slate-800">{relation.type}</span>
                          </GlossaryTerm>
                          <span className="text-sm text-slate-500">
                            {relation.positions.join('、')}柱
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {relation.branches.map((branch, i) => (
                            <span
                              key={i}
                              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow bg-slate-500"
                            >
                              {branch}
                            </span>
                          ))}
                        </div>

                        <p className="text-sm text-slate-600 mb-2">
                          {relation.description || info.description}
                        </p>
                        <p className="text-xs text-rose-600 font-medium">
                          ⚠️ {info.impact}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* 無關係提示 */}
        {relations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 bg-slate-50 rounded-2xl text-center"
          >
            <Circle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              命盤中地支關係較為平和，無明顯合沖刑害。
            </p>
          </motion.div>
        )}
      </section>

      <CloudDivider />

      {/* 人際關係總結建議 */}
      <InsightCallout
        title="人際關係總結建議"
        variant={positiveRelations.length > negativeRelations.length ? 'success' :
                 negativeRelations.length > positiveRelations.length ? 'warning' : 'default'}
      >
        {positiveRelations.length > negativeRelations.length ? (
          <div className="space-y-3">
            <p className="leading-relaxed">
              命盤地支以合局為主，天生人緣好，容易獲得貴人相助。建議多發展人際關係，善用合作機會。
              {positiveRelations.some(r => r.type === '六合') && (
                <span className="block mt-2">
                  <GlossaryTerm term="六合">六合</GlossaryTerm>代表最佳的人際和諧，與對應柱位的人事物緣分深厚。
                </span>
              )}
              {positiveRelations.some(r => r.type === '三合') && (
                <span className="block mt-2">
                  <GlossaryTerm term="三合">三合局</GlossaryTerm>代表團隊合作力量，適合發展團隊事業。
                </span>
              )}
            </p>
          </div>
        ) : negativeRelations.length > positiveRelations.length ? (
          <div className="space-y-3">
            <p className="leading-relaxed">
              命盤地支刑沖較多，人際關係需要經營。建議學會圓融溝通，避免不必要的爭執。
              {negativeRelations.some(r => r.type === '六沖') && (
                <span className="block mt-2">
                  <GlossaryTerm term="六沖">六沖</GlossaryTerm>代表正面衝突，但也可轉化為突破動力，需注意對應流年。
                </span>
              )}
              {negativeRelations.some(r => r.type === '三刑') && (
                <span className="block mt-2">
                  <GlossaryTerm term="三刑">三刑</GlossaryTerm>需特別注意是非與健康，建議保持低調。
                </span>
              )}
            </p>
          </div>
        ) : (
          <p className="leading-relaxed">
            命盤地支關係平衡，有合有沖，人生起伏正常。建議把握合局帶來的貴人運，同時注意沖刑可能帶來的變動時機。
          </p>
        )}
      </InsightCallout>

      {/* 分領域建議 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-600 mb-2 font-medium">👔 事業合作</div>
          <div className="text-lg font-bold text-slate-800 mb-1">
            {positiveRelations.some((r) => r.positions.includes('月')) ? '有利' : '普通'}
          </div>
          <p className="text-xs text-slate-500">
            {positiveRelations.some((r) => r.positions.includes('月'))
              ? '月柱有合局，事業貴人運佳'
              : '事業運勢中性，需自身努力'}
          </p>
        </div>
        <div className="p-4 bg-pink-50 rounded-xl border border-pink-200">
          <div className="text-sm text-pink-600 mb-2 font-medium">💕 感情關係</div>
          <div className="text-lg font-bold text-slate-800 mb-1">
            {positiveRelations.some((r) => r.positions.includes('日'))
              ? '和諧'
              : negativeRelations.some((r) => r.positions.includes('日'))
              ? '需經營'
              : '平穩'}
          </div>
          <p className="text-xs text-slate-500">
            {positiveRelations.some((r) => r.positions.includes('日'))
              ? '日柱有合局，感情生活順利'
              : negativeRelations.some((r) => r.positions.includes('日'))
              ? '日柱有沖刑，感情需要磨合'
              : '感情運勢平穩，穩定發展'}
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="text-sm text-purple-600 mb-2 font-medium">🏠 家庭關係</div>
          <div className="text-lg font-bold text-slate-800 mb-1">
            {positiveRelations.some((r) => r.positions.includes('年')) ? '融洽' : '一般'}
          </div>
          <p className="text-xs text-slate-500">
            {positiveRelations.some((r) => r.positions.includes('年'))
              ? '年柱有合局，家庭氣氛和樂'
              : '家庭關係中性，需用心維繫'}
          </p>
        </div>
      </motion.div>

      <CloudDivider />

      {/* 5. 感情婚姻分析 */}
      {analysis.relationship && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
              5
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">感情婚姻分析</h2>
              <p className="text-sm text-slate-500">
                <GlossaryTerm term="配偶宮">配偶宮</GlossaryTerm>・配偶星・桃花分析
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 配偶宮分析 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-800">配偶宮分析</h3>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-xs font-bold rounded">
                  日支 {analysis.relationship.spousePalace.position}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">👤</span>
                  <div>
                    <div className="text-sm font-medium text-slate-700">配偶性格</div>
                    <p className="text-sm text-slate-600">{analysis.relationship.spousePalace.traits.personality}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">✨</span>
                  <div>
                    <div className="text-sm font-medium text-slate-700">外表特徵</div>
                    <p className="text-sm text-slate-600">{analysis.relationship.spousePalace.traits.appearance}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">💕</span>
                  <div>
                    <div className="text-sm font-medium text-slate-700">相處模式</div>
                    <p className="text-sm text-slate-600">{analysis.relationship.spousePalace.traits.relationship}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {analysis.relationship.spousePalace.analysis}
                </p>
              </div>
            </motion.div>

            {/* 配偶星分析 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-slate-800">配偶星分析</h3>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-bold rounded">
                  {analysis.relationship.spouseStar.primary}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-3 bg-white/60 rounded-lg text-center">
                    <div className="text-xs text-slate-500 mb-1">正緣星</div>
                    <div className="font-bold text-purple-600">{analysis.relationship.spouseStar.primary}</div>
                  </div>
                  <div className="flex-1 p-3 bg-white/60 rounded-lg text-center">
                    <div className="text-xs text-slate-500 mb-1">副星</div>
                    <div className="font-bold text-slate-600">{analysis.relationship.spouseStar.secondary}</div>
                  </div>
                  <div className="flex-1 p-3 bg-white/60 rounded-lg text-center">
                    <div className="text-xs text-slate-500 mb-1">星數</div>
                    <div className="font-bold text-amber-600">{analysis.relationship.spouseStar.count}</div>
                  </div>
                </div>

                <div className="p-3 bg-white/60 rounded-xl">
                  <div className="text-sm font-medium text-purple-700 mb-1">配偶星狀態</div>
                  <p className="text-sm text-slate-600">{analysis.relationship.spouseStar.status}</p>
                </div>

                <div className="p-3 bg-purple-100/50 rounded-xl">
                  <p className="text-sm text-purple-800">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    {analysis.relationship.spouseStar.advice}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 桃花與紅鸞天喜 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-4 rounded-xl border ${
                analysis.relationship.peachBlossom.hasPeachBlossom
                  ? 'bg-pink-50 border-pink-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🌸</span>
                <span className="font-bold text-slate-800">桃花星</span>
                {analysis.relationship.peachBlossom.hasPeachBlossom && (
                  <span className="px-2 py-0.5 bg-pink-200 text-pink-700 text-xs font-bold rounded">
                    有
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600">
                {analysis.relationship.peachBlossom.analysis}
              </p>
              {analysis.relationship.peachBlossom.hasPeachBlossom && (
                <div className="mt-2 text-xs text-pink-600">
                  出現於：{analysis.relationship.peachBlossom.positions.join('、')}柱
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-4 rounded-xl border ${
                analysis.relationship.hongLuanTianXi.hasHongLuan || analysis.relationship.hongLuanTianXi.hasTianXi
                  ? 'bg-red-50 border-red-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎊</span>
                <span className="font-bold text-slate-800">紅鸞天喜</span>
                {analysis.relationship.hongLuanTianXi.hasHongLuan && (
                  <span className="px-2 py-0.5 bg-red-200 text-red-700 text-xs font-bold rounded">
                    紅鸞
                  </span>
                )}
                {analysis.relationship.hongLuanTianXi.hasTianXi && (
                  <span className="px-2 py-0.5 bg-orange-200 text-orange-700 text-xs font-bold rounded">
                    天喜
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600">
                {analysis.relationship.hongLuanTianXi.analysis}
              </p>
            </motion.div>
          </div>

          {/* 婚姻時機與總建議 */}
          <div className="mt-6 p-5 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💒</div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-2">婚姻時機分析</h4>
                <p className="text-sm text-slate-700 mb-3">{analysis.relationship.marriageTiming}</p>
                <div className="p-3 bg-white/60 rounded-xl">
                  <p className="text-sm text-rose-800 font-medium">
                    <Heart className="w-4 h-4 inline mr-1" />
                    {analysis.relationship.overallAdvice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <CloudDivider />

      {/* 6. 四柱六親詳解 */}
      {analysis.liuQin && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
              6
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">四柱六親詳解</h2>
              <p className="text-sm text-slate-500">年 → 月 → 日 → 時 對應六親關係</p>
            </div>
          </div>

          {/* 四柱宮位 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { data: analysis.liuQin.year, icon: '👴', color: 'emerald' },
              { data: analysis.liuQin.month, icon: '👨', color: 'blue' },
              { data: analysis.liuQin.day, icon: '💑', color: 'rose' },
              { data: analysis.liuQin.hour, icon: '👶', color: 'purple' },
            ].map((item, idx) => (
              <motion.div
                key={item.data.position}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100/50 rounded-xl border border-${item.color}-200`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="font-bold text-slate-800">{item.data.position}柱</div>
                    <div className="text-xs text-slate-500">{item.data.palace.lifeStage}（{item.data.palace.ageRange}）</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">天干：</span>
                    <span className="font-medium text-slate-700">{item.data.ganTenGod}</span>
                    {item.data.ganLiuQin.length > 0 && (
                      <span className="text-xs text-slate-500">（{item.data.ganLiuQin[0]}）</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">地支：</span>
                    <span className="font-medium text-slate-700">{item.data.zhiTenGod}</span>
                    {item.data.zhiLiuQin.length > 0 && (
                      <span className="text-xs text-slate-500">（{item.data.zhiLiuQin[0]}）</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-600 leading-relaxed">{item.data.analysis}</p>
                </div>

                <div className="mt-2 p-2 bg-white/60 rounded-lg">
                  <p className="text-xs text-slate-700">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    {item.data.advice}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 主要六親分析 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-blue-50 rounded-xl border border-blue-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-slate-800">父親緣分</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{analysis.liuQin.fatherAnalysis}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-pink-50 rounded-xl border border-pink-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <span className="font-bold text-slate-800">母親緣分</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{analysis.liuQin.motherAnalysis}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 bg-rose-50 rounded-xl border border-rose-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-rose-600" />
                <span className="font-bold text-slate-800">配偶緣分</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{analysis.liuQin.spouseAnalysis}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 bg-purple-50 rounded-xl border border-purple-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Baby className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-slate-800">子女緣分</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{analysis.liuQin.childrenAnalysis}</p>
            </motion.div>
          </div>

          {/* 六親總結 */}
          <InsightCallout
            title="六親緣分總結"
            variant="fortune"
            className="mt-6"
          >
            <p className="leading-relaxed">{analysis.liuQin.summary}</p>
          </InsightCallout>
        </section>
      )}
    </div>
  );
}
