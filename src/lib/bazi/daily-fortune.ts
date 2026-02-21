/**
 * 流日分析模組
 * 計算每日運勢、吉凶時辰、行事建議
 */

import type { BaZiChart, WuXing, ShiShen, TianGan, DiZhi } from './types';
// @ts-expect-error - lunar-javascript 沒有 TypeScript 型別
import { Solar } from 'lunar-javascript';
import { getTenGod } from './ten-gods';
import { TIAN_GAN_ELEMENT, DI_ZHI_ELEMENT } from '@/data/constants';
import { calculateWuXingEnergyScore } from './luck-pillar-analysis';
import { getMonthStrengthScore } from './strength';

export interface DailyFortune {
  date: string;           // 日期 YYYY-MM-DD
  ganZhi: string;         // 日干支
  gan: TianGan;           // 日天干
  zhi: DiZhi;             // 日地支
  ganElement: WuXing;     // 天干五行
  zhiElement: WuXing;     // 地支五行
  tenGod: ShiShen;        // 日干對日主的十神
  score: number;          // 運勢分數 0-100
  level: 'excellent' | 'good' | 'neutral' | 'caution' | 'poor';  // 運勢等級

  // 各方面運勢
  careerScore: number;    // 事業運
  wealthScore: number;    // 財運
  loveScore: number;      // 感情運
  healthScore: number;    // 健康運

  // 分析內容
  theme: string;          // 當日主題
  overview: string;       // 運勢總覽
  advice: string[];       // 行事建議
  cautions: string[];     // 注意事項

  // 時辰分析
  auspiciousHours: string[];    // 吉時
  inauspiciousHours: string[];  // 凶時
}

export interface WeeklyFortune {
  weekStart: string;
  weekEnd: string;
  days: DailyFortune[];
  bestDay: DailyFortune;
  worstDay: DailyFortune;
  weekSummary: string;
}

/**
 * 十神對應的日運主題
 */
const DAILY_THEMES: Record<ShiShen, {
  theme: string;
  career: string;
  wealth: string;
  love: string;
  health: string;
}> = {
  '比肩': {
    theme: '競爭合作日',
    career: '同儕競爭激烈，需展現實力',
    wealth: '財務上有同儕競爭，不宜合夥投資',
    love: '感情平淡，可能遇到競爭者',
    health: '精力充沛，適合運動',
  },
  '劫財': {
    theme: '謹慎理財日',
    career: '防小人暗害，謹慎行事',
    wealth: '破財風險高，不宜大額支出',
    love: '感情有競爭，注意第三者',
    health: '注意意外傷害',
  },
  '食神': {
    theme: '享受生活日',
    career: '展現才華，創意佳',
    wealth: '有偏財運，口福好',
    love: '桃花運佳，約會吉',
    health: '心情愉快，注意飲食過量',
  },
  '傷官': {
    theme: '創新突破日',
    career: '適合創新，但注意言行',
    wealth: '有賺錢機會但風險也大',
    love: '感情波動，易有口角',
    health: '精神亢奮，注意休息',
  },
  '偏財': {
    theme: '財運活絡日',
    career: '商機多，適合談生意',
    wealth: '偏財運旺，有意外收入',
    love: '異性緣佳，但要慎重',
    health: '精神佳，但注意勞累',
  },
  '正財': {
    theme: '穩健進財日',
    career: '工作順利，有成果',
    wealth: '正財運佳，適合談薪酬',
    love: '感情穩定，適合約會',
    health: '身體穩定，適合調養',
  },
  '七殺': {
    theme: '挑戰壓力日',
    career: '壓力大但有機會，迎難而上',
    wealth: '財務壓力，需謹慎',
    love: '感情有波折，需冷靜',
    health: '注意安全，防意外',
  },
  '正官': {
    theme: '貴人相助日',
    career: '適合見長官，有升遷機會',
    wealth: '財務穩定，守規矩得財',
    love: '感情正式，適合見家長',
    health: '穩定，注意作息',
  },
  '偏印': {
    theme: '學習進修日',
    career: '適合學習，思考問題',
    wealth: '財運平淡，不宜投機',
    love: '感情內斂，需主動',
    health: '思慮過多，注意睡眠',
  },
  '正印': {
    theme: '貴人提攜日',
    career: '有長輩貴人相助',
    wealth: '財運平穩，有人幫忙',
    love: '感情有長輩祝福',
    health: '適合休養，調整身心',
  },
};

/**
 * 時辰對應表
 */
const HOUR_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const HOUR_RANGES = [
  '23:00-01:00', '01:00-03:00', '03:00-05:00', '05:00-07:00',
  '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00',
  '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00',
];

/**
 * 計算特定日期的干支
 */
export function getDailyGanZhi(year: number, month: number, day: number): { gan: TianGan; zhi: DiZhi } {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const dayGanZhi = lunar.getDayInGanZhi();

  return {
    gan: dayGanZhi[0] as TianGan,
    zhi: dayGanZhi[1] as DiZhi,
  };
}

/**
 * 分析單日運勢
 */
export function analyzeDailyFortune(
  chart: BaZiChart,
  targetDate: Date,
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean = true
): DailyFortune {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();

  const { gan, zhi } = getDailyGanZhi(year, month, day);
  const ganElement = TIAN_GAN_ELEMENT[gan];
  const zhiElement = DI_ZHI_ELEMENT[zhi];
  const tenGod = getTenGod(chart.day.gan, gan);

  // 計算綜合分數
  const score = calculateDailyScore(
    chart.day.ganElement,
    gan,
    zhi,
    favorable,
    unfavorable,
    isStrong
  );

  // 計算各方面分數
  const { careerScore, wealthScore, loveScore, healthScore } = calculateAspectScores(
    tenGod,
    ganElement,
    zhiElement,
    favorable,
    score
  );

  // 獲取運勢等級
  const level = getFortuneLevel(score);

  // 獲取主題和內容
  const themeInfo = DAILY_THEMES[tenGod];
  const overview = generateDailyOverview(tenGod, score, ganElement);
  const advice = generateDailyAdvice(tenGod, score, isStrong);
  const cautions = generateDailyCautions(tenGod, score, ganElement, zhiElement);

  // 計算吉凶時辰
  const { auspiciousHours, inauspiciousHours } = calculateAuspiciousHours(
    chart.day.gan,
    gan,
    favorable
  );

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    date: dateStr,
    ganZhi: gan + zhi,
    gan,
    zhi,
    ganElement,
    zhiElement,
    tenGod,
    score,
    level,
    careerScore,
    wealthScore,
    loveScore,
    healthScore,
    theme: themeInfo.theme,
    overview,
    advice,
    cautions,
    auspiciousHours,
    inauspiciousHours,
  };
}

/**
 * 計算日運分數
 */
function calculateDailyScore(
  dayElement: WuXing,
  dailyGan: TianGan,
  dailyZhi: DiZhi,
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean
): number {
  const dailyGanElement = TIAN_GAN_ELEMENT[dailyGan];
  const dailyZhiElement = DI_ZHI_ELEMENT[dailyZhi];

  // 1. 喜用神配合（40%）
  let favorScore = 50;
  if (favorable.includes(dailyGanElement)) favorScore += 25;
  if (favorable.includes(dailyZhiElement)) favorScore += 20;
  if (unfavorable.includes(dailyGanElement)) favorScore -= 20;
  if (unfavorable.includes(dailyZhiElement)) favorScore -= 15;
  favorScore = Math.max(0, Math.min(100, favorScore));

  // 2. 五行能量（35%）
  const wuXingEnergy = calculateWuXingEnergyScore(dayElement, dailyGanElement, dailyZhi, isStrong);
  const wuXingNormalized = Math.max(0, Math.min(100, 50 + wuXingEnergy.score * 2.5));

  // 3. 日支影響（25%）
  const dayEffect = getMonthStrengthScore(dayElement, dailyZhi);
  let dayScore = dayEffect.score;
  if (isStrong) {
    if (dayScore >= 80) dayScore = 100 - dayScore + 20;
  }
  dayScore = Math.max(0, Math.min(100, dayScore));

  // 綜合評分
  const totalScore = Math.round(
    favorScore * 0.40 +
    wuXingNormalized * 0.35 +
    dayScore * 0.25
  );

  return Math.max(0, Math.min(100, totalScore));
}

/**
 * 計算各方面分數
 */
function calculateAspectScores(
  tenGod: ShiShen,
  ganElement: WuXing,
  zhiElement: WuXing,
  favorable: WuXing[],
  baseScore: number
): { careerScore: number; wealthScore: number; loveScore: number; healthScore: number } {
  let careerMod = 0, wealthMod = 0, loveMod = 0, healthMod = 0;

  // 根據十神調整各方面分數
  switch (tenGod) {
    case '正官':
    case '七殺':
      careerMod = 15;
      break;
    case '正財':
    case '偏財':
      wealthMod = 15;
      break;
    case '桃花' as never:
    case '食神':
      loveMod = 15;
      break;
    case '正印':
    case '偏印':
      healthMod = 10;
      break;
  }

  // 根據五行調整
  if (favorable.includes(ganElement)) {
    careerMod += 5;
    wealthMod += 5;
  }

  return {
    careerScore: Math.max(0, Math.min(100, baseScore + careerMod)),
    wealthScore: Math.max(0, Math.min(100, baseScore + wealthMod)),
    loveScore: Math.max(0, Math.min(100, baseScore + loveMod)),
    healthScore: Math.max(0, Math.min(100, baseScore + healthMod)),
  };
}

/**
 * 獲取運勢等級
 */
function getFortuneLevel(score: number): 'excellent' | 'good' | 'neutral' | 'caution' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'neutral';
  if (score >= 35) return 'caution';
  return 'poor';
}

/**
 * 生成日運總覽
 */
function generateDailyOverview(tenGod: ShiShen, score: number, ganElement: WuXing): string {
  const themeInfo = DAILY_THEMES[tenGod];
  const levelDesc = score >= 70 ? '吉' : score >= 50 ? '平' : '凶';

  return `今日${themeInfo.theme}，整體運勢${levelDesc}。${themeInfo.career}`;
}

/**
 * 生成日運建議
 */
function generateDailyAdvice(tenGod: ShiShen, score: number, isStrong: boolean): string[] {
  const advice: string[] = [];
  const themeInfo = DAILY_THEMES[tenGod];

  // 基於十神的建議
  switch (tenGod) {
    case '比肩':
    case '劫財':
      advice.push('今日宜獨立作業，減少合作');
      advice.push('財務決策需謹慎，不宜借貸');
      break;
    case '食神':
    case '傷官':
      advice.push('今日適合創意工作，展現才華');
      advice.push('言語上注意分寸，避免得罪人');
      break;
    case '正財':
    case '偏財':
      advice.push('今日財運活絡，可談生意');
      advice.push('把握商機，但注意風險控制');
      break;
    case '正官':
    case '七殺':
      advice.push('今日適合處理公務，見長官');
      advice.push('守規矩辦事，不宜投機取巧');
      break;
    case '正印':
    case '偏印':
      advice.push('今日適合學習進修，沉澱思考');
      advice.push('有貴人相助，虛心請教');
      break;
  }

  // 根據分數添加建議
  if (score >= 70) {
    advice.push('運勢良好，可積極把握機會');
  } else if (score < 50) {
    advice.push('運勢較差，宜低調行事');
  }

  return advice;
}

/**
 * 生成日運注意事項
 */
function generateDailyCautions(
  tenGod: ShiShen,
  score: number,
  ganElement: WuXing,
  zhiElement: WuXing
): string[] {
  const cautions: string[] = [];

  // 基於十神的注意事項
  switch (tenGod) {
    case '劫財':
      cautions.push('防破財、防小人');
      break;
    case '傷官':
      cautions.push('注意言行，避免口舌是非');
      break;
    case '七殺':
      cautions.push('注意安全，防意外傷害');
      break;
  }

  // 分數低時的提醒
  if (score < 40) {
    cautions.push('今日宜靜不宜動，重大決定延後');
    cautions.push('注意健康和安全');
  }

  if (cautions.length === 0) {
    cautions.push('無特別注意事項，正常行事即可');
  }

  return cautions;
}

/**
 * 計算吉凶時辰
 */
function calculateAuspiciousHours(
  dayMasterGan: TianGan,
  dailyGan: TianGan,
  favorable: WuXing[]
): { auspiciousHours: string[]; inauspiciousHours: string[] } {
  const auspiciousHours: string[] = [];
  const inauspiciousHours: string[] = [];

  // 簡化的吉凶時辰計算
  // 基於日干與時支的關係
  const dayMasterElement = TIAN_GAN_ELEMENT[dayMasterGan];

  HOUR_NAMES.forEach((hourZhi, index) => {
    const hourElement = DI_ZHI_ELEMENT[hourZhi as DiZhi];

    // 喜用神時辰為吉
    if (favorable.includes(hourElement)) {
      auspiciousHours.push(`${hourZhi}時 (${HOUR_RANGES[index]})`);
    }
    // 剋日主的時辰為凶（簡化判斷）
    else if (isClashingElement(hourElement, dayMasterElement)) {
      inauspiciousHours.push(`${hourZhi}時 (${HOUR_RANGES[index]})`);
    }
  });

  // 確保至少有一些吉時和凶時
  if (auspiciousHours.length === 0) {
    auspiciousHours.push('辰時 (07:00-09:00)', '巳時 (09:00-11:00)');
  }
  if (inauspiciousHours.length === 0) {
    inauspiciousHours.push('午時 (11:00-13:00)');
  }

  return {
    auspiciousHours: auspiciousHours.slice(0, 3),
    inauspiciousHours: inauspiciousHours.slice(0, 2)
  };
}

/**
 * 判斷五行是否相剋
 */
function isClashingElement(element1: WuXing, element2: WuXing): boolean {
  const clashMap: Record<WuXing, WuXing> = {
    '木': '土',
    '火': '金',
    '土': '水',
    '金': '木',
    '水': '火',
  };
  return clashMap[element1] === element2;
}

/**
 * 分析一週運勢
 */
export function analyzeWeeklyFortune(
  chart: BaZiChart,
  startDate: Date,
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean = true
): WeeklyFortune {
  const days: DailyFortune[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(analyzeDailyFortune(chart, date, favorable, unfavorable, isStrong));
  }

  // 找出最好和最差的日子
  const sortedDays = [...days].sort((a, b) => b.score - a.score);
  const bestDay = sortedDays[0];
  const worstDay = sortedDays[sortedDays.length - 1];

  // 計算週末日期
  const weekEnd = new Date(startDate);
  weekEnd.setDate(startDate.getDate() + 6);

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // 生成週運總結
  const avgScore = days.reduce((sum, d) => sum + d.score, 0) / 7;
  let weekSummary = '';
  if (avgScore >= 65) {
    weekSummary = '本週整體運勢良好，適合積極行動，把握機會。';
  } else if (avgScore >= 50) {
    weekSummary = '本週運勢平穩，按部就班為宜，不宜冒險。';
  } else {
    weekSummary = '本週運勢較弱，宜謹慎行事，避免重大決定。';
  }

  weekSummary += `最佳行動日為${bestDay.date.slice(5)}（${bestDay.ganZhi}），避免在${worstDay.date.slice(5)}做重要決定。`;

  return {
    weekStart: formatDate(startDate),
    weekEnd: formatDate(weekEnd),
    days,
    bestDay,
    worstDay,
    weekSummary,
  };
}

/**
 * 獲取今日運勢簡報
 */
export function getTodayFortuneBrief(
  chart: BaZiChart,
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean = true
): string {
  const today = new Date();
  const fortune = analyzeDailyFortune(chart, today, favorable, unfavorable, isStrong);

  const levelMap = {
    excellent: '大吉',
    good: '吉',
    neutral: '平',
    caution: '小凶',
    poor: '凶',
  };

  return `今日${fortune.ganZhi}，${fortune.theme}，運勢【${levelMap[fortune.level]}】（${fortune.score}分）。${fortune.overview}`;
}
