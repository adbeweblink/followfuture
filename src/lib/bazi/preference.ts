/**
 * 喜用神深度分析模組
 *
 * 專業命理師等級的用神喜忌判斷：
 * 1. 依格局類型調整（正格 vs 從格 vs 專旺格）
 * 2. 區分調候用神 vs 扶抑用神
 * 3. 判斷用神有力/無力
 */

import type { BaZiChart, WuXing, Pattern, DiZhi, TianGan, StrengthAnalysis, PreferenceAnalysis, TiaoHouAnalysis } from './types';
import { TIAN_GAN_ELEMENT, HIDDEN_STEMS, DI_ZHI_ELEMENT } from '@/data/constants';
import { analyzeTiaoHou } from './tiao-hou';

// 重新導出 PreferenceAnalysis 類型，保持 API 兼容性
export type { PreferenceAnalysis } from './types';

// ========== 五行關係映射 ==========

/** 我生（食傷） */
const SHENG_MAP: Record<WuXing, WuXing> = {
  木: '火', 火: '土', 土: '金', 金: '水', 水: '木',
};

/** 我剋（財星） */
const KE_MAP: Record<WuXing, WuXing> = {
  木: '土', 火: '金', 土: '水', 金: '木', 水: '火',
};

/** 生我（印星） */
const BE_SHENG_MAP: Record<WuXing, WuXing> = {
  木: '水', 火: '木', 土: '火', 金: '土', 水: '金',
};

/** 剋我（官殺） */
const BE_KE_MAP: Record<WuXing, WuXing> = {
  木: '金', 火: '水', 土: '木', 金: '火', 水: '土',
};

// ========== 調候用神表 ==========

/**
 * 調候用神需求表
 * 根據日主五行和出生月份，判斷是否需要調候
 */
const TIAO_HOU_TABLE: Record<WuXing, Partial<Record<DiZhi, { need: WuXing; reason: string }>>> = {
  木: {
    巳: { need: '水', reason: '夏木需水滋潤，否則枯焦' },
    午: { need: '水', reason: '夏木焚於火，必須有水調候' },
    未: { need: '水', reason: '土旺木折，需水生木' },
    戌: { need: '水', reason: '秋木凋零，需水養根' },
    亥: { need: '火', reason: '冬木寒凝，需火溫暖' },
    子: { need: '火', reason: '冬木嚴寒，火為調候之必須' },
    丑: { need: '火', reason: '寒冬木凍，非火不能解凍' },
  },
  火: {
    亥: { need: '木', reason: '冬火無焰，需木生發' },
    子: { need: '木', reason: '冬火衰微，木為調候引火' },
    丑: { need: '木', reason: '嚴冬火滅，必須有木' },
    申: { need: '木', reason: '秋火被剋，需木助燃' },
    酉: { need: '木', reason: '秋金旺火死，木為救應' },
  },
  土: {
    寅: { need: '火', reason: '春土寒濕，需火暖土' },
    卯: { need: '火', reason: '春木剋土，需火通關' },
    亥: { need: '火', reason: '冬土凍結，非火不能解' },
    子: { need: '火', reason: '冬水泛濫，土需火助' },
    丑: { need: '火', reason: '嚴冬土凝，火為必須' },
  },
  金: {
    巳: { need: '水', reason: '夏金被剋，需水洩火生金' },
    午: { need: '水', reason: '夏火熔金，水為調候救應' },
    未: { need: '水', reason: '土燥金脆，需水潤澤' },
  },
  水: {
    巳: { need: '金', reason: '夏水乾涸，需金生水之源' },
    午: { need: '金', reason: '火旺水枯，金為水之母' },
    未: { need: '金', reason: '土燥剋水，金可生水解危' },
    辰: { need: '金', reason: '春水洩氣，需金補充' },
  },
};

// ========== 主函數 ==========

/**
 * 深度分析喜用神
 *
 * @param chart 八字盤
 * @param pattern 格局判定結果
 * @param strength 身強身弱分析結果
 */
export function analyzePreferenceAdvanced(
  chart: BaZiChart,
  pattern: Pattern,
  strength: StrengthAnalysis
): PreferenceAnalysis {
  const dayElement = chart.day.ganElement;
  const monthBranch = chart.month.zhi;

  // 根據格局類型選擇分析方法
  if (pattern.type === '從格') {
    return analyzeFromPattern(chart, pattern, dayElement);
  }

  if (pattern.type === '專旺格') {
    return analyzeSpecialPattern(chart, pattern, dayElement);
  }

  // 正格或雜格：使用扶抑法 + 調候法
  return analyzeNormalPattern(chart, pattern, strength, dayElement, monthBranch);
}

// ========== 正格分析（扶抑法） ==========

function analyzeNormalPattern(
  chart: BaZiChart,
  pattern: Pattern,
  strength: StrengthAnalysis,
  dayElement: WuXing,
  monthBranch: DiZhi
): PreferenceAnalysis {
  const isStrong = strength.verdict === '身強' || strength.verdict === '身極強' || strength.verdict === '身旺';

  // 基礎扶抑用神
  let favorable: WuXing[];
  let unfavorable: WuXing[];

  if (isStrong) {
    // 身強：喜洩耗剋（食傷、財星、官殺）
    favorable = [SHENG_MAP[dayElement], KE_MAP[dayElement], BE_KE_MAP[dayElement]];
    unfavorable = [dayElement, BE_SHENG_MAP[dayElement]];
  } else {
    // 身弱：喜生扶（印星、比劫）
    favorable = [dayElement, BE_SHENG_MAP[dayElement]];
    unfavorable = [SHENG_MAP[dayElement], KE_MAP[dayElement], BE_KE_MAP[dayElement]];
  }

  // 使用完整版調候分析
  const tiaoHouAnalysis = analyzeTiaoHou(chart);

  // 如果需要調候且調候用神不在喜用神中，調整優先級
  if (tiaoHouAnalysis.isUrgent && tiaoHouAnalysis.tiaoHouShen.length > 0) {
    const primaryTiaoHou = tiaoHouAnalysis.tiaoHouShen[0];
    if (!favorable.includes(primaryTiaoHou)) {
      // 調候用神提升到首位
      favorable = [primaryTiaoHou, ...favorable.filter(e => e !== primaryTiaoHou)];
    }
  }

  // 判斷用神力量
  const primaryUshen = favorable[0];
  const ushenStrength = evaluateUshenStrength(chart, primaryUshen);

  // 生成說明（使用新版調候資訊）
  const description = generateNormalDescriptionV2(
    dayElement,
    isStrong,
    favorable,
    unfavorable,
    tiaoHouAnalysis,
    ushenStrength,
    pattern
  );

  // 判斷方法：如果調候是緊急的，使用調候法
  const method = tiaoHouAnalysis.isUrgent ? '調候法' : '扶抑法';

  return {
    favorable,
    unfavorable,
    tiaoHou: tiaoHouAnalysis.tiaoHouShen.length > 0 ? tiaoHouAnalysis : undefined,
    ushenStrength,
    description,
    method,
  };
}

// ========== 從格分析（從勢法） ==========

function analyzeFromPattern(
  chart: BaZiChart,
  pattern: Pattern,
  dayElement: WuXing
): PreferenceAnalysis {
  let favorable: WuXing[];
  let unfavorable: WuXing[];
  let description: string;

  switch (pattern.name) {
    case '從殺格':
      // 從殺：喜官殺、財星（財生殺），忌印比（會破格）
      favorable = [BE_KE_MAP[dayElement], KE_MAP[dayElement]];
      unfavorable = [dayElement, BE_SHENG_MAP[dayElement], SHENG_MAP[dayElement]];
      description = `從殺格成立，日主從官殺之勢。喜官殺（${BE_KE_MAP[dayElement]}）繼續強化權威，喜財星（${KE_MAP[dayElement]}）生殺助勢。忌印星比劫（${BE_SHENG_MAP[dayElement]}、${dayElement}）扶起日主破格。順從上司、權威發展最佳。`;
      break;

    case '從財格':
      // 從財：喜財星、食傷（食傷生財），忌印比
      favorable = [KE_MAP[dayElement], SHENG_MAP[dayElement]];
      unfavorable = [dayElement, BE_SHENG_MAP[dayElement], BE_KE_MAP[dayElement]];
      description = `從財格成立，日主從財星之勢。喜財星（${KE_MAP[dayElement]}）持續旺盛，喜食傷（${SHENG_MAP[dayElement]}）生財助勢。忌印星比劫（${BE_SHENG_MAP[dayElement]}、${dayElement}）奪財破格。適合經商、理財發展。`;
      break;

    case '從兒格':
      // 從兒：喜食傷、財星（洩秀生財），忌印星（奪食）
      favorable = [SHENG_MAP[dayElement], KE_MAP[dayElement]];
      unfavorable = [BE_SHENG_MAP[dayElement], BE_KE_MAP[dayElement]];
      description = `從兒格成立，日主從食傷之勢。喜食傷（${SHENG_MAP[dayElement]}）發揮才華，喜財星（${KE_MAP[dayElement]}）秀氣流轉生財。忌印星（${BE_SHENG_MAP[dayElement]}）奪食破格。適合藝術、創意、自由業發展。`;
      break;

    default:
      // 通用從格處理
      favorable = [KE_MAP[dayElement], SHENG_MAP[dayElement]];
      unfavorable = [dayElement, BE_SHENG_MAP[dayElement]];
      description = '從格成立，順從大勢發展。';
  }

  const ushenStrength = evaluateUshenStrength(chart, favorable[0]);

  return {
    favorable,
    unfavorable,
    ushenStrength,
    description,
    method: '從勢法',
  };
}

// ========== 專旺格分析 ==========

function analyzeSpecialPattern(
  chart: BaZiChart,
  pattern: Pattern,
  dayElement: WuXing
): PreferenceAnalysis {
  // 專旺格：喜順不喜逆
  // 喜比劫（同類增強）、食傷（順勢而洩）
  // 忌官殺（逆勢剋制）、財星（耗氣）
  const favorable: WuXing[] = [dayElement, SHENG_MAP[dayElement], BE_SHENG_MAP[dayElement]];
  const unfavorable: WuXing[] = [BE_KE_MAP[dayElement], KE_MAP[dayElement]];

  const patternNames: Record<string, string> = {
    '曲直格': '木氣',
    '炎上格': '火氣',
    '稼穡格': '土氣',
    '從革格': '金氣',
    '潤下格': '水氣',
  };

  const qiType = patternNames[pattern.name] || '一氣';

  const description = `${pattern.name}成立，${qiType}專旺一方。喜同類（${dayElement}）增強氣勢，喜食傷（${SHENG_MAP[dayElement]}）順勢流轉，喜印星（${BE_SHENG_MAP[dayElement]}）生扶日主。忌官殺（${BE_KE_MAP[dayElement]}）逆勢剋制，忌財星（${KE_MAP[dayElement]}）耗洩元氣。專旺格大起大落，順勢時成就非凡，逆勢時一落千丈。`;

  const ushenStrength = evaluateUshenStrength(chart, favorable[0]);

  return {
    favorable,
    unfavorable,
    ushenStrength,
    description,
    method: '專旺法',
  };
}

// ========== 調候用神檢查 ==========

function checkTiaoHou(
  chart: BaZiChart,
  dayElement: WuXing,
  monthBranch: DiZhi
): { needed: boolean; element: WuXing; reason: string; isPresent: boolean } {
  const tiaoHouNeed = TIAO_HOU_TABLE[dayElement]?.[monthBranch];

  if (!tiaoHouNeed) {
    return { needed: false, element: dayElement, reason: '', isPresent: true };
  }

  // 檢查調候用神是否存在於八字中
  const neededElement = tiaoHouNeed.need;
  const isPresent = checkElementPresent(chart, neededElement);

  return {
    needed: true,
    element: neededElement,
    reason: tiaoHouNeed.reason,
    isPresent,
  };
}

/**
 * 檢查某五行是否在八字中有力量
 */
function checkElementPresent(chart: BaZiChart, element: WuXing): boolean {
  // 檢查天干
  const stems: TianGan[] = [chart.year.gan, chart.month.gan, chart.day.gan, chart.hour.gan];
  for (const stem of stems) {
    if (TIAN_GAN_ELEMENT[stem] === element) {
      return true;
    }
  }

  // 檢查地支本氣
  const branches: DiZhi[] = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi];
  for (const branch of branches) {
    const mainStem = HIDDEN_STEMS[branch].main;
    if (TIAN_GAN_ELEMENT[mainStem] === element) {
      return true;
    }
  }

  return false;
}

// ========== 用神力量評估 ==========

function evaluateUshenStrength(
  chart: BaZiChart,
  ushenElement: WuXing
): { element: WuXing; strength: '有力' | '中等' | '無力'; factors: string[] } {
  const factors: string[] = [];
  let score = 0;

  // 1. 檢查是否透干
  const stems: TianGan[] = [chart.year.gan, chart.month.gan, chart.day.gan, chart.hour.gan];
  const positions = ['年干', '月干', '日干', '時干'];

  for (let i = 0; i < stems.length; i++) {
    if (TIAN_GAN_ELEMENT[stems[i]] === ushenElement && i !== 2) { // 排除日干本身
      factors.push(`${positions[i]}透出（${stems[i]}）`);
      score += 2;
    }
  }

  // 2. 檢查是否通根
  const branches: DiZhi[] = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi];
  const branchPositions = ['年支', '月支', '日支', '時支'];

  for (let i = 0; i < branches.length; i++) {
    const hidden = HIDDEN_STEMS[branches[i]];
    if (TIAN_GAN_ELEMENT[hidden.main] === ushenElement) {
      factors.push(`${branchPositions[i]}本氣通根（${branches[i]}藏${hidden.main}）`);
      score += 2;
    } else if (hidden.middle && TIAN_GAN_ELEMENT[hidden.middle] === ushenElement) {
      factors.push(`${branchPositions[i]}中氣通根（${branches[i]}藏${hidden.middle}）`);
      score += 1;
    } else if (hidden.residue && TIAN_GAN_ELEMENT[hidden.residue] === ushenElement) {
      factors.push(`${branchPositions[i]}餘氣通根（${branches[i]}藏${hidden.residue}）`);
      score += 0.5;
    }
  }

  // 3. 檢查是否得令
  const monthElement = DI_ZHI_ELEMENT[chart.month.zhi];
  const monthMainStem = HIDDEN_STEMS[chart.month.zhi].main;
  const monthMainElement = TIAN_GAN_ELEMENT[monthMainStem];

  if (monthMainElement === ushenElement) {
    factors.push(`得令（月支${chart.month.zhi}本氣為${ushenElement}）`);
    score += 3;
  } else if (BE_SHENG_MAP[ushenElement] === monthMainElement) {
    // 月令生用神
    factors.push(`月令生扶（${monthMainElement}生${ushenElement}）`);
    score += 1;
  }

  // 4. 判定強度
  let strength: '有力' | '中等' | '無力';
  if (score >= 5) {
    strength = '有力';
  } else if (score >= 2) {
    strength = '中等';
  } else {
    strength = '無力';
    if (factors.length === 0) {
      factors.push('用神在八字中無根無氣');
    }
  }

  return { element: ushenElement, strength, factors };
}

// ========== 說明文字生成 ==========

/**
 * 生成正格分析說明（使用完整版調候分析）
 */
function generateNormalDescriptionV2(
  dayElement: WuXing,
  isStrong: boolean,
  favorable: WuXing[],
  unfavorable: WuXing[],
  tiaoHou: TiaoHouAnalysis,
  ushenStrength: { element: WuXing; strength: '有力' | '中等' | '無力'; factors: string[] },
  pattern: Pattern
): string {
  const parts: string[] = [];

  // 基本判斷
  if (isStrong) {
    parts.push(`日主${dayElement}身強，宜洩耗剋，喜食傷（${SHENG_MAP[dayElement]}）洩秀、財星（${KE_MAP[dayElement]}）耗氣、官殺（${BE_KE_MAP[dayElement]}）制約。忌印星（${BE_SHENG_MAP[dayElement]}）再生、比劫（${dayElement}）爭奪。`);
  } else {
    parts.push(`日主${dayElement}身弱，宜生扶，喜印星（${BE_SHENG_MAP[dayElement]}）生身、比劫（${dayElement}）助力。忌食傷（${SHENG_MAP[dayElement]}）洩氣、財星（${KE_MAP[dayElement]}）耗身、官殺（${BE_KE_MAP[dayElement]}）剋制。`);
  }

  // 調候說明（使用完整版）
  if (tiaoHou.tiaoHouShen.length > 0) {
    const tiaoHouElements = tiaoHou.tiaoHouShen.join('、');
    if (tiaoHou.isSufficient) {
      parts.push(`${tiaoHou.description}。調候有情，${tiaoHouElements}在八字中出現，命局氣候調和。`);
    } else if (tiaoHou.isUrgent) {
      parts.push(`命局急需調候！${tiaoHou.description}。然八字中缺${tiaoHouElements}，調候無力，此為命局一大缺陷。行運見${tiaoHouElements}方能改善。`);
    } else {
      parts.push(`${tiaoHou.description}。喜行${tiaoHouElements}運。`);
    }
  }

  // 用神力量說明
  if (ushenStrength.strength === '有力') {
    parts.push(`用神${ushenStrength.element}${ushenStrength.strength}，${ushenStrength.factors.join('、')}，格局層次較高。`);
  } else if (ushenStrength.strength === '無力') {
    parts.push(`惜用神${ushenStrength.element}${ushenStrength.strength}，${ushenStrength.factors.join('、')}，格局受損。需借行運補足。`);
  } else {
    parts.push(`用神${ushenStrength.element}力量${ushenStrength.strength}，${ushenStrength.factors.join('、')}。`);
  }

  // 格局配合
  if (pattern.keyGod) {
    const keyGodElement = getKeyGodElement(dayElement, pattern.keyGod);
    if (favorable.includes(keyGodElement)) {
      parts.push(`格局用神${pattern.keyGod}（${keyGodElement}）與喜用神相合，格局清純。`);
    } else {
      parts.push(`格局用神${pattern.keyGod}（${keyGodElement}）與扶抑用神有異，需取舍權衡。`);
    }
  }

  return parts.join('');
}

/**
 * 獲取十神對應的五行
 */
function getKeyGodElement(dayElement: WuXing, shiShen: string): WuXing {
  switch (shiShen) {
    case '比肩':
    case '劫財':
      return dayElement;
    case '食神':
    case '傷官':
      return SHENG_MAP[dayElement];
    case '正財':
    case '偏財':
      return KE_MAP[dayElement];
    case '正官':
    case '七殺':
      return BE_KE_MAP[dayElement];
    case '正印':
    case '偏印':
      return BE_SHENG_MAP[dayElement];
    default:
      return dayElement;
  }
}

// ========== 導出簡化版（兼容現有 API） ==========

/**
 * 簡化版喜用神分析（兼容現有調用）
 */
export function analyzePreferenceSimple(
  dayElement: WuXing,
  isStrong: boolean
): { favorable: WuXing[]; unfavorable: WuXing[] } {
  if (isStrong) {
    return {
      favorable: [SHENG_MAP[dayElement], KE_MAP[dayElement], BE_KE_MAP[dayElement]],
      unfavorable: [dayElement, BE_SHENG_MAP[dayElement]],
    };
  } else {
    return {
      favorable: [dayElement, BE_SHENG_MAP[dayElement]],
      unfavorable: [SHENG_MAP[dayElement], KE_MAP[dayElement], BE_KE_MAP[dayElement]],
    };
  }
}
