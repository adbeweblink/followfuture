/**
 * 進階運勢分析模組
 *
 * 包含：
 * 1. 歲運並臨檢測
 * 2. 引動原局某柱分析
 * 3. 流年神煞檢測
 * 4. 空亡判斷
 * 5. 地支關係（沖合刑害）
 * 6. 長生十二宮
 */

import type {
  BaZiChart,
  TianGan,
  DiZhi,
  WuXing,
  ShenSha,
  BranchRelation,
} from './types';
import {
  TIAN_YI_GUI_REN,
  TAO_HUA,
  YI_MA,
  YANG_REN,
  LU_SHEN,
  HUA_GAI,
  SHEN_SHA_INFO,
  getKongWang,
} from '@/data/shensha';
import {
  BRANCH_SIX_CLASH,
  BRANCH_THREE_COMBINE,
  BRANCH_THREE_MEETING,
  BRANCH_THREE_PUNISHMENT,
  BRANCH_SIX_COMBINE,
} from '@/data/constants';
import { analyzeTwelveStageForFortune, TwelveStage } from './twelve-stages';

/** 引動類型 */
export type TriggerType = '沖' | '合' | '刑' | '會' | '同';

/** 引動結果 */
export interface PillarTrigger {
  position: '年' | '月' | '日' | '時';
  pillarGan: TianGan;
  pillarZhi: DiZhi;
  triggerType: TriggerType;
  triggerDescription: string;
  affectedArea: string; // 影響的人生領域
  impact: 'positive' | 'negative' | 'neutral';
}

/** 歲運並臨結果 */
export interface SuiYunBingLin {
  isActive: boolean;
  type?: '伏吟' | '反吟';
  affectedPillar?: '年' | '月' | '日' | '時';
  description: string;
  severity: 'high' | 'medium' | 'low';
}

/** 流年神煞 */
export interface AnnualShenSha {
  name: string;
  type: 'auspicious' | 'inauspicious' | 'neutral';
  description: string;
  advice: string;
}

/** 進階運勢分析結果 */
export interface AdvancedFortuneAnalysis {
  // 歲運並臨
  suiYunBingLin: SuiYunBingLin;

  // 引動原局
  pillarTriggers: PillarTrigger[];

  // 流年神煞
  annualShenSha: AnnualShenSha[];

  // 空亡狀態
  kongWangStatus: {
    isFlowYearKong: boolean;
    isLuckPillarKong: boolean;
    description: string;
  };

  // 地支關係
  branchRelations: {
    withChart: BranchRelation[];
    description: string;
  };

  // 長生十二宮
  twelveStage: {
    stage: TwelveStage;
    score: number;
    description: string;
    isProsperous: boolean;
    isDeclined: boolean;
  };

  // 綜合評分調整
  scoreAdjustment: number;

  // 綜合建議
  advices: string[];

  // 警示
  warnings: string[];
}

/**
 * 檢測歲運並臨（伏吟/反吟）
 * 伏吟：流年干支與命局某柱相同
 * 反吟：流年干支與命局某柱天沖地沖
 */
export function detectSuiYunBingLin(
  chart: BaZiChart,
  yearGan: TianGan,
  yearZhi: DiZhi,
  luckGan?: TianGan,
  luckZhi?: DiZhi
): SuiYunBingLin {
  const pillars = [
    { position: '年' as const, gan: chart.year.gan, zhi: chart.year.zhi },
    { position: '月' as const, gan: chart.month.gan, zhi: chart.month.zhi },
    { position: '日' as const, gan: chart.day.gan, zhi: chart.day.zhi },
    { position: '時' as const, gan: chart.hour.gan, zhi: chart.hour.zhi },
  ];

  // 天干沖對照表
  const ganClash: Record<TianGan, TianGan> = {
    '甲': '庚', '乙': '辛', '丙': '壬', '丁': '癸', '戊': '甲',
    '己': '乙', '庚': '甲', '辛': '乙', '壬': '丙', '癸': '丁',
  };

  // 地支沖對照表
  const zhiClashMap = new Map<DiZhi, DiZhi>();
  for (const [z1, z2] of BRANCH_SIX_CLASH) {
    zhiClashMap.set(z1, z2);
    zhiClashMap.set(z2, z1);
  }

  // 檢查伏吟（流年與原局相同）
  for (const pillar of pillars) {
    if (pillar.gan === yearGan && pillar.zhi === yearZhi) {
      return {
        isActive: true,
        type: '伏吟',
        affectedPillar: pillar.position,
        description: `流年${yearGan}${yearZhi}與${pillar.position}柱伏吟（干支相同），主該宮位代表的人事有重複、反覆之象。`,
        severity: pillar.position === '日' ? 'high' : 'medium',
      };
    }
  }

  // 檢查反吟（流年與原局天沖地沖）
  for (const pillar of pillars) {
    const isGanClash = ganClash[pillar.gan] === yearGan;
    const isZhiClash = zhiClashMap.get(pillar.zhi) === yearZhi;

    if (isGanClash && isZhiClash) {
      return {
        isActive: true,
        type: '反吟',
        affectedPillar: pillar.position,
        description: `流年${yearGan}${yearZhi}與${pillar.position}柱反吟（天沖地沖），主該宮位代表的人事有劇烈變動。`,
        severity: pillar.position === '日' ? 'high' : 'medium',
      };
    }
  }

  // 檢查大運是否與原局形成伏吟/反吟
  if (luckGan && luckZhi) {
    for (const pillar of pillars) {
      if (pillar.gan === luckGan && pillar.zhi === luckZhi) {
        return {
          isActive: true,
          type: '伏吟',
          affectedPillar: pillar.position,
          description: `大運${luckGan}${luckZhi}與${pillar.position}柱伏吟，十年內該宮位人事多有波折。`,
          severity: 'medium',
        };
      }

      const isGanClash = ganClash[pillar.gan] === luckGan;
      const isZhiClash = zhiClashMap.get(pillar.zhi) === luckZhi;

      if (isGanClash && isZhiClash) {
        return {
          isActive: true,
          type: '反吟',
          affectedPillar: pillar.position,
          description: `大運${luckGan}${luckZhi}與${pillar.position}柱反吟，十年內該宮位人事有大變動。`,
          severity: 'medium',
        };
      }
    }
  }

  return {
    isActive: false,
    description: '無歲運並臨',
    severity: 'low',
  };
}

/**
 * 分析流年/大運引動原局某柱
 */
export function analyzePillarTriggers(
  chart: BaZiChart,
  targetGan: TianGan,
  targetZhi: DiZhi
): PillarTrigger[] {
  const triggers: PillarTrigger[] = [];

  const pillars = [
    { position: '年' as const, gan: chart.year.gan, zhi: chart.year.zhi, area: '祖業、長輩、童年' },
    { position: '月' as const, gan: chart.month.gan, zhi: chart.month.zhi, area: '事業、父母、青年' },
    { position: '日' as const, gan: chart.day.gan, zhi: chart.day.zhi, area: '自身、婚姻、中年' },
    { position: '時' as const, gan: chart.hour.gan, zhi: chart.hour.zhi, area: '子女、晚年、成就' },
  ];

  // 地支沖對照
  const zhiClashMap = new Map<DiZhi, DiZhi>();
  for (const [z1, z2] of BRANCH_SIX_CLASH) {
    zhiClashMap.set(z1, z2);
    zhiClashMap.set(z2, z1);
  }

  // 六合對照
  const sixCombineMap = new Map<DiZhi, DiZhi>();
  for (const [z1, z2] of BRANCH_SIX_COMBINE) {
    sixCombineMap.set(z1, z2);
    sixCombineMap.set(z2, z1);
  }

  for (const pillar of pillars) {
    // 檢查地支相同（同）
    if (pillar.zhi === targetZhi) {
      triggers.push({
        position: pillar.position,
        pillarGan: pillar.gan,
        pillarZhi: pillar.zhi,
        triggerType: '同',
        triggerDescription: `流年地支${targetZhi}與${pillar.position}柱地支相同，引動${pillar.position}柱`,
        affectedArea: pillar.area,
        impact: 'neutral',
      });
    }

    // 檢查地支六沖
    if (zhiClashMap.get(pillar.zhi) === targetZhi) {
      triggers.push({
        position: pillar.position,
        pillarGan: pillar.gan,
        pillarZhi: pillar.zhi,
        triggerType: '沖',
        triggerDescription: `流年地支${targetZhi}沖${pillar.position}柱${pillar.zhi}，引動變化`,
        affectedArea: pillar.area,
        impact: 'negative',
      });
    }

    // 檢查地支六合
    if (sixCombineMap.get(pillar.zhi) === targetZhi) {
      triggers.push({
        position: pillar.position,
        pillarGan: pillar.gan,
        pillarZhi: pillar.zhi,
        triggerType: '合',
        triggerDescription: `流年地支${targetZhi}合${pillar.position}柱${pillar.zhi}，有助力`,
        affectedArea: pillar.area,
        impact: 'positive',
      });
    }
  }

  // 檢查三合局/三會局
  const chartBranches = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi];

  for (const [b1, b2, b3] of BRANCH_THREE_COMBINE) {
    const inChart = [b1, b2, b3].filter(b => chartBranches.includes(b)).length;
    const isTarget = [b1, b2, b3].includes(targetZhi);

    if (inChart >= 2 && isTarget) {
      // 流年補齊三合局
      const positions = pillars
        .filter(p => [b1, b2, b3].includes(p.zhi))
        .map(p => p.position);

      triggers.push({
        position: positions[0] || '年',
        pillarGan: chart[positions[0]?.toLowerCase() as 'year' | 'month' | 'day' | 'hour']?.gan || chart.year.gan,
        pillarZhi: targetZhi,
        triggerType: '會',
        triggerDescription: `流年${targetZhi}補齊三合局${b1}${b2}${b3}，五行力量增強`,
        affectedArea: '多宮位聯動',
        impact: 'positive',
      });
    }
  }

  // 檢查三刑
  const wuEn = BRANCH_THREE_PUNISHMENT.無恩之刑;
  const chiShi = BRANCH_THREE_PUNISHMENT.恃勢之刑;
  const wuLi = BRANCH_THREE_PUNISHMENT.無禮之刑;

  for (const pillar of pillars) {
    // 無恩之刑（寅巳申）
    if (wuEn.includes(pillar.zhi) && wuEn.includes(targetZhi) && pillar.zhi !== targetZhi) {
      triggers.push({
        position: pillar.position,
        pillarGan: pillar.gan,
        pillarZhi: pillar.zhi,
        triggerType: '刑',
        triggerDescription: `流年${targetZhi}與${pillar.position}柱${pillar.zhi}形成無恩之刑`,
        affectedArea: pillar.area,
        impact: 'negative',
      });
    }

    // 恃勢之刑（丑戌未）
    if (chiShi.includes(pillar.zhi) && chiShi.includes(targetZhi) && pillar.zhi !== targetZhi) {
      triggers.push({
        position: pillar.position,
        pillarGan: pillar.gan,
        pillarZhi: pillar.zhi,
        triggerType: '刑',
        triggerDescription: `流年${targetZhi}與${pillar.position}柱${pillar.zhi}形成恃勢之刑`,
        affectedArea: pillar.area,
        impact: 'negative',
      });
    }

    // 無禮之刑（子卯）
    if (wuLi.includes(pillar.zhi) && wuLi.includes(targetZhi) && pillar.zhi !== targetZhi) {
      triggers.push({
        position: pillar.position,
        pillarGan: pillar.gan,
        pillarZhi: pillar.zhi,
        triggerType: '刑',
        triggerDescription: `流年${targetZhi}與${pillar.position}柱${pillar.zhi}形成無禮之刑`,
        affectedArea: pillar.area,
        impact: 'negative',
      });
    }
  }

  return triggers;
}

/**
 * 計算流年神煞
 */
export function getAnnualShenSha(
  dayGan: TianGan,
  yearZhi: DiZhi,
  dayZhi: DiZhi
): AnnualShenSha[] {
  const results: AnnualShenSha[] = [];

  // 天乙貴人
  const tianYiPositions = TIAN_YI_GUI_REN[dayGan];
  if (tianYiPositions.includes(yearZhi)) {
    const info = SHEN_SHA_INFO['天乙貴人'];
    results.push({
      name: '天乙貴人',
      type: 'auspicious',
      description: '流年遇天乙貴人，有貴人扶助',
      advice: info?.advice || '把握貴人機會，主動結交貴人',
    });
  }

  // 驛馬
  const yiMa = YI_MA[dayZhi];
  if (yiMa === yearZhi) {
    const info = SHEN_SHA_INFO['驛馬'];
    results.push({
      name: '驛馬',
      type: 'neutral',
      description: '流年逢驛馬，主奔波變動',
      advice: info?.advice || '適合出行、搬遷、轉職',
    });
  }

  // 桃花
  const taoHua = TAO_HUA[dayZhi];
  if (taoHua === yearZhi) {
    const info = SHEN_SHA_INFO['桃花'];
    results.push({
      name: '桃花',
      type: 'neutral',
      description: '流年逢桃花，異性緣旺盛',
      advice: info?.advice || '單身者有戀愛機會，已婚者需慎防桃花劫',
    });
  }

  // 羊刃
  const yangRen = YANG_REN[dayGan];
  if (yangRen === yearZhi) {
    const info = SHEN_SHA_INFO['羊刃'];
    results.push({
      name: '羊刃',
      type: 'inauspicious',
      description: '流年逢羊刃，注意血光之災',
      advice: info?.advice || '避免高風險活動，小心刀剪傷',
    });
  }

  // 祿神
  const luShen = LU_SHEN[dayGan];
  if (luShen === yearZhi) {
    const info = SHEN_SHA_INFO['祿神'];
    results.push({
      name: '祿神',
      type: 'auspicious',
      description: '流年逢祿神，正財運佳',
      advice: info?.advice || '適合爭取加薪、升職',
    });
  }

  // 華蓋
  const huaGai = HUA_GAI[dayZhi];
  if (huaGai === yearZhi) {
    const info = SHEN_SHA_INFO['華蓋'];
    results.push({
      name: '華蓋',
      type: 'neutral',
      description: '流年逢華蓋，適合學習、修行',
      advice: info?.advice || '適合進修、研究、創作',
    });
  }

  return results;
}

/**
 * 檢查空亡狀態
 */
export function checkKongWangStatus(
  chart: BaZiChart,
  yearZhi: DiZhi,
  luckZhi?: DiZhi
): {
  isFlowYearKong: boolean;
  isLuckPillarKong: boolean;
  description: string;
} {
  // 以日柱查空亡
  const dayKong = getKongWang(chart.day.gan, chart.day.zhi);

  const isFlowYearKong = dayKong.includes(yearZhi);
  const isLuckPillarKong = luckZhi ? dayKong.includes(luckZhi) : false;

  let description = '';
  if (isFlowYearKong) {
    description += `流年地支${yearZhi}落空亡，事情容易虛而不實，需加倍努力。`;
  }
  if (isLuckPillarKong) {
    description += `大運地支${luckZhi}落空亡，十年運勢打折，但也可能因禍得福。`;
  }
  if (!isFlowYearKong && !isLuckPillarKong) {
    description = '無空亡影響。';
  }

  return {
    isFlowYearKong,
    isLuckPillarKong,
    description,
  };
}

/**
 * 完整進階運勢分析
 */
export function analyzeAdvancedFortune(
  chart: BaZiChart,
  yearGan: TianGan,
  yearZhi: DiZhi,
  luckGan?: TianGan,
  luckZhi?: DiZhi,
  isStrong: boolean = true
): AdvancedFortuneAnalysis {
  const advices: string[] = [];
  const warnings: string[] = [];
  let scoreAdjustment = 0;

  // 1. 歲運並臨
  const suiYunBingLin = detectSuiYunBingLin(chart, yearGan, yearZhi, luckGan, luckZhi);
  if (suiYunBingLin.isActive) {
    if (suiYunBingLin.type === '伏吟') {
      warnings.push(suiYunBingLin.description);
      scoreAdjustment -= 10;
    } else if (suiYunBingLin.type === '反吟') {
      warnings.push(suiYunBingLin.description);
      scoreAdjustment -= 15;
    }
  }

  // 2. 引動原局
  const pillarTriggers = analyzePillarTriggers(chart, yearGan, yearZhi);
  for (const trigger of pillarTriggers) {
    if (trigger.impact === 'negative') {
      warnings.push(`${trigger.triggerDescription}，影響${trigger.affectedArea}`);
      scoreAdjustment -= 5;
    } else if (trigger.impact === 'positive') {
      advices.push(`${trigger.triggerDescription}，有利於${trigger.affectedArea}`);
      scoreAdjustment += 5;
    }
  }

  // 3. 流年神煞
  const annualShenSha = getAnnualShenSha(chart.day.gan, yearZhi, chart.day.zhi);
  for (const shenSha of annualShenSha) {
    if (shenSha.type === 'auspicious') {
      advices.push(shenSha.advice);
      scoreAdjustment += 8;
    } else if (shenSha.type === 'inauspicious') {
      warnings.push(shenSha.advice);
      scoreAdjustment -= 8;
    }
  }

  // 4. 空亡狀態
  const kongWangStatus = checkKongWangStatus(chart, yearZhi, luckZhi);
  if (kongWangStatus.isFlowYearKong) {
    warnings.push('流年落空亡，計劃易落空，需踏實努力');
    scoreAdjustment -= 5;
  }

  // 5. 地支關係分析
  const branchRelations = analyzeBranchRelationsWithTarget(chart, yearZhi);
  for (const rel of branchRelations.withChart) {
    if (rel.type === '六沖' || rel.type === '三刑' || rel.type === '六害') {
      scoreAdjustment -= 5;
    } else if (rel.type === '三合' || rel.type === '三會' || rel.type === '六合') {
      scoreAdjustment += 5;
    }
  }

  // 6. 長生十二宮
  const twelveStageResult = analyzeTwelveStageForFortune(chart.day.gan, yearZhi);
  const twelveStage = {
    stage: twelveStageResult.stage,
    score: twelveStageResult.score,
    description: twelveStageResult.fortuneDescription,
    isProsperous: twelveStageResult.isProsperous,
    isDeclined: twelveStageResult.isDeclined,
  };

  if (twelveStageResult.isProsperous) {
    advices.push(`日主在流年處「${twelveStageResult.stage}」位，運勢向好`);
    scoreAdjustment += 10;
  } else if (twelveStageResult.isDeclined) {
    warnings.push(`日主在流年處「${twelveStageResult.stage}」位，運勢偏弱，宜保守`);
    scoreAdjustment -= 10;
  }

  // 限制分數調整範圍
  scoreAdjustment = Math.max(-30, Math.min(30, scoreAdjustment));

  return {
    suiYunBingLin,
    pillarTriggers,
    annualShenSha,
    kongWangStatus,
    branchRelations,
    twelveStage,
    scoreAdjustment,
    advices,
    warnings,
  };
}

/**
 * 分析流年地支與原局的關係
 */
function analyzeBranchRelationsWithTarget(
  chart: BaZiChart,
  targetZhi: DiZhi
): {
  withChart: BranchRelation[];
  description: string;
} {
  const relations: BranchRelation[] = [];
  const chartBranches = [
    { position: '年' as const, zhi: chart.year.zhi },
    { position: '月' as const, zhi: chart.month.zhi },
    { position: '日' as const, zhi: chart.day.zhi },
    { position: '時' as const, zhi: chart.hour.zhi },
  ];

  // 檢查六沖
  for (const [z1, z2] of BRANCH_SIX_CLASH) {
    if (targetZhi === z1 || targetZhi === z2) {
      const opposite = targetZhi === z1 ? z2 : z1;
      const matched = chartBranches.filter(b => b.zhi === opposite);
      for (const m of matched) {
        relations.push({
          type: '六沖',
          branches: [targetZhi, opposite],
          positions: [m.position],
          description: `流年${targetZhi}沖${m.position}柱${opposite}`,
        });
      }
    }
  }

  // 檢查六合
  for (const [z1, z2, result] of BRANCH_SIX_COMBINE) {
    if (targetZhi === z1 || targetZhi === z2) {
      const opposite = targetZhi === z1 ? z2 : z1;
      const matched = chartBranches.filter(b => b.zhi === opposite);
      for (const m of matched) {
        relations.push({
          type: '六合',
          branches: [targetZhi, opposite],
          positions: [m.position],
          result: result as WuXing,
          description: `流年${targetZhi}合${m.position}柱${opposite}化${result}`,
        });
      }
    }
  }

  const descriptions = relations.map(r => r.description);

  return {
    withChart: relations,
    description: descriptions.length > 0 ? descriptions.join('；') : '流年地支與原局無特殊關係',
  };
}
