/**
 * 十神計算模組
 */

import type { TianGan, WuXing, ShiShen, BaZiChart, DiZhi } from './types';
import {
  TIAN_GAN_ELEMENT,
  TIAN_GAN_YINYANG,
  WUXING_SHENG,
  WUXING_KE,
  HIDDEN_STEMS,
} from '@/data/constants';

/**
 * 五行關係類型
 * 0: 同我（比劫）
 * 1: 我生（食傷）
 * 2: 我剋（財星）
 * 3: 剋我（官殺）
 * 4: 生我（印星）
 */
type WuXingRelation = 0 | 1 | 2 | 3 | 4;

/**
 * 判斷五行關係
 */
function getWuXingRelation(myElement: WuXing, targetElement: WuXing): WuXingRelation {
  if (myElement === targetElement) {
    return 0; // 同我
  }
  if (WUXING_SHENG[myElement] === targetElement) {
    return 1; // 我生
  }
  if (WUXING_KE[myElement] === targetElement) {
    return 2; // 我剋
  }
  if (WUXING_KE[targetElement] === myElement) {
    return 3; // 剋我
  }
  // 剩下就是生我
  return 4; // 生我
}

/**
 * 十神對照表
 * [五行關係, 陰陽是否相同] => 十神
 */
const TEN_GOD_TABLE: Record<string, ShiShen> = {
  '0-true': '比肩',   // 同五行，同陰陽
  '0-false': '劫財',  // 同五行，異陰陽
  '1-true': '食神',   // 我生，同陰陽
  '1-false': '傷官',  // 我生，異陰陽
  '2-true': '偏財',   // 我剋，同陰陽
  '2-false': '正財',  // 我剋，異陰陽
  '3-true': '七殺',   // 剋我，同陰陽
  '3-false': '正官',  // 剋我，異陰陽
  '4-true': '偏印',   // 生我，同陰陽
  '4-false': '正印',  // 生我，異陰陽
};

/**
 * 計算某天干相對於日主的十神
 */
export function getTenGod(dayMaster: TianGan, target: TianGan): ShiShen {
  const dayElement = TIAN_GAN_ELEMENT[dayMaster];
  const targetElement = TIAN_GAN_ELEMENT[target];

  const relation = getWuXingRelation(dayElement, targetElement);
  const sameYinYang = TIAN_GAN_YINYANG[dayMaster] === TIAN_GAN_YINYANG[target];

  const key = `${relation}-${sameYinYang}`;
  return TEN_GOD_TABLE[key];
}

/**
 * 計算地支藏干的十神
 */
export function getHiddenStemsTenGods(
  dayMaster: TianGan,
  zhi: DiZhi
): { stem: TianGan; tenGod: ShiShen; weight: number }[] {
  const hidden = HIDDEN_STEMS[zhi];
  const result: { stem: TianGan; tenGod: ShiShen; weight: number }[] = [];

  // 本氣
  result.push({
    stem: hidden.main,
    tenGod: getTenGod(dayMaster, hidden.main),
    weight: 1.0,
  });

  // 中氣
  if (hidden.middle) {
    result.push({
      stem: hidden.middle,
      tenGod: getTenGod(dayMaster, hidden.middle),
      weight: 0.6,
    });
  }

  // 餘氣
  if (hidden.residue) {
    result.push({
      stem: hidden.residue,
      tenGod: getTenGod(dayMaster, hidden.residue),
      weight: 0.3,
    });
  }

  return result;
}

/**
 * 為八字盤計算所有十神
 */
export function calculateAllTenGods(chart: BaZiChart): BaZiChart {
  const dayMaster = chart.day.gan;

  // 計算天干十神（日主本身不計算）
  chart.year.ganShiShen = getTenGod(dayMaster, chart.year.gan);
  chart.month.ganShiShen = getTenGod(dayMaster, chart.month.gan);
  chart.hour.ganShiShen = getTenGod(dayMaster, chart.hour.gan);

  // 計算藏干十神
  for (const pillar of [chart.year, chart.month, chart.day, chart.hour]) {
    for (const hidden of pillar.hiddenStems) {
      hidden.shiShen = getTenGod(dayMaster, hidden.gan);
    }
  }

  return chart;
}

/**
 * 統計十神數量
 */
export function countTenGods(chart: BaZiChart): Record<ShiShen, number> {
  const dayMaster = chart.day.gan;
  const count: Record<string, number> = {
    '比肩': 0, '劫財': 0,
    '食神': 0, '傷官': 0,
    '偏財': 0, '正財': 0,
    '七殺': 0, '正官': 0,
    '偏印': 0, '正印': 0,
  };

  // 統計天干（排除日主）
  const stems = [chart.year.gan, chart.month.gan, chart.hour.gan];
  for (const stem of stems) {
    const god = getTenGod(dayMaster, stem);
    count[god]++;
  }

  // 統計地支藏干
  const branches = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi];
  for (const branch of branches) {
    const hiddenGods = getHiddenStemsTenGods(dayMaster, branch);
    for (const { tenGod, weight } of hiddenGods) {
      count[tenGod] += weight;
    }
  }

  return count as Record<ShiShen, number>;
}

/**
 * 獲取十神的五行屬性（相對於日主）
 */
export function getTenGodElement(tenGod: ShiShen, dayMasterElement: WuXing): WuXing {
  switch (tenGod) {
    case '比肩':
    case '劫財':
      return dayMasterElement; // 同我
    case '食神':
    case '傷官':
      return WUXING_SHENG[dayMasterElement]; // 我生
    case '偏財':
    case '正財':
      return WUXING_KE[dayMasterElement]; // 我剋
    case '七殺':
    case '正官':
      // 剋我的五行
      for (const [k, v] of Object.entries(WUXING_KE)) {
        if (v === dayMasterElement) return k as WuXing;
      }
      return dayMasterElement;
    case '偏印':
    case '正印':
      // 生我的五行
      for (const [k, v] of Object.entries(WUXING_SHENG)) {
        if (v === dayMasterElement) return k as WuXing;
      }
      return dayMasterElement;
    default:
      return dayMasterElement;
  }
}

/**
 * 十神分類
 */
export const TEN_GOD_CATEGORIES = {
  比劫: ['比肩', '劫財'] as ShiShen[],
  食傷: ['食神', '傷官'] as ShiShen[],
  財星: ['偏財', '正財'] as ShiShen[],
  官殺: ['七殺', '正官'] as ShiShen[],
  印星: ['偏印', '正印'] as ShiShen[],
};

/**
 * 判斷十神是否為吉神/凶神（傳統觀點）
 */
export function isBenevolentGod(tenGod: ShiShen): boolean {
  const benevolent: ShiShen[] = ['正官', '正財', '正印', '食神'];
  return benevolent.includes(tenGod);
}
