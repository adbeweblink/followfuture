'use client';

import { useState } from 'react';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import type { BirthInput, Gender } from '@/lib/bazi/types';

interface BirthInputFormProps {
  onSubmit: (input: BirthInput) => void;
  isLoading?: boolean;
}

export default function BirthInputForm({ onSubmit, isLoading }: BirthInputFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    gender: '男' as Gender,
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getHourLabel = (hour: number): string => {
    const labels: Record<number, string> = {
      0: '子時 (00:00-00:59)',
      1: '丑時 (01:00-02:59)',
      2: '丑時',
      3: '寅時 (03:00-04:59)',
      4: '寅時',
      5: '卯時 (05:00-06:59)',
      6: '卯時',
      7: '辰時 (07:00-08:59)',
      8: '辰時',
      9: '巳時 (09:00-10:59)',
      10: '巳時',
      11: '午時 (11:00-12:59)',
      12: '午時',
      13: '未時 (13:00-14:59)',
      14: '未時',
      15: '申時 (15:00-16:59)',
      16: '申時',
      17: '酉時 (17:00-18:59)',
      18: '酉時',
      19: '戌時 (19:00-20:59)',
      20: '戌時',
      21: '亥時 (21:00-22:59)',
      22: '亥時',
      23: '子時 (23:00-23:59)',
    };
    return `${hour.toString().padStart(2, '0')}:00 ${labels[hour] || ''}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 姓名 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2">
          <User size={16} /> 姓名（選填）
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="請輸入姓名或暱稱"
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
        />
      </div>

      {/* 性別 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2">
          <User size={16} /> 性別
        </label>
        <div className="flex gap-4">
          {(['男', '女'] as Gender[]).map((g) => (
            <label
              key={g}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                formData.gender === g
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <input
                type="radio"
                name="gender"
                value={g}
                checked={formData.gender === g}
                onChange={() => setFormData({ ...formData, gender: g })}
                className="sr-only"
              />
              <span className="text-lg">{g === '男' ? '♂' : '♀'}</span>
              <span className="font-medium">{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 出生日期 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2">
          <Calendar size={16} /> 出生日期（國曆）
        </label>
        <div className="grid grid-cols-3 gap-3">
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            className="px-3 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y} 年
              </option>
            ))}
          </select>
          <select
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
            className="px-3 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m} 月
              </option>
            ))}
          </select>
          <select
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: Number(e.target.value) })}
            className="px-3 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d} 日
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 出生時辰 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2">
          <Clock size={16} /> 出生時辰
        </label>
        <select
          value={formData.hour}
          onChange={(e) => setFormData({ ...formData, hour: Number(e.target.value) })}
          className="w-full px-3 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {getHourLabel(h)}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-stone-500">
          * 時辰對八字影響很大，請盡量填寫準確的出生時間
        </p>
      </div>

      {/* 提交按鈕 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg
                   hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            排盤中...
          </span>
        ) : (
          '開始解盤'
        )}
      </button>
    </form>
  );
}
