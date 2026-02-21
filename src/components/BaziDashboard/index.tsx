'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  TrendingUp,
  Link2,
  Wand2,
  Heart,
  Info,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowUp,
} from 'lucide-react';
import type { BaZiAnalysis } from '@/lib/bazi/types';
import { TaijiSymbol } from '@/components/ui';

// Tab 內容元件 - 按傳統八字「年→月→日→時」順序重組
import OverviewTab from './tabs/OverviewTab';
import PersonalityTab from './tabs/PersonalityTab';
import RelationsTab from './tabs/RelationsTab';
import FortuneTab from './tabs/FortuneTab';
import AdviceTab from './tabs/AdviceTab';
import TarotTab from './tabs/TarotTab';

type TabId = 'overview' | 'personality' | 'relations' | 'fortune' | 'advice' | 'tarot';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  shortLabel: string;
}

const TABS: Tab[] = [
  { id: 'overview', label: '命盤總覽', shortLabel: '總覽', icon: Compass, color: 'from-amber-500 to-orange-500', description: '八字盤・格局・用神' },
  { id: 'personality', label: '性格解析', shortLabel: '性格', icon: Sparkles, color: 'from-purple-500 to-pink-500', description: '十神宮位・做事風格' },
  { id: 'relations', label: '人際六親', shortLabel: '六親', icon: Link2, color: 'from-rose-500 to-red-500', description: '六親關係・地支作用' },
  { id: 'fortune', label: '大運流年', shortLabel: '運勢', icon: TrendingUp, color: 'from-blue-500 to-cyan-500', description: '大運・流月・時機' },
  { id: 'advice', label: '開運指南', shortLabel: '開運', icon: Heart, color: 'from-teal-500 to-green-500', description: '改運建議・籤詩' },
  { id: 'tarot', label: '塔羅占卜', shortLabel: '塔羅', icon: Wand2, color: 'from-fuchsia-500 to-purple-500', description: '命理塔羅牌占卜' },
];

interface BaziDashboardProps {
  analysis: BaZiAnalysis;
  onBack?: () => void;
}

export default function BaziDashboard({ analysis, onBack }: BaziDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [visitedTabs, setVisitedTabs] = useState<Set<TabId>>(new Set(['overview']));
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 追蹤已瀏覽的 Tab
  useEffect(() => {
    setVisitedTabs(prev => new Set([...prev, activeTab]));
  }, [activeTab]);

  // 監聽滾動顯示回到頂部按鈕
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 當前 Tab 索引
  const currentIndex = TABS.findIndex(t => t.id === activeTab);
  const prevTab = currentIndex > 0 ? TABS[currentIndex - 1] : null;
  const nextTab = currentIndex < TABS.length - 1 ? TABS[currentIndex + 1] : null;

  // 生成籤詩（32字）
  const generateQianShi = (): string => {
    const dayElement = analysis.chart.day.ganElement;
    const strength = analysis.strength.verdict;

    const shiLines: Record<string, string> = {
      '木': '青龍昂首向天飛，',
      '火': '朱雀展翅照四方，',
      '土': '麒麟踏地穩根基，',
      '金': '白虎嘯風凌雲志，',
      '水': '玄武潛淵蓄大勢，',
    };

    const strengthLines: Record<string, string> = {
      '身極強': '龍騰虎躍勢難擋，',
      '身強': '乘風破浪正當時，',
      '身旺': '春風得意馬蹄疾，',
      '中和': '陰陽調和福自來，',
      '身弱': '借力使力方為妙，',
      '身衰': '韜光養晦待時機，',
      '身極弱': '以柔克剛終成事，',
    };

    const endLines = [
      '運籌帷幄天地寬。',
      '前程似錦路無疆。',
      '厚積薄發終圓滿。',
      '守得雲開見月明。',
    ];

    const line1 = shiLines[dayElement] || '命中註定有貴人，';
    const line2 = strengthLines[strength] || '順勢而為福祿全，';
    const line3 = analysis.favorable.includes('木')
      ? '東方有貴扶搖起，'
      : analysis.favorable.includes('水')
      ? '北方有緣助騰達，'
      : '五行調和萬事興，';
    const line4 = endLines[Math.floor(Math.random() * endLines.length)];

    return line1 + line2 + line3 + line4;
  };

  const qianShi = generateQianShi();

  const renderTabContent = () => {
    const props = { analysis, qianShi };

    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...props} />;
      case 'personality':
        return <PersonalityTab {...props} />;
      case 'relations':
        return <RelationsTab {...props} />;
      case 'fortune':
        return <FortuneTab {...props} />;
      case 'advice':
        return <AdviceTab {...props} />;
      case 'tarot':
        return <TarotTab {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50">
      {/* Header - 命盤概覽 */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* 東方裝飾元素 */}
        <div className="absolute top-4 right-4 opacity-10">
          <TaijiSymbol size={100} />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative">
          {/* 返回按鈕 */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-4 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              重新排盤
            </button>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* 左側 - 日主資訊 */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* 日主圓盤 - 強化動畫 */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="relative"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-amber-400/20">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-white">
                    {analysis.chart.day.gan}
                  </span>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-white text-xs font-bold text-amber-600 rounded-full shadow"
                >
                  {analysis.chart.day.ganElement}
                </motion.div>
              </motion.div>

              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-bold tracking-tight"
                >
                  {analysis.basic.name || `${analysis.chart.day.gan}${analysis.chart.day.ganElement}命`}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center gap-2 mt-2"
                >
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded">
                    {analysis.strength.verdict}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded">
                    {analysis.pattern.name}
                  </span>
                  <span className="px-2 py-1 bg-slate-500/20 text-slate-300 text-xs font-bold rounded">
                    {analysis.basic.gender}
                  </span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-400 text-sm mt-2"
                >
                  {analysis.basic.birthDate.toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </motion.p>
              </div>
            </div>

            {/* 右側 - 四柱快覽 */}
            <div className="flex gap-2 sm:gap-3">
              {[
                { pillar: analysis.chart.year, label: '年' },
                { pillar: analysis.chart.month, label: '月' },
                { pillar: analysis.chart.day, label: '日' },
                { pillar: analysis.chart.hour, label: '時' },
              ].map(({ pillar, label }, idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className={`flex flex-col items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
                    label === '日'
                      ? 'bg-amber-500/20 ring-2 ring-amber-400/50'
                      : 'bg-white/5'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 mb-1">{label}柱</span>
                  <span className="text-lg sm:text-xl font-serif font-bold text-white">
                    {pillar.gan}
                  </span>
                  <span className="text-lg sm:text-xl font-serif font-bold text-slate-300">
                    {pillar.zhi}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 32字籤詩 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-xl border border-amber-500/20"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-400 font-medium mb-1">命盤籤詩總結</p>
                <p className="text-amber-200 font-serif text-sm sm:text-base leading-relaxed tracking-wider">
                  「{qianShi}」
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Tab 導航 - 強化版 */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* 進度指示器 */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-xs text-slate-400">
              命盤解讀進度
            </span>
            <div className="flex items-center gap-1">
              {TABS.map((tab, idx) => (
                <div
                  key={tab.id}
                  className={`w-6 h-1 rounded-full transition-all ${
                    visitedTabs.has(tab.id)
                      ? activeTab === tab.id
                        ? 'bg-gradient-to-r ' + tab.color
                        : 'bg-emerald-400'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
              <span className="ml-2 text-xs text-slate-500">
                {visitedTabs.size}/{TABS.length}
              </span>
            </div>
          </div>

          {/* Tab 按鈕 */}
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {TABS.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isVisited = visitedTabs.has(tab.id);

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                    ${isActive
                      ? 'text-white shadow-lg'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-lg`}
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    {isVisited && !isActive && (
                      <Check className="w-3 h-3 text-emerald-500" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 當前 Tab 描述 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="py-2 text-xs text-slate-500 text-center border-t border-slate-100"
            >
              {TABS.find(t => t.id === activeTab)?.description}
            </motion.div>
          </AnimatePresence>
        </div>
      </nav>

      {/* Tab 內容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        {/* Tab 快捷導航 */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200">
          {prevTab ? (
            <button
              onClick={() => setActiveTab(prevTab.id)}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-slate-400">上一章</div>
                <div className="font-medium">{prevTab.label}</div>
              </div>
            </button>
          ) : (
            <div />
          )}

          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">當前章節</div>
            <div className="text-sm font-bold text-slate-800">
              {currentIndex + 1} / {TABS.length}
            </div>
          </div>

          {nextTab ? (
            <button
              onClick={() => setActiveTab(nextTab.id)}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors group"
            >
              <div className="text-right">
                <div className="text-xs text-slate-400">下一章</div>
                <div className="font-medium">{nextTab.label}</div>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Check className="w-5 h-5" />
              <span className="font-medium">完成解讀</span>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2026 八字命理分析系統 · 僅供參考，不作為重大決策依據</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <span>喜用神：{analysis.favorable.join('、')}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>忌神：{analysis.unfavorable.join('、')}</span>
          </div>

          {/* 快速導航 */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollToTop();
                }}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                }`}
              >
                {tab.shortLabel}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* 回到頂部按鈕 */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-slate-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
