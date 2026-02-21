/**
 * 報告生成器
 * 整合所有文案模板，生成完整的八字分析報告
 */

import type { BaZiAnalysis, WuXing, ShiShen } from './types';
import {
  generateDayMasterAnalysis,
  generateWuXingAdvice,
  getHealthAdvice,
  getCareerAdvice,
  generateTenGodAnalysis,
  generatePatternAnalysis,
  generateStrengthAnalysis,
  generateFavorableAdvice,
  TEN_GOD_DESCRIPTIONS,
  WUXING_DESCRIPTIONS,
} from '@/data/copywriting';

export interface ReportSection {
  title: string;
  content: string;
  icon?: string;
}

export interface FullReport {
  title: string;
  subtitle: string;
  generatedAt: Date;
  sections: ReportSection[];
}

/**
 * 生成完整的八字分析報告
 */
export function generateFullReport(analysis: BaZiAnalysis): FullReport {
  const sections: ReportSection[] = [];

  // 1. 基本資訊
  sections.push({
    title: '基本命盤資訊',
    icon: '📋',
    content: generateBasicInfo(analysis),
  });

  // 2. 元神分析（日主五行）
  sections.push({
    title: '元神特質',
    icon: '✨',
    content: generateDayMasterAnalysis(analysis.chart.day.ganElement),
  });

  // 3. 身強弱分析
  sections.push({
    title: '身強身弱分析',
    icon: '⚖️',
    content: generateStrengthAnalysis(
      analysis.chart.day.ganElement,
      analysis.strength.verdict,
      analysis.strength.deLing,
      analysis.strength.deDiScore,
      analysis.strength.deShi
    ),
  });

  // 4. 格局分析
  sections.push({
    title: '格局判定',
    icon: '🎯',
    content: generatePatternAnalysis(
      analysis.pattern.name,
      analysis.pattern.status
    ),
  });

  // 5. 十神分析
  sections.push({
    title: '十神配置',
    icon: '🔮',
    content: generateTenGodSection(analysis),
  });

  // 6. 五行分析
  sections.push({
    title: '五行分布',
    icon: '🌊',
    content: generateWuXingSection(analysis),
  });

  // 7. 喜用神分析
  const isStrongForFavorable = ['身極強', '身強', '身旺'].includes(analysis.strength.verdict);
  sections.push({
    title: '用神喜忌',
    icon: '💫',
    content: generateFavorableAdvice(
      analysis.favorable,
      analysis.unfavorable,
      isStrongForFavorable
    ),
  });

  // 8. 地支關係
  if (analysis.branchRelations.length > 0) {
    sections.push({
      title: '地支關係',
      icon: '🔗',
      content: generateBranchRelationsSection(analysis),
    });
  }

  // 9. 大運概覽
  if (analysis.luckPillars.length > 0) {
    sections.push({
      title: '大運走勢',
      icon: '📈',
      content: generateLuckPillarsSection(analysis),
    });
  }

  // 10. 健康建議
  sections.push({
    title: '健康提醒',
    icon: '❤️',
    content: getHealthAdvice(analysis.chart.day.ganElement),
  });

  // 11. 職業建議
  sections.push({
    title: '職業方向',
    icon: '💼',
    content: getCareerAdvice(analysis.chart.day.ganElement, analysis.favorable),
  });

  // 12. 綜合建議
  sections.push({
    title: '綜合建議',
    icon: '💡',
    content: generateOverallAdvice(analysis),
  });

  return {
    title: `${analysis.basic.name || analysis.chart.day.gan + '日主'}命盤分析報告`,
    subtitle: `${analysis.chart.day.gan}${analysis.chart.day.ganElement}命 · ${analysis.pattern.name} · ${analysis.strength.verdict}`,
    generatedAt: new Date(),
    sections,
  };
}

/**
 * 生成基本資訊區塊
 */
function generateBasicInfo(analysis: BaZiAnalysis): string {
  const { basic, chart } = analysis;

  let info = `**姓名**：${basic.name || '未提供'}\n`;
  info += `**性別**：${basic.gender}\n`;
  info += `**出生時間**：${basic.birthDate.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })}\n\n`;

  info += `**四柱八字**：\n`;
  info += `┌─────┬─────┬─────┬─────┐\n`;
  info += `│ 年柱 │ 月柱 │ 日柱 │ 時柱 │\n`;
  info += `├─────┼─────┼─────┼─────┤\n`;
  info += `│ ${chart.year.gan}${chart.year.zhi} │ ${chart.month.gan}${chart.month.zhi} │ ${chart.day.gan}${chart.day.zhi} │ ${chart.hour.gan}${chart.hour.zhi} │\n`;
  info += `└─────┴─────┴─────┴─────┘\n\n`;

  info += `**日主**：${chart.day.gan}（${chart.day.ganElement}）\n`;
  info += `**格局**：${analysis.pattern.name}（${analysis.pattern.type}）\n`;
  info += `**身強弱**：${analysis.strength.verdict}`;

  return info;
}

/**
 * 生成十神分析區塊
 */
function generateTenGodSection(analysis: BaZiAnalysis): string {
  const tenGodCounts: Record<ShiShen, number> = {
    '比肩': 0, '劫財': 0, '食神': 0, '傷官': 0, '偏財': 0,
    '正財': 0, '七殺': 0, '正官': 0, '偏印': 0, '正印': 0,
  };

  // 統計天干十神
  for (const pillar of [analysis.chart.year, analysis.chart.month, analysis.chart.hour]) {
    if (pillar.ganShiShen) {
      tenGodCounts[pillar.ganShiShen]++;
    }
  }

  // 統計地支藏干十神
  for (const pillar of [analysis.chart.year, analysis.chart.month, analysis.chart.day, analysis.chart.hour]) {
    for (const hidden of pillar.hiddenStems) {
      if (hidden.shiShen) {
        tenGodCounts[hidden.shiShen] += hidden.weight;
      }
    }
  }

  let content = generateTenGodAnalysis(tenGodCounts, analysis.chart.day.gan);

  // 列出十神分布
  content += '\n\n**十神分布統計**：\n';
  const sorted = Object.entries(tenGodCounts)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  for (const [god, count] of sorted) {
    const desc = TEN_GOD_DESCRIPTIONS[god as ShiShen];
    content += `• ${god}：${count.toFixed(1)} — ${desc.keywords.slice(0, 3).join('、')}\n`;
  }

  return content;
}

/**
 * 生成五行分析區塊
 */
function generateWuXingSection(analysis: BaZiAnalysis): string {
  let content = '';

  // 五行分布
  const wuXingOrder: WuXing[] = ['木', '火', '土', '金', '水'];
  content += '**五行能量分布**：\n';

  for (const element of wuXingOrder) {
    const count = analysis.wuXing[element] || 0;
    const pct = analysis.wuXingPercentage[element] || 0;
    const bar = '█'.repeat(Math.round(pct / 5)) + '░'.repeat(20 - Math.round(pct / 5));
    const desc = WUXING_DESCRIPTIONS[element];
    content += `${desc.symbol} ${element}：${bar} ${pct}%\n`;
  }

  content += '\n';

  // 五行調候建議
  const isStrong = ['身極強', '身強', '身旺'].includes(analysis.strength.verdict);
  content += generateWuXingAdvice(
    analysis.chart.day.ganElement,
    analysis.wuXing,
    isStrong
  );

  return content;
}

/**
 * 生成地支關係區塊
 */
function generateBranchRelationsSection(analysis: BaZiAnalysis): string {
  let content = `命盤中共發現 ${analysis.branchRelations.length} 組地支關係：\n\n`;

  const positiveRelations = analysis.branchRelations.filter(r =>
    ['六合', '三合', '半合', '三會', '暗合'].includes(r.type)
  );
  const negativeRelations = analysis.branchRelations.filter(r =>
    ['六沖', '三刑', '自刑', '六害'].includes(r.type)
  );

  if (positiveRelations.length > 0) {
    content += '**吉利關係**（合局）：\n';
    for (const rel of positiveRelations) {
      content += `✅ ${rel.type}：${rel.branches.join('')}`;
      if (rel.result) content += ` → 化${rel.result}`;
      content += `\n   ${rel.description}\n`;
    }
    content += '\n';
  }

  if (negativeRelations.length > 0) {
    content += '**需注意關係**（刑沖害）：\n';
    for (const rel of negativeRelations) {
      content += `⚠️ ${rel.type}：${rel.branches.join('')}\n`;
      content += `   ${rel.description}\n`;
    }
  }

  if (positiveRelations.length > negativeRelations.length) {
    content += '\n💬 整體而言，命盤地支關係以合局為主，人緣較好，貴人運較旺。';
  } else if (negativeRelations.length > positiveRelations.length) {
    content += '\n💬 整體而言，命盤地支關係以刑沖為主，處事需謹慎，注意人際關係經營。';
  }

  return content;
}

/**
 * 生成大運區塊
 */
function generateLuckPillarsSection(analysis: BaZiAnalysis): string {
  let content = '**十年大運走勢**：\n\n';

  const favorable = new Set(analysis.favorable);

  for (const pillar of analysis.luckPillars) {
    const ganElement = pillar.ganZhi[0]; // 簡化：取天干
    content += `【${pillar.ageStart}-${pillar.ageEnd} 歲】${pillar.ganZhi}\n`;
  }

  content += '\n💬 大運每十年一換，結合流年分析更加準確。建議每年初查看當年流年運勢。';

  return content;
}

/**
 * 生成綜合建議
 */
function generateOverallAdvice(analysis: BaZiAnalysis): string {
  const isStrong = ['身極強', '身強', '身旺'].includes(analysis.strength.verdict);

  let advice = '';

  // 根據身強弱給出方向
  if (isStrong) {
    advice += '**發展方向**：\n';
    advice += '您的命盤日主身強，能量充沛，適合追求事業和財富。建議：\n';
    advice += '• 可以承擔較大的挑戰和責任\n';
    advice += '• 適合創業或擔任領導角色\n';
    advice += '• 宜找到發揮能量的出口\n\n';
  } else {
    advice += '**發展方向**：\n';
    advice += '您的命盤日主身弱，宜借力使力。建議：\n';
    advice += '• 選擇穩定的發展環境\n';
    advice += '• 善用團隊和貴人的力量\n';
    advice += '• 不宜單打獨鬥，合作共贏\n\n';
  }

  // 格局建議
  advice += '**格局特點**：\n';
  advice += `您的格局為「${analysis.pattern.name}」（${analysis.pattern.type}），`;
  advice += `${analysis.pattern.description}\n\n`;

  // 用神建議
  advice += '**開運建議**：\n';
  advice += `• 喜用五行：${analysis.favorable.join('、')}\n`;
  advice += `• 可多接觸相關顏色：${analysis.favorable.map(e => WUXING_DESCRIPTIONS[e].color).join('、')}\n`;
  advice += `• 有利方位：${analysis.favorable.map(e => WUXING_DESCRIPTIONS[e].direction).join('、')}\n`;

  return advice;
}

/**
 * 生成簡短版報告（用於免費版）
 */
export function generateShortReport(analysis: BaZiAnalysis): FullReport {
  const sections: ReportSection[] = [];

  // 只包含基本資訊和簡單分析
  sections.push({
    title: '基本命盤',
    icon: '📋',
    content: generateBasicInfo(analysis),
  });

  sections.push({
    title: '核心特質',
    icon: '✨',
    content: `您的元神屬「${analysis.chart.day.ganElement}」，${analysis.strength.verdict}。\n` +
      `格局為「${analysis.pattern.name}」。\n\n` +
      `想了解更詳細的分析？升級完整版報告可獲得：\n` +
      `• 十神配置詳解\n` +
      `• 五行調候建議\n` +
      `• 用神喜忌分析\n` +
      `• 地支關係解讀\n` +
      `• 大運流年預測\n` +
      `• 職業健康建議`,
  });

  return {
    title: `${analysis.basic.name || '命盤'}基礎分析`,
    subtitle: `${analysis.chart.day.gan}${analysis.chart.day.ganElement}命`,
    generatedAt: new Date(),
    sections,
  };
}
