'use client';

import { Scale, CheckCircle, XCircle } from 'lucide-react';
import type { StrengthAnalysis, WuXing } from '@/lib/bazi/types';

interface StrengthCardProps {
  strength: StrengthAnalysis;
  dayElement: WuXing;
}

export default function StrengthCard({ strength, dayElement }: StrengthCardProps) {
  const getVerdictColor = (verdict: StrengthAnalysis['verdict']) => {
    switch (verdict) {
      case '身極強':
        return 'bg-red-600';
      case '身強':
        return 'bg-orange-500';
      case '身弱':
        return 'bg-blue-500';
      case '身極弱':
        return 'bg-blue-700';
    }
  };

  const getVerdictDescription = (verdict: StrengthAnalysis['verdict']) => {
    switch (verdict) {
      case '身極強':
        return '日主氣勢極旺，精力充沛但易衝動，需要財官來消耗過剩能量。';
      case '身強':
        return '日主氣勢旺盛，有能力追求事業財富，適合主動出擊。';
      case '身弱':
        return '日主氣勢較弱，需要貴人扶持，宜穩健保守。';
      case '身極弱':
        return '日主氣勢極弱，可能形成從格，順從大勢反而順遂。';
    }
  };

  return (
    <div className="bg-stone-900 text-stone-100 p-6 rounded-xl shadow-lg">
      {/* 標題 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Scale size={24} className="text-amber-400" />
          身強身弱判定書
        </h3>
        <span
          className={`px-3 py-1 text-white text-sm font-bold rounded-full ${getVerdictColor(
            strength.verdict
          )}`}
        >
          {strength.verdict}
        </span>
      </div>

      {/* 分數條 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-stone-400">強度分數</span>
          <span className="text-amber-400 font-bold">{strength.score}/100</span>
        </div>
        <div className="w-full bg-stone-700 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-500"
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {/* 三項判定 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: '得令', value: strength.deLing, desc: '月令生扶' },
          { label: '得地', value: strength.deDi, desc: '地支通根' },
          { label: '得勢', value: strength.deShi, desc: '印比數量' },
        ].map((item) => (
          <div
            key={item.label}
            className={`p-3 rounded-lg border ${
              item.value
                ? 'border-green-500/50 bg-green-900/20'
                : 'border-red-500/50 bg-red-900/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {item.value ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className="font-bold">{item.label}</span>
            </div>
            <div className="text-xs text-stone-400">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* 原因說明 */}
      <div className="space-y-2">
        {strength.reason.map((r, i) => (
          <div
            key={i}
            className="text-sm text-stone-300 bg-stone-800/50 p-2 rounded"
          >
            {r}
          </div>
        ))}
      </div>

      {/* 總評 */}
      <div className="mt-4 pt-4 border-t border-stone-700">
        <p className="text-sm text-stone-300 leading-relaxed">
          <span className="text-amber-400 font-bold">★ 老師點評：</span>{' '}
          {getVerdictDescription(strength.verdict)}
        </p>
      </div>
    </div>
  );
}
