/**
 * 八字命理系統 - 六親分析模組
 * 年月日時對應六親關係分析
 */

import type {
  BaZiChart,
  Pillar,
  ShiShen,
  Gender,
} from './types';
import { countTenGods } from './ten-gods';

// ========== 六親定義 ==========

/**
 * 十神對應六親（傳統定義）
 */
export interface LiuQinMapping {
  male: Record<ShiShen, string[]>;
  female: Record<ShiShen, string[]>;
}

export const LIUQIN_MAPPING: LiuQinMapping = {
  male: {
    比肩: ['兄弟', '朋友', '同輩'],
    劫財: ['姊妹', '競爭對手'],
    食神: ['女婿', '孫女', '晚輩'],
    傷官: ['女兒', '創意才華'],
    偏財: ['父親', '情人', '副財源'],
    正財: ['妻子', '主要財源'],
    七殺: ['兒子', '權威', '壓力來源'],
    正官: ['女兒', '上司', '名譽'],
    偏印: ['繼母', '副業貴人'],
    正印: ['母親', '正業貴人', '學業'],
  },
  female: {
    比肩: ['姊妹', '朋友', '同輩'],
    劫財: ['兄弟', '競爭對手'],
    食神: ['兒子', '晚輩'],
    傷官: ['女兒', '才藝表現'],
    偏財: ['父親', '副財源'],
    正財: ['財富', '資產'],
    七殺: ['情人', '偏夫', '壓力'],
    正官: ['丈夫', '正緣', '名譽'],
    偏印: ['繼母', '副業'],
    正印: ['母親', '貴人', '學業'],
  },
};

// ========== 宮位分析 ==========

/** 四柱宮位對應 */
export interface PillarPalace {
  position: '年' | '月' | '日' | '時';
  upperPalace: string;  // 天干宮位
  lowerPalace: string;  // 地支宮位
  lifeStage: string;    // 人生階段
  ageRange: string;     // 年齡範圍
}

export const PILLAR_PALACES: PillarPalace[] = [
  {
    position: '年',
    upperPalace: '祖父、外祖、長輩',
    lowerPalace: '祖母、外祖母、根基',
    lifeStage: '幼年期',
    ageRange: '1-16歲',
  },
  {
    position: '月',
    upperPalace: '父親、叔伯、兄長',
    lowerPalace: '母親、姑姨、姊妹',
    lifeStage: '青年期',
    ageRange: '17-32歲',
  },
  {
    position: '日',
    upperPalace: '自己',
    lowerPalace: '配偶宮',
    lifeStage: '中年期',
    ageRange: '33-48歲',
  },
  {
    position: '時',
    upperPalace: '子女、晚輩',
    lowerPalace: '子女宮、晚年',
    lifeStage: '晚年期',
    ageRange: '49歲以後',
  },
];

// ========== 六親分析 ==========

export interface LiuQinAnalysis {
  position: '年' | '月' | '日' | '時';
  palace: PillarPalace;
  ganTenGod: ShiShen;
  zhiTenGod: ShiShen;
  ganLiuQin: string[];
  zhiLiuQin: string[];
  analysis: string;
  advice: string;
}

export interface FullLiuQinReport {
  year: LiuQinAnalysis;
  month: LiuQinAnalysis;
  day: LiuQinAnalysis;
  hour: LiuQinAnalysis;
  fatherAnalysis: string;
  motherAnalysis: string;
  spouseAnalysis: string;
  childrenAnalysis: string;
  summary: string;
}

/**
 * 分析單柱六親
 */
function analyzePillarLiuQin(
  pillar: Pillar,
  position: '年' | '月' | '日' | '時',
  gender: Gender
): LiuQinAnalysis {
  const palace = PILLAR_PALACES.find(p => p.position === position)!;
  const mapping = gender === '男' ? LIUQIN_MAPPING.male : LIUQIN_MAPPING.female;

  const ganTenGod = pillar.ganShiShen || '比肩';
  const zhiTenGod = pillar.hiddenStems[0]?.shiShen || '比肩';

  const ganLiuQin = mapping[ganTenGod] || [];
  const zhiLiuQin = mapping[zhiTenGod] || [];

  let analysis = '';
  let advice = '';

  switch (position) {
    case '年':
      analysis = `年柱代表祖上、幼年運。天干${ganTenGod}顯示祖父輩或早年環境${ganLiuQin[0] ? `與${ganLiuQin[0]}有關` : ''}。地支藏干${zhiTenGod}反映家族根基。`;
      advice = '重視家族傳承，感恩長輩庇蔭。';
      break;
    case '月':
      analysis = `月柱為父母宮。天干${ganTenGod}代表父親或家庭資源${ganLiuQin[0] ? `，與${ganLiuQin[0]}相關` : ''}。地支代表母親或家庭環境。`;
      advice = '孝順父母，維繫家庭和諧。';
      break;
    case '日':
      analysis = `日柱為命主本身與配偶。日支為配偶宮，藏干${zhiTenGod}影響婚姻關係。`;
      advice = '重視自我修養，經營好婚姻關係。';
      break;
    case '時':
      analysis = `時柱為子女宮、晚年運。天干${ganTenGod}代表子女${ganLiuQin[0] ? `，與${ganLiuQin[0]}有關` : ''}。地支反映晚年境遇。`;
      advice = '教育子女有方，為晚年積福。';
      break;
  }

  return {
    position,
    palace,
    ganTenGod,
    zhiTenGod,
    ganLiuQin,
    zhiLiuQin,
    analysis,
    advice,
  };
}

/**
 * 分析父親緣分
 */
function analyzeFather(chart: BaZiChart, gender: Gender): string {
  const tenGodCount = countTenGods(chart);
  const fatherStar = '偏財'; // 偏財代表父親

  const fatherCount = tenGodCount[fatherStar];
  const monthGanIsFather = chart.month.ganShiShen === fatherStar;

  let analysis = '';

  if (fatherCount === 0) {
    analysis = '八字中偏財不顯，與父親緣分較薄，或父親較早離家、緣淺。';
  } else if (fatherCount >= 2) {
    analysis = '偏財旺盛，父親有能力，但父子關係需要經營，可能有距離感。';
  } else {
    analysis = '偏財適中，與父親關係正常，能得到父親一定的助力。';
  }

  if (monthGanIsFather) {
    analysis += '父星在月柱天干透出，父親對命主影響明顯。';
  }

  return analysis;
}

/**
 * 分析母親緣分
 */
function analyzeMother(chart: BaZiChart, gender: Gender): string {
  const tenGodCount = countTenGods(chart);
  const motherStar = '正印'; // 正印代表母親

  const motherCount = tenGodCount[motherStar] + tenGodCount['偏印'];
  const monthZhiIsMother = chart.month.hiddenStems.some(
    hs => hs.shiShen === '正印' || hs.shiShen === '偏印'
  );

  let analysis = '';

  if (motherCount === 0) {
    analysis = '八字中印星不顯，與母親緣分較淡，或母親照顧較少。';
  } else if (motherCount >= 2) {
    analysis = '印星旺盛，母親緣厚，能得到母親的愛護與支持。';
  } else {
    analysis = '印星適中，與母親關係和諧，家庭溫暖。';
  }

  if (monthZhiIsMother) {
    analysis += '母星在月支，母親對家庭有重要影響。';
  }

  return analysis;
}

/**
 * 分析配偶緣分
 */
function analyzeSpouse(chart: BaZiChart, gender: Gender): string {
  const tenGodCount = countTenGods(chart);
  const spouseStar = gender === '男' ? '正財' : '正官';
  const secondarySpouse = gender === '男' ? '偏財' : '七殺';

  const spouseCount = tenGodCount[spouseStar];
  const secondaryCount = tenGodCount[secondarySpouse];
  const dayZhiHasSpouse = chart.day.hiddenStems.some(
    hs => hs.shiShen === spouseStar || hs.shiShen === secondarySpouse
  );

  let analysis = '';

  if (spouseCount === 0 && secondaryCount === 0) {
    analysis = `配偶星不顯，姻緣較晚或需要努力爭取。`;
  } else if (spouseCount >= 2 || (spouseCount + secondaryCount) >= 3) {
    analysis = gender === '男'
      ? '財星旺盛，異性緣好，但需專一，避免感情複雜。'
      : '官殺混雜，追求者多，需謹慎選擇正緣。';
  } else {
    analysis = '配偶星適中，姻緣正常，用心經營婚姻。';
  }

  if (dayZhiHasSpouse) {
    analysis += '配偶宮有配偶星，婚姻緣分較好。';
  }

  return analysis;
}

/**
 * 分析子女緣分
 */
function analyzeChildren(chart: BaZiChart, gender: Gender): string {
  const tenGodCount = countTenGods(chart);

  // 男命：七殺為子、正官為女
  // 女命：食神為子、傷官為女
  const sonStar = gender === '男' ? '七殺' : '食神';
  const daughterStar = gender === '男' ? '正官' : '傷官';

  const sonCount = tenGodCount[sonStar];
  const daughterCount = tenGodCount[daughterStar];
  const totalChildren = sonCount + daughterCount;

  const hourHasChildren = chart.hour.ganShiShen === sonStar ||
    chart.hour.ganShiShen === daughterStar ||
    chart.hour.hiddenStems.some(hs => hs.shiShen === sonStar || hs.shiShen === daughterStar);

  let analysis = '';

  if (totalChildren === 0) {
    analysis = '子女星不顯，子女緣較淡，或子女較獨立，緣分較淺。';
  } else if (totalChildren >= 3) {
    analysis = '子女星旺盛，子女緣厚，但需注意教養方式。';
  } else {
    analysis = '子女星適中，子女緣分正常，用心教養。';
  }

  if (hourHasChildren) {
    analysis += '時柱有子女星，子女宮佳，子女有成。';
  }

  // 推算子女數量傾向
  if (sonCount > daughterCount) {
    analysis += '男孩緣分較重。';
  } else if (daughterCount > sonCount) {
    analysis += '女孩緣分較重。';
  }

  return analysis;
}

/**
 * 完整六親分析
 */
export function analyzeLiuQin(chart: BaZiChart, gender: Gender): FullLiuQinReport {
  const year = analyzePillarLiuQin(chart.year, '年', gender);
  const month = analyzePillarLiuQin(chart.month, '月', gender);
  const day = analyzePillarLiuQin(chart.day, '日', gender);
  const hour = analyzePillarLiuQin(chart.hour, '時', gender);

  const fatherAnalysis = analyzeFather(chart, gender);
  const motherAnalysis = analyzeMother(chart, gender);
  const spouseAnalysis = analyzeSpouse(chart, gender);
  const childrenAnalysis = analyzeChildren(chart, gender);

  const summary = generateLiuQinSummary(chart, gender);

  return {
    year,
    month,
    day,
    hour,
    fatherAnalysis,
    motherAnalysis,
    spouseAnalysis,
    childrenAnalysis,
    summary,
  };
}

/**
 * 生成六親總結
 */
function generateLiuQinSummary(chart: BaZiChart, gender: Gender): string {
  const tenGodCount = countTenGods(chart);

  // 統計六親星
  const parentStars = tenGodCount['偏財'] + tenGodCount['正印'] + tenGodCount['偏印'];
  const spouseStars = gender === '男'
    ? tenGodCount['正財'] + tenGodCount['偏財']
    : tenGodCount['正官'] + tenGodCount['七殺'];
  const childStars = gender === '男'
    ? tenGodCount['七殺'] + tenGodCount['正官']
    : tenGodCount['食神'] + tenGodCount['傷官'];
  const siblingStars = tenGodCount['比肩'] + tenGodCount['劫財'];

  const summaries: string[] = [];

  if (parentStars >= 2) {
    summaries.push('父母緣厚，家庭助力明顯');
  } else if (parentStars === 0) {
    summaries.push('父母緣較淡，多靠自身努力');
  }

  if (siblingStars >= 2) {
    summaries.push('兄弟姊妹緣分好，但需防競爭');
  } else if (siblingStars === 0) {
    summaries.push('手足緣較淡，或為獨生');
  }

  if (spouseStars >= 2) {
    summaries.push('姻緣旺盛，異性緣佳');
  } else if (spouseStars === 0) {
    summaries.push('姻緣較晚，需主動爭取');
  }

  if (childStars >= 2) {
    summaries.push('子女緣厚，晚年有靠');
  } else if (childStars === 0) {
    summaries.push('子女緣較淡，宜順其自然');
  }

  return summaries.length > 0 ? summaries.join('；') + '。' : '六親緣分適中，家庭和諧。';
}

/**
 * 獲取十神六親對照
 */
export function getTenGodLiuQin(tenGod: ShiShen, gender: Gender): string[] {
  return gender === '男' ? LIUQIN_MAPPING.male[tenGod] : LIUQIN_MAPPING.female[tenGod];
}
