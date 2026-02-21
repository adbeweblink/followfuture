/**
 * 五行統計與分析模組
 */

import type { BaZiChart, WuXing, WuXingStats, TianGan, DiZhi } from './types';
import {
  TIAN_GAN_ELEMENT,
  HIDDEN_STEMS,
  HIDDEN_STEM_WEIGHT,
  WUXING_COLOR,
} from '@/data/constants';

/**
 * 初始化空的五行統計
 */
function createEmptyWuXingStats(): WuXingStats {
  return { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
}

/**
 * 統計八字盤中的五行分布
 */
export function calculateWuXingStats(chart: BaZiChart): WuXingStats {
  const stats = createEmptyWuXingStats();

  // 天干（權重 1.0）
  const stems: TianGan[] = [chart.year.gan, chart.month.gan, chart.day.gan, chart.hour.gan];
  for (const stem of stems) {
    const element = TIAN_GAN_ELEMENT[stem];
    stats[element] += 1.0;
  }

  // 地支藏干（按本氣/中氣/餘氣權重）
  const branches: DiZhi[] = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi];
  for (const branch of branches) {
    const hidden = HIDDEN_STEMS[branch];

    // 本氣
    const mainElement = TIAN_GAN_ELEMENT[hidden.main];
    stats[mainElement] += HIDDEN_STEM_WEIGHT.main;

    // 中氣
    if (hidden.middle) {
      const middleElement = TIAN_GAN_ELEMENT[hidden.middle];
      stats[middleElement] += HIDDEN_STEM_WEIGHT.middle;
    }

    // 餘氣
    if (hidden.residue) {
      const residueElement = TIAN_GAN_ELEMENT[hidden.residue];
      stats[residueElement] += HIDDEN_STEM_WEIGHT.residue;
    }
  }

  return stats;
}

/**
 * 轉換為百分比
 */
export function calculateWuXingPercentage(stats: WuXingStats): WuXingStats {
  const total = Object.values(stats).reduce((sum, val) => sum + val, 0);

  if (total === 0) {
    return { 木: 20, 火: 20, 土: 20, 金: 20, 水: 20 };
  }

  return {
    木: Math.round((stats.木 / total) * 100),
    火: Math.round((stats.火 / total) * 100),
    土: Math.round((stats.土 / total) * 100),
    金: Math.round((stats.金 / total) * 100),
    水: Math.round((stats.水 / total) * 100),
  };
}

/**
 * 獲取五行強弱描述
 */
export function getWuXingDescription(percentage: number): string {
  if (percentage >= 40) return '極旺';
  if (percentage >= 25) return '旺';
  if (percentage >= 15) return '平';
  if (percentage >= 8) return '弱';
  return '極弱';
}

/**
 * 獲取五行狀態（用於健康分析）
 */
export function getWuXingStatus(
  element: WuXing,
  percentage: number,
  dayElement: WuXing
): { status: string; emoji: string } {
  const isMyElement = element === dayElement;

  if (percentage >= 40) {
    return { status: '過旺', emoji: '🔥' };
  }
  if (percentage >= 25) {
    return { status: '旺', emoji: '💪' };
  }
  if (percentage >= 15) {
    return { status: '平衡', emoji: '⚖️' };
  }
  if (percentage >= 8) {
    return { status: '偏弱', emoji: '📉' };
  }

  // 根據相剋關係給出更具體的狀態
  if (dayElement === '火' && element === '水') {
    return { status: '蒸發 (枯竭)', emoji: '💧' };
  }
  if (dayElement === '火' && element === '金') {
    return { status: '熔化 (受傷)', emoji: '⚔️' };
  }
  if (dayElement === '水' && element === '火') {
    return { status: '被剋 (受制)', emoji: '🌊' };
  }
  if (dayElement === '木' && element === '金') {
    return { status: '被砍 (受傷)', emoji: '🪓' };
  }

  return { status: '極弱 (缺失)', emoji: '⚠️' };
}

/**
 * 分析用神喜忌（簡化版）
 */
export function analyzePreference(
  dayElement: WuXing,
  isStrong: boolean
): { favorable: WuXing[]; unfavorable: WuXing[] } {
  // 五行相生鏈：木→火→土→金→水→木
  // 五行相剋鏈：木→土→水→火→金→木

  const shengMap: Record<WuXing, WuXing> = {
    木: '火', 火: '土', 土: '金', 金: '水', 水: '木',
  };
  const keMap: Record<WuXing, WuXing> = {
    木: '土', 火: '金', 土: '水', 金: '木', 水: '火',
  };
  const beShengMap: Record<WuXing, WuXing> = {
    木: '水', 火: '木', 土: '火', 金: '土', 水: '金',
  };
  const beKeMap: Record<WuXing, WuXing> = {
    木: '金', 火: '水', 土: '木', 金: '火', 水: '土',
  };

  if (isStrong) {
    // 身強：喜洩耗剋
    // 喜：食傷（我生）、財星（我剋）、官殺（剋我）
    // 忌：印星（生我）、比劫（同我）
    return {
      favorable: [shengMap[dayElement], keMap[dayElement], beKeMap[dayElement]],
      unfavorable: [dayElement, beShengMap[dayElement]],
    };
  } else {
    // 身弱：喜生扶
    // 喜：印星（生我）、比劫（同我）
    // 忌：食傷（我生）、財星（我剋）、官殺（剋我）
    return {
      favorable: [dayElement, beShengMap[dayElement]],
      unfavorable: [shengMap[dayElement], keMap[dayElement], beKeMap[dayElement]],
    };
  }
}

/**
 * 獲取五行對應的健康器官
 */
export function getWuXingOrgans(element: WuXing): { organs: string; risks: string[] } {
  const mapping: Record<WuXing, { organs: string; risks: string[] }> = {
    木: {
      organs: '肝臟、膽、眼睛、筋腱',
      risks: ['肝火旺盛', '視力問題', '肌腱拉傷', '情緒波動'],
    },
    火: {
      organs: '心臟、小腸、血液、舌頭',
      risks: ['心血管疾病', '失眠', '血壓異常', '口舌生瘡'],
    },
    土: {
      organs: '脾臟、胃、肌肉、口腔',
      risks: ['消化不良', '肌肉鬆弛', '糖尿病', '食慾不振'],
    },
    金: {
      organs: '肺臟、大腸、皮膚、鼻子',
      risks: ['呼吸道疾病', '皮膚過敏', '便秘', '鼻炎'],
    },
    水: {
      organs: '腎臟、膀胱、骨骼、耳朵',
      risks: ['腎功能問題', '泌尿系統', '骨質疏鬆', '聽力下降'],
    },
  };

  return mapping[element];
}

/**
 * 為圖表準備五行數據
 */
export function prepareWuXingChartData(percentage: WuXingStats, dayElement: WuXing) {
  const elements: WuXing[] = ['木', '火', '土', '金', '水'];

  return elements.map(element => {
    const value = percentage[element];
    const { status, emoji } = getWuXingStatus(element, value, dayElement);

    return {
      name: `${element} (${getTenGodCategory(element, dayElement)})`,
      value,
      color: WUXING_COLOR[element],
      desc: `${status} ${emoji}`,
      element,
    };
  });
}

/**
 * 獲取五行對應的十神類別
 */
function getTenGodCategory(element: WuXing, dayElement: WuXing): string {
  const shengMap: Record<WuXing, WuXing> = {
    木: '火', 火: '土', 土: '金', 金: '水', 水: '木',
  };
  const keMap: Record<WuXing, WuXing> = {
    木: '土', 火: '金', 土: '水', 金: '木', 水: '火',
  };

  if (element === dayElement) return '比';
  if (shengMap[dayElement] === element) return '食';
  if (keMap[dayElement] === element) return '財';

  // 找出剋我的五行
  for (const [k, v] of Object.entries(keMap)) {
    if (v === dayElement && k === element) return '官';
  }
  // 找出生我的五行
  for (const [k, v] of Object.entries(shengMap)) {
    if (v === dayElement && k === element) return '印';
  }

  return '';
}
