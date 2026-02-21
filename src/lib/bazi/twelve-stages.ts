/**
 * 長生十二宮模組
 *
 * 十二宮位：長生、沐浴、冠帶、臨官、帝旺、衰、病、死、墓、絕、胎、養
 * 代表五行在不同地支中的生命週期狀態
 */

import type { WuXing, DiZhi, TianGan } from './types';
import { TIAN_GAN_ELEMENT, DI_ZHI } from '@/data/constants';

/** 地支順序（用於計算索引） */
const DI_ZHI_ORDER = DI_ZHI;

/** 十二宮位名稱 */
export type TwelveStage =
  | '長生' | '沐浴' | '冠帶' | '臨官' | '帝旺'
  | '衰' | '病' | '死' | '墓' | '絕' | '胎' | '養';

/** 十二宮位順序 */
const TWELVE_STAGES: TwelveStage[] = [
  '長生', '沐浴', '冠帶', '臨官', '帝旺',
  '衰', '病', '死', '墓', '絕', '胎', '養'
];

/**
 * 各五行的長生位置（陽干順行，陰干逆行）
 * 陽干：甲丙戊庚壬
 * 陰干：乙丁己辛癸
 */
const CHANG_SHENG_POSITION: Record<WuXing, { yang: DiZhi; yin: DiZhi }> = {
  '木': { yang: '亥', yin: '午' },
  '火': { yang: '寅', yin: '酉' },
  '土': { yang: '寅', yin: '酉' }, // 土寄火，與火同
  '金': { yang: '巳', yin: '子' },
  '水': { yang: '申', yin: '卯' },
};

/**
 * 十二宮位的能量分數
 * 正數代表旺相，負數代表衰絕
 */
const STAGE_SCORES: Record<TwelveStage, number> = {
  '長生': 80,
  '沐浴': 50,   // 桃花之地，雖旺但不穩
  '冠帶': 70,
  '臨官': 90,   // 祿位
  '帝旺': 100,  // 最旺
  '衰': 40,
  '病': 20,
  '死': 10,
  '墓': 30,     // 墓庫，有藏有收
  '絕': 0,
  '胎': 40,
  '養': 60,
};

/**
 * 十二宮位的意義描述
 */
const STAGE_MEANINGS: Record<TwelveStage, {
  keyword: string;
  description: string;
  fortuneImpact: string;
}> = {
  '長生': {
    keyword: '初生萌芽',
    description: '如嬰兒出生，生機勃勃，萬物初始',
    fortuneImpact: '新開始、新機會，事業學業有發展',
  },
  '沐浴': {
    keyword: '洗禮成長',
    description: '如幼兒沐浴，敏感多變，也稱桃花位',
    fortuneImpact: '異性緣佳，但易有桃花是非',
  },
  '冠帶': {
    keyword: '成人禮',
    description: '如青年成冠，開始獨立自主',
    fortuneImpact: '貴人運佳，事業開始起步',
  },
  '臨官': {
    keyword: '事業建立',
    description: '如壯年任官，事業興旺，也稱祿位',
    fortuneImpact: '事業財運俱佳，有權有利',
  },
  '帝旺': {
    keyword: '鼎盛極致',
    description: '如帝王極盛，達到頂峰',
    fortuneImpact: '運勢最旺，但物極必反需謹慎',
  },
  '衰': {
    keyword: '開始下滑',
    description: '如中年後衰，精力漸減',
    fortuneImpact: '運勢轉弱，宜守不宜攻',
  },
  '病': {
    keyword: '身體欠安',
    description: '如老年多病，需要休養',
    fortuneImpact: '健康需注意，事業宜保守',
  },
  '死': {
    keyword: '氣數將盡',
    description: '如生命終結，舊事結束',
    fortuneImpact: '舊事告終，但也是新生之始',
  },
  '墓': {
    keyword: '收藏入庫',
    description: '如入墓安葬，塵埃落定',
    fortuneImpact: '適合收藏積蓄，有厚積薄發之象',
  },
  '絕': {
    keyword: '氣息斷絕',
    description: '如種子休眠，生機潛藏',
    fortuneImpact: '最低谷，但絕處逢生有轉機',
  },
  '胎': {
    keyword: '孕育成形',
    description: '如母腹受胎，新生命開始孕育',
    fortuneImpact: '籌劃階段，適合謀劃不宜行動',
  },
  '養': {
    keyword: '養育待發',
    description: '如胎兒成長，等待出生',
    fortuneImpact: '積蓄能量，準備迎接新機會',
  },
};

/**
 * 獲取地支在十二宮位中的索引位置
 */
function getBranchIndex(branch: DiZhi): number {
  return DI_ZHI_ORDER.indexOf(branch);
}

/**
 * 計算五行在特定地支的十二宮位
 * @param element 五行
 * @param branch 目標地支
 * @param isYang 是否為陽干（陽干順行，陰干逆行）
 */
export function getTwelveStage(
  element: WuXing,
  branch: DiZhi,
  isYang: boolean
): TwelveStage {
  const startBranch = isYang
    ? CHANG_SHENG_POSITION[element].yang
    : CHANG_SHENG_POSITION[element].yin;

  const startIdx = getBranchIndex(startBranch);
  const targetIdx = getBranchIndex(branch);

  let diff: number;
  if (isYang) {
    // 陽干順行
    diff = (targetIdx - startIdx + 12) % 12;
  } else {
    // 陰干逆行
    diff = (startIdx - targetIdx + 12) % 12;
  }

  return TWELVE_STAGES[diff];
}

/**
 * 根據天干獲取十二宮位
 * @param gan 天干
 * @param branch 目標地支
 */
export function getTwelveStageByGan(gan: TianGan, branch: DiZhi): TwelveStage {
  const element = TIAN_GAN_ELEMENT[gan];
  const yangGans: TianGan[] = ['甲', '丙', '戊', '庚', '壬'];
  const isYang = yangGans.includes(gan);

  return getTwelveStage(element, branch, isYang);
}

/**
 * 獲取十二宮位的能量分數
 */
export function getTwelveStageScore(stage: TwelveStage): number {
  return STAGE_SCORES[stage];
}

/**
 * 獲取十二宮位的意義
 */
export function getTwelveStageMeaning(stage: TwelveStage): {
  keyword: string;
  description: string;
  fortuneImpact: string;
} {
  return STAGE_MEANINGS[stage];
}

/**
 * 判斷是否處於旺相狀態（長生、冠帶、臨官、帝旺）
 */
export function isProsperous(stage: TwelveStage): boolean {
  return ['長生', '冠帶', '臨官', '帝旺'].includes(stage);
}

/**
 * 判斷是否處於衰絕狀態（病、死、絕）
 */
export function isDeclined(stage: TwelveStage): boolean {
  return ['病', '死', '絕'].includes(stage);
}

/**
 * 判斷是否處於墓庫狀態
 */
export function isInTomb(stage: TwelveStage): boolean {
  return stage === '墓';
}

/**
 * 判斷是否處於桃花位（沐浴）
 */
export function isPeachBlossom(stage: TwelveStage): boolean {
  return stage === '沐浴';
}

/**
 * 計算日主在流年/大運地支的十二宮位狀態
 * @param dayGan 日干
 * @param targetBranch 目標地支（流年或大運地支）
 */
export function analyzeTwelveStageForFortune(
  dayGan: TianGan,
  targetBranch: DiZhi
): {
  stage: TwelveStage;
  score: number;
  meaning: { keyword: string; description: string; fortuneImpact: string };
  isProsperous: boolean;
  isDeclined: boolean;
  isPeachBlossom: boolean;
  isInTomb: boolean;
  fortuneDescription: string;
} {
  const stage = getTwelveStageByGan(dayGan, targetBranch);
  const score = getTwelveStageScore(stage);
  const meaning = getTwelveStageMeaning(stage);

  const prosperousState = isProsperous(stage);
  const declinedState = isDeclined(stage);
  const peachBlossomState = isPeachBlossom(stage);
  const tombState = isInTomb(stage);

  let fortuneDescription = `日主${dayGan}在${targetBranch}為「${stage}」位。${meaning.fortuneImpact}`;

  if (prosperousState) {
    fortuneDescription += '整體運勢向好，適合積極進取。';
  } else if (declinedState) {
    fortuneDescription += '運勢偏弱，宜養精蓄銳，等待時機。';
  } else if (tombState) {
    fortuneDescription += '有收藏蓄積之象，財運有暗財。';
  } else if (peachBlossomState) {
    fortuneDescription += '桃花運旺，人緣佳但需防桃花劫。';
  }

  return {
    stage,
    score,
    meaning,
    isProsperous: prosperousState,
    isDeclined: declinedState,
    isPeachBlossom: peachBlossomState,
    isInTomb: tombState,
    fortuneDescription,
  };
}

/**
 * 批量計算四柱地支的十二宮位
 */
export function analyzeChartTwelveStages(
  dayGan: TianGan,
  branches: { position: '年' | '月' | '日' | '時'; zhi: DiZhi }[]
): {
  position: '年' | '月' | '日' | '時';
  zhi: DiZhi;
  stage: TwelveStage;
  score: number;
}[] {
  return branches.map(({ position, zhi }) => ({
    position,
    zhi,
    stage: getTwelveStageByGan(dayGan, zhi),
    score: getTwelveStageScore(getTwelveStageByGan(dayGan, zhi)),
  }));
}
