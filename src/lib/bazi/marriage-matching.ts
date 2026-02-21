/**
 * 合婚分析模組
 * 分析兩人八字的婚姻相合度
 */

import type { TianGan, DiZhi, WuXing, BaZiChart, Gender, ShiShen } from './types';
import { getTenGod } from './ten-gods';
import { TIAN_GAN_ELEMENT, DI_ZHI_ELEMENT } from '@/data/constants';

/** 合婚分析結果 */
export interface MarriageMatchingResult {
  // 總評
  totalScore: number;          // 總分（0-100）
  level: '上上婚' | '上等婚' | '中上婚' | '中等婚' | '中下婚' | '下等婚';
  summary: string;             // 總評說明

  // 日柱合婚
  dayPillarMatch: {
    score: number;
    ganMatch: string;          // 天干配對
    zhiMatch: string;          // 地支配對
    description: string;
  };

  // 年柱合婚（生肖）
  yearMatch: {
    score: number;
    relation: string;          // 關係類型
    description: string;
  };

  // 五行互補
  wuxingMatch: {
    score: number;
    complementary: string[];   // 互補的五行
    conflict: string[];        // 衝突的五行
    description: string;
  };

  // 十神配對
  tenGodMatch: {
    score: number;
    maleToFemale: ShiShen;     // 男方對女方
    femaleToMale: ShiShen;     // 女方對男方
    description: string;
  };

  // 宮位配對
  palaceMatch: {
    score: number;
    description: string;
  };

  // 綜合建議
  advice: {
    strengths: string[];       // 優點
    challenges: string[];      // 挑戰
    suggestions: string[];     // 建議
  };

  // 最佳結婚年份（未來5年）
  bestYears: Array<{
    year: number;
    score: number;
    reason: string;
  }>;
}

/** 天干合化 */
const GAN_HE: Record<string, { partner: TianGan; element: WuXing; name: string }> = {
  '甲': { partner: '己', element: '土', name: '中正之合' },
  '己': { partner: '甲', element: '土', name: '中正之合' },
  '乙': { partner: '庚', element: '金', name: '仁義之合' },
  '庚': { partner: '乙', element: '金', name: '仁義之合' },
  '丙': { partner: '辛', element: '水', name: '威制之合' },
  '辛': { partner: '丙', element: '水', name: '威制之合' },
  '丁': { partner: '壬', element: '木', name: '淫佚之合' },
  '壬': { partner: '丁', element: '木', name: '淫佚之合' },
  '戊': { partner: '癸', element: '火', name: '無情之合' },
  '癸': { partner: '戊', element: '火', name: '無情之合' },
};

/** 地支六合 */
const ZHI_LIUHE: Record<string, { partner: DiZhi; element: WuXing }> = {
  '子': { partner: '丑', element: '土' },
  '丑': { partner: '子', element: '土' },
  '寅': { partner: '亥', element: '木' },
  '亥': { partner: '寅', element: '木' },
  '卯': { partner: '戌', element: '火' },
  '戌': { partner: '卯', element: '火' },
  '辰': { partner: '酉', element: '金' },
  '酉': { partner: '辰', element: '金' },
  '巳': { partner: '申', element: '水' },
  '申': { partner: '巳', element: '水' },
  '午': { partner: '未', element: '土' },
  '未': { partner: '午', element: '土' },
};

/** 地支六沖 */
const ZHI_CHONG: Record<DiZhi, DiZhi> = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳',
};

/** 地支三合 */
const ZHI_SANHE: Record<DiZhi, DiZhi[]> = {
  '申': ['子', '辰'], '子': ['申', '辰'], '辰': ['申', '子'], // 水局
  '寅': ['午', '戌'], '午': ['寅', '戌'], '戌': ['寅', '午'], // 火局
  '亥': ['卯', '未'], '卯': ['亥', '未'], '未': ['亥', '卯'], // 木局
  '巳': ['酉', '丑'], '酉': ['巳', '丑'], '丑': ['巳', '酉'], // 金局
};

/** 生肖六害 */
const ZHI_HAI: Record<DiZhi, DiZhi> = {
  '子': '未', '未': '子',
  '丑': '午', '午': '丑',
  '寅': '巳', '巳': '寅',
  '卯': '辰', '辰': '卯',
  '申': '亥', '亥': '申',
  '酉': '戌', '戌': '酉',
};

/** 生肖三刑 */
const ZHI_XING: Record<DiZhi, DiZhi[]> = {
  '寅': ['巳', '申'], '巳': ['寅', '申'], '申': ['寅', '巳'], // 無恩之刑
  '丑': ['戌', '未'], '戌': ['丑', '未'], '未': ['丑', '戌'], // 恃勢之刑
  '子': ['卯'], '卯': ['子'], // 無禮之刑
  '辰': ['辰'], '午': ['午'], '酉': ['酉'], '亥': ['亥'], // 自刑
};

/** 天干五行 */
const GAN_ELEMENT: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

/** 地支五行 */
const ZHI_ELEMENT: Record<DiZhi, WuXing> = {
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '丑': '土', '未': '土', '戌': '土',
  '申': '金', '酉': '金',
  '亥': '水', '子': '水',
};

/** 生肖名稱 */
const ZHI_ANIMAL: Record<DiZhi, string> = {
  '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
  '辰': '龍', '巳': '蛇', '午': '馬', '未': '羊',
  '申': '猴', '酉': '雞', '戌': '狗', '亥': '豬',
};

/**
 * 執行合婚分析
 * @param maleChart 男方八字
 * @param femaleChart 女方八字
 * @returns 合婚分析結果
 */
export function analyzeMarriageMatching(
  maleChart: BaZiChart,
  femaleChart: BaZiChart
): MarriageMatchingResult {
  // 1. 日柱合婚分析
  const dayPillarMatch = analyzeDayPillarMatch(maleChart, femaleChart);

  // 2. 年柱（生肖）合婚
  const yearMatch = analyzeYearMatch(maleChart.year.zhi, femaleChart.year.zhi);

  // 3. 五行互補分析
  const wuxingMatch = analyzeWuxingMatch(maleChart, femaleChart);

  // 4. 十神配對分析
  const tenGodMatch = analyzeTenGodMatch(maleChart, femaleChart);

  // 5. 宮位配對分析
  const palaceMatch = analyzePalaceMatch(maleChart, femaleChart);

  // 計算總分
  const totalScore = Math.round(
    dayPillarMatch.score * 0.30 +
    yearMatch.score * 0.15 +
    wuxingMatch.score * 0.25 +
    tenGodMatch.score * 0.15 +
    palaceMatch.score * 0.15
  );

  // 評定等級
  const level = getMatchLevel(totalScore);

  // 生成綜合建議
  const advice = generateMarriageAdvice(
    dayPillarMatch,
    yearMatch,
    wuxingMatch,
    tenGodMatch,
    palaceMatch
  );

  // 推算最佳結婚年份
  const bestYears = calculateBestMarriageYears(maleChart, femaleChart);

  return {
    totalScore,
    level,
    summary: generateSummary(totalScore, level, dayPillarMatch, yearMatch),
    dayPillarMatch,
    yearMatch,
    wuxingMatch,
    tenGodMatch,
    palaceMatch,
    advice,
    bestYears,
  };
}

/**
 * 日柱合婚分析
 */
function analyzeDayPillarMatch(maleChart: BaZiChart, femaleChart: BaZiChart): {
  score: number;
  ganMatch: string;
  zhiMatch: string;
  description: string;
} {
  const maleGan = maleChart.day.gan;
  const femaleGan = femaleChart.day.gan;
  const maleZhi = maleChart.day.zhi;
  const femaleZhi = femaleChart.day.zhi;

  let ganScore = 50;
  let zhiScore = 50;
  let ganMatch = '';
  let zhiMatch = '';

  // 天干配對
  if (GAN_HE[maleGan]?.partner === femaleGan) {
    ganScore = 95;
    ganMatch = `天干相合（${GAN_HE[maleGan].name}）- 大吉`;
  } else if (GAN_ELEMENT[maleGan] === GAN_ELEMENT[femaleGan]) {
    ganScore = 70;
    ganMatch = '天干同五行 - 同心同德';
  } else {
    const maleEl = GAN_ELEMENT[maleGan];
    const femaleEl = GAN_ELEMENT[femaleGan];
    const relation = getElementRelation(maleEl, femaleEl);
    if (relation === '生') {
      ganScore = 75;
      ganMatch = '天干相生 - 互相扶持';
    } else if (relation === '被生') {
      ganScore = 70;
      ganMatch = '天干相生 - 受到照顧';
    } else if (relation === '剋') {
      ganScore = 40;
      ganMatch = '天干相剋 - 需要磨合';
    } else if (relation === '被剋') {
      ganScore = 45;
      ganMatch = '天干相剋 - 壓力較大';
    } else {
      ganScore = 55;
      ganMatch = '天干平和 - 相安無事';
    }
  }

  // 地支配對
  if (ZHI_LIUHE[maleZhi]?.partner === femaleZhi) {
    zhiScore = 95;
    zhiMatch = '地支六合 - 天作之合';
  } else if (ZHI_SANHE[maleZhi]?.includes(femaleZhi)) {
    zhiScore = 85;
    zhiMatch = '地支三合 - 氣場相合';
  } else if (ZHI_CHONG[maleZhi] === femaleZhi) {
    zhiScore = 30;
    zhiMatch = '地支相沖 - 挑戰較大';
  } else if (ZHI_HAI[maleZhi] === femaleZhi) {
    zhiScore = 35;
    zhiMatch = '地支相害 - 易生嫌隙';
  } else if (ZHI_XING[maleZhi]?.includes(femaleZhi)) {
    zhiScore = 40;
    zhiMatch = '地支相刑 - 需要包容';
  } else {
    zhiScore = 60;
    zhiMatch = '地支平和 - 相處自然';
  }

  const score = Math.round(ganScore * 0.5 + zhiScore * 0.5);

  let description = '';
  if (score >= 80) {
    description = '日柱相合度極佳，兩人有天然的親近感，相處融洽，是難得的良緣。';
  } else if (score >= 65) {
    description = '日柱相合度良好，兩人能互相理解，感情發展順利。';
  } else if (score >= 50) {
    description = '日柱相合度中等，需要雙方共同經營感情，互相包容。';
  } else {
    description = '日柱有衝突，感情路上會有挑戰，但只要真心相愛，仍可克服。';
  }

  return { score, ganMatch, zhiMatch, description };
}

/**
 * 年柱（生肖）合婚分析
 */
function analyzeYearMatch(maleZhi: DiZhi, femaleZhi: DiZhi): {
  score: number;
  relation: string;
  description: string;
} {
  const maleAnimal = ZHI_ANIMAL[maleZhi];
  const femaleAnimal = ZHI_ANIMAL[femaleZhi];

  let score = 60;
  let relation = '';

  // 六合
  if (ZHI_LIUHE[maleZhi]?.partner === femaleZhi) {
    score = 95;
    relation = '六合';
  }
  // 三合
  else if (ZHI_SANHE[maleZhi]?.includes(femaleZhi)) {
    score = 85;
    relation = '三合';
  }
  // 六沖
  else if (ZHI_CHONG[maleZhi] === femaleZhi) {
    score = 35;
    relation = '六沖';
  }
  // 六害
  else if (ZHI_HAI[maleZhi] === femaleZhi) {
    score = 40;
    relation = '六害';
  }
  // 相刑
  else if (ZHI_XING[maleZhi]?.includes(femaleZhi)) {
    score = 45;
    relation = '相刑';
  }
  // 同生肖
  else if (maleZhi === femaleZhi) {
    score = 70;
    relation = '同生肖';
  }
  else {
    score = 60;
    relation = '平和';
  }

  const relationDesc: Record<string, string> = {
    '六合': `${maleAnimal}與${femaleAnimal}六合，天生一對，姻緣美滿。`,
    '三合': `${maleAnimal}與${femaleAnimal}三合，志同道合，感情和諧。`,
    '六沖': `${maleAnimal}與${femaleAnimal}相沖，性格差異大，需要更多包容。`,
    '六害': `${maleAnimal}與${femaleAnimal}相害，容易產生誤解，需要加強溝通。`,
    '相刑': `${maleAnimal}與${femaleAnimal}相刑，相處時需多忍讓。`,
    '同生肖': `同屬${maleAnimal}，想法相近，但也容易固執己見。`,
    '平和': `${maleAnimal}與${femaleAnimal}相處平和，無明顯沖剋。`,
  };

  return {
    score,
    relation,
    description: relationDesc[relation] || `${maleAnimal}與${femaleAnimal}相處自然。`,
  };
}

/**
 * 五行互補分析
 */
function analyzeWuxingMatch(maleChart: BaZiChart, femaleChart: BaZiChart): {
  score: number;
  complementary: string[];
  conflict: string[];
  description: string;
} {
  // 統計雙方五行
  const maleWuxing = countWuxing(maleChart);
  const femaleWuxing = countWuxing(femaleChart);

  const complementary: string[] = [];
  const conflict: string[] = [];

  // 找出互補的五行（一方缺，另一方旺）
  const elements: WuXing[] = ['木', '火', '土', '金', '水'];
  for (const el of elements) {
    const maleCount = maleWuxing[el];
    const femaleCount = femaleWuxing[el];

    if ((maleCount <= 1 && femaleCount >= 3) || (femaleCount <= 1 && maleCount >= 3)) {
      complementary.push(`${el}（互補）`);
    }
    if (maleCount >= 4 && femaleCount >= 4) {
      conflict.push(`${el}（過旺）`);
    }
  }

  // 日主五行關係
  const maleElement = maleChart.day.ganElement;
  const femaleElement = femaleChart.day.ganElement;
  const relation = getElementRelation(maleElement, femaleElement);

  let score = 60;
  if (complementary.length >= 2) score += 15;
  else if (complementary.length === 1) score += 8;

  if (conflict.length >= 2) score -= 15;
  else if (conflict.length === 1) score -= 8;

  if (relation === '生' || relation === '被生') score += 10;
  if (relation === '剋' || relation === '被剋') score -= 10;

  score = Math.max(30, Math.min(95, score));

  let description = '';
  if (complementary.length > 0) {
    description = `五行互補良好（${complementary.join('、')}），能夠取長補短。`;
  } else if (conflict.length > 0) {
    description = `五行有衝突（${conflict.join('、')}），需要注意平衡。`;
  } else {
    description = '五行配合中等，無明顯互補或衝突。';
  }

  return { score, complementary, conflict, description };
}

/**
 * 十神配對分析
 */
function analyzeTenGodMatch(maleChart: BaZiChart, femaleChart: BaZiChart): {
  score: number;
  maleToFemale: ShiShen;
  femaleToMale: ShiShen;
  description: string;
} {
  // 男方日主對女方日主的十神
  const maleToFemale = getTenGod(maleChart.day.gan, femaleChart.day.gan);
  // 女方日主對男方日主的十神
  const femaleToMale = getTenGod(femaleChart.day.gan, maleChart.day.gan);

  let score = 60;

  // 好的配對
  const goodPairs = [
    ['正財', '正官'], // 男看財女看官
    ['正印', '食神'], // 互相滋養
    ['偏財', '七殺'], // 互相吸引
  ];

  // 較有挑戰的配對
  const challengePairs = [
    ['劫財', '劫財'], // 競爭
    ['傷官', '正官'], // 衝突
    ['七殺', '七殺'], // 壓力
  ];

  // 根據十神組合評分
  if (maleToFemale === '正財' || femaleToMale === '正官') score += 15;
  if (maleToFemale === '正印' || femaleToMale === '正印') score += 10;
  if (maleToFemale === '食神' || femaleToMale === '食神') score += 10;
  if (maleToFemale === '劫財' && femaleToMale === '劫財') score -= 10;
  if (maleToFemale === '傷官' || femaleToMale === '傷官') score -= 5;
  if (maleToFemale === '七殺' && femaleToMale === '七殺') score -= 10;

  score = Math.max(30, Math.min(95, score));

  const tenGodDesc: Record<ShiShen, string> = {
    '比肩': '平等夥伴',
    '劫財': '競爭關係',
    '食神': '照顧滋養',
    '傷官': '創意碰撞',
    '偏財': '相互吸引',
    '正財': '穩定支持',
    '七殺': '激情壓力',
    '正官': '尊重有序',
    '偏印': '精神共鳴',
    '正印': '包容呵護',
  };

  const description = `男方視女方為「${maleToFemale}」（${tenGodDesc[maleToFemale]}），女方視男方為「${femaleToMale}」（${tenGodDesc[femaleToMale]}）。`;

  return { score, maleToFemale, femaleToMale, description };
}

/**
 * 宮位配對分析
 */
function analyzePalaceMatch(maleChart: BaZiChart, femaleChart: BaZiChart): {
  score: number;
  description: string;
} {
  // 日支是配偶宮
  const maleSpousePalace = maleChart.day.zhi;
  const femaleSpousePalace = femaleChart.day.zhi;

  let score = 60;
  let description = '';

  // 配偶宮與對方年柱、日柱的關係
  // 男方配偶宮與女方年支
  if (ZHI_LIUHE[maleSpousePalace]?.partner === femaleChart.year.zhi) {
    score += 10;
    description += '男方配偶宮與女方生肖六合，姻緣深厚。';
  }
  if (ZHI_CHONG[maleSpousePalace] === femaleChart.year.zhi) {
    score -= 10;
    description += '男方配偶宮與女方生肖相沖，需要磨合。';
  }

  // 女方配偶宮與男方年支
  if (ZHI_LIUHE[femaleSpousePalace]?.partner === maleChart.year.zhi) {
    score += 10;
    description += '女方配偶宮與男方生肖六合，姻緣深厚。';
  }
  if (ZHI_CHONG[femaleSpousePalace] === maleChart.year.zhi) {
    score -= 10;
    description += '女方配偶宮與男方生肖相沖，需要磨合。';
  }

  // 雙方配偶宮關係
  if (ZHI_LIUHE[maleSpousePalace]?.partner === femaleSpousePalace) {
    score += 15;
    description += '雙方配偶宮六合，天作之合。';
  } else if (ZHI_SANHE[maleSpousePalace]?.includes(femaleSpousePalace)) {
    score += 10;
    description += '雙方配偶宮三合，心意相通。';
  } else if (ZHI_CHONG[maleSpousePalace] === femaleSpousePalace) {
    score -= 15;
    description += '雙方配偶宮相沖，感情波折較多。';
  }

  if (!description) {
    description = '配偶宮相處平和，婚姻生活穩定。';
  }

  score = Math.max(30, Math.min(95, score));

  return { score, description };
}

// ===== 輔助函數 =====

function getElementRelation(el1: WuXing, el2: WuXing): '生' | '被生' | '剋' | '被剋' | '同' | '無' {
  const generateMap: Record<WuXing, WuXing> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };
  const controlMap: Record<WuXing, WuXing> = {
    '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
  };

  if (el1 === el2) return '同';
  if (generateMap[el1] === el2) return '生';
  if (generateMap[el2] === el1) return '被生';
  if (controlMap[el1] === el2) return '剋';
  if (controlMap[el2] === el1) return '被剋';
  return '無';
}

function countWuxing(chart: BaZiChart): Record<WuXing, number> {
  const count: Record<WuXing, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  const pillars = [chart.year, chart.month, chart.day, chart.hour];
  for (const pillar of pillars) {
    count[pillar.ganElement]++;
    count[pillar.zhiElement]++;
  }

  return count;
}

function getMatchLevel(score: number): '上上婚' | '上等婚' | '中上婚' | '中等婚' | '中下婚' | '下等婚' {
  if (score >= 85) return '上上婚';
  if (score >= 75) return '上等婚';
  if (score >= 65) return '中上婚';
  if (score >= 55) return '中等婚';
  if (score >= 45) return '中下婚';
  return '下等婚';
}

function generateSummary(
  score: number,
  level: string,
  dayPillar: { score: number },
  year: { score: number }
): string {
  let summary = `整體配對評分 ${score} 分，屬於「${level}」。`;

  if (score >= 80) {
    summary += '兩人八字高度契合，是難得的良緣。互相扶持，婚姻美滿可期。';
  } else if (score >= 65) {
    summary += '兩人八字配合良好，感情發展順利。用心經營，可成佳偶。';
  } else if (score >= 50) {
    summary += '兩人八字配合中等，需要雙方共同努力經營感情。真心相待，仍可白頭偕老。';
  } else {
    summary += '兩人八字有些衝突，感情路上會有挑戰。但只要真心相愛，願意包容，仍有機會幸福。';
  }

  return summary;
}

function generateMarriageAdvice(
  dayPillar: { score: number; ganMatch: string; zhiMatch: string },
  year: { score: number; relation: string },
  wuxing: { score: number; complementary: string[]; conflict: string[] },
  tenGod: { score: number; maleToFemale: ShiShen; femaleToMale: ShiShen },
  palace: { score: number }
): { strengths: string[]; challenges: string[]; suggestions: string[] } {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const suggestions: string[] = [];

  // 根據各項分數生成建議
  if (dayPillar.score >= 70) {
    strengths.push('日柱相合，天生有緣，相處融洽');
  }
  if (year.score >= 70) {
    strengths.push(`生肖${year.relation}，姻緣天定`);
  }
  if (wuxing.complementary.length > 0) {
    strengths.push('五行互補，取長補短');
  }
  if (tenGod.score >= 70) {
    strengths.push('十神配對佳，互相成就');
  }

  if (dayPillar.score < 50) {
    challenges.push('日柱有沖，需要更多包容');
    suggestions.push('遇到分歧時，先冷靜再溝通');
  }
  if (year.score < 50) {
    challenges.push(`生肖${year.relation}，性格差異大`);
    suggestions.push('理解彼此的不同，欣賞對方的優點');
  }
  if (wuxing.conflict.length > 0) {
    challenges.push('五行有衝突，容易較勁');
    suggestions.push('各退一步，海闊天空');
  }
  if (tenGod.score < 50) {
    challenges.push('十神配對有壓力');
    suggestions.push('給對方空間，不要控制太多');
  }

  // 通用建議
  suggestions.push('定期安排兩人時間，維繫感情');
  suggestions.push('有問題當面溝通，不要冷戰');

  return { strengths, challenges, suggestions };
}

function calculateBestMarriageYears(
  maleChart: BaZiChart,
  femaleChart: BaZiChart
): Array<{ year: number; score: number; reason: string }> {
  const currentYear = new Date().getFullYear();
  const results: Array<{ year: number; score: number; reason: string }> = [];

  // 六十甲子
  const TIAN_GAN: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const DI_ZHI: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  for (let i = 0; i < 5; i++) {
    const year = currentYear + i;
    const ganIndex = (year - 4) % 10;
    const zhiIndex = (year - 4) % 12;
    const yearGan = TIAN_GAN[ganIndex];
    const yearZhi = DI_ZHI[zhiIndex];

    let score = 60;
    const reasons: string[] = [];

    // 流年地支與雙方配偶宮的關係
    const maleSpouse = maleChart.day.zhi;
    const femaleSpouse = femaleChart.day.zhi;

    if (ZHI_LIUHE[yearZhi]?.partner === maleSpouse || ZHI_LIUHE[yearZhi]?.partner === femaleSpouse) {
      score += 15;
      reasons.push('流年合配偶宮');
    }
    if (ZHI_SANHE[yearZhi]?.includes(maleSpouse) || ZHI_SANHE[yearZhi]?.includes(femaleSpouse)) {
      score += 10;
      reasons.push('流年三合');
    }
    if (ZHI_CHONG[yearZhi] === maleSpouse || ZHI_CHONG[yearZhi] === femaleSpouse) {
      score -= 10;
      reasons.push('流年沖配偶宮');
    }

    // 紅鸞天喜
    // 簡化判斷：某些年份特別適合婚嫁
    if (['卯', '午', '酉', '子'].includes(yearZhi)) {
      score += 5;
      reasons.push('桃花年');
    }

    score = Math.max(40, Math.min(95, score));

    results.push({
      year,
      score,
      reason: reasons.length > 0 ? reasons.join('、') : '平穩年份',
    });
  }

  // 按分數排序
  return results.sort((a, b) => b.score - a.score);
}

/**
 * 取得合婚簡評
 */
export function getMarriageMatchingSummary(result: MarriageMatchingResult): string {
  return `配對評分：${result.totalScore}分（${result.level}）。${result.summary}`;
}
