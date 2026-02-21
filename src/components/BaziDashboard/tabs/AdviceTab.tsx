'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BaZiAnalysis, WuXing } from '@/lib/bazi/types';
import { WUXING_COLOR } from '@/data/constants';
import { WUXING_DESCRIPTIONS } from '@/data/copywriting/wuxing';
import {
  Compass,
  Gem,
  MapPin,
  Palette,
  Clock,
  Utensils,
  Activity,
  Briefcase,
  Users,
  Calendar,
  Sparkles,
  Shield,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { GlossaryTerm, CloudDivider, InsightCallout, TaijiSymbol, SealStamp } from '@/components/ui';

interface AdviceTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

// 五行開運對照
const WUXING_ADVICE: Record<WuXing, {
  colors: string[];
  directions: string;
  numbers: string;
  foods: string[];
  activities: string[];
  careers: string[];
  accessories: string[];
  timeSlots: string;
  season: string;
  organs: string;
}> = {
  '木': {
    colors: ['綠色', '青色', '藍綠色'],
    directions: '東方',
    numbers: '3、8',
    foods: ['綠葉蔬菜', '酸味食物', '青草茶', '竹筍', '芹菜'],
    activities: ['森林浴', '園藝', '爬山健行', '植栽', '瑜伽'],
    careers: ['教育', '出版', '文創', '農業', '環保'],
    accessories: ['翡翠', '綠松石', '木質飾品', '竹製品'],
    timeSlots: '寅時（3-5點）、卯時（5-7點）',
    season: '春季',
    organs: '肝膽',
  },
  '火': {
    colors: ['紅色', '紫色', '橙色', '粉紅色'],
    directions: '南方',
    numbers: '2、7',
    foods: ['紅色蔬果', '辣椒', '薑', '桂圓', '紅棗'],
    activities: ['曬太陽', '熱瑜伽', '社交活動', '演講', '表演'],
    careers: ['行銷', '娛樂', '餐飲', '照明', '能源'],
    accessories: ['紅寶石', '紅瑪瑙', '紫水晶', '紅繩'],
    timeSlots: '巳時（9-11點）、午時（11-13點）',
    season: '夏季',
    organs: '心小腸',
  },
  '土': {
    colors: ['黃色', '棕色', '米色', '卡其色'],
    directions: '中央（或西南、東北）',
    numbers: '5、0',
    foods: ['根莖類', '五穀雜糧', '蜂蜜', '南瓜', '地瓜'],
    activities: ['陶藝', '種植', '冥想', '烹飪', '收藏'],
    careers: ['房地產', '建築', '農業', '殯葬', '倉儲'],
    accessories: ['黃水晶', '琥珀', '陶瓷', '玉石'],
    timeSlots: '辰戌丑未時（季節交替月）',
    season: '四季交替',
    organs: '脾胃',
  },
  '金': {
    colors: ['白色', '金色', '銀色', '灰色'],
    directions: '西方',
    numbers: '4、9',
    foods: ['辛辣食物', '白色食物', '梨', '白蘿蔔', '杏仁'],
    activities: ['重訓', '武術', '投資理財', '斷捨離', '整理'],
    careers: ['金融', '法律', '機械', '珠寶', '汽車'],
    accessories: ['黃金', '白金', '銀飾', '金屬手錶'],
    timeSlots: '申時（15-17點）、酉時（17-19點）',
    season: '秋季',
    organs: '肺大腸',
  },
  '水': {
    colors: ['黑色', '深藍色', '灰藍色'],
    directions: '北方',
    numbers: '1、6',
    foods: ['海鮮', '黑色食物', '湯品', '豆腐', '黑芝麻'],
    activities: ['游泳', '泡湯', '閱讀', '冥想', '旅行'],
    careers: ['航運', '旅遊', '貿易', '傳媒', '水利'],
    accessories: ['黑曜石', '藍寶石', '珍珠', '水晶'],
    timeSlots: '亥時（21-23點）、子時（23-1點）',
    season: '冬季',
    organs: '腎膀胱',
  },
};

// 身強身弱開運建議
const STRENGTH_ADVICE = {
  strong: {
    principle: '洩秀為用',
    strategy: '身強者能量過剩，需要找到發揮的舞台。適合創業、領導、競爭激烈的環境。能量宜疏導而非壓抑。',
    dos: ['多承擔責任', '積極拓展事業', '主動挑戰', '幫助他人', '運動消耗精力'],
    donts: ['獨善其身', '固執己見', '過度勞累', '衝動行事', '孤立自我'],
  },
  weak: {
    principle: '印比為用',
    strategy: '身弱者需要貴人扶持，適合合作、依附、穩定的環境。借力使力方為妙，切忌孤軍奮戰。',
    dos: ['善用人脈', '尋求合作', '穩紮穩打', '養精蓄銳', '接受幫助'],
    donts: ['孤軍奮戰', '急於求成', '高風險投資', '過度消耗', '逞強好勝'],
  },
};

export default function AdviceTab({ analysis, qianShi }: AdviceTabProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('foods');
  const isStrong = ['身極強', '身強', '身旺'].includes(analysis.strength.verdict);
  const strengthAdvice = isStrong ? STRENGTH_ADVICE.strong : STRENGTH_ADVICE.weak;

  // 主要喜用神
  const primaryFavorable = analysis.favorable[0];
  const primaryAdvice = WUXING_ADVICE[primaryFavorable];
  const wuxingDesc = WUXING_DESCRIPTIONS[primaryFavorable];

  return (
    <div className="space-y-8">
      {/* 1. 籤詩展示 - 儀式感強化 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
            1
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">命盤籤詩</h2>
            <p className="text-sm text-slate-500">源自古籍的智慧指引</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl border-2 border-amber-200 overflow-hidden"
        >
          {/* 東方裝飾元素 */}
          <div className="absolute top-4 left-4 opacity-10">
            <TaijiSymbol size={60} />
          </div>
          <div className="absolute bottom-4 right-4 opacity-20">
            <SealStamp text="吉" size="sm" />
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* 裝飾邊框 */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-amber-300" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-amber-300" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-amber-300" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-amber-300" />

          <div className="text-center relative py-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block"
            >
              <div className="text-xs text-amber-600 mb-4 tracking-widest">✦ 命盤開示 ✦</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-serif text-amber-900 leading-loose tracking-[0.3em] writing-vertical">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-2"
                >
                  {qianShi.slice(0, 8)}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mb-2"
                >
                  {qianShi.slice(8, 16)}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mb-2"
                >
                  {qianShi.slice(16, 24)}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  {qianShi.slice(24, 32)}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <CloudDivider />

      {/* 2. 核心開運原則 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
            2
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">核心開運原則</h2>
            <p className="text-sm text-slate-500">
              基於<GlossaryTerm term="身強">身強身弱</GlossaryTerm>的調候之道
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl text-white"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" />
            <h3 className="text-lg font-bold">
              {analysis.strength.verdict} · {strengthAdvice.principle}
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-teal-200 mb-2">您的命盤特質</div>
              <div className="text-3xl font-bold mb-3">
                <GlossaryTerm term={isStrong ? '身強' : '身弱'}>
                  <span className="text-white">{analysis.strength.verdict}</span>
                </GlossaryTerm>
              </div>
              <p className="text-sm text-teal-50 leading-relaxed">
                {strengthAdvice.strategy}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-xs text-teal-200 mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3" /> 宜
                </div>
                <ul className="space-y-1">
                  {strengthAdvice.dos.map((item, i) => (
                    <li key={i} className="text-sm flex items-center gap-1">
                      <span className="text-emerald-300">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-xs text-teal-200 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> 忌
                </div>
                <ul className="space-y-1">
                  {strengthAdvice.donts.map((item, i) => (
                    <li key={i} className="text-sm flex items-center gap-1">
                      <span className="text-rose-300">✗</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <CloudDivider />

      {/* 3. 喜用神開運指南 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">
            3
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              <GlossaryTerm term="喜用神">喜用神</GlossaryTerm>開運指南
            </h2>
            <p className="text-sm text-slate-500">您的主要喜用神是「{primaryFavorable}」</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
        >
          {/* 五行標題 */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{ backgroundColor: WUXING_COLOR[primaryFavorable] }}
            >
              {wuxingDesc.symbol}
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">
                <GlossaryTerm term={primaryFavorable}>{primaryFavorable}</GlossaryTerm>行開運
              </h3>
              <p className="text-sm text-slate-500">
                {primaryAdvice.season}當令 · 主{primaryAdvice.organs}
              </p>
            </div>
          </div>

          {/* 快速參考 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <Palette className="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <div className="text-xs text-slate-500 mb-1">開運色彩</div>
              <div className="text-sm font-medium text-slate-800">
                {primaryAdvice.colors[0]}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <Compass className="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <div className="text-xs text-slate-500 mb-1">有利方位</div>
              <div className="text-sm font-medium text-slate-800">
                {primaryAdvice.directions}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <span className="text-slate-400 font-bold text-lg">#</span>
              <div className="text-xs text-slate-500 mb-1 mt-1">吉祥數字</div>
              <div className="text-sm font-medium text-slate-800">
                {primaryAdvice.numbers}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <Clock className="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <div className="text-xs text-slate-500 mb-1">貴人時段</div>
              <div className="text-xs font-medium text-slate-800">
                {primaryAdvice.timeSlots.split('、')[0]}
              </div>
            </div>
          </div>

          {/* 可展開的詳細開運方法 */}
          <div className="space-y-3">
            {/* 開運飲食 */}
            <div
              className={`rounded-xl border transition-all ${
                expandedSection === 'foods'
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === 'foods' ? null : 'foods')}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Utensils className={`w-5 h-5 ${expandedSection === 'foods' ? 'text-green-600' : 'text-slate-400'}`} />
                  <span className={`font-medium ${expandedSection === 'foods' ? 'text-green-800' : 'text-slate-700'}`}>
                    開運飲食
                  </span>
                </div>
                {expandedSection === 'foods' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <AnimatePresence>
                {expandedSection === 'foods' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      {primaryAdvice.foods.map((food, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white text-green-700 text-sm rounded-full border border-green-200 shadow-sm">
                          {food}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-green-600 mt-3">
                      💡 建議：日常飲食可多攝取以上食材，補充{primaryFavorable}行能量
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 開運活動 */}
            <div
              className={`rounded-xl border transition-all ${
                expandedSection === 'activities'
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === 'activities' ? null : 'activities')}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${expandedSection === 'activities' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`font-medium ${expandedSection === 'activities' ? 'text-blue-800' : 'text-slate-700'}`}>
                    開運活動
                  </span>
                </div>
                {expandedSection === 'activities' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <AnimatePresence>
                {expandedSection === 'activities' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      {primaryAdvice.activities.map((activity, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white text-blue-700 text-sm rounded-full border border-blue-200 shadow-sm">
                          {activity}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 mt-3">
                      💡 建議：每週安排以上活動，增強{primaryFavorable}行氣場
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 適合行業 */}
            <div
              className={`rounded-xl border transition-all ${
                expandedSection === 'careers'
                  ? 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === 'careers' ? null : 'careers')}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className={`w-5 h-5 ${expandedSection === 'careers' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className={`font-medium ${expandedSection === 'careers' ? 'text-purple-800' : 'text-slate-700'}`}>
                    適合行業
                  </span>
                </div>
                {expandedSection === 'careers' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <AnimatePresence>
                {expandedSection === 'careers' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      {primaryAdvice.careers.map((career, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white text-purple-700 text-sm rounded-full border border-purple-200 shadow-sm">
                          {career}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-purple-600 mt-3">
                      💡 建議：從事{primaryFavorable}行相關產業可獲得事業助力
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 開運飾品 */}
            <div
              className={`rounded-xl border transition-all ${
                expandedSection === 'accessories'
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === 'accessories' ? null : 'accessories')}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Gem className={`w-5 h-5 ${expandedSection === 'accessories' ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span className={`font-medium ${expandedSection === 'accessories' ? 'text-amber-800' : 'text-slate-700'}`}>
                    開運飾品
                  </span>
                </div>
                {expandedSection === 'accessories' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <AnimatePresence>
                {expandedSection === 'accessories' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      {primaryAdvice.accessories.map((item, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white text-amber-700 text-sm rounded-full border border-amber-200 shadow-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-amber-600 mt-3">
                      💡 建議：佩戴以上材質飾品可增強{primaryFavorable}行運勢
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      <CloudDivider />

      {/* 4. 忌神提醒 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
            4
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              <GlossaryTerm term="忌神">忌神</GlossaryTerm>提醒
            </h2>
            <p className="text-sm text-slate-500">應適度避免或減少接觸的五行</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-rose-50 rounded-2xl border border-rose-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span className="text-rose-800 font-medium">
              以下五行為您的忌神，能量過強可能造成不利影響
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {analysis.unfavorable.map((element) => {
              const desc = WUXING_DESCRIPTIONS[element];
              const advice = WUXING_ADVICE[element];

              return (
                <div
                  key={element}
                  className="p-4 bg-white rounded-xl border border-rose-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: WUXING_COLOR[element], opacity: 0.7 }}
                    >
                      {desc.symbol}
                    </div>
                    <div>
                      <span className="font-bold text-rose-800">
                        <GlossaryTerm term={element}>{element}</GlossaryTerm>行
                      </span>
                      <p className="text-xs text-rose-600">忌神</p>
                    </div>
                  </div>
                  <ul className="text-sm text-rose-700 space-y-1">
                    <li>• 避開顏色：{advice.colors[0]}</li>
                    <li>• 避開方位：{advice.directions}</li>
                    <li>• 少食：{advice.foods[0]}</li>
                  </ul>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <CloudDivider />

      {/* 5. 年度開運行動計畫 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            5
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">年度開運行動計畫</h2>
            <p className="text-sm text-slate-500">具體可執行的開運方案</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">實用開運行動</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="font-medium">貴人運</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                多結交{primaryFavorable}行屬性的人，
                {primaryFavorable === '木' ? '屬虎、兔的朋友' :
                 primaryFavorable === '火' ? '屬蛇、馬的朋友' :
                 primaryFavorable === '土' ? '屬龍、狗、牛、羊的朋友' :
                 primaryFavorable === '金' ? '屬猴、雞的朋友' : '屬豬、鼠的朋友'}
                可能是您的貴人。
              </p>
            </div>

            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-green-400" />
                <span className="font-medium">開運方位</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {primaryAdvice.directions}方位是您的開運方位，
                可考慮在該方位工作、居住或旅行，增強運勢。
              </p>
            </div>

            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span className="font-medium">日常習慣</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                穿著{primaryAdvice.colors[0]}系服飾，
                在{primaryAdvice.timeSlots.split('、')[0]}處理重要事務。
              </p>
            </div>
          </div>

          {/* 每月提醒 */}
          <div className="mt-6 p-4 bg-amber-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-amber-300">每月開運提醒</span>
            </div>
            <p className="text-sm text-slate-300">
              建議每月初閱讀<GlossaryTerm term="流月">流月</GlossaryTerm>運勢，把握當月吉利時機。
              遇到<GlossaryTerm term="忌神">忌神</GlossaryTerm>月份時，保守行事，避免重大決策。
            </p>
          </div>
        </motion.div>
      </section>

      <CloudDivider />

      {/* 6. 健康養生分析 */}
      {analysis.healthReport && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              6
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">健康養生分析</h2>
              <p className="text-sm text-slate-500">
                <GlossaryTerm term="五行">五行</GlossaryTerm>臟腑對應・體質分析
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 體質概述 */}
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🏥</div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">體質特點</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{analysis.healthReport.constitution}</p>
                  <div className="mt-3 p-3 bg-white/60 rounded-xl">
                    <p className="text-sm text-emerald-800">{analysis.healthReport.summary}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 五行健康風險 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.health.slice(0, 6).map((item, idx) => (
                <motion.div
                  key={item.element}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    item.severity === 'high'
                      ? 'bg-rose-50 border-rose-300'
                      : item.severity === 'medium'
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-emerald-50 border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: WUXING_COLOR[item.element] }}
                      >
                        {item.element}
                      </span>
                      <span className="font-bold text-slate-800">{item.organs}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                      item.severity === 'high'
                        ? 'bg-rose-200 text-rose-700'
                        : item.severity === 'medium'
                        ? 'bg-amber-200 text-amber-700'
                        : 'bg-emerald-200 text-emerald-700'
                    }`}>
                      {item.severity === 'high' ? '需注意' : item.severity === 'medium' ? '一般' : '良好'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{item.status}</p>
                  <p className="text-xs text-slate-500">{item.risk}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="text-xs text-emerald-700">
                      <Activity className="w-3 h-3 inline mr-1" />
                      {item.advice}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 季節養生建議 */}
            <div className="p-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl text-white">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold">四季養生建議</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysis.healthReport.seasonalAdvice.map((advice, idx) => (
                  <div key={idx} className="p-3 bg-white/10 rounded-xl">
                    <p className="text-sm text-slate-200">{advice}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      <CloudDivider />

      {/* 7. 職業事業分析 */}
      {analysis.career && analysis.career.strategy && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              7
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">職業事業分析</h2>
              <p className="text-sm text-slate-500">
                <GlossaryTerm term="財官印">財官印</GlossaryTerm>分析・行業推薦
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 職業策略概述 */}
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
              <div className="flex items-start gap-3">
                <div className="text-3xl">💼</div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">事業發展策略</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full">
                      {analysis.career.strategy}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{analysis.career.description}</p>
                </div>
              </div>
            </div>

            {/* 適合行業 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.career.suitableIndustries.map((industry, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: WUXING_COLOR[industry.element] }}
                    >
                      {industry.element}
                    </span>
                    <span className="font-bold text-slate-800">{industry.element}行產業</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{industry.jobs}</p>
                  <p className="text-xs text-indigo-600 bg-indigo-50 p-2 rounded">
                    <Lightbulb className="w-3 h-3 inline mr-1" />
                    {industry.reason}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* 職場角色建議 */}
            {analysis.career.roles.length > 0 && (
              <div className="p-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold">適合職場角色</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis.career.roles.map((role, idx) => (
                    <div key={idx} className="p-3 bg-white/10 rounded-xl">
                      <div className="font-medium text-amber-300 mb-1">{role.title}</div>
                      <p className="text-sm text-slate-300">{role.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </section>
      )}

      <CloudDivider />

      {/* 開運總結 */}
      <InsightCallout
        title="開運建議總結"
        variant="fortune"
      >
        <div className="space-y-3">
          <p className="leading-relaxed">
            您的命盤屬於「<GlossaryTerm term={isStrong ? '身強' : '身弱'}>{analysis.strength.verdict}</GlossaryTerm>」，
            開運原則為「{strengthAdvice.principle}」。
            主要<GlossaryTerm term="喜用神">喜用神</GlossaryTerm>為「<GlossaryTerm term={primaryFavorable}>{primaryFavorable}</GlossaryTerm>」，
            建議多接觸{primaryAdvice.colors[0]}、{primaryAdvice.directions}方位，
            在{primaryAdvice.timeSlots.split('、')[0]}處理重要事務。
          </p>
          <p className="leading-relaxed">
            <span className="font-medium">每日小提醒：</span>
            起床後面向{primaryAdvice.directions}方深呼吸三次，
            穿戴{primaryAdvice.colors[0]}系配件，
            飲食上適量攝取{primaryAdvice.foods[0]}等食材，
            持之以恆，運勢自然提升。
          </p>
        </div>
      </InsightCallout>
    </div>
  );
}
