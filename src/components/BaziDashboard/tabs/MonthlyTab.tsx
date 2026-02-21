'use client';

import { motion } from 'framer-motion';
import type { BaZiAnalysis, WuXing } from '@/lib/bazi/types';
import { WUXING_COLOR, TIAN_GAN_ELEMENT, DI_ZHI_ELEMENT } from '@/data/constants';
import { Calendar, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from 'lucide-react';

interface MonthlyTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

export default function MonthlyTab({ analysis }: MonthlyTabProps) {
  const monthlyFortunes = analysis.monthlyFortunes || [];
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // 計算年度整體運勢
  const avgScore = monthlyFortunes.length > 0
    ? Math.round(monthlyFortunes.reduce((sum, m) => sum + m.score, 0) / monthlyFortunes.length)
    : 50;

  const getStatusIcon = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'yellow':
        return <Minus className="w-4 h-4 text-amber-500" />;
      case 'red':
        return <TrendingDown className="w-4 h-4 text-rose-500" />;
    }
  };

  const getStatusColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green':
        return 'from-emerald-50 to-teal-50 border-emerald-200';
      case 'yellow':
        return 'from-amber-50 to-yellow-50 border-amber-200';
      case 'red':
        return 'from-rose-50 to-red-50 border-rose-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* 標題 & 年度總覽 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            {currentYear} 年流月運勢
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
            <span className="text-xs text-slate-400">年度平均</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${
                avgScore >= 65 ? 'text-emerald-500' : avgScore >= 45 ? 'text-amber-500' : 'text-rose-500'
              }`}>
                {avgScore}
              </span>
              <span className="text-xs text-slate-400">分</span>
            </div>
          </div>
        </div>
      </div>

      {/* 流月卡片網格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {monthlyFortunes.map((fortune, index) => {
          const isCurrent = fortune.month === currentMonth;
          const gan = fortune.ganZhi[0];
          const zhi = fortune.ganZhi[1];
          const ganElement = TIAN_GAN_ELEMENT[gan as keyof typeof TIAN_GAN_ELEMENT] as WuXing;
          const zhiElement = DI_ZHI_ELEMENT[zhi as keyof typeof DI_ZHI_ELEMENT] as WuXing;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-2xl border overflow-hidden ${
                isCurrent
                  ? 'ring-2 ring-green-500 shadow-lg shadow-green-200/50'
                  : ''
              } ${getStatusColor(fortune.status)}`}
            >
              {/* 當前月份標記 */}
              {isCurrent && (
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-bl-lg">
                  本月
                </div>
              )}

              {/* 月份標題 */}
              <div className="p-4 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-800">{fortune.title}</span>
                  </div>
                  {getStatusIcon(fortune.status)}
                </div>

                {/* 干支 */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-2xl font-serif font-bold"
                    style={{ color: WUXING_COLOR[ganElement] }}
                  >
                    {gan}
                  </span>
                  <span
                    className="text-2xl font-serif font-bold"
                    style={{ color: WUXING_COLOR[zhiElement] }}
                  >
                    {zhi}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {fortune.solarRange}
                  </span>
                </div>

                {/* 分數條 */}
                <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fortune.score}%` }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      fortune.status === 'green'
                        ? 'bg-emerald-500'
                        : fortune.status === 'yellow'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{fortune.description}</span>
                  <span className={`font-bold ${
                    fortune.status === 'green'
                      ? 'text-emerald-600'
                      : fortune.status === 'yellow'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {fortune.score}分
                  </span>
                </div>
              </div>

              {/* 建議 */}
              <div className="px-4 py-3 bg-white/40 border-t border-white/50">
                <p className="text-xs text-slate-600 line-clamp-2">
                  {fortune.advice}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 季節運勢總結 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4">四季運勢概覽</h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { season: '春季', months: [1, 2, 3], color: 'emerald', element: '木' as WuXing },
            { season: '夏季', months: [4, 5, 6], color: 'rose', element: '火' as WuXing },
            { season: '秋季', months: [7, 8, 9], color: 'amber', element: '金' as WuXing },
            { season: '冬季', months: [10, 11, 12], color: 'blue', element: '水' as WuXing },
          ].map((s, i) => {
            const seasonFortunes = monthlyFortunes.filter((f) =>
              s.months.includes(f.month)
            );
            const seasonAvg = seasonFortunes.length > 0
              ? Math.round(
                  seasonFortunes.reduce((sum, f) => sum + f.score, 0) / seasonFortunes.length
                )
              : 50;

            const isFavorable = analysis.favorable.includes(s.element);

            return (
              <motion.div
                key={s.season}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className={`p-4 rounded-xl border ${
                  isFavorable ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-800">{s.season}</span>
                  {isFavorable && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </div>

                <div className="flex items-end gap-2 mb-2">
                  <span className={`text-3xl font-bold text-${s.color}-500`}>
                    {seasonAvg}
                  </span>
                  <span className="text-xs text-slate-400 pb-1">平均分</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: WUXING_COLOR[s.element] }}
                  />
                  <span>{s.element}氣旺盛</span>
                  {isFavorable && (
                    <span className="ml-auto text-emerald-600">喜用</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* 特別提醒 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-amber-800 mb-2">年度運勢提醒</h4>
            <ul className="space-y-2 text-sm text-amber-700">
              {/* 找出最好和最差的月份 */}
              {(() => {
                if (monthlyFortunes.length === 0) return null;

                const sortedByScore = [...monthlyFortunes].sort((a, b) => b.score - a.score);
                const best = sortedByScore[0];
                const worst = sortedByScore[sortedByScore.length - 1];

                return (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600">●</span>
                      <span>
                        最佳月份：<strong>{best.title}</strong>（{best.ganZhi}），適合{' '}
                        {best.description.includes('創新') ? '創新突破' : '穩健發展'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600">●</span>
                      <span>
                        謹慎月份：<strong>{worst.title}</strong>（{worst.ganZhi}），宜{' '}
                        {worst.advice.slice(0, 20)}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">●</span>
                      <span>
                        喜用五行為「{analysis.favorable.join('、')}」的月份運勢較佳
                      </span>
                    </li>
                  </>
                );
              })()}
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
