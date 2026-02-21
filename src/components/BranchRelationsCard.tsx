'use client';

import { GitMerge } from 'lucide-react';
import type { BranchRelation } from '@/lib/bazi/types';

interface BranchRelationsCardProps {
  relations: BranchRelation[];
}

export default function BranchRelationsCard({ relations }: BranchRelationsCardProps) {
  const getRelationColor = (type: BranchRelation['type']) => {
    switch (type) {
      case '六合':
      case '三合':
      case '半合':
      case '三會':
        return 'bg-green-50 border-green-200 text-green-800';
      case '六沖':
        return 'bg-red-50 border-red-200 text-red-800';
      case '三刑':
      case '自刑':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case '六害':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case '暗合':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-stone-50 border-stone-200 text-stone-800';
    }
  };

  const getRelationTag = (type: BranchRelation['type']) => {
    const isPositive = ['六合', '三合', '半合', '三會', '暗合'].includes(type);
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded font-bold ${
          isPositive ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
        }`}
      >
        {type}
      </span>
    );
  };

  if (relations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-bold text-stone-800 mb-4 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
          <GitMerge size={20} className="text-indigo-500" />
          地支關係
        </h3>
        <p className="text-stone-500 text-sm">此命盤地支間無明顯的合沖刑害關係。</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
      <h3 className="text-lg font-bold text-stone-800 mb-4 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
        <GitMerge size={20} className="text-indigo-500" />
        地支關係（{relations.length} 組）
      </h3>

      <div className="space-y-3">
        {relations.map((relation, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${getRelationColor(relation.type)}`}
          >
            <div className="flex items-center gap-2 mb-1">
              {getRelationTag(relation.type)}
              <span className="font-bold text-lg font-serif">
                {relation.branches.join('')}
              </span>
              {relation.result && (
                <span className="text-xs bg-white/50 px-1.5 py-0.5 rounded">
                  化{relation.result}
                </span>
              )}
              <span className="text-xs text-stone-500 ml-auto">
                {relation.positions.join('/')}柱
              </span>
            </div>
            <p className="text-sm opacity-90">{relation.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
