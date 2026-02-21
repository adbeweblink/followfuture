/**
 * 小運（童限）分析模組
 * 分析大運起運前的運程，從出生到起運年齡之間的流年運勢
 */

import type { BaZiChart, TianGan, DiZhi, WuXing, ShiShen, Gender } from './types';
import { getTenGod } from './ten-gods';
import {
  TIAN_GAN,
  DI_ZHI,
  TIAN_GAN_ELEMENT,
  DI_ZHI_ELEMENT,
} from '@/data/constants';

export interface MinorFortuneYear {
  age: number;
  year: number;
  ganZhi: string;
  gan: TianGan;
  zhi: DiZhi;
  ganElement: WuXing;
  zhiElement: WuXing;
  ganTenGod: ShiShen;
  zhiTenGod: ShiShen;
  theme: string;
  advice: string;
  score: number;
}

export interface MinorFortuneAnalysis {
  startYear: number;
  endYear: number;
  years: MinorFortuneYear[];
  summary: string;
  overallTheme: string;
}

/**
 * 計算小運起始干支
 * 小運從時柱干支開始，順行或逆行
 * 男陽女陰順行，男陰女陽逆行
 */
function getMinorFortuneDirection(yearGan: TianGan, gender: Gender): 'forward' | 'backward' {
  const yangGan = ['甲', '丙', '戊', '庚', '壬'];
  const isYangYear = yangGan.includes(yearGan);

  // 男命陽年順行，陰年逆行
  // 女命陰年順行，陽年逆行
  if (gender === '男') {
    return isYangYear ? 'forward' : 'backward';
  } else {
    return isYangYear ? 'backward' : 'forward';
  }
}

/**
 * 獲取下一個或上一個天干
 */
function getNextGan(gan: TianGan, direction: 'forward' | 'backward'): TianGan {
  const index = TIAN_GAN.indexOf(gan);
  if (direction === 'forward') {
    return TIAN_GAN[(index + 1) % 10] as TianGan;
  } else {
    return TIAN_GAN[(index - 1 + 10) % 10] as TianGan;
  }
}

/**
 * 獲取下一個或上一個地支
 */
function getNextZhi(zhi: DiZhi, direction: 'forward' | 'backward'): DiZhi {
  const index = DI_ZHI.indexOf(zhi);
  if (direction === 'forward') {
    return DI_ZHI[(index + 1) % 12] as DiZhi;
  } else {
    return DI_ZHI[(index - 1 + 12) % 12] as DiZhi;
  }
}

/**
 * 小運干支對應的主題分析
 */
function analyzeMinorFortuneTheme(
  gan: TianGan,
  zhi: DiZhi,
  ganTenGod: ShiShen,
  zhiTenGod: ShiShen,
  age: number
): { theme: string; advice: string; score: number } {
  let theme = '';
  let advice = '';
  let score = 60;

  // 根據十神組合判斷主題
  const tenGodThemes: Record<ShiShen, { theme: string; childAdvice: string; baseScore: number }> = {
    '比肩': {
      theme: '有同伴相助',
      childAdvice: '適合多與同齡人互動，培養社交能力',
      baseScore: 65,
    },
    '劫財': {
      theme: '競爭意識強',
      childAdvice: '注意與兄弟姐妹或同學的相處，學會分享',
      baseScore: 55,
    },
    '食神': {
      theme: '享受生活、才華展現',
      childAdvice: '適合發展藝術、音樂等才藝，享受學習的樂趣',
      baseScore: 75,
    },
    '傷官': {
      theme: '聰明叛逆、創意十足',
      childAdvice: '引導創造力，避免過於調皮搗蛋',
      baseScore: 60,
    },
    '偏財': {
      theme: '父緣旺、外向活潑',
      childAdvice: '與父親關係佳，適合戶外活動',
      baseScore: 70,
    },
    '正財': {
      theme: '穩定務實',
      childAdvice: '培養理財觀念，學習珍惜物品',
      baseScore: 68,
    },
    '七殺': {
      theme: '挑戰多、意志堅強',
      childAdvice: '可能面臨一些挫折，但能培養堅強性格',
      baseScore: 50,
    },
    '正官': {
      theme: '規矩守紀',
      childAdvice: '適合學習規則，建立良好習慣',
      baseScore: 72,
    },
    '偏印': {
      theme: '獨特想法、學習特殊技能',
      childAdvice: '可能對特殊領域感興趣，支持其探索',
      baseScore: 62,
    },
    '正印': {
      theme: '受長輩疼愛、學業順利',
      childAdvice: '學習能力強，適合培養閱讀習慣',
      baseScore: 78,
    },
  };

  const ganTheme = tenGodThemes[ganTenGod];
  const zhiTheme = tenGodThemes[zhiTenGod];

  // 綜合天干地支十神
  if (ganTheme && zhiTheme) {
    if (['正印', '食神', '正財', '正官'].includes(ganTenGod)) {
      theme = `${age}歲：${ganTheme.theme}`;
      advice = ganTheme.childAdvice;
      score = Math.round((ganTheme.baseScore + zhiTheme.baseScore) / 2);
    } else {
      theme = `${age}歲：${zhiTheme.theme}`;
      advice = zhiTheme.childAdvice;
      score = Math.round((ganTheme.baseScore + zhiTheme.baseScore) / 2);
    }
  }

  // 根據年齡調整建議
  if (age <= 3) {
    advice = '嬰幼兒時期，' + advice.replace('適合', '父母可').replace('學習', '啟蒙');
  } else if (age <= 6) {
    advice = '學齡前，' + advice;
  } else if (age <= 12) {
    advice = '小學階段，' + advice;
  }

  return { theme, advice, score };
}

/**
 * 分析小運（童限）
 *
 * @param chart - 八字命盤
 * @param birthYear - 出生年份
 * @param gender - 性別
 * @param majorFortuneStartAge - 大運起運年齡
 * @returns 小運分析結果
 */
export function analyzeMinorFortune(
  chart: BaZiChart,
  birthYear: number,
  gender: Gender,
  majorFortuneStartAge: number
): MinorFortuneAnalysis {
  const dayMaster = chart.day.gan;
  const direction = getMinorFortuneDirection(chart.year.gan, gender);

  // 小運從時柱開始
  let currentGan = chart.hour.gan;
  let currentZhi = chart.hour.zhi;

  const years: MinorFortuneYear[] = [];

  // 計算從1歲到大運起運前的每一年
  for (let age = 1; age < majorFortuneStartAge; age++) {
    const year = birthYear + age;
    const ganElement = TIAN_GAN_ELEMENT[currentGan];
    const zhiElement = DI_ZHI_ELEMENT[currentZhi];
    const ganTenGod = getTenGod(dayMaster, currentGan);
    const zhiTenGod = getTenGod(dayMaster, currentGan); // 簡化處理，實際應取地支藏干

    const { theme, advice, score } = analyzeMinorFortuneTheme(
      currentGan,
      currentZhi,
      ganTenGod,
      zhiTenGod,
      age
    );

    years.push({
      age,
      year,
      ganZhi: currentGan + currentZhi,
      gan: currentGan,
      zhi: currentZhi,
      ganElement,
      zhiElement,
      ganTenGod,
      zhiTenGod,
      theme,
      advice,
      score,
    });

    // 移動到下一個干支
    currentGan = getNextGan(currentGan, direction);
    currentZhi = getNextZhi(currentZhi, direction);
  }

  // 生成總結
  const summary = generateMinorFortuneSummary(years, majorFortuneStartAge);
  const overallTheme = generateOverallTheme(years);

  return {
    startYear: birthYear + 1,
    endYear: birthYear + majorFortuneStartAge - 1,
    years,
    summary,
    overallTheme,
  };
}

/**
 * 生成小運總結
 */
function generateMinorFortuneSummary(years: MinorFortuneYear[], majorFortuneStartAge: number): string {
  if (years.length === 0) {
    return '大運起運較早，小運時期較短。';
  }

  const avgScore = years.reduce((sum, y) => sum + y.score, 0) / years.length;

  const summaryParts: string[] = [];

  if (avgScore >= 70) {
    summaryParts.push(`童年運勢良好（${majorFortuneStartAge}歲前）`);
    summaryParts.push('成長環境較為順遂，能得到家人的關愛與照顧。');
  } else if (avgScore >= 60) {
    summaryParts.push(`童年運勢平穩（${majorFortuneStartAge}歲前）`);
    summaryParts.push('成長過程中有一些小挑戰，但整體平順。');
  } else {
    summaryParts.push(`童年可能有些波折（${majorFortuneStartAge}歲前）`);
    summaryParts.push('早年可能經歷一些考驗，但這些經歷會成為成長的養分。');
  }

  // 找出特別好或特別需要注意的年份
  const goodYears = years.filter(y => y.score >= 75);
  const challengeYears = years.filter(y => y.score < 55);

  if (goodYears.length > 0) {
    summaryParts.push(`特別順利的年齡：${goodYears.map(y => y.age + '歲').join('、')}。`);
  }

  if (challengeYears.length > 0) {
    summaryParts.push(`需要多加關注的年齡：${challengeYears.map(y => y.age + '歲').join('、')}。`);
  }

  return summaryParts.join('');
}

/**
 * 生成整體主題
 */
function generateOverallTheme(years: MinorFortuneYear[]): string {
  if (years.length === 0) return '';

  // 統計十神出現次數
  const tenGodCount: Record<string, number> = {};
  years.forEach(y => {
    tenGodCount[y.ganTenGod] = (tenGodCount[y.ganTenGod] || 0) + 1;
  });

  // 找出最常出現的十神
  const dominantTenGod = Object.entries(tenGodCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  const themes: Record<string, string> = {
    '正印': '童年受長輩庇護，學業運佳',
    '偏印': '童年思想獨特，可能對神秘事物感興趣',
    '正官': '童年規矩，家教嚴格但有益成長',
    '七殺': '童年獨立性強，較早懂事',
    '正財': '童年物質條件尚可，懂得珍惜',
    '偏財': '童年與父親緣分較深，活潑好動',
    '食神': '童年快樂，才藝發展良好',
    '傷官': '童年聰明伶俐，但可能較調皮',
    '比肩': '童年有玩伴，社交能力發展',
    '劫財': '童年競爭環境，培養堅強性格',
  };

  return themes[dominantTenGod] || '童年運勢多變，適應能力強';
}

/**
 * 獲取特定年齡的小運分析
 */
export function getMinorFortuneByAge(
  analysis: MinorFortuneAnalysis,
  age: number
): MinorFortuneYear | undefined {
  return analysis.years.find(y => y.age === age);
}

/**
 * 獲取小運簡要
 */
export function getMinorFortuneBrief(
  chart: BaZiChart,
  birthYear: number,
  gender: Gender,
  majorFortuneStartAge: number
): string {
  const analysis = analyzeMinorFortune(chart, birthYear, gender, majorFortuneStartAge);

  if (analysis.years.length === 0) {
    return '大運起運較早，小運時期較短。';
  }

  return `${analysis.overallTheme}。${analysis.summary}`;
}

/**
 * 判斷是否處於小運期間
 */
export function isInMinorFortunePeriod(
  birthYear: number,
  currentYear: number,
  majorFortuneStartAge: number
): boolean {
  const currentAge = currentYear - birthYear;
  return currentAge > 0 && currentAge < majorFortuneStartAge;
}

/**
 * 獲取當前小運（如果仍在小運期間）
 */
export function getCurrentMinorFortune(
  chart: BaZiChart,
  birthYear: number,
  gender: Gender,
  majorFortuneStartAge: number
): MinorFortuneYear | null {
  const currentYear = new Date().getFullYear();

  if (!isInMinorFortunePeriod(birthYear, currentYear, majorFortuneStartAge)) {
    return null;
  }

  const currentAge = currentYear - birthYear;
  const analysis = analyzeMinorFortune(chart, birthYear, gender, majorFortuneStartAge);

  return getMinorFortuneByAge(analysis, currentAge) || null;
}
