'use client';

import { Target, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { Pattern } from '@/lib/bazi/types';

interface PatternCardProps {
  pattern: Pattern;
}

export default function PatternCard({ pattern }: PatternCardProps) {
  const getStatusIcon = () => {
    switch (pattern.status) {
      case '成格':
        return <CheckCircle size={18} className="text-green-500" />;
      case '破格':
        return <XCircle size={18} className="text-red-500" />;
      case '假格':
        return <AlertTriangle size={18} className="text-amber-500" />;
    }
  };

  const getStatusColor = () => {
    switch (pattern.status) {
      case '成格':
        return 'bg-green-100 text-green-700 border-green-200';
      case '破格':
        return 'bg-red-100 text-red-700 border-red-200';
      case '假格':
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getTypeColor = () => {
    switch (pattern.type) {
      case '正格':
        return 'bg-blue-100 text-blue-700';
      case '從格':
        return 'bg-purple-100 text-purple-700';
      case '專旺格':
        return 'bg-red-100 text-red-700';
      case '雜格':
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
      <h3 className="text-lg font-bold text-stone-800 mb-4 border-l-4 border-purple-500 pl-3 flex items-center gap-2">
        <Target size={20} className="text-purple-500" />
        格局判定
      </h3>

      <div className="flex items-center gap-3 mb-4">
        {/* 格局名稱 */}
        <div className="text-3xl font-serif font-bold text-stone-800">
          {pattern.name}
        </div>

        {/* 類型標籤 */}
        <span className={`px-2 py-0.5 text-xs font-bold rounded ${getTypeColor()}`}>
          {pattern.type}
        </span>

        {/* 狀態標籤 */}
        <span
          className={`px-2 py-0.5 text-xs font-bold rounded border flex items-center gap-1 ${getStatusColor()}`}
        >
          {getStatusIcon()}
          {pattern.status}
        </span>
      </div>

      {/* 描述 */}
      <p className="text-sm text-stone-600 leading-relaxed bg-stone-50 p-3 rounded">
        {pattern.description}
      </p>

      {/* 用神 */}
      {pattern.keyGod && (
        <div className="mt-4 pt-4 border-t border-stone-100">
          <span className="text-xs font-bold text-stone-500">格局用神：</span>
          <span className="text-sm font-bold text-purple-600 ml-2">
            {pattern.keyGod}
          </span>
        </div>
      )}
    </div>
  );
}
