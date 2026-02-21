'use client';

import { motion } from 'framer-motion';
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
import type { BaZiAnalysis, WuXing, ShiShen } from '@/lib/bazi/types';
import { WUXING_COLOR } from '@/data/constants';
import { PieChart, Users, Target, Zap, Heart, Briefcase, Brain } from 'lucide-react';

interface CrossAnalysisTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

// 六親對照
const LIUQIN_MAP: Record<ShiShen, { name: string; relation: string; description: string }> = {
  '比肩': { name: '兄弟姐妹', relation: '同輩', description: '志同道合的夥伴，相互扶持' },
  '劫財': { name: '競爭者', relation: '同輩', description: '亦敵亦友，需謹慎相處' },
  '食神': { name: '子女', relation: '晚輩', description: '才華表現，福氣來源' },
  '傷官': { name: '子女', relation: '晚輩', description: '創意天才，但需收斂' },
  '偏財': { name: '父親', relation: '長輩', description: '財運來源，人脈貴人' },
  '正財': { name: '妻子/財運', relation: '配偶', description: '穩定財源，感情歸宿' },
  '七殺': { name: '丈夫', relation: '配偶', description: '事業壓力，權力象徵' },
  '正官': { name: '丈夫/上司', relation: '權威', description: '正統權威，規矩秩序' },
  '偏印': { name: '繼母', relation: '長輩', description: '偏門學問，轉型機會' },
  '正印': { name: '母親', relation: '長輩', description: '貴人扶持，學業智慧' },
};

// 十神分類
const TEN_GOD_CATEGORIES: Record<ShiShen, string> = {
  '比肩': '自我',
  '劫財': '自我',
  '食神': '生財',
  '傷官': '生財',
  '偏財': '財星',
  '正財': '財星',
  '七殺': '官殺',
  '正官': '官殺',
  '偏印': '印星',
  '正印': '印星',
};

// 生命能量維度
const LIFE_DIMENSIONS = [
  { key: 'career', name: '事業運', icon: Briefcase },
  { key: 'wealth', name: '財運', icon: Target },
  { key: 'relationship', name: '感情運', icon: Heart },
  { key: 'health', name: '健康運', icon: Zap },
  { key: 'wisdom', name: '智慧運', icon: Brain },
  { key: 'social', name: '人際運', icon: Users },
];

export default function CrossAnalysisTab({ analysis }: CrossAnalysisTabProps) {
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

  // 五行雷達圖數據
  const wuXingRadar = Object.entries(analysis.wuXingPercentage).map(([element, value]) => ({
    element,
    value: Math.round(value),
    fullMark: 40,
  }));

  // 計算生命維度分數
  const calculateDimensionScores = () => {
    const scores: Record<string, number> = {
      career: 50,
      wealth: 50,
      relationship: 50,
      health: 50,
      wisdom: 50,
      social: 50,
    };

    // 事業運：正官、七殺、比肩
    scores.career += (tenGodCounts['正官'] + tenGodCounts['七殺']) * 10;
    scores.career += tenGodCounts['比肩'] * 5;

    // 財運：正財、偏財
    scores.wealth += (tenGodCounts['正財'] + tenGodCounts['偏財']) * 15;

    // 感情運：正財（男）、正官（女）、食神
    scores.relationship += tenGodCounts['正財'] * 10;
    scores.relationship += tenGodCounts['食神'] * 8;

    // 健康運：根據五行平衡
    const balance = Math.max(...Object.values(analysis.wuXingPercentage)) -
                   Math.min(...Object.values(analysis.wuXingPercentage));
    scores.health = Math.max(30, 100 - balance);

    // 智慧運：正印、偏印
    scores.wisdom += (tenGodCounts['正印'] + tenGodCounts['偏印']) * 12;

    // 人際運：食神、傷官、正官
    scores.social += tenGodCounts['食神'] * 10;
    scores.social += analysis.branchRelations.filter(r =>
      ['六合', '三合', '半合'].includes(r.type)
    ).length * 8;

    // 正規化到 0-100
    Object.keys(scores).forEach(key => {
      scores[key] = Math.max(20, Math.min(100, Math.round(scores[key])));
    });

    return scores;
  };

  const dimensionScores = calculateDimensionScores();

  // 六親互動分析
  const getLiuQinAnalysis = () => {
    const result: Array<{
      shiShen: ShiShen;
      count: number;
      info: typeof LIUQIN_MAP[ShiShen];
    }> = [];

    Object.entries(tenGodCounts).forEach(([shiShen, count]) => {
      if (count > 0) {
        result.push({
          shiShen: shiShen as ShiShen,
          count,
          info: LIUQIN_MAP[shiShen as ShiShen],
        });
      }
    });

    return result.sort((a, b) => b.count - a.count);
  };

  const liuQinData = getLiuQinAnalysis();

  // 生命維度雷達圖數據
  const dimensionRadar = LIFE_DIMENSIONS.map(dim => ({
    dimension: dim.name,
    value: dimensionScores[dim.key],
    fullMark: 100,
  }));

  return (
    <div className="space-y-8">
      {/* 標題 */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">綜合命盤分析</h2>
        <PieChart className="w-5 h-5 text-indigo-500" />
      </div>

      {/* 雙雷達圖 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 五行能量雷達 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">五行能量分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={wuXingRadar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="element"
                  tick={{ fill: '#64748b', fontSize: 14, fontWeight: 'bold' }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 40]} tick={false} axisLine={false} />
                <Radar
                  name="五行"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 五行狀態 */}
          <div className="grid grid-cols-5 gap-2 mt-4">
            {wuXingRadar.map((item) => (
              <div key={item.element} className="text-center">
                <div
                  className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: WUXING_COLOR[item.element as WuXing] }}
                >
                  {item.element}
                </div>
                <div className="text-xs text-slate-500 mt-1">{item.value}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 生命維度雷達 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">生命能量維度</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dimensionRadar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="維度"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 維度列表 */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {LIFE_DIMENSIONS.map((dim) => {
              const Icon = dim.icon;
              const score = dimensionScores[dim.key];
              return (
                <div key={dim.key} className="flex items-center gap-2 text-xs">
                  <Icon className={`w-4 h-4 ${
                    score >= 70 ? 'text-emerald-500' :
                    score >= 50 ? 'text-amber-500' : 'text-rose-500'
                  }`} />
                  <span className="text-slate-600">{dim.name}</span>
                  <span className="font-bold text-slate-800">{score}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* 十神能量條形圖 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4">十神能量分布</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={Object.entries(tenGodCounts).map(([god, count]) => ({
                god,
                count: Math.round(count * 10) / 10,
                category: TEN_GOD_CATEGORIES[god as ShiShen] || '其他',
              }))}
              layout="vertical"
              margin={{ left: 60, right: 20 }}
            >
              <XAxis type="number" domain={[0, 'auto']} />
              <YAxis type="category" dataKey="god" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [Number(value).toFixed(1), '能量值']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {Object.entries(tenGodCounts).map(([god], index) => {
                  const category = TEN_GOD_CATEGORIES[god as ShiShen];
                  const colors: Record<string, string> = {
                    '自我': '#3b82f6',
                    '生財': '#10b981',
                    '財星': '#f59e0b',
                    '官殺': '#ef4444',
                    '印星': '#8b5cf6',
                  };
                  return (
                    <Cell key={index} fill={colors[category] || '#64748b'} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 圖例 */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {[
            { name: '自我（比劫）', color: '#3b82f6' },
            { name: '生財（食傷）', color: '#10b981' },
            { name: '財星（正偏財）', color: '#f59e0b' },
            { name: '官殺（正官七殺）', color: '#ef4444' },
            { name: '印星（正偏印）', color: '#8b5cf6' },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-600">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 六親互動分析 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-violet-600" />
          <h3 className="text-lg font-bold text-slate-800">六親互動分析</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liuQinData.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.shiShen}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-4 bg-white rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-violet-600">{item.shiShen}</span>
                <span className="px-2 py-0.5 bg-violet-100 text-violet-600 text-xs rounded-full">
                  {item.info.relation}
                </span>
              </div>
              <div className="text-sm font-medium text-slate-700 mb-1">
                {item.info.name}
              </div>
              <div className="text-xs text-slate-500">
                {item.info.description}
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-xs text-slate-400">能量值：</span>
                <div className="flex-1 h-1.5 bg-violet-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${Math.min(100, item.count * 25)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-violet-600">
                  {item.count.toFixed(1)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 六親總結 */}
        <div className="mt-6 p-4 bg-white rounded-xl">
          <h4 className="font-bold text-slate-700 mb-2">六親關係總評</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            {liuQinData[0] && (
              <>
                命盤中「{liuQinData[0].shiShen}」能量最強，代表與{liuQinData[0].info.name}的緣分深厚。
                {liuQinData[1] && `其次是「${liuQinData[1].shiShen}」，${liuQinData[1].info.description}。`}
                建議善用這些人際資源，同時注意可能的衝突關係。
              </>
            )}
          </p>
        </div>
      </motion.section>

      {/* 綜合評分卡 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white"
      >
        <h3 className="text-lg font-bold mb-6">命盤綜合評分</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {LIFE_DIMENSIONS.map((dim, index) => {
            const Icon = dim.icon;
            const score = dimensionScores[dim.key];
            const color = score >= 70 ? 'emerald' : score >= 50 ? 'amber' : 'rose';

            return (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-${color}-500/20 flex items-center justify-center mb-2`}
                  style={{
                    backgroundColor: color === 'emerald' ? 'rgba(16, 185, 129, 0.2)' :
                      color === 'amber' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <Icon className={`w-8 h-8`}
                    style={{
                      color: color === 'emerald' ? '#10b981' :
                        color === 'amber' ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-xs text-slate-400">{dim.name}</div>
              </motion.div>
            );
          })}
        </div>

        {/* 整體建議 */}
        <div className="mt-6 p-4 bg-white/10 rounded-xl">
          <p className="text-sm text-slate-300 leading-relaxed">
            根據綜合分析，您的命盤
            {(() => {
              const avgScore = Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 6;
              if (avgScore >= 70) return '整體運勢優秀，各方面發展均衡。建議把握當前良好態勢，積極拓展事業版圖。';
              if (avgScore >= 55) return '整體運勢平穩，有發展潛力。建議加強弱項領域，善用喜用神補足能量。';
              return '部分領域需要加強。建議透過開運方法調整，善用貴人運勢轉化困境。';
            })()}
          </p>
        </div>
      </motion.section>
    </div>
  );
}
