/**
 * 調候用神模組
 *
 * 調候是八字命理中極重要的概念：
 * - 寒命需暖（冬生用火）
 * - 熱命需涼（夏生用水）
 * - 燥命需潤（秋燥用水）
 * - 濕命需燥（春濕用火）
 *
 * 調候用神的優先級在某些情況下高於扶抑用神
 */

import type { BaZiChart, WuXing, TianGan, DiZhi } from './types';
import { TIAN_GAN_ELEMENT, HIDDEN_STEMS } from '@/data/constants';

// ========== 類型定義 ==========

/** 氣候狀態 */
export type ClimateState = '寒' | '熱' | '燥' | '濕' | '寒濕' | '燥熱' | '中和';

/** 調候分析結果 */
export interface TiaoHouAnalysis {
  /** 月令氣候 */
  climate: ClimateState;
  /** 氣候程度（0-100，越高越極端） */
  climateIntensity: number;
  /** 調候用神（最需要的五行） */
  tiaoHouShen: WuXing[];
  /** 調候忌神（最忌諱的五行） */
  tiaoHouJi: WuXing[];
  /** 是否急需調候 */
  isUrgent: boolean;
  /** 命局已有的調候力量 */
  existingTiaoHou: {
    element: WuXing;
    count: number;
    positions: string[];
  }[];
  /** 調候是否充足 */
  isSufficient: boolean;
  /** 調候評分（0-100） */
  score: number;
  /** 詳細說明 */
  description: string;
  /** 建議 */
  advice: string[];
}

// ========== 常量定義 ==========

/** 月支氣候對照 */
const MONTH_CLIMATE: Record<DiZhi, { climate: ClimateState; intensity: number }> = {
  // 冬季（寒）
  子: { climate: '寒', intensity: 100 },    // 仲冬，最寒
  丑: { climate: '寒濕', intensity: 80 },   // 季冬，寒中帶濕
  亥: { climate: '寒', intensity: 70 },     // 初冬，漸寒

  // 春季（濕）
  寅: { climate: '寒濕', intensity: 50 },   // 初春，餘寒帶濕
  卯: { climate: '濕', intensity: 40 },     // 仲春，溫和帶濕
  辰: { climate: '濕', intensity: 60 },     // 季春，濕土

  // 夏季（熱）
  巳: { climate: '熱', intensity: 70 },     // 初夏，漸熱
  午: { climate: '熱', intensity: 100 },    // 仲夏，最熱
  未: { climate: '燥熱', intensity: 80 },   // 季夏，燥熱

  // 秋季（燥）
  申: { climate: '燥', intensity: 50 },     // 初秋，漸燥
  酉: { climate: '燥', intensity: 70 },     // 仲秋，燥金
  戌: { climate: '燥', intensity: 80 },     // 季秋，燥土
};

/** 日主在各季節的調候需求 */
const TIAO_HOU_RULES: Record<WuXing, Record<ClimateState, {
  need: WuXing[];
  avoid: WuXing[];
  reason: string;
}>> = {
  '木': {
    '寒': {
      need: ['火'],
      avoid: ['水'],
      reason: '木生寒冬，需丙火（太陽）暖木。水多反令木寒。',
    },
    '寒濕': {
      need: ['火'],
      avoid: ['水'],
      reason: '寒濕之木，急需火暖。濕木得火方能生發。',
    },
    '濕': {
      need: ['火', '土'],
      avoid: [],
      reason: '濕木可用火土燥之，但不急。',
    },
    '熱': {
      need: ['水'],
      avoid: ['火'],
      reason: '夏木焦枯，需水潤根。火旺則木焚。',
    },
    '燥熱': {
      need: ['水'],
      avoid: ['火'],
      reason: '燥熱之木急需水潤，否則枯槁。',
    },
    '燥': {
      need: ['水'],
      avoid: [],
      reason: '秋木凋零，得水潤之可延生機。',
    },
    '中和': {
      need: [],
      avoid: [],
      reason: '氣候中和，無需特別調候。',
    },
  },
  '火': {
    '寒': {
      need: ['木'],
      avoid: ['水'],
      reason: '冬火虛弱，需木生火。水旺則火滅。',
    },
    '寒濕': {
      need: ['木'],
      avoid: ['水'],
      reason: '寒濕克火，急需木來生火暖局。',
    },
    '濕': {
      need: ['木'],
      avoid: [],
      reason: '濕地之火，需木助燃。',
    },
    '熱': {
      need: ['水'],
      avoid: [],
      reason: '夏火炎上，得水既濟方為上格。',
    },
    '燥熱': {
      need: ['水'],
      avoid: [],
      reason: '火旺燥熱，需水調和。',
    },
    '燥': {
      need: ['水'],
      avoid: [],
      reason: '秋火虛，但燥氣仍需水潤。',
    },
    '中和': {
      need: [],
      avoid: [],
      reason: '氣候中和，無需特別調候。',
    },
  },
  '土': {
    '寒': {
      need: ['火'],
      avoid: ['水'],
      reason: '冬土寒凝，需火暖土。水多土流。',
    },
    '寒濕': {
      need: ['火'],
      avoid: ['水'],
      reason: '寒濕之土，急需火燥暖。',
    },
    '濕': {
      need: ['火'],
      avoid: ['水'],
      reason: '濕土需火燥之方能承載萬物。',
    },
    '熱': {
      need: ['水'],
      avoid: [],
      reason: '夏土燥烈，得水潤之為妙。',
    },
    '燥熱': {
      need: ['水'],
      avoid: ['火'],
      reason: '燥熱之土急需水潤，否則龜裂。',
    },
    '燥': {
      need: ['水'],
      avoid: [],
      reason: '秋土燥硬，得水潤和。',
    },
    '中和': {
      need: [],
      avoid: [],
      reason: '氣候中和，無需特別調候。',
    },
  },
  '金': {
    '寒': {
      need: ['火', '土'],
      avoid: ['水'],
      reason: '冬金寒脆，需火煉土培。水多金沉。',
    },
    '寒濕': {
      need: ['火'],
      avoid: ['水'],
      reason: '寒濕之金易鏽，需火燥暖。',
    },
    '濕': {
      need: ['火'],
      avoid: [],
      reason: '濕地之金需火燥。',
    },
    '熱': {
      need: ['水'],
      avoid: ['火'],
      reason: '夏金軟弱，需水洗滌。火旺金熔。',
    },
    '燥熱': {
      need: ['水'],
      avoid: ['火'],
      reason: '燥熱之金急需水淬，方顯鋒芒。',
    },
    '燥': {
      need: ['水'],
      avoid: [],
      reason: '秋金得令，但仍需水潤。',
    },
    '中和': {
      need: [],
      avoid: [],
      reason: '氣候中和，無需特別調候。',
    },
  },
  '水': {
    '寒': {
      need: ['火'],
      avoid: [],
      reason: '冬水旺極，需火暖之免成冰。',
    },
    '寒濕': {
      need: ['火'],
      avoid: [],
      reason: '寒濕之水泛濫，需火土止之。',
    },
    '濕': {
      need: ['火', '土'],
      avoid: [],
      reason: '濕地之水需火土制之。',
    },
    '熱': {
      need: ['金'],
      avoid: ['火', '土'],
      reason: '夏水涸竭，需金生水。火土剋制太過。',
    },
    '燥熱': {
      need: ['金'],
      avoid: ['火', '土'],
      reason: '燥熱之地水源枯，急需金生。',
    },
    '燥': {
      need: ['金'],
      avoid: [],
      reason: '秋燥之地，水需金源生之。',
    },
    '中和': {
      need: [],
      avoid: [],
      reason: '氣候中和，無需特別調候。',
    },
  },
};

/** 調候急需程度閾值 */
const URGENT_THRESHOLD = 70;

// ========== 主函數 ==========

/**
 * 分析調候用神
 */
export function analyzeTiaoHou(chart: BaZiChart): TiaoHouAnalysis {
  const monthZhi = chart.month.zhi;
  const dayElement = chart.day.ganElement;

  // 1. 獲取月令氣候
  const { climate, intensity } = MONTH_CLIMATE[monthZhi];

  // 2. 獲取日主的調候需求
  const tiaoHouRule = TIAO_HOU_RULES[dayElement][climate];
  const tiaoHouShen = tiaoHouRule.need;
  const tiaoHouJi = tiaoHouRule.avoid;

  // 3. 判斷是否急需調候
  const isUrgent = intensity >= URGENT_THRESHOLD && tiaoHouShen.length > 0;

  // 4. 檢查命局中已有的調候力量
  const existingTiaoHou = checkExistingTiaoHou(chart, tiaoHouShen);

  // 5. 評估調候是否充足
  const { isSufficient, score } = evaluateTiaoHouSufficiency(
    existingTiaoHou,
    intensity,
    tiaoHouShen.length > 0
  );

  // 6. 生成描述和建議
  const description = generateTiaoHouDescription(
    dayElement,
    monthZhi,
    climate,
    intensity,
    tiaoHouRule.reason,
    existingTiaoHou,
    isSufficient
  );

  const advice = generateTiaoHouAdvice(
    tiaoHouShen,
    tiaoHouJi,
    isSufficient,
    isUrgent,
    dayElement
  );

  return {
    climate,
    climateIntensity: intensity,
    tiaoHouShen,
    tiaoHouJi,
    isUrgent,
    existingTiaoHou,
    isSufficient,
    score,
    description,
    advice,
  };
}

/**
 * 檢查命局中已有的調候力量
 */
function checkExistingTiaoHou(
  chart: BaZiChart,
  neededElements: WuXing[]
): { element: WuXing; count: number; positions: string[] }[] {
  const result: { element: WuXing; count: number; positions: string[] }[] = [];

  for (const element of neededElements) {
    const positions: string[] = [];
    let count = 0;

    // 檢查四柱天干
    const pillars = [
      { pillar: chart.year, name: '年柱' },
      { pillar: chart.month, name: '月柱' },
      { pillar: chart.day, name: '日柱' },
      { pillar: chart.hour, name: '時柱' },
    ];

    for (const { pillar, name } of pillars) {
      // 天干
      if (TIAN_GAN_ELEMENT[pillar.gan] === element) {
        positions.push(`${name}天干${pillar.gan}`);
        count += 1;
      }

      // 地支藏干
      const hidden = HIDDEN_STEMS[pillar.zhi];
      if (hidden) {
        if (TIAN_GAN_ELEMENT[hidden.main] === element) {
          positions.push(`${name}地支${pillar.zhi}(${hidden.main})`);
          count += 0.6; // 本氣權重
        }
        if (hidden.middle && TIAN_GAN_ELEMENT[hidden.middle] === element) {
          positions.push(`${name}地支${pillar.zhi}(${hidden.middle})`);
          count += 0.3; // 中氣權重
        }
        if (hidden.residue && TIAN_GAN_ELEMENT[hidden.residue] === element) {
          count += 0.1; // 餘氣權重
        }
      }
    }

    if (count > 0) {
      result.push({ element, count: Math.round(count * 10) / 10, positions });
    }
  }

  return result;
}

/**
 * 評估調候是否充足
 */
function evaluateTiaoHouSufficiency(
  existingTiaoHou: { element: WuXing; count: number; positions: string[] }[],
  climateIntensity: number,
  needsTiaoHou: boolean
): { isSufficient: boolean; score: number } {
  // 如果不需要調候，直接滿分
  if (!needsTiaoHou) {
    return { isSufficient: true, score: 100 };
  }

  // 計算已有的調候力量
  const totalTiaoHouPower = existingTiaoHou.reduce((sum, item) => sum + item.count, 0);

  // 根據氣候強度決定所需力量
  const requiredPower = climateIntensity >= 80 ? 1.5 : climateIntensity >= 60 ? 1.0 : 0.5;

  // 計算充足度
  const sufficiencyRatio = totalTiaoHouPower / requiredPower;
  const isSufficient = sufficiencyRatio >= 1;

  // 計算分數（0-100）
  let score: number;
  if (sufficiencyRatio >= 2) {
    score = 100; // 調候力量充足
  } else if (sufficiencyRatio >= 1) {
    score = 80 + (sufficiencyRatio - 1) * 20; // 80-100
  } else if (sufficiencyRatio >= 0.5) {
    score = 50 + sufficiencyRatio * 60; // 50-80
  } else {
    score = sufficiencyRatio * 100; // 0-50
  }

  return { isSufficient, score: Math.round(score) };
}

/**
 * 生成調候描述
 */
function generateTiaoHouDescription(
  dayElement: WuXing,
  monthZhi: DiZhi,
  climate: ClimateState,
  intensity: number,
  reason: string,
  existingTiaoHou: { element: WuXing; count: number; positions: string[] }[],
  isSufficient: boolean
): string {
  const parts: string[] = [];

  // 氣候描述
  const intensityDesc = intensity >= 80 ? '極' : intensity >= 60 ? '較' : '微';
  parts.push(`${dayElement}日主生於${monthZhi}月，氣候${intensityDesc}${climate}。`);

  // 調候原理
  parts.push(reason);

  // 命局調候狀況
  if (existingTiaoHou.length > 0) {
    const tiaoHouDesc = existingTiaoHou
      .map(item => `${item.element}(${item.positions.slice(0, 2).join('、')})`)
      .join('、');
    parts.push(`命局已有${tiaoHouDesc}作為調候。`);

    if (isSufficient) {
      parts.push('調候力量充足，命局寒暖燥濕得宜。');
    } else {
      parts.push('惜調候力量不足，仍需大運流年補充。');
    }
  } else {
    parts.push('命局缺乏調候用神，需靠大運流年補足。');
  }

  return parts.join('');
}

/**
 * 生成調候建議
 */
function generateTiaoHouAdvice(
  tiaoHouShen: WuXing[],
  tiaoHouJi: WuXing[],
  isSufficient: boolean,
  isUrgent: boolean,
  dayElement: WuXing
): string[] {
  const advice: string[] = [];

  if (tiaoHouShen.length === 0) {
    advice.push('氣候中和，無特別調候需求。');
    return advice;
  }

  // 調候用神建議
  const tiaoHouShenNames = tiaoHouShen.join('、');
  if (isUrgent && !isSufficient) {
    advice.push(`急需${tiaoHouShenNames}調候，此為第一用神。`);
    advice.push(`大運流年見${tiaoHouShenNames}為佳運。`);
  } else if (!isSufficient) {
    advice.push(`宜見${tiaoHouShenNames}調候命局。`);
  } else {
    advice.push(`命局調候已足，${tiaoHouShenNames}為錦上添花。`);
  }

  // 調候忌神提醒
  if (tiaoHouJi.length > 0) {
    const tiaoHouJiNames = tiaoHouJi.join('、');
    if (isUrgent) {
      advice.push(`忌見${tiaoHouJiNames}，會加重命局寒暖失衡。`);
    } else {
      advice.push(`${tiaoHouJiNames}不宜太旺。`);
    }
  }

  // 職業/方位建議
  const directionAdvice = getDirectionAdvice(tiaoHouShen, isSufficient);
  if (directionAdvice) {
    advice.push(directionAdvice);
  }

  return advice;
}

/**
 * 獲取方位建議
 */
function getDirectionAdvice(tiaoHouShen: WuXing[], isSufficient: boolean): string | null {
  if (isSufficient || tiaoHouShen.length === 0) return null;

  const directions: Record<WuXing, string> = {
    '木': '東方',
    '火': '南方',
    '土': '中央、東北、西南',
    '金': '西方',
    '水': '北方',
  };

  const industries: Record<WuXing, string> = {
    '木': '教育、出版、木材、園藝',
    '火': '電子、能源、餐飲、娛樂',
    '土': '房地產、農業、建築、倉儲',
    '金': '金融、機械、汽車、五金',
    '水': '貿易、旅遊、物流、傳媒',
  };

  const mainTiaoHou = tiaoHouShen[0];
  return `可往${directions[mainTiaoHou]}發展，適合從事${industries[mainTiaoHou]}等行業。`;
}

// ========== 輔助函數 ==========

/**
 * 獲取調候用神對運勢的影響
 * 用於大運/流年評分調整
 */
export function getTiaoHouImpact(
  tiaoHouAnalysis: TiaoHouAnalysis,
  targetElement: WuXing
): { score: number; description: string } {
  const { tiaoHouShen, tiaoHouJi, isUrgent, isSufficient, climateIntensity } = tiaoHouAnalysis;

  // 計算調候影響分數
  let score = 0;
  let description = '';

  if (tiaoHouShen.includes(targetElement)) {
    // 遇到調候用神
    if (isUrgent && !isSufficient) {
      score = 25; // 急需且不足，加分很高
      description = `大運/流年${targetElement}為調候用神，正補命局所急需。`;
    } else if (!isSufficient) {
      score = 15;
      description = `${targetElement}為調候用神，有助命局寒暖平衡。`;
    } else {
      score = 5;
      description = `${targetElement}為調候用神，錦上添花。`;
    }
  } else if (tiaoHouJi.includes(targetElement)) {
    // 遇到調候忌神
    if (isUrgent) {
      score = -20;
      description = `${targetElement}為調候忌神，加重命局寒暖失衡。`;
    } else {
      score = -10;
      description = `${targetElement}不利調候。`;
    }
  }

  return { score, description };
}

/**
 * 簡化版：快速判斷是否需要調候
 */
export function needsTiaoHou(chart: BaZiChart): boolean {
  const monthZhi = chart.month.zhi;
  const { intensity } = MONTH_CLIMATE[monthZhi];
  return intensity >= 60;
}

/**
 * 簡化版：獲取最需要的調候五行
 */
export function getPrimaryTiaoHou(chart: BaZiChart): WuXing | null {
  const analysis = analyzeTiaoHou(chart);
  return analysis.tiaoHouShen[0] || null;
}
