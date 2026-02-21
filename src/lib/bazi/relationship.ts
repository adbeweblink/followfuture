/**
 * 八字命理系統 - 感情婚姻分析模組
 * 配偶宮分析、財星/官殺分析、桃花系統
 */

import type {
  BaZiChart,
  DiZhi,
  WuXing,
  ShiShen,
  Gender,
  ShenSha,
} from './types';
import { countTenGods } from './ten-gods';
import { DI_ZHI_ELEMENT } from '@/data/constants';

// ========== 配偶星定義 ==========

/**
 * 獲取配偶星
 * 男命：正財為妻星，偏財為妾星
 * 女命：正官為夫星，七殺為偏夫
 */
export function getSpouseStar(gender: Gender): {
  primary: ShiShen;
  secondary: ShiShen;
  description: string;
} {
  if (gender === '男') {
    return {
      primary: '正財',
      secondary: '偏財',
      description: '男命以正財為妻星，代表正緣配偶；偏財為外緣桃花。',
    };
  } else {
    return {
      primary: '正官',
      secondary: '七殺',
      description: '女命以正官為夫星，代表正緣配偶；七殺為偏緣或情人。',
    };
  }
}

// ========== 配偶宮分析 ==========

/** 地支配偶宮特質 */
const SPOUSE_PALACE_TRAITS: Record<DiZhi, {
  personality: string;
  appearance: string;
  relationship: string;
}> = {
  子: {
    personality: '聰明靈活、機智多謀',
    appearance: '清秀俊俏、眼睛明亮',
    relationship: '感情豐富，但需防桃花過旺',
  },
  丑: {
    personality: '踏實穩重、勤勞樸實',
    appearance: '敦厚端正、身材中等',
    relationship: '感情穩定，但較為務實保守',
  },
  寅: {
    personality: '積極進取、有領導力',
    appearance: '高挑挺拔、氣質威嚴',
    relationship: '配偶有能力，但需互相尊重空間',
  },
  卯: {
    personality: '溫柔體貼、善解人意',
    appearance: '秀氣文雅、身材苗條',
    relationship: '感情和諧，配偶溫和',
  },
  辰: {
    personality: '大氣穩重、有包容心',
    appearance: '面相福厚、氣質沉穩',
    relationship: '婚姻穩固，但需化解固執',
  },
  巳: {
    personality: '聰慧機敏、口才好',
    appearance: '眼神靈動、表情豐富',
    relationship: '配偶聰明，但需防口舌爭執',
  },
  午: {
    personality: '熱情開朗、活力四射',
    appearance: '陽光有神、身材勻稱',
    relationship: '感情熱烈，但需防衝動決定',
  },
  未: {
    personality: '溫和善良、有耐心',
    appearance: '面容和藹、身材適中',
    relationship: '婚姻平順，但需主動溝通',
  },
  申: {
    personality: '機靈活潑、適應力強',
    appearance: '五官端正、表情生動',
    relationship: '配偶能幹，但需給予信任',
  },
  酉: {
    personality: '精緻細膩、追求完美',
    appearance: '容貌姣好、注重打扮',
    relationship: '配偶有品味，但需互相欣賞',
  },
  戌: {
    personality: '忠誠可靠、重情義',
    appearance: '相貌端正、氣質穩重',
    relationship: '婚姻忠誠，但需減少猜疑',
  },
  亥: {
    personality: '包容大度、智慧內斂',
    appearance: '面容福相、身材豐潤',
    relationship: '感情深厚，但需保持交流',
  },
};

/**
 * 分析配偶宮
 */
export function analyzeSpousePalace(chart: BaZiChart): {
  position: DiZhi;
  element: WuXing;
  traits: {
    personality: string;
    appearance: string;
    relationship: string;
  };
  analysis: string;
} {
  const spousePalace = chart.day.zhi; // 日支為配偶宮
  const element = DI_ZHI_ELEMENT[spousePalace as keyof typeof DI_ZHI_ELEMENT] as WuXing;
  const traits = SPOUSE_PALACE_TRAITS[spousePalace];

  const analysis = `配偶宮坐${spousePalace}（${element}），配偶${traits.personality}，外型${traits.appearance}。${traits.relationship}`;

  return {
    position: spousePalace,
    element,
    traits,
    analysis,
  };
}

// ========== 桃花星分析 ==========

/** 桃花位對照（日支查桃花） */
const PEACH_BLOSSOM_TABLE: Record<string, DiZhi> = {
  // 申子辰見酉
  申: '酉', 子: '酉', 辰: '酉',
  // 寅午戌見卯
  寅: '卯', 午: '卯', 戌: '卯',
  // 巳酉丑見午
  巳: '午', 酉: '午', 丑: '午',
  // 亥卯未見子
  亥: '子', 卯: '子', 未: '子',
};

/**
 * 查找桃花位
 */
export function findPeachBlossom(dayZhi: DiZhi): DiZhi {
  return PEACH_BLOSSOM_TABLE[dayZhi] || '子';
}

/**
 * 檢查八字中是否有桃花
 */
export function checkPeachBlossomInChart(chart: BaZiChart): {
  hasPeachBlossom: boolean;
  positions: ('年' | '月' | '日' | '時')[];
  peachBlossomZhi: DiZhi;
} {
  const peachBlossom = findPeachBlossom(chart.day.zhi);
  const positions: ('年' | '月' | '日' | '時')[] = [];

  if (chart.year.zhi === peachBlossom) positions.push('年');
  if (chart.month.zhi === peachBlossom) positions.push('月');
  if (chart.hour.zhi === peachBlossom) positions.push('時');

  return {
    hasPeachBlossom: positions.length > 0,
    positions,
    peachBlossomZhi: peachBlossom,
  };
}

// ========== 紅鸞天喜 ==========

/** 紅鸞對照（年支查紅鸞） */
const HONG_LUAN_TABLE: Record<DiZhi, DiZhi> = {
  子: '卯', 丑: '寅', 寅: '丑', 卯: '子',
  辰: '亥', 巳: '戌', 午: '酉', 未: '申',
  申: '未', 酉: '午', 戌: '巳', 亥: '辰',
};

/** 天喜對照（年支查天喜，紅鸞對沖） */
const TIAN_XI_TABLE: Record<DiZhi, DiZhi> = {
  子: '酉', 丑: '申', 寅: '未', 卯: '午',
  辰: '巳', 巳: '辰', 午: '卯', 未: '寅',
  申: '丑', 酉: '子', 戌: '亥', 亥: '戌',
};

/**
 * 查找紅鸞天喜
 */
export function findHongLuanTianXi(yearZhi: DiZhi): {
  hongLuan: DiZhi;
  tianXi: DiZhi;
} {
  return {
    hongLuan: HONG_LUAN_TABLE[yearZhi],
    tianXi: TIAN_XI_TABLE[yearZhi],
  };
}

/**
 * 檢查八字中是否有紅鸞天喜
 */
export function checkHongLuanTianXiInChart(chart: BaZiChart): {
  hasHongLuan: boolean;
  hasTianXi: boolean;
  hongLuanPositions: ('年' | '月' | '日' | '時')[];
  tianXiPositions: ('年' | '月' | '日' | '時')[];
} {
  const { hongLuan, tianXi } = findHongLuanTianXi(chart.year.zhi);

  const hongLuanPositions: ('年' | '月' | '日' | '時')[] = [];
  const tianXiPositions: ('年' | '月' | '日' | '時')[] = [];

  const pillars = [
    { pos: '月' as const, zhi: chart.month.zhi },
    { pos: '日' as const, zhi: chart.day.zhi },
    { pos: '時' as const, zhi: chart.hour.zhi },
  ];

  for (const pillar of pillars) {
    if (pillar.zhi === hongLuan) hongLuanPositions.push(pillar.pos);
    if (pillar.zhi === tianXi) tianXiPositions.push(pillar.pos);
  }

  return {
    hasHongLuan: hongLuanPositions.length > 0,
    hasTianXi: tianXiPositions.length > 0,
    hongLuanPositions,
    tianXiPositions,
  };
}

// ========== 感情分析 ==========

export interface RelationshipAnalysis {
  spousePalace: {
    position: DiZhi;
    element: WuXing;
    traits: { personality: string; appearance: string; relationship: string };
    analysis: string;
  };
  spouseStar: {
    primary: ShiShen;
    secondary: ShiShen;
    count: number;
    status: string;
    advice: string;
  };
  peachBlossom: {
    hasPeachBlossom: boolean;
    positions: ('年' | '月' | '日' | '時')[];
    analysis: string;
  };
  hongLuanTianXi: {
    hasHongLuan: boolean;
    hasTianXi: boolean;
    analysis: string;
  };
  marriageTiming: string;
  overallAdvice: string;
}

/**
 * 完整感情婚姻分析
 */
export function analyzeRelationship(
  chart: BaZiChart,
  gender: Gender
): RelationshipAnalysis {
  // 1. 配偶宮分析
  const spousePalace = analyzeSpousePalace(chart);

  // 2. 配偶星分析
  const spouseStarInfo = getSpouseStar(gender);
  const tenGodCount = countTenGods(chart);
  const spouseStarCount = tenGodCount[spouseStarInfo.primary] + tenGodCount[spouseStarInfo.secondary];

  let spouseStarStatus: string;
  let spouseStarAdvice: string;

  if (spouseStarCount === 0) {
    spouseStarStatus = `${spouseStarInfo.primary}星缺乏`;
    spouseStarAdvice = gender === '男'
      ? '財星缺乏，姻緣較晚，宜先立業後成家，或透過社交活動增加機會。'
      : '官星缺乏，正緣較晚，宜先充實自己，等待有緣人出現。';
  } else if (spouseStarCount >= 3) {
    spouseStarStatus = `${spouseStarInfo.primary}星旺盛`;
    spouseStarAdvice = gender === '男'
      ? '財星旺，桃花運佳，但需專一，避免感情糾葛。'
      : '官殺混雜，感情選擇多，需謹慎選擇，專一對待。';
  } else {
    spouseStarStatus = `${spouseStarInfo.primary}星適中`;
    spouseStarAdvice = '配偶星配置適中，感情順遂，適時把握姻緣。';
  }

  // 3. 桃花分析
  const peachBlossom = checkPeachBlossomInChart(chart);
  let peachBlossomAnalysis: string;

  if (peachBlossom.hasPeachBlossom) {
    const posStr = peachBlossom.positions.join('、');
    if (peachBlossom.positions.includes('日')) {
      peachBlossomAnalysis = `桃花在日支（配偶宮），配偶容貌姣好，但婚後需注意異性緣。`;
    } else if (peachBlossom.positions.includes('時')) {
      peachBlossomAnalysis = `桃花在時柱，晚年桃花運旺，子女緣分好。`;
    } else {
      peachBlossomAnalysis = `桃花在${posStr}柱，異性緣佳，但需專一對待感情。`;
    }
  } else {
    peachBlossomAnalysis = '命中無桃花星，感情較為穩定，靠真心經營。';
  }

  // 4. 紅鸞天喜分析
  const hongLuanTianXi = checkHongLuanTianXiInChart(chart);
  let hongLuanAnalysis: string;

  if (hongLuanTianXi.hasHongLuan && hongLuanTianXi.hasTianXi) {
    hongLuanAnalysis = '命帶紅鸞天喜，感情緣分好，易遇正緣，婚姻幸福。';
  } else if (hongLuanTianXi.hasHongLuan) {
    hongLuanAnalysis = '命帶紅鸞，姻緣佳，感情運順暢，易有喜事。';
  } else if (hongLuanTianXi.hasTianXi) {
    hongLuanAnalysis = '命帶天喜，喜事臨門，感情方面有好消息。';
  } else {
    hongLuanAnalysis = '命中紅鸞天喜不顯，姻緣需靠自身努力經營。';
  }

  // 5. 婚姻時機提示
  let marriageTiming: string;
  if (spouseStarCount === 0) {
    marriageTiming = '配偶星較弱，婚姻可能較晚，建議在運走配偶星時積極把握。';
  } else if (peachBlossom.hasPeachBlossom && spouseStarCount >= 2) {
    marriageTiming = '桃花與配偶星皆旺，婚姻機會多，宜在 25-32 歲間把握正緣。';
  } else {
    marriageTiming = '姻緣順其自然，注意大運流年走配偶星時的機會。';
  }

  // 6. 綜合建議
  const overallAdvice = generateRelationshipAdvice(
    gender,
    spouseStarCount,
    peachBlossom.hasPeachBlossom,
    hongLuanTianXi.hasHongLuan
  );

  return {
    spousePalace,
    spouseStar: {
      primary: spouseStarInfo.primary,
      secondary: spouseStarInfo.secondary,
      count: spouseStarCount,
      status: spouseStarStatus,
      advice: spouseStarAdvice,
    },
    peachBlossom: {
      ...peachBlossom,
      analysis: peachBlossomAnalysis,
    },
    hongLuanTianXi: {
      ...hongLuanTianXi,
      analysis: hongLuanAnalysis,
    },
    marriageTiming,
    overallAdvice,
  };
}

/**
 * 生成感情綜合建議
 */
function generateRelationshipAdvice(
  gender: Gender,
  spouseStarCount: number,
  hasPeachBlossom: boolean,
  hasHongLuan: boolean
): string {
  const advices: string[] = [];

  if (spouseStarCount === 0) {
    advices.push('姻緣較晚到來，宜先專注事業和自我成長');
  } else if (spouseStarCount >= 3) {
    advices.push('感情機會多，需學會取捨，專一對待');
  }

  if (hasPeachBlossom) {
    advices.push('桃花運佳，異性緣好，但婚後宜避免不必要的異性交際');
  }

  if (hasHongLuan) {
    advices.push('紅鸞照命，近期有喜事機會，宜積極把握');
  }

  if (gender === '男') {
    advices.push('男命宜先立業後成家，事業穩定後姻緣自來');
  } else {
    advices.push('女命宜提升自身價值，好姻緣會被吸引而來');
  }

  return advices.join('；') + '。';
}
