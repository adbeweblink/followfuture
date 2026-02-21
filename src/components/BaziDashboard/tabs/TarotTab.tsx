'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BaZiAnalysis, WuXing } from '@/lib/bazi/types';
import { Wand2, Sparkles, RotateCcw, Eye, Moon, Sun, Star } from 'lucide-react';

interface TarotTabProps {
  analysis: BaZiAnalysis;
  qianShi: string;
}

// 塔羅牌數據（大阿爾克那 22張）
const TAROT_CARDS = [
  { id: 0, name: '愚者', element: '風', meaning: '新開始、純真、冒險精神', advice: '勇敢踏出第一步，不要被既有框架束縛', symbol: '🃏' },
  { id: 1, name: '魔術師', element: '火', meaning: '創造力、自信、掌控', advice: '善用手邊資源，你有能力實現願望', symbol: '✨' },
  { id: 2, name: '女祭司', element: '水', meaning: '直覺、神秘、內在智慧', advice: '傾聽內心的聲音，答案就在心中', symbol: '🌙' },
  { id: 3, name: '皇后', element: '土', meaning: '豐饒、母性、創造', advice: '滋養你的計畫，耐心等待收穫', symbol: '👑' },
  { id: 4, name: '皇帝', element: '火', meaning: '權威、結構、領導', advice: '建立秩序，展現領導力', symbol: '🦅' },
  { id: 5, name: '教皇', element: '土', meaning: '傳統、指導、信仰', advice: '向有經驗的人請教，遵循正道', symbol: '📿' },
  { id: 6, name: '戀人', element: '風', meaning: '愛情、選擇、和諧', advice: '聽從心的選擇，建立真誠關係', symbol: '💕' },
  { id: 7, name: '戰車', element: '水', meaning: '勝利、意志、前進', advice: '堅定方向，全力以赴必能成功', symbol: '🏆' },
  { id: 8, name: '力量', element: '火', meaning: '勇氣、耐心、內在力量', advice: '以柔克剛，溫柔但堅定地面對挑戰', symbol: '🦁' },
  { id: 9, name: '隱士', element: '土', meaning: '內省、智慧、獨處', advice: '適時退一步思考，尋找內在答案', symbol: '🏔️' },
  { id: 10, name: '命運之輪', element: '木', meaning: '轉變、機運、週期', advice: '把握時機，命運正在轉動', symbol: '🎡' },
  { id: 11, name: '正義', element: '金', meaning: '公正、真相、因果', advice: '誠實面對，公平處理事務', symbol: '⚖️' },
  { id: 12, name: '倒吊人', element: '水', meaning: '犧牲、等待、新視角', advice: '換個角度看問題，有時放手是收穫', symbol: '🔄' },
  { id: 13, name: '死神', element: '水', meaning: '結束、轉化、重生', advice: '舊的不去新的不來，擁抱改變', symbol: '🦋' },
  { id: 14, name: '節制', element: '火', meaning: '平衡、調和、耐心', advice: '凡事適度，找到中庸之道', symbol: '⚗️' },
  { id: 15, name: '惡魔', element: '土', meaning: '誘惑、執著、物質', advice: '覺察束縛你的事物，勇敢掙脫', symbol: '⛓️' },
  { id: 16, name: '高塔', element: '火', meaning: '突變、覺醒、崩壞', advice: '接受劇變，這是重建的契機', symbol: '⚡' },
  { id: 17, name: '星星', element: '風', meaning: '希望、靈感、治癒', advice: '保持希望，宇宙正在眷顧你', symbol: '⭐' },
  { id: 18, name: '月亮', element: '水', meaning: '幻覺、直覺、恐懼', advice: '不要被表象迷惑，相信直覺', symbol: '🌕' },
  { id: 19, name: '太陽', element: '火', meaning: '成功、喜悅、活力', advice: '光明正大，享受生命的美好', symbol: '☀️' },
  { id: 20, name: '審判', element: '火', meaning: '覺醒、更新、召喚', advice: '聆聽內在召喚，做出重要決定', symbol: '📯' },
  { id: 21, name: '世界', element: '土', meaning: '完成、圓滿、成就', advice: '一個週期的圓滿結束，新旅程即將開始', symbol: '🌍' },
];

// 根據五行對應元素
const WUXING_TO_ELEMENT: Record<WuXing, string> = {
  '木': '木',
  '火': '火',
  '土': '土',
  '金': '金',
  '水': '水',
};

const ELEMENT_TO_WUXING: Record<string, WuXing> = {
  '風': '木',
  '火': '火',
  '土': '土',
  '金': '金',
  '水': '水',
  '木': '木',
};

export default function TarotTab({ analysis, qianShi }: TarotTabProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedSpread, setSelectedSpread] = useState<'single' | 'three' | 'celtic'>('single');
  const [drawnCards, setDrawnCards] = useState<typeof TAROT_CARDS>([]);

  // 根據命盤生成種子
  const seed = useMemo(() => {
    const dayGan = analysis.chart.day.gan;
    const dayZhi = analysis.chart.day.zhi;
    const pattern = analysis.pattern.name;
    return `${dayGan}${dayZhi}${pattern}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }, [analysis]);

  // 根據命盤抽牌
  const drawCards = (count: number) => {
    const shuffled = [...TAROT_CARDS];
    // 使用種子進行偽隨機排序
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((Math.sin(seed * (i + 1)) * 10000 + Date.now()) % (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 優先選擇與喜用神五行相關的牌
    const favorableElements = analysis.favorable.map(w => WUXING_TO_ELEMENT[w]);
    const sortedCards = shuffled.sort((a, b) => {
      const aMatch = favorableElements.includes(ELEMENT_TO_WUXING[a.element] || a.element);
      const bMatch = favorableElements.includes(ELEMENT_TO_WUXING[b.element] || b.element);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });

    setDrawnCards(sortedCards.slice(0, count));
    setIsRevealed(true);
  };

  const resetCards = () => {
    setDrawnCards([]);
    setIsRevealed(false);
  };

  const spreadConfig = {
    single: { count: 1, name: '單牌占卜', description: '簡單直接，解答當下問題' },
    three: { count: 3, name: '三牌陣', description: '過去-現在-未來的時間軸解讀' },
    celtic: { count: 5, name: '五行牌陣', description: '根據五行方位全面解析' },
  };

  const spreadPositions = {
    single: ['當前指引'],
    three: ['過去', '現在', '未來'],
    celtic: ['木位（東方）', '火位（南方）', '土位（中央）', '金位（西方）', '水位（北方）'],
  };

  return (
    <div className="space-y-8">
      {/* 標題 */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-fuchsia-500 to-purple-500 rounded-full" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">塔羅占卜</h2>
        <Wand2 className="w-5 h-5 text-fuchsia-500" />
      </div>

      {/* 說明 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-purple-900 via-fuchsia-900 to-purple-900 rounded-2xl text-white relative overflow-hidden"
      >
        {/* 星星背景 */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <Star
              key={i}
              className="absolute w-3 h-3 text-white animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-6 h-6 text-purple-300" />
            <h3 className="text-lg font-bold">命盤結合塔羅指引</h3>
            <Sun className="w-6 h-6 text-amber-300" />
          </div>
          <p className="text-purple-200 text-sm leading-relaxed">
            結合您的八字命盤特質，為您抽取最適合的塔羅牌。
            塔羅牌的象徵意義將與您的五行喜忌相呼應，提供更精準的指引。
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-purple-300">
            <Sparkles className="w-4 h-4" />
            <span>喜用五行：{analysis.favorable.join('、')}</span>
          </div>
        </div>
      </motion.div>

      {/* 牌陣選擇 */}
      <div className="grid grid-cols-3 gap-4">
        {(['single', 'three', 'celtic'] as const).map((spread) => (
          <button
            key={spread}
            onClick={() => {
              setSelectedSpread(spread);
              resetCards();
            }}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedSpread === spread
                ? 'border-fuchsia-500 bg-fuchsia-50'
                : 'border-slate-200 hover:border-fuchsia-300'
            }`}
          >
            <div className="text-lg font-bold text-slate-800 mb-1">
              {spreadConfig[spread].name}
            </div>
            <div className="text-xs text-slate-500">
              {spreadConfig[spread].description}
            </div>
          </button>
        ))}
      </div>

      {/* 抽牌按鈕 */}
      <div className="flex justify-center gap-4">
        {!isRevealed ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => drawCards(spreadConfig[selectedSpread].count)}
            className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/30 flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            揭示命運指引
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetCards}
            className="px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-xl flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重新抽牌
          </motion.button>
        )}
      </div>

      {/* 塔羅牌展示 */}
      <AnimatePresence mode="wait">
        {isRevealed && drawnCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="space-y-6"
          >
            {/* 牌面展示 */}
            <div className={`grid gap-6 ${
              selectedSpread === 'single' ? 'grid-cols-1 max-w-md mx-auto' :
              selectedSpread === 'three' ? 'grid-cols-3' : 'grid-cols-5'
            }`}>
              {drawnCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ rotateY: 180, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ delay: index * 0.3, duration: 0.6 }}
                  className="perspective-1000"
                >
                  <div className="p-6 bg-gradient-to-br from-purple-900 to-fuchsia-900 rounded-2xl text-white text-center relative overflow-hidden">
                    {/* 裝飾邊框 */}
                    <div className="absolute inset-2 border border-purple-400/30 rounded-xl" />

                    {/* 位置標籤 */}
                    <div className="text-xs text-purple-300 mb-3">
                      {spreadPositions[selectedSpread][index]}
                    </div>

                    {/* 牌面符號 */}
                    <div className="text-5xl mb-3">{card.symbol}</div>

                    {/* 牌名 */}
                    <div className="text-xl font-bold mb-2">{card.name}</div>

                    {/* 編號 */}
                    <div className="text-xs text-purple-400 mb-3">
                      {card.id === 0 ? '0' : card.id} · {card.element}
                    </div>

                    {/* 含義 */}
                    <div className="text-sm text-purple-200">{card.meaning}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 詳細解讀 */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: drawnCards.length * 0.3 + 0.5 }}
              className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-fuchsia-500" />
                塔羅指引解讀
              </h3>

              <div className="space-y-4">
                {drawnCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{card.symbol}</span>
                      <div>
                        <div className="font-bold text-slate-800">{card.name}</div>
                        <div className="text-xs text-slate-500">
                          {spreadPositions[selectedSpread][index]} · {card.element}屬性
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{card.meaning}</p>
                    <p className="text-sm text-fuchsia-600 font-medium">
                      💡 {card.advice}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 綜合指引 */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: drawnCards.length * 0.3 + 1 }}
              className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white"
            >
              <h3 className="text-lg font-bold mb-4">命盤與塔羅的綜合指引</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                根據您的八字命盤（{analysis.chart.day.gan}{analysis.chart.day.zhi}日主，{analysis.strength.verdict}），
                結合塔羅牌「{drawnCards[0].name}」的指引，
                {analysis.favorable.includes(ELEMENT_TO_WUXING[drawnCards[0].element] || '土' as WuXing)
                  ? '這張牌與您的喜用神相合，指引的方向特別值得重視。'
                  : '這張牌提醒您注意另一個面向的發展。'
                }
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mt-3">
                {qianShi && `「${qianShi.slice(0, 16)}...」配合塔羅指引，建議您${drawnCards[0].advice.slice(0, 20)}。`}
              </p>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 未抽牌時的佔位 */}
      {!isRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center"
        >
          <div className="w-24 h-36 mx-auto bg-gradient-to-br from-purple-200 to-fuchsia-200 rounded-xl flex items-center justify-center mb-4 border-2 border-purple-300">
            <span className="text-4xl">🎴</span>
          </div>
          <p className="text-slate-500">
            選擇牌陣後，點擊「揭示命運指引」開始占卜
          </p>
        </motion.div>
      )}
    </div>
  );
}
