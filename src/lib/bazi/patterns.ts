/**
 * 格局判定模組
 */

import type { BaZiChart, Pattern, ShiShen, WuXing, TianGan, DiZhi } from './types';
import { getTenGod, countTenGods, TEN_GOD_CATEGORIES } from './ten-gods';
import { analyzeStrength, canBeFromPattern, canBeSpecialPattern } from './strength';
import {
  TIAN_GAN_ELEMENT,
  HIDDEN_STEMS,
  DI_ZHI_ELEMENT,
} from '@/data/constants';

/**
 * 獲取月支本氣的十神
 */
function getMonthMainGod(chart: BaZiChart): ShiShen {
  const dayMaster = chart.day.gan;
  const monthBranch = chart.month.zhi;
  const mainStem = HIDDEN_STEMS[monthBranch].main;

  return getTenGod(dayMaster, mainStem);
}

/**
 * 檢查天干是否透出
 */
function isStemTransparent(chart: BaZiChart, stem: TianGan): boolean {
  return [chart.year.gan, chart.month.gan, chart.hour.gan].includes(stem);
}

/**
 * 判定正格
 */
function determineNormalPattern(chart: BaZiChart): Pattern | null {
  const dayMaster = chart.day.gan;
  const monthBranch = chart.month.zhi;
  const hiddenStems = HIDDEN_STEMS[monthBranch];

  // Step 1: 檢查月支本氣是否透干
  const mainStem = hiddenStems.main;
  const mainGod = getTenGod(dayMaster, mainStem);

  // 比劫不成格，需要另外處理
  if (!['比肩', '劫財'].includes(mainGod)) {
    if (isStemTransparent(chart, mainStem)) {
      return {
        name: `${mainGod}格`,
        type: '正格',
        status: '成格',
        description: `月支${monthBranch}本氣${mainStem}透干，取${mainGod}格。`,
        keyGod: mainGod,
      };
    }
  }

  // Step 2: 檢查月支中氣、餘氣透干
  if (hiddenStems.middle) {
    const middleGod = getTenGod(dayMaster, hiddenStems.middle);
    if (!['比肩', '劫財'].includes(middleGod) && isStemTransparent(chart, hiddenStems.middle)) {
      return {
        name: `${middleGod}格`,
        type: '正格',
        status: '成格',
        description: `月支${monthBranch}中氣${hiddenStems.middle}透干，取${middleGod}格。`,
        keyGod: middleGod,
      };
    }
  }

  if (hiddenStems.residue) {
    const residueGod = getTenGod(dayMaster, hiddenStems.residue);
    if (!['比肩', '劫財'].includes(residueGod) && isStemTransparent(chart, hiddenStems.residue)) {
      return {
        name: `${residueGod}格`,
        type: '正格',
        status: '成格',
        description: `月支${monthBranch}餘氣${hiddenStems.residue}透干，取${residueGod}格。`,
        keyGod: residueGod,
      };
    }
  }

  // Step 3: 月支為比劫（建祿格/月刃格）
  const dayElement = chart.day.ganElement;
  const monthElement = DI_ZHI_ELEMENT[monthBranch];

  if (dayElement === monthElement) {
    // 建祿格或月刃格
    const isYangDay = ['甲', '丙', '戊', '庚', '壬'].includes(dayMaster);

    // 羊刃判定（陽日主在特定地支）
    const yangRenMap: Record<TianGan, DiZhi> = {
      '甲': '卯', '丙': '午', '戊': '午', '庚': '酉', '壬': '子',
      '乙': '寅', '丁': '巳', '己': '巳', '辛': '申', '癸': '亥',
    };

    if (monthBranch === yangRenMap[dayMaster]) {
      return {
        name: '月刃格',
        type: '正格',
        status: '成格',
        description: `月支${monthBranch}為日主${dayMaster}之羊刃，取月刃格。性格剛烈，需官殺制約。`,
        keyGod: '劫財',
      };
    }

    return {
      name: '建祿格',
      type: '正格',
      status: '成格',
      description: `月支${monthBranch}為日主${dayMaster}之臨官祿位，取建祿格。自力更生，不靠祖業。`,
      keyGod: '比肩',
    };
  }

  // Step 4: 取全局最旺之神
  const godCount = countTenGods(chart);
  let maxGod: ShiShen = '比肩';
  let maxCount = 0;

  for (const [god, count] of Object.entries(godCount)) {
    if (!['比肩', '劫財'].includes(god as ShiShen) && count > maxCount) {
      maxCount = count;
      maxGod = god as ShiShen;
    }
  }

  if (maxCount > 0) {
    return {
      name: `${maxGod}格`,
      type: '正格',
      status: '成格',
      description: `取全局最旺之${maxGod}為格。`,
      keyGod: maxGod,
    };
  }

  return null;
}

/**
 * 判定從格
 */
function determineFromPattern(chart: BaZiChart): Pattern | null {
  const strength = analyzeStrength(chart);

  if (!canBeFromPattern(strength)) {
    return null;
  }

  const godCount = countTenGods(chart);

  // 計算各類十神總量
  const officialCount = godCount['正官'] + godCount['七殺'];
  const wealthCount = godCount['正財'] + godCount['偏財'];
  const outputCount = godCount['食神'] + godCount['傷官'];
  const sealCount = godCount['正印'] + godCount['偏印'];
  const siblingCount = godCount['比肩'] + godCount['劫財'];

  // 從殺格
  if (officialCount >= 3 && outputCount < 1 && siblingCount < 0.5) {
    return {
      name: '從殺格',
      type: '從格',
      status: '成格',
      description: '日主極弱，官殺當令且無制，從其官殺之勢。順從權威，適合在大組織發展。',
      keyGod: '七殺',
    };
  }

  // 從財格
  if (wealthCount >= 3 && siblingCount < 0.5 && sealCount < 0.5) {
    return {
      name: '從財格',
      type: '從格',
      status: '成格',
      description: '日主極弱，財星當令且無劫，從其財星之勢。順從財富，適合經商理財。',
      keyGod: '正財',
    };
  }

  // 從兒格（從食傷）
  if (outputCount >= 3 && sealCount < 0.5) {
    return {
      name: '從兒格',
      type: '從格',
      status: '成格',
      description: '日主極弱，食傷當令且無印制，從其食傷之勢。順從才華，適合創意表達。',
      keyGod: '食神',
    };
  }

  return null;
}

/**
 * 判定專旺格
 */
function determineSpecialPattern(chart: BaZiChart): Pattern | null {
  const strength = analyzeStrength(chart);

  if (!canBeSpecialPattern(strength)) {
    return null;
  }

  const dayElement = chart.day.ganElement;
  const branches = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi];

  // 專旺格需要地支成方局或合局
  const elementMap: Record<WuXing, { name: string; branches: DiZhi[] }> = {
    木: { name: '曲直格', branches: ['寅', '卯', '辰'] },
    火: { name: '炎上格', branches: ['巳', '午', '未'] },
    土: { name: '稼穡格', branches: ['辰', '戌', '丑', '未'] },
    金: { name: '從革格', branches: ['申', '酉', '戌'] },
    水: { name: '潤下格', branches: ['亥', '子', '丑'] },
  };

  const targetBranches = elementMap[dayElement].branches;
  const matchCount = branches.filter(b => targetBranches.includes(b)).length;

  if (matchCount >= 3) {
    return {
      name: elementMap[dayElement].name,
      type: '專旺格',
      status: '成格',
      description: `日主${dayElement}氣專旺，地支成${dayElement}方局，一氣獨旺。大起大落，成就非凡。`,
      keyGod: '比肩',
    };
  }

  return null;
}

/**
 * 綜合判定格局
 */
export function determinePattern(chart: BaZiChart): Pattern {
  // 優先檢查特殊格局
  const specialPattern = determineSpecialPattern(chart);
  if (specialPattern) return specialPattern;

  // 其次檢查從格
  const fromPattern = determineFromPattern(chart);
  if (fromPattern) return fromPattern;

  // 最後判定正格
  const normalPattern = determineNormalPattern(chart);
  if (normalPattern) return normalPattern;

  // 兜底
  return {
    name: '雜格',
    type: '雜格',
    status: '成格',
    description: '格局不明顯，以日主強弱和用神喜忌論命。',
  };
}

/**
 * 檢查格局是否破格
 */
export function checkPatternBreak(chart: BaZiChart, pattern: Pattern): Pattern {
  const godCount = countTenGods(chart);

  // 正官格破格條件
  if (pattern.keyGod === '正官') {
    // 傷官見官
    if (godCount['傷官'] >= 1) {
      return {
        ...pattern,
        status: '破格',
        description: pattern.description + ' 但有傷官見官，格局受損，官非口舌多。',
      };
    }
    // 官殺混雜
    if (godCount['七殺'] >= 1 && godCount['正官'] >= 1) {
      return {
        ...pattern,
        status: '破格',
        description: pattern.description + ' 但官殺混雜，事業多變動。',
      };
    }
  }

  // 七殺格破格條件
  if (pattern.keyGod === '七殺') {
    // 無制化
    if (godCount['食神'] < 0.5 && godCount['正印'] < 0.5) {
      return {
        ...pattern,
        status: '破格',
        description: pattern.description + ' 但七殺無制，性格暴躁，多災多難。',
      };
    }
  }

  // 食神格破格條件
  if (pattern.keyGod === '食神') {
    // 梟神奪食
    if (godCount['偏印'] >= 1) {
      return {
        ...pattern,
        status: '破格',
        description: pattern.description + ' 但有偏印奪食，才華難發揮，謀事多阻。',
      };
    }
  }

  return pattern;
}

/**
 * 獲取格局的詳細解讀
 */
export function getPatternDescription(pattern: Pattern, isStrong: boolean): string {
  const baseDesc = pattern.description;

  const implications: Record<string, string> = {
    '正官格': '適合公職、管理層、需要權威和信任的工作。做事有原則，重視名譽。',
    '七殺格': '適合軍警、競技、開創性事業。性格強勢，有魄力，敢於冒險。',
    '正財格': '適合穩健的商業、財務工作。腳踏實地，善於理財，有商業頭腦。',
    '偏財格': '適合投資、貿易、需要社交的工作。人緣好，財來財去，適合流動資金。',
    '正印格': '適合學術、教育、研究工作。重視學習，有貴人運，適合傳承。',
    '偏印格': '適合技術、藝術、獨特專業。思維獨特，適合冷門領域。',
    '食神格': '適合餐飲、娛樂、創意工作。心態樂觀，有口福，適合享受生活。',
    '傷官格': '適合藝術、設計、自由業。才華橫溢，叛逆創新，不喜歡約束。',
    '建祿格': '自力更生，不靠祖業。白手起家的命格，需靠自己打拼。',
    '月刃格': '性格剛烈，有魄力。需要有官殺制約才能成大事，否則易惹是非。',
    '從殺格': '順從權威，在大組織中發展最佳。不宜自己當老闆。',
    '從財格': '順從財富，適合為人打工或經商。不爭權位，但財運好。',
    '從兒格': '順從才華，適合創意、藝術工作。發揮所長即可成功。',
    '曲直格': '木氣專旺，仁慈正直。適合教育、醫療、公益。',
    '炎上格': '火氣專旺，熱情奔放。適合表演、領導、激勵人心的工作。',
    '稼穡格': '土氣專旺，穩重踏實。適合地產、農業、中介。',
    '從革格': '金氣專旺，果斷剛毅。適合法律、執法、改革。',
    '潤下格': '水氣專旺，智慧圓通。適合研究、諮詢、流動性強的工作。',
  };

  return (implications[pattern.name] || '') + ' ' + baseDesc;
}
