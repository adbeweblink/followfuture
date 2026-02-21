/**
 * 流年分析模組
 * 計算當年及未來流年運勢
 */

import type {
  BaZiChart,
  WuXing,
  ShiShen,
  AnnualFortune,
  MonthlyFortune,
  TianGan,
  DiZhi,
} from './types';
import { getAnnualGanZhi, getMonthlyGanZhi } from './calculator';
import { getTenGod } from './ten-gods';
import {
  TIAN_GAN_ELEMENT,
  DI_ZHI_ELEMENT,
} from '@/data/constants';
import { calculateWuXingEnergyScore } from './luck-pillar-analysis';
import { getMonthStrengthScore } from './strength';
import { analyzeAdvancedFortune } from './fortune-advanced';

/**
 * 流年主題對照表
 */
const ANNUAL_THEMES: Record<ShiShen, { theme: string; coreStrategy: string }> = {
  '比肩': {
    theme: '競爭與合作之年',
    coreStrategy: '謹慎處理人際關係，合作共贏。注意同儕競爭，但也能遇到志同道合的夥伴。',
  },
  '劫財': {
    theme: '投資與風險之年',
    coreStrategy: '謹慎理財，避免投機。容易有破財風險，但也有賺取偏財的機會。',
  },
  '食神': {
    theme: '才華展現之年',
    coreStrategy: '發揮創意，展現才能。適合創作、表演、教學等表達性工作。享受生活。',
  },
  '傷官': {
    theme: '創新突破之年',
    coreStrategy: '敢於創新，但注意言行。容易得罪人，需收斂鋒芒。適合技術突破。',
  },
  '偏財': {
    theme: '財運活絡之年',
    coreStrategy: '把握商機，拓展人脈。有意外之財，但也容易花錢。適合業務拓展。',
  },
  '正財': {
    theme: '穩健理財之年',
    coreStrategy: '穩健經營，積累財富。適合儲蓄和長期投資。感情方面有進展。',
  },
  '七殺': {
    theme: '挑戰壓力之年',
    coreStrategy: '迎接挑戰，化壓力為動力。事業上有突破機會，但競爭激烈。注意健康。',
  },
  '正官': {
    theme: '事業晉升之年',
    coreStrategy: '把握升遷機會，建立權威。適合考試、升職。注意守規矩。',
  },
  '偏印': {
    theme: '學習轉型之年',
    coreStrategy: '適合進修、學習新技能。思想上有轉變，可能換工作或換跑道。',
  },
  '正印': {
    theme: '貴人相助之年',
    coreStrategy: '多有貴人扶持，適合學業進修。長輩緣好，可得到提攜。',
  },
};

/**
 * 計算流年對日主的影響分數
 * 綜合五行能量、月令影響、喜用神配合
 */
function calculateAnnualScore(
  dayElement: WuXing,
  annualGan: TianGan,
  annualZhi: DiZhi,
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean
): number {
  const annualGanElement = TIAN_GAN_ELEMENT[annualGan];
  const annualZhiElement = DI_ZHI_ELEMENT[annualZhi];

  // ======== 1. 喜用神配合（佔 35%）========
  let favorScore = 50;
  if (favorable.includes(annualGanElement)) favorScore += 25;
  if (favorable.includes(annualZhiElement)) favorScore += 20;
  if (unfavorable.includes(annualGanElement)) favorScore -= 20;
  if (unfavorable.includes(annualZhiElement)) favorScore -= 15;
  favorScore = Math.max(0, Math.min(100, favorScore));

  // ======== 2. 五行能量對日主影響（佔 40%）========
  const wuXingEnergy = calculateWuXingEnergyScore(dayElement, annualGanElement, annualZhi, isStrong);
  // 擴大分數範圍（乘數從 2 調整為 3）
  const wuXingNormalized = Math.max(0, Math.min(100, 50 + wuXingEnergy.score * 3));

  // ======== 3. 流年地支月令效應（佔 25%）========
  // 用流年地支模擬「月令」對日主的旺相休囚死
  const monthEffect = getMonthStrengthScore(dayElement, annualZhi);
  let monthScore = monthEffect.score;

  // 身強身弱的月令效應調整（完整邏輯）
  if (isStrong) {
    // 身強：休囚死反而好（洩氣），旺相反而不利（過旺）
    if (monthScore >= 80) {
      monthScore = 100 - monthScore + 20;
    } else if (monthScore >= 60) {
      monthScore = 60;
    } else if (monthScore < 40) {
      monthScore = 100 - monthScore;
    }
  } else {
    // 身弱：旺相有利（生扶），休囚死不利（更弱）
    if (monthScore >= 80) {
      monthScore = monthScore + 10;
    }
  }
  monthScore = Math.max(0, Math.min(100, monthScore));

  // ======== 綜合評分 ========
  const totalScore = Math.round(
    favorScore * 0.35 +
    wuXingNormalized * 0.40 +
    monthScore * 0.25
  );

  return Math.max(0, Math.min(100, totalScore));
}

/**
 * 分析單一流年
 * @param isStrong 日主是否身強（用於五行能量判定）
 */
export function analyzeAnnualFortune(
  chart: BaZiChart,
  targetYear: number,
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean = true
): AnnualFortune {
  const ganZhi = getAnnualGanZhi(targetYear);
  const gan = ganZhi[0] as TianGan;
  const zhi = ganZhi[1] as DiZhi;

  // 計算流年天干對日主的十神
  const tenGod = getTenGod(chart.day.gan, gan);

  // 計算基礎運勢分數（綜合五行能量、月令、喜用神）
  const baseScore = calculateAnnualScore(
    chart.day.ganElement,
    gan,
    zhi,
    favorable,
    unfavorable,
    isStrong
  );

  // 進階分析整合
  const advancedAnalysis = analyzeAdvancedFortune(
    chart,
    gan,
    zhi,
    undefined, // 無大運參數時
    undefined,
    isStrong
  );

  // 納入進階分析的分數調整
  const score = Math.max(0, Math.min(100, baseScore + advancedAnalysis.scoreAdjustment));

  // 獲取主題和策略
  const { theme, coreStrategy } = ANNUAL_THEMES[tenGod];

  // 組合核心策略與進階建議
  let enhancedStrategy = coreStrategy;
  if (advancedAnalysis.warnings.length > 0) {
    enhancedStrategy += `【注意】${advancedAnalysis.warnings[0]}`;
  }
  if (advancedAnalysis.advices.length > 0) {
    enhancedStrategy += `【提示】${advancedAnalysis.advices[0]}`;
  }

  return {
    year: targetYear,
    ganZhi,
    theme: `${targetYear} ${ganZhi}年 - ${theme}`,
    score,
    coreStrategy: enhancedStrategy,
  };
}

/**
 * 流月分析
 * @param isStrong 日主是否身強（用於五行能量判定）
 */
export function analyzeMonthlyFortunes(
  chart: BaZiChart,
  targetYear: number,
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean = true
): MonthlyFortune[] {
  const monthsData = getMonthlyGanZhi(targetYear);
  const results: MonthlyFortune[] = [];
  const dayElement = chart.day.ganElement;

  const monthNames = [
    '正月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ];

  const solarRanges = [
    '1/20-2/18', '2/19-3/20', '3/21-4/19', '4/20-5/20',
    '5/21-6/21', '6/22-7/22', '7/23-8/22', '8/23-9/22',
    '9/23-10/23', '10/24-11/22', '11/23-12/21', '12/22-1/19',
  ];

  for (let i = 0; i < monthsData.length; i++) {
    const { ganZhi, solarMonth } = monthsData[i];
    const gan = ganZhi[0] as TianGan;
    const zhi = ganZhi[1] as DiZhi;

    const ganElement = TIAN_GAN_ELEMENT[gan];
    const zhiElement = DI_ZHI_ELEMENT[zhi];

    // ======== 綜合計算月份運勢分數 ========
    // 1. 喜用神配合（35%）
    let favorScore = 50;
    if (favorable.includes(ganElement)) favorScore += 25;
    if (favorable.includes(zhiElement)) favorScore += 20;
    if (unfavorable.includes(ganElement)) favorScore -= 20;
    if (unfavorable.includes(zhiElement)) favorScore -= 15;
    favorScore = Math.max(0, Math.min(100, favorScore));

    // 2. 五行能量對日主影響（40%）
    const wuXingEnergy = calculateWuXingEnergyScore(dayElement, ganElement, zhi, isStrong);
    // 擴大分數範圍（乘數從 2 調整為 3）
    const wuXingNormalized = Math.max(0, Math.min(100, 50 + wuXingEnergy.score * 3));

    // 3. 月令效應（25%）
    const monthEffect = getMonthStrengthScore(dayElement, zhi);
    let monthScore = monthEffect.score;

    // 身強身弱的月令效應調整
    if (isStrong) {
      if (monthScore >= 80) {
        monthScore = 100 - monthScore + 20;
      } else if (monthScore >= 60) {
        monthScore = 60;
      } else if (monthScore < 40) {
        monthScore = 100 - monthScore;
      }
    } else {
      if (monthScore >= 80) {
        monthScore = monthScore + 10;
      }
    }
    monthScore = Math.max(0, Math.min(100, monthScore));

    // 綜合評分
    const totalScore = Math.round(
      favorScore * 0.35 +
      wuXingNormalized * 0.40 +
      monthScore * 0.25
    );
    const score = Math.max(0, Math.min(100, totalScore));

    // 決定狀態
    let status: 'green' | 'yellow' | 'red';
    if (score >= 65) status = 'green';
    else if (score >= 40) status = 'yellow';
    else status = 'red';

    // 生成描述
    const tenGod = getTenGod(chart.day.gan, gan);
    const { theme } = ANNUAL_THEMES[tenGod];

    results.push({
      month: solarMonth,
      ganZhi,
      solarRange: solarRanges[i] || '',
      score,
      status,
      title: `${monthNames[i] || `${solarMonth}月`} ${ganZhi}`,
      description: theme,
      advice: getMonthlyAdvice(tenGod, score),
    });
  }

  return results;
}

/**
 * 根據十神和分數生成月份建議
 */
function getMonthlyAdvice(tenGod: ShiShen, score: number): string {
  const baseAdvice = ANNUAL_THEMES[tenGod].coreStrategy;

  if (score >= 70) {
    return `運勢順遂。${baseAdvice}`;
  } else if (score >= 50) {
    return `平穩之月。${baseAdvice}`;
  } else {
    return `宜謹慎行事。${baseAdvice}`;
  }
}

/**
 * 獲取多年流年分析
 * @param isStrong 日主是否身強（用於五行能量判定）
 */
export function analyzeMultipleYears(
  chart: BaZiChart,
  startYear: number,
  count: number,
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean = true
): AnnualFortune[] {
  const results: AnnualFortune[] = [];

  for (let i = 0; i < count; i++) {
    results.push(
      analyzeAnnualFortune(chart, startYear + i, favorable, unfavorable, isStrong)
    );
  }

  return results;
}

/**
 * 流年關鍵事項提醒
 */
export function getAnnualKeyPoints(
  tenGod: ShiShen,
  isStrong: boolean
): { opportunities: string[]; risks: string[]; actions: string[] } {
  const points: Record<
    ShiShen,
    { opportunities: string[]; risks: string[]; actions: string[] }
  > = {
    '比肩': {
      opportunities: ['合作夥伴機會', '同儕資源互助', '團隊合作項目'],
      risks: ['競爭對手出現', '財務分歧', '意見不合'],
      actions: ['建立合作關係', '區分敵友', '保持獨立判斷'],
    },
    '劫財': {
      opportunities: ['偏財機會', '人脈拓展', '投資項目'],
      risks: ['破財損失', '合夥糾紛', '信任危機'],
      actions: ['謹慎投資', '保護資產', '避免賭博'],
    },
    '食神': {
      opportunities: ['創意發展', '才藝表演', '口福享受'],
      risks: ['過度享樂', '懶散懈怠', '投入太多'],
      actions: ['展現才華', '學習新技能', '保持節制'],
    },
    '傷官': {
      opportunities: ['創新突破', '技術進步', '個人表現'],
      risks: ['得罪貴人', '口舌是非', '自視過高'],
      actions: ['收斂言行', '專注專業', '謙虛待人'],
    },
    '偏財': {
      opportunities: ['商業機會', '意外收入', '投資回報'],
      risks: ['投機失敗', '感情複雜', '財來財去'],
      actions: ['把握商機', '穩健理財', '專注主業'],
    },
    '正財': {
      opportunities: ['穩定收入', '感情進展', '資產增值'],
      risks: ['過於保守', '錯失機會', '太重視錢'],
      actions: ['儲蓄理財', '經營感情', '穩中求進'],
    },
    '七殺': {
      opportunities: ['事業突破', '競爭勝出', '領導機會'],
      risks: ['壓力過大', '健康問題', '人際衝突'],
      actions: ['積極應對', '強身健體', '化敵為友'],
    },
    '正官': {
      opportunities: ['升職加薪', '考試通過', '名聲建立'],
      risks: ['官司麻煩', '規則限制', '壓力累積'],
      actions: ['遵守規則', '把握升遷', '建立威信'],
    },
    '偏印': {
      opportunities: ['學習進修', '轉型機會', '特殊領域'],
      risks: ['孤獨感', '思慮過多', '半途而廢'],
      actions: ['深入學習', '尋找方向', '完成項目'],
    },
    '正印': {
      opportunities: ['貴人提攜', '學業進步', '身心調養'],
      risks: ['依賴他人', '缺乏行動', '被動等待'],
      actions: ['感恩貴人', '主動學習', '建立信心'],
    },
  };

  const result = points[tenGod];

  // 根據身強弱調整建議
  if (isStrong) {
    result.actions.push('適度消耗能量，尋找發揮舞台');
  } else {
    result.actions.push('借力使力，善用貴人資源');
  }

  return result;
}
