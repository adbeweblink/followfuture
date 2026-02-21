'use client';

import { useState } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import BirthInputForm from '@/components/BirthInputForm';
import BaziDashboard from '@/components/BaziDashboard';
import type { BirthInput, BaZiAnalysis } from '@/lib/bazi/types';
import { performFullAnalysis } from '@/lib/bazi';

export default function Home() {
  const [analysis, setAnalysis] = useState<BaZiAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: BirthInput) => {
    setIsLoading(true);
    try {
      // 模擬短暫延遲讓使用者感受到處理中
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

  // 顯示 BaziDashboard
  if (analysis) {
    return (
      <BaziDashboard
        analysis={analysis}
        onBack={() => setAnalysis(null)}
      />
    );
  }

  // 顯示輸入表單
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-800 to-red-900 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider">八字命理分析系統</h1>
              <p className="text-red-200 text-sm">專業排盤 · 精準解讀</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 輸入表單 */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-stone-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-stone-800">開始您的命理分析</h2>
              <p className="text-stone-500 text-sm mt-2">
                請輸入您的出生資訊，系統將為您進行專業解盤
              </p>
            </div>

            <BirthInputForm onSubmit={handleSubmit} isLoading={isLoading} />

            <div className="mt-6 pt-6 border-t border-stone-100">
              <p className="text-xs text-stone-400 text-center">
                * 本系統僅供參考，命理分析結果不應作為重大決策的唯一依據
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-400 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm">
          <p>© 2026 八字命理分析系統 · 僅供參考</p>
        </div>
      </footer>
    </div>
  );
}
