/**
 * 身強身弱判定模組
 *
 * 判定原則：
 * 1. 得令（月令旺相休囚死）- 最重要，佔 40%
 * 2. 得地（四柱地支通根）- 佔 35%
 * 3. 得勢（印比 vs 財官食傷）- 佔 25%
 */

import type { BaZiChart, WuXing, StrengthAnalysis, TianGan, DiZhi } from './types';
import {
  TIAN_GAN_ELEMENT,
  HIDDEN_STEMS,
  HIDDEN_STEM_WEIGHT,
  WUXING_SHENG,
  WUXING_KE,
} from '@/data/constants';
import { countTenGods, TEN_GOD_CATEGORIES } from './ten-gods';

// ========== 月令旺相休囚死 ==========

/** 月支對應的當令五行 */
const MONTH_DOMINANT_ELEMENT: Record<DiZhi, WuXing> = {
  寅: '木', 卯: '木',           // 春季木旺
  巳: '火', 午: '火',           // 夏季火旺
  申: '金', 酉: '金',           // 秋季金旺
  亥: '水', 子: '水',           // 冬季水旺
  辰: '土', 戌: '土', 丑: '土', 未: '土',  // 四季土旺（四庫）
};

/**
 * 計算日主五行在月令中的「旺相休囚死」狀態
 * 旺：當令，分數 100
 * 相：生我的五行當令，分數 80
 * 休：我生的五行當令，分數 50
 * 囚：剋我的五行當令，分數 30
 * 死：我剋的五行當令，分數 10
 */
export function getMonthStrengthScore(dayElement: WuXing, monthBranch: DiZhi): {
  status: '旺' | '相' | '休' | '囚' | '死';
  score: number;
  description: string;
} {
  const monthElement = MONTH_DOMINANT_ELEMENT[monthBranch];

  // 旺：我就是當令的五行
  if (dayElement === monthElement) {
    return {
      status: '旺',
      score: 100,
      description: `${dayElement}日主生於${monthBranch}月，正當${monthElement}旺之時，得令最旺。`
    };
  }

  // 相：生我的五行當令（印星當令）
  if (WUXING_SHENG[monthElement] === dayElement) {
    return {
      status: '相',
      score: 80,
      description: `${dayElement}日主生於${monthBranch}月，${monthElement}生${dayElement}，得月令生扶。`
    };
  }

  // 休：我生的五行當令（食傷當令）
  if (WUXING_SHENG[dayElement] === monthElement) {
    return {
      status: '休',
      score: 50,
      description: `${dayElement}日主生於${monthBranch}月，${dayElement}生${monthElement}，氣洩於月令。`
    };
  }

  // 囚：剋我的五行當令（官殺當令）
  if (WUXING_KE[monthElement] === dayElement) {
    return {
      status: '囚',
      score: 30,
      description: `${dayElement}日主生於${monthBranch}月，${monthElement}剋${dayElement}，受月令所制。`
    };
  }

  // 死：我剋的五行當令（財星當令）
  if (WUXING_KE[dayElement] === monthElement) {
    return {
      status: '死',
      score: 10,
      description: `${dayElement}日主生於${monthBranch}月，${dayElement}剋${monthElement}，耗氣於月令。`
    };
  }

  // 預設（不應到達）
  return { status: '休', score: 50, description: '月令中性。' };
}

/**
 * 判斷是否得令（月令生扶日主）- 保留向後相容
 */
export function isDeLing(dayElement: WuXing, monthBranch: DiZhi): boolean {
  const { score } = getMonthStrengthScore(dayElement, monthBranch);
  return score >= 80; // 旺或相才算得令
}

/**
 * 計算得地分數（地支通根）
 * 返回 0-100 的分數
 */
export function getDeDiScore(dayElement: WuXing, branches: DiZhi[]): number {
  let score = 0;

  for (const branch of branches) {
    const hidden = HIDDEN_STEMS[branch];

    // 本氣
    if (TIAN_GAN_ELEMENT[hidden.main] === dayElement) {
      score += 30 * HIDDEN_STEM_WEIGHT.main;
    }
    // 印星（生我）也算半根
    if (WUXING_SHENG[TIAN_GAN_ELEMENT[hidden.main]] === dayElement) {
      score += 15 * HIDDEN_STEM_WEIGHT.main;
    }

    // 中氣
    if (hidden.middle) {
      if (TIAN_GAN_ELEMENT[hidden.middle] === dayElement) {
        score += 30 * HIDDEN_STEM_WEIGHT.middle;
      }
      if (WUXING_SHENG[TIAN_GAN_ELEMENT[hidden.middle]] === dayElement) {
        score += 15 * HIDDEN_STEM_WEIGHT.middle;
      }
    }

    // 餘氣
    if (hidden.residue) {
      if (TIAN_GAN_ELEMENT[hidden.residue] === dayElement) {
        score += 30 * HIDDEN_STEM_WEIGHT.residue;
      }
      if (WUXING_SHENG[TIAN_GAN_ELEMENT[hidden.residue]] === dayElement) {
        score += 15 * HIDDEN_STEM_WEIGHT.residue;
      }
    }
  }

  return Math.min(score, 100);
}

/**
 * 判斷是否得地
 */
export function isDeDi(dayElement: WuXing, branches: DiZhi[]): boolean {
  return getDeDiScore(dayElement, branches) >= 30;
}

/**
 * 判斷是否得勢（印比數量 > 財官食傷）
 */
export function isDeShi(chart: BaZiChart): boolean {
  const godCount = countTenGods(chart);

  // 計算生扶力量（印星 + 比劫）
  let support = 0;
  for (const god of TEN_GOD_CATEGORIES.印星) {
    support += godCount[god];
  }
  for (const god of TEN_GOD_CATEGORIES.比劫) {
    support += godCount[god];
  }

  // 計算消耗力量（財星 + 官殺 + 食傷）
  let consume = 0;
  for (const god of TEN_GOD_CATEGORIES.財星) {
    consume += godCount[god];
  }
  for (const god of TEN_GOD_CATEGORIES.官殺) {
    consume += godCount[god];
  }
  for (const god of TEN_GOD_CATEGORIES.食傷) {
    consume += godCount[god];
  }

  return support > consume;
}

/**
 * 計算得勢分數
 */
export function getDeShiScore(chart: BaZiChart): number {
  const godCount = countTenGods(chart);

  let support = 0;
  let consume = 0;

  for (const god of TEN_GOD_CATEGORIES.印星) {
    support += godCount[god];
  }
  for (const god of TEN_GOD_CATEGORIES.比劫) {
    support += godCount[god];
  }

  for (const god of TEN_GOD_CATEGORIES.財星) {
    consume += godCount[god];
  }
  for (const god of TEN_GOD_CATEGORIES.官殺) {
    consume += godCount[god];
  }
  for (const god of TEN_GOD_CATEGORIES.食傷) {
    consume += godCount[god];
  }

  const total = support + consume;
  if (total === 0) return 50;

  return Math.round((support / total) * 100);
}

/**
 * 綜合判定身強身弱
 *
 * 計算權重：
 * - 月令（旺相休囚死）：40%（最重要！）
 * - 得地（地支通根）：35%
 * - 得勢（印比 vs 財官食傷）：25%
 */
export function analyzeStrength(chart: BaZiChart): StrengthAnalysis {
  const dayElement = chart.day.ganElement;
  const branches = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi];

  // 1. 月令分析（旺相休囚死）- 最重要
  const monthStrength = getMonthStrengthScore(dayElement, chart.month.zhi);
  const deLing = monthStrength.score >= 80; // 旺或相才算得令

  // 2. 得地分析（地支通根）
  const deDiScore = getDeDiScore(dayElement, branches);
  const deDi = deDiScore >= 30;

  // 3. 得勢分析（印比 vs 財官食傷）
  const deShiScore = getDeShiScore(chart);
  const deShi = deShiScore > 50;

  // 加權計算總分（月令 40% + 得地 35% + 得勢 25%）
  const lingScore = monthStrength.score * 0.40;
  const diScore = deDiScore * 0.35;
  const shiScore = deShiScore * 0.25;
  const totalScore = Math.round(lingScore + diScore + shiScore);

  // 判定結果 - 根據加權總分
  let verdict: StrengthAnalysis['verdict'];

  if (totalScore >= 75) {
    verdict = '身極強';
  } else if (totalScore >= 60) {
    verdict = '身強';
  } else if (totalScore >= 50) {
    verdict = '身旺';
  } else if (totalScore >= 40) {
    verdict = '中和';
  } else if (totalScore >= 30) {
    verdict = '身弱';
  } else if (totalScore >= 20) {
    verdict = '身衰';
  } else {
    verdict = '身極弱';
  }

  // 組織原因說明
  const reasons: string[] = [];

  // 月令說明（最重要）
  reasons.push(`【月令${monthStrength.status}】${monthStrength.description}`);

  // 得地說明
  if (deDi) {
    reasons.push(`【得地】地支中有${dayElement}的通根（${deDiScore}分），日主有根氣。`);
  } else {
    reasons.push(`【失地】地支中缺乏${dayElement}的通根（${deDiScore}分），日主虛浮。`);
  }

  // 得勢說明
  if (deShi) {
    reasons.push(`【得勢】命局印比力量（${deShiScore}%）多於財官食傷，有助力。`);
  } else {
    reasons.push(`【失勢】命局財官食傷力量多於印比（${deShiScore}%），消耗大。`);
  }

  return {
    deLing,
    deDi,
    deDiScore,
    deShi,
    score: totalScore,
    verdict,
    reason: reasons,
  };
}

/**
 * 判斷是否可能成為從格
 */
export function canBeFromPattern(strength: StrengthAnalysis): boolean {
  // 三失全中才可能是從格
  return !strength.deLing && !strength.deDi && !strength.deShi && strength.score < 20;
}

/**
 * 判斷是否可能成為專旺格
 */
export function canBeSpecialPattern(strength: StrengthAnalysis): boolean {
  // 三得全中且分數極高
  return strength.deLing && strength.deDi && strength.deShi && strength.score > 85;
}

/**
 * 生成身強身弱的詳細解讀
 */
export function getStrengthDescription(strength: StrengthAnalysis, dayElement: WuXing): string {
  const { verdict, score } = strength;

  const descriptions: Record<typeof verdict, string> = {
    '身極強': `日主${dayElement}氣極旺，精力充沛但易衝動，需要財官來平衡消耗過剩的能量。`,
    '身強': `日主${dayElement}氣旺盛，有足夠的能力追求事業財富，適合主動出擊。`,
    '身旺': `日主${dayElement}氣較旺，能量充沛，可以承擔較大的挑戰和責任。`,
    '中和': `日主${dayElement}氣平衡，適應性強，可根據大運流年調整發展方向。`,
    '身弱': `日主${dayElement}氣較弱，需要印星（貴人）扶持，宜穩健保守。`,
    '身衰': `日主${dayElement}氣偏弱，宜借力使力，選擇適合的環境發展。`,
    '身極弱': `日主${dayElement}氣極弱，可能形成從格，順從大勢反而順遂。`,
  };

  return descriptions[verdict];
}
