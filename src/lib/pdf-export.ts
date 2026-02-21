/**
 * PDF 報告導出模組
 * 使用瀏覽器列印功能生成 PDF
 */

import type { BaZiAnalysis } from './bazi/types';
import { analyzeDayMaster } from './bazi/day-master';
import { analyzeMonthPillar } from './bazi/month-pillar';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

/** PDF 報告配置 */
export interface PdfReportConfig {
  title?: string;
  includeBasic?: boolean;         // 基本資料
  includeChart?: boolean;         // 八字盤
  includeDayMaster?: boolean;     // 日主分析
  includeMonthPillar?: boolean;   // 月柱分析
  includeStrength?: boolean;      // 身強身弱
  includePattern?: boolean;       // 格局
  includeWuxing?: boolean;        // 五行
  includeFavorable?: boolean;     // 喜用神
  includeLuckPillars?: boolean;   // 大運
  includeAnnual?: boolean;        // 流年
  includeHealth?: boolean;        // 健康
  includeCareer?: boolean;        // 職業
  includeRelationship?: boolean;  // 感情
}

const DEFAULT_CONFIG: PdfReportConfig = {
  title: '八字命理分析報告',
  includeBasic: true,
  includeChart: true,
  includeDayMaster: true,
  includeMonthPillar: true,
  includeStrength: true,
  includePattern: true,
  includeWuxing: true,
  includeFavorable: true,
  includeLuckPillars: true,
  includeAnnual: true,
  includeHealth: true,
  includeCareer: true,
  includeRelationship: true,
};

/**
 * 五行顏色對應
 */
const WUXING_COLORS: Record<string, string> = {
  '木': '#22c55e',
  '火': '#ef4444',
  '土': '#d97706',
  '金': '#f59e0b',
  '水': '#3b82f6',
};

/**
 * 生成 PDF 報告的 HTML 內容
 */
export function generatePdfHtml(analysis: BaZiAnalysis, config: PdfReportConfig = {}): string {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const dayMaster = analyzeDayMaster(analysis.chart.day.gan);
  const monthPillar = analyzeMonthPillar(analysis.chart);

  let html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>${cfg.title}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: "Microsoft JhengHei", "微軟正黑體", "PingFang TC", sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1f2937;
      background: white;
    }
    .page {
      page-break-after: always;
    }
    .page:last-child {
      page-break-after: auto;
    }
    h1 {
      font-size: 24pt;
      color: #dc2626;
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 3px solid #dc2626;
      padding-bottom: 10px;
    }
    h2 {
      font-size: 14pt;
      color: #1f2937;
      margin: 20px 0 10px;
      padding-left: 10px;
      border-left: 4px solid #dc2626;
    }
    h3 {
      font-size: 12pt;
      color: #374151;
      margin: 15px 0 8px;
    }
    p {
      margin: 8px 0;
      text-align: justify;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    .info-table th, .info-table td {
      border: 1px solid #d1d5db;
      padding: 8px 12px;
      text-align: left;
    }
    .info-table th {
      background: #f3f4f6;
      font-weight: bold;
      width: 120px;
    }
    .bazi-chart {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 20px 0;
    }
    .pillar {
      text-align: center;
      padding: 15px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      min-width: 80px;
    }
    .pillar.day-pillar {
      border-color: #dc2626;
      background: #fef2f2;
    }
    .pillar-label {
      font-size: 10pt;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .pillar-gan, .pillar-zhi {
      font-size: 20pt;
      font-weight: bold;
      margin: 5px 0;
    }
    .hidden-stems {
      font-size: 9pt;
      color: #9ca3af;
      margin-top: 5px;
    }
    .wuxing-bar {
      display: flex;
      height: 25px;
      border-radius: 4px;
      overflow: hidden;
      margin: 10px 0;
    }
    .wuxing-segment {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 9pt;
      font-weight: bold;
    }
    .tag {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 9pt;
      margin: 2px;
    }
    .tag-green { background: #dcfce7; color: #166534; }
    .tag-red { background: #fee2e2; color: #991b1b; }
    .tag-blue { background: #dbeafe; color: #1e40af; }
    .tag-yellow { background: #fef3c7; color: #92400e; }
    .score-bar {
      width: 100%;
      height: 20px;
      background: #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      margin: 5px 0;
    }
    .score-fill {
      height: 100%;
      border-radius: 10px;
    }
    .score-high { background: linear-gradient(90deg, #22c55e, #16a34a); }
    .score-medium { background: linear-gradient(90deg, #f59e0b, #d97706); }
    .score-low { background: linear-gradient(90deg, #ef4444, #dc2626); }
    .luck-pillar-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 10px 0;
    }
    .luck-pillar-item {
      padding: 8px 15px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      text-align: center;
      min-width: 70px;
    }
    .footer {
      text-align: center;
      font-size: 9pt;
      color: #9ca3af;
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #e5e7eb;
    }
    ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    li {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="page">
    <h1>${cfg.title}</h1>
`;

  // 基本資料
  if (cfg.includeBasic) {
    const birthDate = format(analysis.basic.birthDate, 'yyyy年M月d日 HH:mm', { locale: zhTW });
    html += `
    <h2>基本資料</h2>
    <table class="info-table">
      <tr><th>姓名</th><td>${analysis.basic.name || '未提供'}</td></tr>
      <tr><th>性別</th><td>${analysis.basic.gender}</td></tr>
      <tr><th>出生時間</th><td>${birthDate}</td></tr>
    </table>
`;
  }

  // 八字盤
  if (cfg.includeChart) {
    const pillars = [
      { pillar: analysis.chart.hour, label: '時柱' },
      { pillar: analysis.chart.day, label: '日柱', isDay: true },
      { pillar: analysis.chart.month, label: '月柱' },
      { pillar: analysis.chart.year, label: '年柱' },
    ];

    html += `
    <h2>本命八字盤</h2>
    <p style="text-align: center; color: #6b7280; font-size: 10pt;">傳統排列：年月日時（從右到左）</p>
    <div class="bazi-chart">
`;
    for (const { pillar, label, isDay } of pillars) {
      const hiddenStems = pillar.hiddenStems.map(h => h.gan).join(' ');
      html += `
      <div class="pillar${isDay ? ' day-pillar' : ''}">
        <div class="pillar-label">${label}${isDay ? '（日主）' : ''}</div>
        <div class="pillar-gan" style="color: ${WUXING_COLORS[pillar.ganElement]}">${pillar.gan}</div>
        <div class="pillar-zhi" style="color: ${WUXING_COLORS[pillar.zhiElement]}">${pillar.zhi}</div>
        <div class="hidden-stems">${hiddenStems}</div>
      </div>
`;
    }
    html += `
    </div>
`;
  }

  // 日主分析
  if (cfg.includeDayMaster) {
    html += `
    <h2>日主分析 - ${dayMaster.gan}${dayMaster.element}（${dayMaster.nickname}）</h2>
    <p><strong>本質特性：</strong>${dayMaster.nature}</p>
    <p><strong>核心性格：</strong>${dayMaster.personality.core}</p>
    <h3>優點</h3>
    <ul>
      ${dayMaster.personality.strengths.map(s => `<li>${s}</li>`).join('')}
    </ul>
    <h3>需注意</h3>
    <ul>
      ${dayMaster.personality.weaknesses.map(w => `<li>${w}</li>`).join('')}
    </ul>
    <p><strong>人生課題：</strong>${dayMaster.lifeLesson}</p>
`;
  }

  html += `
  </div>
  <div class="page">
`;

  // 月柱分析
  if (cfg.includeMonthPillar) {
    html += `
    <h2>月柱分析 - ${monthPillar.gan}${monthPillar.zhi}（${monthPillar.monthName}）</h2>
    <p><strong>社會形象：</strong>${monthPillar.socialImage}</p>
    <p><strong>外在風格：</strong>${monthPillar.externalStyle}</p>
    <h3>父母緣</h3>
    <p>${monthPillar.parentRelation.overview}</p>
    <h3>青年運勢（17-32歲）</h3>
    <p>${monthPillar.youthFortune}</p>
`;
  }

  // 身強身弱
  if (cfg.includeStrength) {
    const strength = analysis.strength;
    html += `
    <h2>身強身弱分析</h2>
    <table class="info-table">
      <tr><th>判定結果</th><td><strong>${strength.verdict}</strong>（${strength.score}分）</td></tr>
      <tr><th>得令</th><td>${strength.deLing ? '是' : '否'}</td></tr>
      <tr><th>得地</th><td>${strength.deDi ? '是' : '否'}（${strength.deDiScore}分）</td></tr>
      <tr><th>得勢</th><td>${strength.deShi ? '是' : '否'}</td></tr>
    </table>
    <p><strong>分析說明：</strong>${strength.reason.join('；')}</p>
`;
  }

  // 格局
  if (cfg.includePattern) {
    const pattern = analysis.pattern;
    html += `
    <h2>格局分析</h2>
    <table class="info-table">
      <tr><th>格局名稱</th><td><strong>${pattern.name}</strong></td></tr>
      <tr><th>格局類型</th><td>${pattern.type}</td></tr>
      <tr><th>格局狀態</th><td>${pattern.status}</td></tr>
    </table>
    <p>${pattern.description}</p>
`;
  }

  // 五行
  if (cfg.includeWuxing) {
    const wuxing = analysis.wuXingPercentage;
    const total = Object.values(wuxing).reduce((a, b) => a + b, 0);
    html += `
    <h2>五行分布</h2>
    <div class="wuxing-bar">
`;
    for (const [el, value] of Object.entries(wuxing)) {
      const pct = total > 0 ? (value / total * 100).toFixed(1) : 0;
      if (Number(pct) > 0) {
        html += `<div class="wuxing-segment" style="width: ${pct}%; background: ${WUXING_COLORS[el]}">${el} ${pct}%</div>`;
      }
    }
    html += `
    </div>
    <table class="info-table">
      <tr>
        <th>木</th><th>火</th><th>土</th><th>金</th><th>水</th>
      </tr>
      <tr>
        <td>${wuxing['木'].toFixed(1)}%</td>
        <td>${wuxing['火'].toFixed(1)}%</td>
        <td>${wuxing['土'].toFixed(1)}%</td>
        <td>${wuxing['金'].toFixed(1)}%</td>
        <td>${wuxing['水'].toFixed(1)}%</td>
      </tr>
    </table>
`;
  }

  // 喜用神
  if (cfg.includeFavorable) {
    html += `
    <h2>喜用神忌神</h2>
    <p><strong>喜用神：</strong>
      ${analysis.favorable.map(f => `<span class="tag tag-green">${f}</span>`).join('')}
    </p>
    <p><strong>忌神：</strong>
      ${analysis.unfavorable.map(u => `<span class="tag tag-red">${u}</span>`).join('')}
    </p>
`;
    if (analysis.preferenceAnalysis) {
      html += `<p>${analysis.preferenceAnalysis.description}</p>`;
    }
  }

  html += `
  </div>
  <div class="page">
`;

  // 大運
  if (cfg.includeLuckPillars && analysis.luckPillars) {
    html += `
    <h2>大運走勢</h2>
    <div class="luck-pillar-list">
`;
    for (const lp of analysis.luckPillars.slice(0, 8)) {
      const scoreClass = lp.score >= 65 ? 'score-high' : lp.score >= 45 ? 'score-medium' : 'score-low';
      html += `
      <div class="luck-pillar-item">
        <div style="font-weight: bold">${lp.ganZhi}</div>
        <div style="font-size: 9pt; color: #6b7280">${lp.ageStart}-${lp.ageEnd}歲</div>
        <div class="score-bar"><div class="score-fill ${scoreClass}" style="width: ${lp.score}%"></div></div>
        <div style="font-size: 9pt">${lp.score}分</div>
      </div>
`;
    }
    html += `
    </div>
`;
  }

  // 流年
  if (cfg.includeAnnual && analysis.annualFortune) {
    const af = analysis.annualFortune;
    html += `
    <h2>流年運勢 - ${af.year}年</h2>
    <p><strong>主題：</strong>${af.theme}</p>
    <p><strong>運勢評分：</strong>${af.score}分</p>
    <p><strong>核心策略：</strong>${af.coreStrategy}</p>
`;
  }

  // 健康
  if (cfg.includeHealth && analysis.healthReport) {
    html += `
    <h2>健康分析</h2>
    <p><strong>體質總評：</strong>${analysis.healthReport.constitution}</p>
    <p><strong>概述：</strong>${analysis.healthReport.summary}</p>
    <h3>養生建議</h3>
    <ul>
      ${analysis.healthReport.seasonalAdvice.map(a => `<li>${a}</li>`).join('')}
    </ul>
`;
  }

  html += `
  </div>
  <div class="page">
`;

  // 職業
  if (cfg.includeCareer && analysis.career) {
    html += `
    <h2>職業分析</h2>
    <p><strong>發展策略：</strong>${analysis.career.strategy}</p>
    <p>${analysis.career.description}</p>
    <h3>適合的行業方向</h3>
    <ul>
`;
    for (const ind of analysis.career.suitableIndustries) {
      html += `<li><strong>${ind.element}行業：</strong>${ind.jobs}（${ind.reason}）</li>`;
    }
    html += `
    </ul>
`;
  }

  // 感情
  if (cfg.includeRelationship && analysis.relationship) {
    const rel = analysis.relationship;
    html += `
    <h2>感情婚姻分析</h2>
    <h3>配偶宮</h3>
    <p>${rel.spousePalace.analysis}</p>
    <h3>配偶星</h3>
    <p>${rel.spouseStar.status}</p>
    <p>${rel.spouseStar.advice}</p>
    <h3>桃花運</h3>
    <p>${rel.peachBlossom.analysis}</p>
    <h3>婚姻時機</h3>
    <p>${rel.marriageTiming}</p>
    <h3>綜合建議</h3>
    <p>${rel.overallAdvice}</p>
`;
  }

  // 結尾
  html += `
    <div class="footer">
      <p>本報告由八字命理分析系統生成</p>
      <p>生成時間：${format(new Date(), 'yyyy年M月d日 HH:mm', { locale: zhTW })}</p>
      <p style="color: #d1d5db; margin-top: 5px;">命理分析僅供參考，人生掌握在自己手中</p>
    </div>
  </div>
</body>
</html>
`;

  return html;
}

/**
 * 開啟列印視窗導出 PDF
 */
export function exportToPdf(analysis: BaZiAnalysis, config?: PdfReportConfig): void {
  const html = generatePdfHtml(analysis, config);

  // 建立新視窗並列印
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    // 等待內容載入後列印
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

/**
 * 下載 HTML 報告（可在瀏覽器中開啟後另存為 PDF）
 */
export function downloadHtmlReport(analysis: BaZiAnalysis, config?: PdfReportConfig): void {
  const html = generatePdfHtml(analysis, config);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `八字命理報告_${analysis.basic.name || '命主'}_${format(new Date(), 'yyyyMMdd')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
