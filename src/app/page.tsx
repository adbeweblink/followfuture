'use client';

import { useState, useEffect } from 'react';
import { Flame, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthInputForm from '@/components/BirthInputForm';
import BaziDashboard from '@/components/BaziDashboard';
import type { BirthInput, BaZiAnalysis } from '@/lib/bazi/types';
import { performFullAnalysis } from '@/lib/bazi';

export default function Home() {
  const [analysis, setAnalysis] = useState<BaZiAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHero, setShowHero] = useState(true);
  // SSR 時保持可見（Netlify 截圖），hydrate 後才啟動動畫
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (input: BirthInput) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const result = performFullAnalysis(input);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing bazi:', error);
      const errorMessage = error instanceof Error ? error.message : '未知錯誤';
      const errorStack = error instanceof Error ? error.stack : '';
      console.error('Error stack:', errorStack);
      alert(`解盤過程發生錯誤：${errorMessage}\n\n請檢查 Console 獲取詳細資訊。`);
    } finally {
      setIsLoading(false);
    }
  };

  if (analysis) {
    return (
      <BaziDashboard
        analysis={analysis}
        onBack={() => setAnalysis(null)}
      />
    );
  }

  if (showHero) {
    return (
      <div className="relative min-h-screen min-h-[100dvh] overflow-hidden">
        {/* 背景圖 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-bg.png)' }}
        />
        {/* 暗化遮罩確保文字可讀 */}
        <div className="absolute inset-0 bg-black/30" />

        {/* 主內容 */}
        <div data-hero-content className="relative z-10 flex flex-col items-center justify-center min-h-screen min-h-[100dvh] px-4 text-center">
          {/* 頂部裝飾線 */}
          <motion.div
            initial={mounted ? { scaleX: 0 } : false}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6 sm:mb-8"
          />

          {/* 副標題 */}
          <motion.p
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-amber-300/90 text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.5em] uppercase font-medium mb-3 sm:mb-4"
          >
            奇門遁甲 · 命理堪輿
          </motion.p>

          {/* 主標題 */}
          <motion.h1
            initial={mounted ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            八字命理分析
          </motion.h1>

          {/* 描述 */}
          <motion.p
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-stone-300 text-sm sm:text-base md:text-lg max-w-md sm:max-w-lg mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
          >
            融合千年命理智慧與現代演算技術
            <br className="hidden sm:block" />
            <span className="sm:hidden">，</span>
            為您精準解讀生命密碼
          </motion.p>

          {/* CTA 按鈕 */}
          <motion.button
            initial={mounted ? { opacity: 0, scale: 0.9 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(217, 119, 6, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowHero(false)}
            className="group relative px-8 sm:px-12 py-3.5 sm:py-4 bg-gradient-to-r from-amber-600 to-red-700 text-white rounded-full text-base sm:text-lg font-medium tracking-wider shadow-2xl shadow-amber-900/30 transition-all duration-300 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              開始解盤
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          {/* 底部裝飾線 */}
          <motion.div
            initial={mounted ? { scaleX: 0 } : false}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
            className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-10 sm:mt-16"
          />

          {/* 向下提示 */}
          <motion.div
            initial={mounted ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              onClick={() => setShowHero(false)}
              className="cursor-pointer text-amber-400/60 hover:text-amber-400 transition-colors"
            >
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100"
      >
        {/* Header */}
        <header className="bg-gradient-to-r from-red-800 to-red-900 text-white shadow-lg">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-wider">八字命理分析系統</h1>
                <p className="text-red-200 text-xs sm:text-sm">專業排盤 · 精準解讀</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-stone-200"
            >
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-800">開始您的命理分析</h2>
                <p className="text-stone-500 text-xs sm:text-sm mt-2">
                  請輸入您的出生資訊，系統將為您進行專業解盤
                </p>
              </div>

              <BirthInputForm onSubmit={handleSubmit} isLoading={isLoading} />

              <div className="mt-6 pt-6 border-t border-stone-100">
                <p className="text-xs text-stone-400 text-center">
                  * 本系統僅供參考，命理分析結果不應作為重大決策的唯一依據
                </p>
              </div>
            </motion.div>
          </div>
        </main>

        <footer className="bg-stone-800 text-stone-400 py-6 mt-12">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm">
            <p>© 2026 八字命理分析系統 · 僅供參考</p>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
