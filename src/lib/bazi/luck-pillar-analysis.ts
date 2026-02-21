/**
 * 大運×流年交互分析模組
 *
 * 專業命理師等級的大運流年綜合分析：
 * 1. 大運五行與用神配合
 * 2. 大運與流年的沖合刑害
 * 3. 大運流年與原局的交互
 * 4. 綜合運勢評估
 */

import type {
  BaZiChart,
  WuXing,
  TianGan,
  DiZhi,
  ShiShen,
  LuckPillar,
  BirthInput,
} from './types';
import { getTenGod } from './ten-gods';
import { calculateLuckPillars, getAnnualGanZhi } from './calculator';
import {
  TIAN_GAN_ELEMENT,
  DI_ZHI_ELEMENT,
  TIAN_GAN_COMBINE,
  WUXING_SHENG,
  WUXING_KE,
  HIDDEN_STEMS,
  HIDDEN_STEM_WEIGHT,
} from '@/data/constants';
import { getMonthStrengthScore } from './strength';
import {
  analyzeAdvancedFortune,
  type SuiYunBingLin,
  type PillarTrigger,
  type AnnualShenSha,
} from './fortune-advanced';
import { type TwelveStage } from './twelve-stages';

// ========== 類型定義 ==========

/** 大運詳細分析 */
export interface LuckPillarAnalysis {
  ganZhi: string;
  gan: TianGan;
  zhi: DiZhi;
  ganElement: WuXing;
  zhiElement: WuXing;
  ganTenGod: ShiShen;
  zhiTenGod: ShiShen;
  ageStart: number;
  ageEnd: number;
  /** 與喜用神的關係 */
  favorableMatch: {
    gan: boolean;
    zhi: boolean;
    score: number;
  };
  /** 五行能量分析 */
  wuXingEnergy: {
    score: number;
    effects: string[];
    recommendation: string;
  };
  /** 大運主題 */
  theme: string;
  /** 詳細解讀 */
  description: string;
  /** 注意事項 */
  cautions: string[];
}

/** 大運流年交互 */
export interface LuckYearInteraction {
  luckPillar: LuckPillarAnalysis;
  year: number;
  yearGanZhi: string;
  yearGan: TianGan;
  yearZhi: DiZhi;
  /** 天干關係 */
  ganInteraction: {
    type: '合' | '沖' | '生' | '剋' | '同' | '無';
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
  };
  /** 地支關係 */
  zhiInteraction: {
    types: ('沖' | '合' | '刑' | '害' | '破' | '無')[];
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
  };
  /** 與原局交互 */
  chartInteraction: {
    fuYin: boolean;  // 伏吟（干支相同）
    fanYin: boolean; // 反吟（干支相沖）
    description: string;
  };
  /** 流年五行能量分析 */
  yearWuXingEnergy: {
    score: number;
    effects: string[];
    recommendation: string;
  };
  /** 進階分析：歲運並臨 */
  suiYunBingLin?: SuiYunBingLin;
  /** 進階分析：引動原局 */
  pillarTriggers?: PillarTrigger[];
  /** 進階分析：流年神煞 */
  annualShenSha?: AnnualShenSha[];
  /** 進階分析：長生十二宮 */
  twelveStage?: {
    stage: TwelveStage;
    score: number;
    description: string;
    isProsperous: boolean;
    isDeclined: boolean;
  };
  /** 進階分析：空亡狀態 */
  kongWangStatus?: {
    isFlowYearKong: boolean;
    isLuckPillarKong: boolean;
    description: string;
  };
  /** 進階分析：警示 */
  warnings?: string[];
  /** 進階分析：額外建議 */
  advices?: string[];
  /** 綜合評分 */
  score: number;
  /** 綜合主題 */
  theme: string;
  /** 建議 */
  advice: string;
}

// ========== 常量定義 ==========

/** 六沖 */
const LIU_CHONG: Record<DiZhi, DiZhi> = {
  子: '午', 丑: '未', 寅: '申', 卯: '酉', 辰: '戌', 巳: '亥',
  午: '子', 未: '丑', 申: '寅', 酉: '卯', 戌: '辰', 亥: '巳',
};

/** 六合 */
const LIU_HE: Record<DiZhi, { pair: DiZhi; element: WuXing }> = {
  子: { pair: '丑', element: '土' },
  丑: { pair: '子', element: '土' },
  寅: { pair: '亥', element: '木' },
  卯: { pair: '戌', element: '火' },
  辰: { pair: '酉', element: '金' },
  巳: { pair: '申', element: '水' },
  午: { pair: '未', element: '土' },
  未: { pair: '午', element: '土' },
  申: { pair: '巳', element: '水' },
  酉: { pair: '辰', element: '金' },
  戌: { pair: '卯', element: '火' },
  亥: { pair: '寅', element: '木' },
};

/** 六害 */
const LIU_HAI: Record<DiZhi, DiZhi> = {
  子: '未', 丑: '午', 寅: '巳', 卯: '辰', 辰: '卯', 巳: '寅',
  午: '丑', 未: '子', 申: '亥', 酉: '戌', 戌: '酉', 亥: '申',
};

/** 天干五合 */
const TIAN_GAN_HE: [TianGan, TianGan, WuXing][] = [
  ['甲', '己', '土'],
  ['乙', '庚', '金'],
  ['丙', '辛', '水'],
  ['丁', '壬', '木'],
  ['戊', '癸', '火'],
];

/** 天干相沖（隔七位） */
const TIAN_GAN_CHONG: Record<TianGan, TianGan> = {
  甲: '庚', 乙: '辛', 丙: '壬', 丁: '癸', 戊: '甲',
  己: '乙', 庚: '甲', 辛: '乙', 壬: '丙', 癸: '丁',
};

/** 十神主題 */
const TEN_GOD_THEMES: Record<ShiShen, string> = {
  比肩: '競爭合作、同儕關係',
  劫財: '投資風險、人脈拓展',
  食神: '才華發揮、享受生活',
  傷官: '創新突破、叛逆表現',
  偏財: '偏財機運、人緣桃花',
  正財: '穩定財富、感情婚姻',
  七殺: '事業突破、壓力挑戰',
  正官: '升職考試、權威地位',
  偏印: '學習轉型、獨特思維',
  正印: '貴人相助、學業進修',
};

// ========== 五行能量分析 ==========

/** 五行能量對日主的作用類型 */
export type WuXingEffect = '生扶' | '洩氣' | '剋制' | '耗損' | '同助';

/**
 * 分析某五行對日主的作用
 * @param dayElement 日主五行
 * @param targetElement 目標五行（大運/流年）
 * @returns 作用類型和影響程度
 */
export function analyzeWuXingEffect(
  dayElement: WuXing,
  targetElement: WuXing
): { effect: WuXingEffect; score: number; description: string } {
  // 同我：比劫 - 同助日主
  if (targetElement === dayElement) {
    return {
      effect: '同助',
      score: 15,
      description: `${targetElement}與日主${dayElement}同屬，能量增強，有助力。`,
    };
  }

  // 生我：印星 - 生扶日主
  if (WUXING_SHENG[targetElement] === dayElement) {
    return {
      effect: '生扶',
      score: 20,
      description: `${targetElement}生${dayElement}，印星生扶日主，得貴人助力。`,
    };
  }

  // 我生：食傷 - 洩氣日主
  if (WUXING_SHENG[dayElement] === targetElement) {
    return {
      effect: '洩氣',
      score: -5,
      description: `${dayElement}生${targetElement}，日主洩氣於食傷，消耗精力。`,
    };
  }

  // 我剋：財星 - 耗損日主
  if (WUXING_KE[dayElement] === targetElement) {
    return {
      effect: '耗損',
      score: -10,
      description: `${dayElement}剋${targetElement}，日主耗損於財星，需付出努力。`,
    };
  }

  // 剋我：官殺 - 剋制日主
  if (WUXING_KE[targetElement] === dayElement) {
    return {
      effect: '剋制',
      score: -15,
      description: `${targetElement}剋${dayElement}，官殺剋制日主，壓力挑戰。`,
    };
  }

  // 預設（不應到達）
  return {
    effect: '同助',
    score: 0,
    description: '五行關係中性。',
  };
}

/**
 * 計算大運/流年的五行能量綜合分數
 * 考量：天干五行 + 地支藏干五行 + 對日主的整體作用
 */
export function calculateWuXingEnergyScore(
  dayElement: WuXing,
  ganElement: WuXing,
  zhi: DiZhi,
  isStrong: boolean
): { score: number; effects: string[]; recommendation: string } {
  const effects: string[] = [];
  let totalScore = 0;

  // 1. 天干五行對日主的影響（權重 50%）
  const ganEffect = analyzeWuXingEffect(dayElement, ganElement);
  effects.push(`天干${ganElement}：${ganEffect.description}`);

  // 身強身弱調整：身強喜洩剋耗，身弱喜生扶
  let ganAdjustedScore = ganEffect.score;
  if (isStrong) {
    // 身強：洩氣、耗損、剋制反而好
    if (ganEffect.effect === '洩氣' || ganEffect.effect === '耗損') {
      ganAdjustedScore = Math.abs(ganEffect.score) + 5;
    } else if (ganEffect.effect === '剋制') {
      ganAdjustedScore = Math.abs(ganEffect.score); // 官殺制身，事業有成
    } else if (ganEffect.effect === '生扶' || ganEffect.effect === '同助') {
      ganAdjustedScore = -5; // 身強再生扶反而不利
    }
  }
  totalScore += ganAdjustedScore * 0.5;

  // 2. 地支藏干對日主的影響（權重 50%）
  const hidden = HIDDEN_STEMS[zhi];
  if (hidden) {
    const mainStemElement = TIAN_GAN_ELEMENT[hidden.main];
    const mainEffect = analyzeWuXingEffect(dayElement, mainStemElement);
    effects.push(`地支${zhi}本氣${hidden.main}(${mainStemElement})：${mainEffect.description}`);

    let zhiAdjustedScore = mainEffect.score;
    if (isStrong) {
      if (mainEffect.effect === '洩氣' || mainEffect.effect === '耗損') {
        zhiAdjustedScore = Math.abs(mainEffect.score) + 5;
      } else if (mainEffect.effect === '剋制') {
        zhiAdjustedScore = Math.abs(mainEffect.score);
      } else if (mainEffect.effect === '生扶' || mainEffect.effect === '同助') {
        zhiAdjustedScore = -5;
      }
    }
    totalScore += zhiAdjustedScore * HIDDEN_STEM_WEIGHT.main * 0.5;

    // 中氣
    if (hidden.middle) {
      const midElement = TIAN_GAN_ELEMENT[hidden.middle];
      const midEffect = analyzeWuXingEffect(dayElement, midElement);
      let midAdjustedScore = midEffect.score;
      if (isStrong) {
        if (midEffect.effect === '洩氣' || midEffect.effect === '耗損' || midEffect.effect === '剋制') {
          midAdjustedScore = Math.abs(midEffect.score);
        } else {
          midAdjustedScore = -3;
        }
      }
      totalScore += midAdjustedScore * HIDDEN_STEM_WEIGHT.middle * 0.5;
    }

    // 餘氣
    if (hidden.residue) {
      const resElement = TIAN_GAN_ELEMENT[hidden.residue];
      const resEffect = analyzeWuXingEffect(dayElement, resElement);
      let resAdjustedScore = resEffect.score;
      if (isStrong) {
        if (resEffect.effect === '洩氣' || resEffect.effect === '耗損' || resEffect.effect === '剋制') {
          resAdjustedScore = Math.abs(resEffect.score);
        } else {
          resAdjustedScore = -2;
        }
      }
      totalScore += resAdjustedScore * HIDDEN_STEM_WEIGHT.residue * 0.5;
    }
  }

  // 生成建議
  let recommendation: string;
  if (totalScore >= 15) {
    recommendation = isStrong
      ? '此運能量適度消耗，有利發展事業財富，宜積極進取。'
      : '此運得生扶之力，貴人運旺，宜把握機會。';
  } else if (totalScore >= 5) {
    recommendation = '此運五行能量平衡，穩健發展為主。';
  } else if (totalScore >= -5) {
    recommendation = '此運五行中性，視具體情況靈活應對。';
  } else {
    recommendation = isStrong
      ? '此運能量過旺，宜謹慎理財，避免衝動。'
      : '此運壓力較大，宜韜光養晦，借力使力。';
  }

  return { score: totalScore, effects, recommendation };
}

// ========== 主函數 ==========

/**
 * 分析所有大運
 * @param isStrong 日主是否身強（用於五行能量判定）
 */
export function analyzeLuckPillars(
  chart: BaZiChart,
  input: BirthInput,
  favorable: WuXing[],
  unfavorable: WuXing[],
  count: number = 8,
  isStrong: boolean = true
): LuckPillarAnalysis[] {
  const { pillars } = calculateLuckPillars(input, count);
  const results: LuckPillarAnalysis[] = [];
  const dayElement = chart.day.ganElement;

  for (const pillar of pillars) {
    const gan = pillar.ganZhi[0] as TianGan;
    const zhi = pillar.ganZhi[1] as DiZhi;
    const ganElement = TIAN_GAN_ELEMENT[gan];
    const zhiElement = DI_ZHI_ELEMENT[zhi];

    const ganTenGod = getTenGod(chart.day.gan, gan);
    const zhiMainStem = HIDDEN_STEMS[zhi]?.main || '癸'; // 取地支本氣藏干
    const zhiTenGod = getTenGod(chart.day.gan, zhiMainStem);

    // 計算與喜用神的配合度（佔 40%）
    const ganMatch = favorable.includes(ganElement);
    const zhiMatch = favorable.includes(zhiElement);
    const ganPenalty = unfavorable.includes(ganElement);
    const zhiPenalty = unfavorable.includes(zhiElement);

    let favorScore = 50;
    if (ganMatch) favorScore += 20;
    if (zhiMatch) favorScore += 15;
    if (ganPenalty) favorScore -= 15;
    if (zhiPenalty) favorScore -= 10;
    favorScore = Math.max(0, Math.min(100, favorScore));

    // 計算五行能量對日主的影響（佔 35%）
    const wuXingEnergy = calculateWuXingEnergyScore(dayElement, ganElement, zhi, isStrong);

    // 計算大運地支對日主的月令影響（佔 25%）
    // 用大運地支模擬「月令」的旺相休囚死
    const monthEffect = getMonthStrengthScore(dayElement, zhi);
    let monthScore = monthEffect.score;

    // 身強身弱的月令效應調整（完整邏輯）
    if (isStrong) {
      // 身強：休囚死反而好（洩氣），旺相反而不利（過旺）
      if (monthScore >= 80) {
        // 極旺 → 過旺不利
        monthScore = 100 - monthScore + 20;
      } else if (monthScore >= 60) {
        // 旺相 → 微不利
        monthScore = 60;
      } else if (monthScore < 40) {
        // 休囚死 → 有利（可洩氣）
        monthScore = 100 - monthScore;
      }
      // 50-59 維持原分
    } else {
      // 身弱：旺相有利（生扶），休囚死不利（更弱）
      if (monthScore < 40) {
        // 休囚死 → 更弱，不利
        monthScore = monthScore;
      } else if (monthScore >= 80) {
        // 極旺 → 很好
        monthScore = monthScore + 10;
      }
      // 其他維持原分
    }
    monthScore = Math.max(0, Math.min(100, monthScore));

    // 綜合評分（喜用 40% + 五行能量 35% + 月令 25%）
    // 五行能量正規化：擴大分數範圍（乘數從 2 調整為 3）
    const wuXingNormalized = Math.max(0, Math.min(100, 50 + wuXingEnergy.score * 3));
    const totalScore = Math.round(
      favorScore * 0.40 +
      wuXingNormalized * 0.35 +
      monthScore * 0.25
    );
    const finalScore = Math.max(0, Math.min(100, totalScore));

    // 生成主題和描述
    const theme = generateLuckPillarTheme(ganTenGod, zhiTenGod, finalScore);
    const description = generateLuckPillarDescription(
      gan, zhi, ganElement, zhiElement,
      ganTenGod, zhiTenGod, ganMatch, zhiMatch, finalScore
    );
    const cautions = generateLuckPillarCautions(ganTenGod, zhiTenGod, ganPenalty, zhiPenalty);

    results.push({
      ganZhi: pillar.ganZhi,
      gan,
      zhi,
      ganElement,
      zhiElement,
      ganTenGod,
      zhiTenGod,
      ageStart: pillar.ageStart,
      ageEnd: pillar.ageEnd,
      favorableMatch: {
        gan: ganMatch,
        zhi: zhiMatch,
        score: finalScore,
      },
      wuXingEnergy,
      theme,
      description,
      cautions,
    });
  }

  return results;
}

/**
 * 分析大運×流年交互
 * @param isStrong 日主是否身強（用於五行能量判定）
 */
export function analyzeLuckYearInteraction(
  chart: BaZiChart,
  luckPillar: LuckPillarAnalysis,
  targetYear: number,
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean = true
): LuckYearInteraction {
  const yearGanZhi = getAnnualGanZhi(targetYear);
  const yearGan = yearGanZhi[0] as TianGan;
  const yearZhi = yearGanZhi[1] as DiZhi;
  const dayElement = chart.day.ganElement;

  // 天干交互
  const ganInteraction = analyzeGanInteraction(luckPillar.gan, yearGan, chart.day.gan);

  // 地支交互
  const zhiInteraction = analyzeZhiInteraction(luckPillar.zhi, yearZhi);

  // 與原局交互（伏吟/反吟）
  const chartInteraction = analyzeChartInteraction(
    chart, luckPillar.ganZhi, yearGanZhi
  );

  // 流年五行能量分析（重點更新）
  const yearGanElement = TIAN_GAN_ELEMENT[yearGan];
  const yearZhiElement = DI_ZHI_ELEMENT[yearZhi];
  const yearWuXingEnergy = calculateWuXingEnergyScore(dayElement, yearGanElement, yearZhi, isStrong);

  // 流年月令效應（流年地支對日主的旺相休囚死）
  const yearMonthEffect = getMonthStrengthScore(dayElement, yearZhi);
  let yearMonthScore = yearMonthEffect.score;

  // 身強身弱的月令效應調整（完整邏輯）
  if (isStrong) {
    if (yearMonthScore >= 80) {
      yearMonthScore = 100 - yearMonthScore + 20;
    } else if (yearMonthScore >= 60) {
      yearMonthScore = 60;
    } else if (yearMonthScore < 40) {
      yearMonthScore = 100 - yearMonthScore;
    }
  } else {
    if (yearMonthScore >= 80) {
      yearMonthScore = yearMonthScore + 10;
    }
  }
  yearMonthScore = Math.max(0, Math.min(100, yearMonthScore));

  // ======== 綜合評分計算 ========
  // 權重分配：
  // - 大運配合度：25%
  // - 流年喜用神：20%
  // - 流年五行能量：25%
  // - 流年月令效應：15%
  // - 干支交互：15%

  // 1. 大運配合度影響（25%）
  const luckScore = luckPillar.favorableMatch.score * 0.25;

  // 2. 流年喜用神影響（20%）
  let favorScore = 50;
  if (favorable.includes(yearGanElement)) favorScore += 25;
  if (favorable.includes(yearZhiElement)) favorScore += 20;
  if (unfavorable.includes(yearGanElement)) favorScore -= 20;
  if (unfavorable.includes(yearZhiElement)) favorScore -= 15;
  favorScore = Math.max(0, Math.min(100, favorScore)) * 0.20;

  // 3. 流年五行能量影響（25%）
  // 擴大分數範圍（乘數從 2 調整為 3）
  const wuXingNormalized = Math.max(0, Math.min(100, 50 + yearWuXingEnergy.score * 3));
  const wuXingScore = wuXingNormalized * 0.25;

  // 4. 流年月令效應（15%）
  const monthScore = yearMonthScore * 0.15;

  // 5. 干支交互影響（15%）
  let interactionScore = 50;
  if (ganInteraction.impact === 'positive') interactionScore += 20;
  if (ganInteraction.impact === 'negative') interactionScore -= 15;
  if (zhiInteraction.impact === 'positive') interactionScore += 15;
  if (zhiInteraction.impact === 'negative') interactionScore -= 20;
  if (chartInteraction.fuYin) interactionScore -= 10;
  if (chartInteraction.fanYin) interactionScore -= 15;
  interactionScore = Math.max(0, Math.min(100, interactionScore)) * 0.15;

  // 綜合評分
  const totalScore = Math.round(luckScore + favorScore + wuXingScore + monthScore + interactionScore);
  const finalScore = Math.max(0, Math.min(100, totalScore));

  // ======== 進階分析整合 ========
  const advancedAnalysis = analyzeAdvancedFortune(
    chart,
    yearGan,
    yearZhi,
    luckPillar.gan,
    luckPillar.zhi,
    isStrong
  );

  // 將進階分析的分數調整納入總分
  const adjustedScore = Math.max(0, Math.min(100, finalScore + advancedAnalysis.scoreAdjustment));

  // 生成主題和建議
  const theme = generateYearTheme(luckPillar, yearGan, yearZhi, adjustedScore);
  const advice = generateYearAdvice(
    ganInteraction, zhiInteraction, chartInteraction, adjustedScore
  );

  return {
    luckPillar,
    year: targetYear,
    yearGanZhi,
    yearGan,
    yearZhi,
    ganInteraction,
    zhiInteraction,
    chartInteraction,
    yearWuXingEnergy,
    // 進階分析結果
    suiYunBingLin: advancedAnalysis.suiYunBingLin,
    pillarTriggers: advancedAnalysis.pillarTriggers,
    annualShenSha: advancedAnalysis.annualShenSha,
    twelveStage: advancedAnalysis.twelveStage,
    kongWangStatus: advancedAnalysis.kongWangStatus,
    warnings: advancedAnalysis.warnings,
    advices: advancedAnalysis.advices,
    // 調整後的綜合評分
    score: adjustedScore,
    theme,
    advice,
  };
}

/**
 * 分析多年大運流年交互
 */
export function analyzeMultipleYearInteractions(
  chart: BaZiChart,
  input: BirthInput,
  startYear: number,
  yearCount: number,
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean = true
): LuckYearInteraction[] {
  const luckPillars = analyzeLuckPillars(chart, input, favorable, unfavorable, 8, isStrong);
  const results: LuckYearInteraction[] = [];

  for (let i = 0; i < yearCount; i++) {
    const targetYear = startYear + i;

    // 找出當年所在的大運
    const currentAge = targetYear - input.year;
    const currentLuckPillar = luckPillars.find(
      lp => currentAge >= lp.ageStart && currentAge < lp.ageEnd
    ) || luckPillars[0];

    results.push(
      analyzeLuckYearInteraction(chart, currentLuckPillar, targetYear, favorable, unfavorable, isStrong)
    );
  }

  return results;
}

// ========== 輔助函數 ==========

/**
 * 分析天干交互
 */
function analyzeGanInteraction(
  luckGan: TianGan,
  yearGan: TianGan,
  dayGan: TianGan
): { type: '合' | '沖' | '生' | '剋' | '同' | '無'; description: string; impact: 'positive' | 'negative' | 'neutral' } {
  // 檢查天干合
  const heResult = TIAN_GAN_HE.find(
    ([a, b]) => (a === luckGan && b === yearGan) || (a === yearGan && b === luckGan)
  );
  if (heResult) {
    return {
      type: '合',
      description: `大運${luckGan}與流年${yearGan}相合化${heResult[2]}，主吉祥和諧。`,
      impact: 'positive',
    };
  }

  // 檢查天干沖
  if (TIAN_GAN_CHONG[luckGan] === yearGan) {
    return {
      type: '沖',
      description: `大運${luckGan}與流年${yearGan}天干相沖，主動盪變化。`,
      impact: 'negative',
    };
  }

  // 檢查生剋
  const luckElement = TIAN_GAN_ELEMENT[luckGan];
  const yearElement = TIAN_GAN_ELEMENT[yearGan];

  if (WUXING_SHENG[luckElement] === yearElement) {
    return {
      type: '生',
      description: `大運${luckGan}(${luckElement})生流年${yearGan}(${yearElement})，能量順洩。`,
      impact: 'neutral',
    };
  }

  if (WUXING_KE[luckElement] === yearElement) {
    return {
      type: '剋',
      description: `大運${luckGan}(${luckElement})剋流年${yearGan}(${yearElement})，主有阻礙。`,
      impact: 'negative',
    };
  }

  if (luckElement === yearElement) {
    return {
      type: '同',
      description: `大運${luckGan}與流年${yearGan}同屬${luckElement}，能量加強。`,
      impact: 'neutral',
    };
  }

  return {
    type: '無',
    description: `大運${luckGan}與流年${yearGan}無特殊關係。`,
    impact: 'neutral',
  };
}

/**
 * 分析地支交互
 */
function analyzeZhiInteraction(
  luckZhi: DiZhi,
  yearZhi: DiZhi
): { types: ('沖' | '合' | '刑' | '害' | '破' | '無')[]; description: string; impact: 'positive' | 'negative' | 'neutral' } {
  const types: ('沖' | '合' | '刑' | '害' | '破' | '無')[] = [];
  const descriptions: string[] = [];
  let impact: 'positive' | 'negative' | 'neutral' = 'neutral';

  // 六沖
  if (LIU_CHONG[luckZhi] === yearZhi) {
    types.push('沖');
    descriptions.push(`${luckZhi}${yearZhi}相沖，主劇烈變動`);
    impact = 'negative';
  }

  // 六合
  if (LIU_HE[luckZhi]?.pair === yearZhi) {
    types.push('合');
    descriptions.push(`${luckZhi}${yearZhi}六合化${LIU_HE[luckZhi].element}，主和諧順遂`);
    if (impact !== 'negative') impact = 'positive';
  }

  // 六害
  if (LIU_HAI[luckZhi] === yearZhi) {
    types.push('害');
    descriptions.push(`${luckZhi}${yearZhi}相害，主暗中阻礙`);
    impact = 'negative';
  }

  if (types.length === 0) {
    types.push('無');
    descriptions.push('地支無特殊關係');
  }

  return {
    types,
    description: descriptions.join('；'),
    impact,
  };
}

/**
 * 分析與原局交互（伏吟/反吟）
 */
function analyzeChartInteraction(
  chart: BaZiChart,
  luckGanZhi: string,
  yearGanZhi: string
): { fuYin: boolean; fanYin: boolean; description: string } {
  const chartGanZhis = [
    chart.year.gan + chart.year.zhi,
    chart.month.gan + chart.month.zhi,
    chart.day.gan + chart.day.zhi,
    chart.hour.gan + chart.hour.zhi,
  ];

  // 伏吟：大運或流年與原局某柱相同
  const luckFuYin = chartGanZhis.includes(luckGanZhi);
  const yearFuYin = chartGanZhis.includes(yearGanZhi);
  const fuYin = luckFuYin || yearFuYin;

  // 反吟：地支相沖
  const luckZhi = luckGanZhi[1] as DiZhi;
  const yearZhi = yearGanZhi[1] as DiZhi;
  const chartZhis = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi];

  const luckFanYin = chartZhis.includes(LIU_CHONG[luckZhi]);
  const yearFanYin = chartZhis.includes(LIU_CHONG[yearZhi]);
  const fanYin = luckFanYin || yearFanYin;

  let description = '';
  if (fuYin && fanYin) {
    description = '伏吟反吟並見，主重大變動，凡事宜謹慎。伏吟主反覆憂慮，反吟主沖動變化。';
  } else if (fuYin) {
    description = '見伏吟，主事情反覆、心緒不寧。同樣的問題可能重演，需有耐心。';
  } else if (fanYin) {
    description = '見反吟，主沖動變遷、環境變化大。宜順勢而為，不宜強求。';
  } else {
    description = '無伏吟反吟，運程相對平穩。';
  }

  return { fuYin, fanYin, description };
}

/**
 * 生成大運主題
 */
function generateLuckPillarTheme(
  ganTenGod: ShiShen,
  zhiTenGod: ShiShen,
  score: number
): string {
  const ganTheme = TEN_GOD_THEMES[ganTenGod];
  const quality = score >= 65 ? '順遂' : score >= 45 ? '平穩' : '挑戰';
  return `${quality}之運：${ganTheme}`;
}

/**
 * 生成大運詳細描述
 */
function generateLuckPillarDescription(
  gan: TianGan,
  zhi: DiZhi,
  ganElement: WuXing,
  zhiElement: WuXing,
  ganTenGod: ShiShen,
  zhiTenGod: ShiShen,
  ganMatch: boolean,
  zhiMatch: boolean,
  score: number
): string {
  const parts: string[] = [];

  parts.push(`大運${gan}${zhi}，天干${gan}屬${ganElement}為${ganTenGod}，地支${zhi}屬${zhiElement}。`);

  if (ganMatch && zhiMatch) {
    parts.push(`天干地支皆為喜用，運勢上佳，可積極進取。`);
  } else if (ganMatch) {
    parts.push(`天干為喜用，前五年較順；地支不利，後五年需謹慎。`);
  } else if (zhiMatch) {
    parts.push(`地支為喜用，後五年較順；天干不利，前五年宜保守。`);
  } else {
    parts.push(`天干地支皆非喜用，此運需韜光養晦，等待時機。`);
  }

  // 十神解讀
  parts.push(`${ganTenGod}主導，${TEN_GOD_THEMES[ganTenGod]}為此運重點。`);

  return parts.join('');
}

/**
 * 生成大運注意事項
 */
function generateLuckPillarCautions(
  ganTenGod: ShiShen,
  zhiTenGod: ShiShen,
  ganPenalty: boolean,
  zhiPenalty: boolean
): string[] {
  const cautions: string[] = [];

  if (ganPenalty) {
    cautions.push('天干為忌神，前五年運勢較弱，宜謹慎決策');
  }
  if (zhiPenalty) {
    cautions.push('地支為忌神，後五年運勢不穩，注意健康與人際');
  }

  // 十神相關提醒
  const shiShenCautions: Partial<Record<ShiShen, string>> = {
    劫財: '注意財務風險，避免投機',
    傷官: '謹言慎行，避免得罪貴人',
    七殺: '壓力較大，注意身心健康',
    偏印: '思慮過多，避免鑽牛角尖',
  };

  if (shiShenCautions[ganTenGod]) {
    cautions.push(shiShenCautions[ganTenGod]!);
  }

  return cautions;
}

/**
 * 生成流年主題
 */
function generateYearTheme(
  luckPillar: LuckPillarAnalysis,
  yearGan: TianGan,
  yearZhi: DiZhi,
  score: number
): string {
  const quality = score >= 70 ? '大吉' : score >= 55 ? '中吉' : score >= 40 ? '平穩' : '宜守';
  return `${quality}之年：${luckPillar.ganZhi}運行${yearGan}${yearZhi}年`;
}

/**
 * 生成流年建議
 */
function generateYearAdvice(
  ganInteraction: { type: string; impact: string },
  zhiInteraction: { types: string[]; impact: string },
  chartInteraction: { fuYin: boolean; fanYin: boolean },
  score: number
): string {
  const advices: string[] = [];

  if (score >= 70) {
    advices.push('運勢暢旺，宜積極把握機會，大膽進取。');
  } else if (score >= 55) {
    advices.push('運勢中上，穩健發展為主，可適度拓展。');
  } else if (score >= 40) {
    advices.push('運勢平平，宜守成為主，避免冒險。');
  } else {
    advices.push('運勢較弱，韜光養晦，靜待時機。');
  }

  if (zhiInteraction.types.includes('沖')) {
    advices.push('逢沖之年，環境多變，宜提前規劃應對。');
  }
  if (zhiInteraction.types.includes('合')) {
    advices.push('逢合之年，貴人運佳，多尋求合作機會。');
  }
  if (chartInteraction.fuYin) {
    advices.push('見伏吟，舊事重提，需有耐心處理。');
  }
  if (chartInteraction.fanYin) {
    advices.push('見反吟，變動難免，順勢而為為上。');
  }

  return advices.join('');
}

/**
 * 獲取當前大運（根據年齡）
 */
export function getCurrentLuckPillar(
  input: BirthInput,
  chart: BaZiChart,
  favorable: WuXing[],
  unfavorable: WuXing[]
): LuckPillarAnalysis | null {
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - input.year;

  const luckPillars = analyzeLuckPillars(chart, input, favorable, unfavorable);

  return luckPillars.find(
    lp => currentAge >= lp.ageStart && currentAge < lp.ageEnd
  ) || null;
}
