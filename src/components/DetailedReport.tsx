'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Download } from 'lucide-react';
import type { FullReport, ReportSection } from '@/lib/bazi/report-generator';

interface DetailedReportProps {
  report: FullReport;
}

function ReportSectionCard({ section, defaultOpen = false }: { section: ReportSection; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {section.icon && <span className="text-xl">{section.icon}</span>}
          <h3 className="text-lg font-bold text-stone-800">{section.title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-stone-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-stone-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-stone-100">
          <div className="pt-4 prose prose-stone prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-stone-700 leading-relaxed">
              {section.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DetailedReport({ report }: DetailedReportProps) {
  const [expandAll, setExpandAll] = useState(false);

  const handleDownloadTxt = () => {
    let content = `${report.title}\n`;
    content += `${'='.repeat(40)}\n`;
    content += `${report.subtitle}\n`;
    content += `生成時間：${report.generatedAt.toLocaleString('zh-TW')}\n\n`;

    for (const section of report.sections) {
      content += `\n【${section.title}】\n`;
      content += `${'-'.repeat(30)}\n`;
      content += `${section.content}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `八字分析報告_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* 報告標題 */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold">{report.title}</h2>
            </div>
            <p className="text-red-200">{report.subtitle}</p>
            <p className="text-red-300 text-sm mt-2">
              生成時間：{report.generatedAt.toLocaleString('zh-TW')}
            </p>
          </div>
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            下載報告
          </button>
        </div>
      </div>

      {/* 展開/收合控制 */}
      <div className="flex justify-end">
        <button
          onClick={() => setExpandAll(!expandAll)}
          className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1"
        >
          {expandAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              收合全部
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              展開全部
            </>
          )}
        </button>
      </div>

      {/* 報告區塊 */}
      <div className="space-y-3">
        {report.sections.map((section, index) => (
          <ReportSectionCard
            key={index}
            section={section}
            defaultOpen={expandAll || index < 3} // 預設展開前三個
          />
        ))}
      </div>

      {/* 免責聲明 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <p className="font-bold mb-1">⚠️ 免責聲明</p>
        <p>
          本報告僅供參考，不應作為重大人生決策的唯一依據。
          命理分析是一門統計學，反映的是機率而非必然。
          建議結合自身實際情況和專業命理師的建議綜合判斷。
        </p>
      </div>
    </div>
  );
}
